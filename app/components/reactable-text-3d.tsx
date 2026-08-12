import { OrthographicCamera, Text3D, useFont, View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Group, MathUtils, Vector3 } from "three";
import { DEG2RAD } from "three/src/math/MathUtils.js";
import { getRandomInt } from "~/utilities/RandomRange";

interface ReactableText3DProps {
  children: string;
  letterSpacing?: number;
  className?: string;
  sceneClassname?: string;
  selectableText?: boolean;

  color?: string;

  fontPath?: string;
  fontSize?: number;
  cameraZoom?: number;

  charactersFollowMouse?: boolean;
  FollowMouseRadius?: number;

  characterInstablity?: boolean;
  characterInstabilityXRange?: [number, number];
  characterInstabilityYRange?: [number, number];
  characterInstabilityZRange?: [number, number];
  characterInstabilityDurationRange?: [number, number];
  characterInstabilityEase?: string;

  animation?: (g: Group) => gsap.core.Timeline;
  repeatTriggerCount?: number;
  applyAnimationToAllCharacters?: boolean;
  masterAnimationRepeat?: number;
}

const tempVec = new Vector3();

/** One time in six this returns 0 (a "settled" pose); otherwise a random angle in [min, max], in radians. */
function jitterAngleOrZero(min: number, max: number) {
  return getRandomInt(1, 6) === 1 ? 0 : getRandomInt(min, max) * DEG2RAD;
}

interface MeasuredSize {
  /** Total text width, in three.js scene units. */
  width: number;
  /** Total text height (full glyph bounding box, ascender to descender), in three.js scene units. */
  height: number;
}

interface Text3DSceneProps {
  text: string;
  letterSpacing: number;
  fontPath: string;
  fontSize: number;
  color: string;
  charactersFollowMouse: boolean;
  FollowMouseRadius: number;
  characterInstablity: boolean;
  characterInstabilityXRange: [number, number];
  characterInstabilityYRange: [number, number];
  characterInstabilityZRange: [number, number];
  characterInstabilityDurationRange: [number, number];
  characterInstabilityEase: string;
  onMeasured: (size: MeasuredSize) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  animation: ((g: Group) => gsap.core.Timeline) | undefined;
  repeatTriggerCount: number;
  applyAnimationToAllCharacters: boolean;
  masterAnimationRepeat: number;
}

function Text3DScene({
  text,
  letterSpacing,
  fontPath,
  fontSize,
  color,
  charactersFollowMouse,
  FollowMouseRadius,
  characterInstablity,
  characterInstabilityXRange,
  characterInstabilityYRange,
  characterInstabilityZRange,
  characterInstabilityDurationRange,
  characterInstabilityEase,
  onMeasured,
  containerRef,
  animation,
  repeatTriggerCount,
  applyAnimationToAllCharacters,
  masterAnimationRepeat,
}: Text3DSceneProps) {
  const font = useFont(fontPath);
  const groupRefs = useRef<(Group | null)[]>([]);

  // Kept as two separate ref arrays so the idle "instability" jitter and a
  // user-supplied custom animation never stomp on each other's timeline
  // references when both are active on the same characters.
  const instabilityTimelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const customTimelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const masterRef = useRef<gsap.core.Timeline | null>(null);

  const globalMouse = useRef({ x: -9999, y: -9999 });

  // Everything about layout - per-character x position, total width, total
  // height, vertical centering offset - is derived once here from the
  // font's own metrics. This is the single source of truth: nothing else
  // (the DOM overlay, the container box, the camera) is allowed to guess
  // at these numbers independently, which is what caused width/alignment
  // drift before.
  const { items, totalWidth, totalHeight, yOffset } = useMemo(() => {
    const resolution = font.data.resolution || 1000;
    const box = font.data.boundingBox;
    // Fall back to "one em, sitting on the baseline" if the font file
    // doesn't carry a bounding box, so we still get sane sizing.
    const yMin = box ? box.yMin : 0;
    const yMax = box ? box.yMax : resolution;

    let currentX = 0;
    const built = [...text].map((char) => {
      const glyph =
        font.data.glyphs[char] ??
        font.data.glyphs[char.toLowerCase()] ??
        font.data.glyphs[" "];
      const width = ((glyph?.ha ?? 1000) * fontSize) / resolution;
      const posX = currentX;
      currentX += width + letterSpacing;
      return { char, posX, width };
    });

    return {
      items: built,
      totalWidth: built.length > 0 ? Math.max(currentX - letterSpacing, 0) : 0,
      totalHeight: ((yMax - yMin) * fontSize) / resolution,
      yOffset: -(((yMin + yMax) / 2) * fontSize) / resolution,
    };
  }, [text, fontSize, letterSpacing, font]);

  // Report the exact measured box up to the DOM layer *before* paint, so
  // the container/View never sit at a stale or estimated size for longer
  // than one frame.
  useLayoutEffect(() => {
    onMeasured({ width: totalWidth, height: totalHeight });
  }, [totalWidth, totalHeight, onMeasured]);

  // Drop stale trailing ref slots whenever the character count shrinks, so
  // useFrame isn't iterating over indices that no longer correspond to
  // anything on screen.
  useEffect(() => {
    groupRefs.current.length = items.length;
    instabilityTimelineRefs.current.length = items.length;
    customTimelineRefs.current.length = items.length;
  }, [items.length]);

  // Track global mouse position.
  useEffect(() => {
    if (!charactersFollowMouse) return;

    const handlePointerMove = (e: PointerEvent) => {
      globalMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [charactersFollowMouse]);

  // Characters tilt towards the mouse cursor when it's nearby; otherwise
  // whichever per-character timeline is driving them (idle jitter and/or a
  // custom animation) keeps playing.
  useFrame((state, delta) => {
    if (!containerRef.current) return;

    // Live bounding rect accurately tracks screen offset during browser zoom / scroll.
    const rect = containerRef.current.getBoundingClientRect();

    groupRefs.current.forEach((group, index) => {
      if (!group) return;

      let isHovered = false;
      let targetRotY = 0;
      let targetRotX = 0;

      if (charactersFollowMouse) {
        group.getWorldPosition(tempVec);
        tempVec.project(state.camera);

        const letterScreenX = rect.left + ((tempVec.x + 1) * rect.width) / 2;
        const letterScreenY = rect.top + ((-tempVec.y + 1) * rect.height) / 2;

        const dx = globalMouse.current.x - letterScreenX;
        const dy = globalMouse.current.y - letterScreenY;
        const distance = Math.hypot(dx, dy);

        if (distance < FollowMouseRadius) {
          const factor = 1 - distance / FollowMouseRadius;
          targetRotY = Math.atan2(dx, 150) * factor * 4;
          targetRotX = Math.atan2(dy, 150) * factor * 4;
          isHovered = true;
        } else {
          targetRotY = 0;
          targetRotX = 0;
          isHovered = true;
        }
      }

      const instabilityTl = instabilityTimelineRefs.current[index];
      const customTl = customTimelineRefs.current[index];

      if (isHovered) {
        if (instabilityTl?.isActive()) instabilityTl.pause();
        if (customTl?.isActive()) customTl.pause();

        group.rotation.y = MathUtils.lerp(
          group.rotation.y,
          targetRotY,
          delta * 8,
        );
        group.rotation.x = MathUtils.lerp(
          group.rotation.x,
          targetRotX,
          delta * 8,
        );
        group.rotation.z = MathUtils.lerp(group.rotation.z, 0, delta * 8);
      } else {
        if (instabilityTl && !instabilityTl.isActive()) instabilityTl.play();
        if (customTl && !customTl.isActive()) customTl.play();
      }
    });
  });

  // Idle "instability" jitter.
  useEffect(() => {
    if (!characterInstablity) {
      instabilityTimelineRefs.current.forEach((tl) => tl?.kill());
      instabilityTimelineRefs.current = [];
      return;
    }

    const [xMin, xMax] = characterInstabilityXRange;
    const [yMin, yMax] = characterInstabilityYRange;
    const [zMin, zMax] = characterInstabilityZRange;
    const [dMin, dMax] = characterInstabilityDurationRange;

    instabilityTimelineRefs.current = groupRefs.current.map((g) => {
      if (!g) return null;

      return gsap.timeline({ repeat: -1, repeatRefresh: true }).to(g.rotation, {
        x: () => jitterAngleOrZero(xMin, xMax),
        y: () => jitterAngleOrZero(yMin, yMax),
        z: () => jitterAngleOrZero(zMin, zMax),
        duration: () => dMin + Math.random() * (dMax - dMin),
        ease: characterInstabilityEase,
      });
    });

    return () => {
      instabilityTimelineRefs.current.forEach((tl) => tl?.kill());
    };
  }, [
    characterInstablity,
    characterInstabilityXRange[0],
    characterInstabilityXRange[1],
    characterInstabilityYRange[0],
    characterInstabilityYRange[1],
    characterInstabilityZRange[0],
    characterInstabilityZRange[1],
    characterInstabilityDurationRange[0],
    characterInstabilityDurationRange[1],
    characterInstabilityEase,
    text,
  ]);

  // User-supplied per-character animation, gated behind visibility.
  useEffect(() => {
    if (!animation) return;

    const master = gsap.timeline({ repeat: masterAnimationRepeat });
    const createdTimelines: (gsap.core.Timeline | null)[] = [];

    groupRefs.current.forEach((g, index) => {
      if (!g) return;

      const letterTl = animation(g);
      if (!letterTl) return;

      createdTimelines[index] = letterTl;

      if (applyAnimationToAllCharacters) {
        master.add(letterTl, 0);
      } else {
        // GSAP 3 .duration() is already the duration of ONE single cycle.
        const singleCycleDuration = letterTl.duration();
        const triggerOffset = singleCycleDuration * repeatTriggerCount;

        // Position each character at its exact start offset on the master timeline
        master.add(letterTl, index * triggerOffset);
      }
    });

    customTimelineRefs.current = createdTimelines;
    masterRef.current = master;

    // Viewport IntersectionObserver logic...
    // let timer: ReturnType<typeof setTimeout>;
    // const observer = new IntersectionObserver(
    //   ([entry]) => {
    //     if (entry.isIntersecting) {
    //       timer = setTimeout(() => master.play(), 300);
    //     } else {
    //       clearTimeout(timer);
    //       master.pause();
    //     }
    //   },
    //   { threshold: 0.8 },
    // );

    // if (containerRef.current) {
    //   observer.observe(containerRef.current);
    // }

    return () => {
      master.kill();
      // clearTimeout(timer);
      // observer.disconnect();
      customTimelineRefs.current = [];
    };
  }, [
    animation,
    applyAnimationToAllCharacters,
    repeatTriggerCount,
    masterAnimationRepeat,
    text,
  ]);

  return (
    // Statically centered from real font metrics - no per-frame
    // repositioning, so there's no chance of it lagging a resize/viewport
    // update by a frame and drifting out of sync with the DOM overlay.
    <group position={[-totalWidth / 2, yOffset, 0]}>
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <ambientLight intensity={1.5} color={color} />

      {items.map(({ char, posX, width }, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={[posX + width / 2, -yOffset, 0]}
        >
          <Text3D
            font={fontPath}
            size={fontSize}
            height={0.2}
            bevelEnabled
            bevelThickness={0.2}
            bevelSize={0.02}
            position={[-width / 2, +yOffset, 0]}
          >
            {char}
            <meshStandardMaterial
              color={color}
              roughness={0.3}
              metalness={0.1}
            />
          </Text3D>
        </group>
      ))}
    </group>
  );
}

export default function ReactableText3D({
  children,
  letterSpacing = 0.1,
  className = "",
  sceneClassname = "",
  selectableText = true,
  color = "white",
  fontPath = "/fonts/tilges.json",
  fontSize = 2,
  cameraZoom = 24,
  charactersFollowMouse = false,
  FollowMouseRadius = 140,
  characterInstablity = false,
  characterInstabilityXRange = [-25, 25],
  characterInstabilityYRange = [-25, 25],
  characterInstabilityZRange = [-5, 5],
  characterInstabilityDurationRange = [0.8, 2.0],
  characterInstabilityEase = "sine.inOut",
  animation,
  repeatTriggerCount = 1,
  applyAnimationToAllCharacters = true,
  masterAnimationRepeat = -1,
}: ReactableText3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const pixelFontSize = fontSize * cameraZoom;
  const letterSpacingPx = letterSpacing * cameraZoom;

  // The exact box, in scene units, as reported by Text3DScene from real
  // font metrics. Null until the font has loaded and the first
  // measurement comes back.
  const [measured, setMeasured] = useState<MeasuredSize | null>(null);
  const handleMeasured = useCallback(
    (size: MeasuredSize) => setMeasured(size),
    [],
  );

  const [scaleX, setScaleX] = useState(1);

  // This container's width/height is the ONLY thing that determines both
  // (a) the pixel box the 3D View renders into, and (b) the target size
  // the invisible DOM overlay is stretched to match. Previously those two
  // were computed by different, independently-drifting paths (a
  // char-count estimate for one, a CSS-transformed element's *unscaled*
  // layout box for the other), which is what produced inconsistent
  // cropping/misalignment. Using one authoritative number for both fixes
  // that at the source.
  const boxWidthPx = measured
    ? measured.width * cameraZoom
    : (pixelFontSize + letterSpacingPx) * Math.max(children.length, 1); // pre-measurement estimate only
  const boxHeightPx = measured
    ? measured.height * cameraZoom
    : pixelFontSize * 1.2;

  useLayoutEffect(() => {
    if (!textRef.current || !selectableText) return;

    // Reset transform to measure the DOM text's true intrinsic width.
    textRef.current.style.transform = "scaleX(1)";
    const actualWidthPx = textRef.current.getBoundingClientRect().width;

    if (actualWidthPx > 0) {
      setScaleX(boxWidthPx / actualWidthPx);
    }
  }, [
    children,
    letterSpacing,
    fontSize,
    cameraZoom,
    boxWidthPx,
    selectableText,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: boxWidthPx, height: boxHeightPx }}
    >
      {/* DOM overlay: invisible, selectable text stretched to exactly match the 3D glyphs below. */}
      {selectableText && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
          <span
            ref={textRef}
            style={{
              fontSize: `${pixelFontSize}px`,
              letterSpacing: `${letterSpacingPx}px`,
              transform: `scaleX(${scaleX})`,
              transformOrigin: "center center",
              whiteSpace: "nowrap",
            }}
            className="inline-block text-transparent select-text cursor-text font-bold"
          >
            {children}
          </span>
        </div>
      )}

      {/* Embedded 3D view - fills the same box the overlay above is matched to. */}
      <View className={`absolute inset-0 ${sceneClassname}`}>
        <Text3DScene
          text={children}
          letterSpacing={letterSpacing}
          fontPath={fontPath}
          fontSize={fontSize}
          color={color}
          charactersFollowMouse={charactersFollowMouse}
          FollowMouseRadius={FollowMouseRadius}
          characterInstablity={characterInstablity}
          characterInstabilityXRange={characterInstabilityXRange}
          characterInstabilityYRange={characterInstabilityYRange}
          characterInstabilityZRange={characterInstabilityZRange}
          characterInstabilityDurationRange={characterInstabilityDurationRange}
          characterInstabilityEase={characterInstabilityEase}
          onMeasured={handleMeasured}
          containerRef={containerRef}
          animation={animation}
          repeatTriggerCount={repeatTriggerCount}
          applyAnimationToAllCharacters={applyAnimationToAllCharacters}
          masterAnimationRepeat={masterAnimationRepeat}
        />
        <OrthographicCamera
          makeDefault
          position={[0, 0, 10]}
          zoom={cameraZoom}
        />
      </View>
    </div>
  );
}

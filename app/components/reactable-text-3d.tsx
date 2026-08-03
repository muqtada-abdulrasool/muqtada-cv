import { OrthographicCamera, Text3D, useFont, View } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import {
  useEffect,
  useLayoutEffect,
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
  selectableText?: boolean;

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
  characterInstabilityEase?: gsap.EaseString;

  animation?: (g: Group) => gsap.core.Timeline;
  repeatTriggerCount?: number;
  applyAnimationToAllCharacters?: boolean;
  masterAnimationRepeat?: number;
}

const tempVec = new Vector3();

function Text3DScene({
  children,
  letterSpacing,
  fontPath,
  fontSize,
  charactersFollowMouse = true,
  FollowMouseRadius = 140,
  characterInstablity = true,
  characterInstabilityXRange = [-25, 25],
  characterInstabilityYRange = [-25, 25],
  characterInstabilityZRange = [-10, 10],
  characterInstabilityDurationRange = [0.8, 2.0],
  characterInstabilityEase = "sine.inOut",
  onTotalWidth,
  containerRef,
  animation,
  repeatTriggerCount,
  applyAnimationToAllCharacters,
  masterAnimationRepeat,
}: {
  children: string;
  letterSpacing: number;
  fontPath: string;
  fontSize: number;
  charactersFollowMouse?: boolean;
  FollowMouseRadius?: number;
  characterInstablity?: boolean;
  characterInstabilityXRange?: [number, number];
  characterInstabilityYRange?: [number, number];
  characterInstabilityZRange?: [number, number];
  characterInstabilityDurationRange?: [number, number];
  characterInstabilityEase?: gsap.EaseString;
  onTotalWidth: (width: number) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  animation: ((g: Group) => gsap.core.Timeline) | undefined;
  repeatTriggerCount: number;
  applyAnimationToAllCharacters: boolean;
  masterAnimationRepeat: number;
}) {
  const font = useFont(fontPath);
  const groupRefs = useRef<(Group | null)[]>([]);
  const timelineRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const globalMouse = useRef({ x: -9999, y: -9999 });
  const masterRef = useRef<gsap.core.Timeline | null>(null);

  let currentX = 0;
  const items = [...children].map((char) => {
    const glyph =
      font.data.glyphs[char] ||
      font.data.glyphs[char.toLowerCase()] ||
      font.data.glyphs[" "];
    const width = ((glyph?.ha ?? 1000) * fontSize) / font.data.resolution;
    const posX = currentX + width / 2;
    currentX += width + letterSpacing;
    return { char, posX };
  });
  const totalWidth = currentX - letterSpacing;

  useEffect(() => {
    onTotalWidth(totalWidth);
  }, [totalWidth]);

  // Keep track of global mouse movement
  useEffect(() => {
    if (!charactersFollowMouse) return;

    const handlePointerMove = (e: PointerEvent) => {
      globalMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [charactersFollowMouse]);

  // Character looks at mouse implementation
  useFrame((state, delta) => {
    if (!containerRef.current) return;

    // Live bounding rect accurately tracks screen offset during browser zoom / scroll
    const rect = containerRef.current.getBoundingClientRect();

    groupRefs.current.forEach((group, index) => {
      if (!group) return;

      const tl = timelineRefs.current[index];
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
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < FollowMouseRadius) {
          const factor = 1 - distance / FollowMouseRadius;
          targetRotY = Math.atan2(dx, 150) * factor * 4;
          targetRotX = Math.atan2(dy, 150) * factor * 4;
          isHovered = true;
        }
      }

      if (isHovered) {
        // Pause GSAP timeline and lerp towards mouse target
        if (tl && tl.isActive()) tl.pause();

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
        // Resume GSAP timeline when mouse leaves active radius
        if (tl && !tl.isActive()) tl.play();
      }
    });
  });

  // Instability effect
  useEffect(() => {
    if (!characterInstablity) {
      timelineRefs.current.forEach((tl) => tl?.kill());
      timelineRefs.current = [];
      return;
    }

    timelineRefs.current = groupRefs.current.map((g) => {
      if (!g) return null;

      const [xMin, xMax] = characterInstabilityXRange;
      const [yMin, yMax] = characterInstabilityYRange;
      const [zMin, zMax] = characterInstabilityZRange;
      const [dMin, dMax] = characterInstabilityDurationRange;

      return gsap.timeline({ repeat: -1, repeatRefresh: true }).to(g.rotation, {
        x: () =>
          getRandomInt(1, 6) === 1 ? 0 : getRandomInt(xMin, xMax) * DEG2RAD,
        y: () =>
          getRandomInt(1, 6) === 1 ? 0 : getRandomInt(yMin, yMax) * DEG2RAD,
        z: () =>
          getRandomInt(1, 6) === 1 ? 0 : getRandomInt(zMin, zMax) * DEG2RAD,
        duration: () => dMin + Math.random() * (dMax - dMin),
        ease: characterInstabilityEase,
      });
    });

    // Cleanup timelines on unmount
    return () => {
      timelineRefs.current.forEach((tl) => tl?.kill());
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
  ]);

  // Custom Animation
  useEffect(() => {
    if (!animation) return;

    const master = gsap.timeline({ repeat: masterAnimationRepeat });
    const createdTimelines: (gsap.core.Timeline | null)[] = [];

    groupRefs.current.forEach((g, index) => {
      if (!g) return;

      const letterTl = animation(g);
      if (!letterTl) return;

      createdTimelines.push(letterTl);

      if (applyAnimationToAllCharacters) {
        // Force all letter animations to start simultaneously at t = 0
        master.add(letterTl, 0);
      } else {
        // Sequential sequence with repeat offsets
        if (index === 0) {
          master.add(letterTl);
        } else {
          const singleCycleDuration =
            letterTl.duration() / (letterTl.repeat() + 1);
          const triggerOffset = singleCycleDuration * repeatTriggerCount;

          master.add(letterTl, `<+=${triggerOffset}`);
        }
      }
    });

    timelineRefs.current = createdTimelines;
    masterRef.current = master;

    return () => {
      master.kill();
    };
  }, [animation, applyAnimationToAllCharacters, repeatTriggerCount]);

  return (
    <group position={[-totalWidth / 2, -fontSize / 2, 0]}>
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <ambientLight intensity={1.5} color={"white"} />

      {items.map(({ char, posX }, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={[posX, 0, 0]}
        >
          <Text3D
            onUpdate={(self) => {
              self.geometry.computeBoundingBox();
              const box = self.geometry.boundingBox;
              if (box) {
                const cX = (box.min.x + box.max.x) / 2;
                const cY = (box.min.y + box.max.y) / 2;
                self.position.set(-cX, -cY, 0);
                if (self.parent) {
                  self.parent.position.y = cY;
                }
              }
            }}
            font={fontPath}
            size={fontSize}
            height={0.2}
            bevelEnabled
            bevelThickness={0.2}
            bevelSize={0.02}
          >
            {char}
            <meshStandardMaterial
              color="white"
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
  className = "w-full h-20",
  selectableText = true,
  fontPath = "/fonts/tilges.json",
  fontSize = 2,
  cameraZoom = 24,
  charactersFollowMouse = false,
  FollowMouseRadius = 140,
  characterInstablity = false,
  characterInstabilityXRange = [-25, 25],
  characterInstabilityYRange = [-25, 25],
  characterInstabilityZRange = [-10, 10],
  characterInstabilityDurationRange = [0.8, 2.0],
  characterInstabilityEase = "sine.inOut",
  animation,
  repeatTriggerCount = 1,
  applyAnimationToAllCharacters = true,
  masterAnimationRepeat = -1,
}: ReactableText3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixelFontSize = fontSize * cameraZoom;
  const letterSpacingPx = letterSpacing * cameraZoom;

  const [total3DWidth, setTotal3DWidth] = useState<number>(0);
  const [scaleX, setScaleX] = useState<number>(1);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!textRef.current || total3DWidth === 0) return;

    // Reset transform to measure actual intrinsic text width
    textRef.current.style.transform = "scaleX(1)";
    const actualWidthPx = textRef.current.getBoundingClientRect().width;
    const targetWidthPx = total3DWidth * cameraZoom;

    if (actualWidthPx > 0) {
      setScaleX(targetWidthPx / actualWidthPx);
    }
  }, [children, letterSpacing, total3DWidth]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* DOM Overlay Container (Handles absolute placement) */}
      {selectableText && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto overflow-visible">
          {/* Inner Span (Measures ONLY actual text content width) */}
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

      {/* Embedded 3D View */}
      <View className="w-full h-full">
        <Text3DScene
          letterSpacing={letterSpacing}
          fontPath={fontPath}
          fontSize={fontSize}
          charactersFollowMouse={charactersFollowMouse}
          FollowMouseRadius={FollowMouseRadius}
          characterInstablity={characterInstablity}
          characterInstabilityXRange={characterInstabilityXRange}
          characterInstabilityYRange={characterInstabilityYRange}
          characterInstabilityZRange={characterInstabilityZRange}
          characterInstabilityDurationRange={characterInstabilityDurationRange}
          characterInstabilityEase={characterInstabilityEase}
          onTotalWidth={setTotal3DWidth}
          containerRef={containerRef}
          animation={animation}
          repeatTriggerCount={repeatTriggerCount}
          applyAnimationToAllCharacters={applyAnimationToAllCharacters}
          masterAnimationRepeat={masterAnimationRepeat}
        >
          {children}
        </Text3DScene>
        <OrthographicCamera
          makeDefault
          position={[0, 0, 10]}
          zoom={cameraZoom}
        />
      </View>
    </div>
  );
}

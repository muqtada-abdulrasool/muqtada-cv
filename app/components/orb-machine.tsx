import { createRef, useEffect, useRef } from "react";
import Orb from "./orb";
import { Trail } from "./trail";
import { orbContext } from "~/contexts/orb-context";
import gsap from "gsap";

const PS2_COLORS = [
  "#8a2be2", // PS2 Deep Purple / Violet
  "#ff007f", // Vibrant Magenta
  "#00ff88", // Neon Mint / Green
  "#ffb700", // Warm Amber
];

interface OrbMachineProps {
  count?: number;
  // Orb Props
  orbSize?: number;
  orbColor?: string;
  // Trail Props
  trailColor?: string;
  trailLength?: number;
  trailWidth?: number;
}

export default function OrbMachine({
  count = 7,
  orbSize = 40,
  orbColor,
  trailColor = "#ffffff",
  trailLength = 60,
  trailWidth = 3,
}: OrbMachineProps) {
  const orbRefs = useRef(
    [...Array(count)].map(() => createRef<HTMLDivElement>()),
  ).current;

  const orbDistance = useRef(2);

  // Smoothly interpolated target tracking state
  const currentPos = useRef({ cx: 0, cy: 0, radius: 0, initialized: false });

  // 3D Angles in degrees
  const tiltX = useRef(0); // Pitch (Up/Down tilt)
  const tiltY = useRef(0); // Yaw (Left/Right tilt)
  const tiltZ = useRef(0); // Roll (2D spin)

  useEffect(() => {
    const distTl = gsap.timeline({ repeat: -1 });
    distTl
      .to(orbDistance, { duration: 10, ease: "none" })
      .to(orbDistance, { current: 1, duration: 10, ease: "none" })
      .to(orbDistance, { duration: 8, ease: "none" })
      .to(orbDistance, { current: 2, duration: 2, ease: "power1.in" })
      .to(orbDistance, { duration: 20, ease: "none" });

    const pitchTween = gsap.to(tiltX, {
      current: 20,
      duration: 5,
      ease: "none",
      yoyo: true,
      repeat: -1,
    });

    const yawTween = gsap.to(tiltY, {
      current: 30,
      duration: 7,
      ease: "none",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      distTl.kill();
      pitchTween.kill();
      yawTween.kill();
    };
  }, []);

  useEffect(() => {
    let animId: number;

    const animate = (time: number) => {
      const targetEl = orbContext.target;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const targetCx = rect.left + rect.width / 2;
        const targetCy = rect.top + rect.height / 2;
        const targetRadius = Math.max(rect.width, rect.height) / 2 + 40;

        // Initialize position instantly on first frame to prevent flying in from (0,0)
        if (!currentPos.current.initialized) {
          currentPos.current.cx = targetCx;
          currentPos.current.cy = targetCy;
          currentPos.current.radius = targetRadius;
          currentPos.current.initialized = true;
        } else {
          // LERP factor (0.05 = super smooth/floaty, 0.1 = snappy glide, 0.2 = fast transition)
          const ease = 0.08;

          currentPos.current.cx += (targetCx - currentPos.current.cx) * ease;
          currentPos.current.cy += (targetCy - currentPos.current.cy) * ease;
          currentPos.current.radius +=
            (targetRadius - currentPos.current.radius) * ease;
        }

        const cx = currentPos.current.cx;
        const cy = currentPos.current.cy;
        const radius = currentPos.current.radius;

        const t = (time / 1000) * 1.5;

        // Convert 3D angles to radians
        const radX = (tiltX.current * Math.PI) / 180;
        const radY = (tiltY.current * Math.PI) / 180;
        const radZ = (tiltZ.current * Math.PI) / 180;

        const cosX = Math.cos(radX),
          sinX = Math.sin(radX);
        const cosY = Math.cos(radY),
          sinY = Math.sin(radY);
        const cosZ = Math.cos(radZ),
          sinZ = Math.sin(radZ);

        orbRefs.forEach((orbRef, i) => {
          if (!orbRef.current) return;

          const offset = (i / count) * Math.PI * orbDistance.current;
          const angle = t + offset;

          // 1. Initial 3D circle coordinates (flat on XY plane)
          const x0 = Math.sin(angle) * radius;
          const y0 = Math.cos(angle) * radius;
          const z0 = 0;

          // 2. Pitch: Rotate around X-axis (Tilts Up/Down)
          const x1 = x0;
          const y1 = y0 * cosX - z0 * sinX;
          const z1 = y0 * sinX + z0 * cosX;

          // 3. Yaw: Rotate around Y-axis (Tilts Left/Right)
          const x2 = x1 * cosY + z1 * sinY;
          const y2 = y1;
          const z2 = -x1 * sinY + z1 * cosY;

          // 4. Roll: Rotate around Z-axis (Clockwise spin)
          const x3 = x2 * cosZ - y2 * sinZ;
          const y3 = x2 * sinZ + y2 * cosZ;

          // Translate 3D position to absolute screen pixels
          const x = cx + x3;
          const y = cy + y3;

          orbRef.current.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
        });
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [count, orbRefs]);

  return (
    <div className="pointer-events-none fixed w-full h-full">
      {orbRefs.map((ref, i) => {
        const color = orbColor || PS2_COLORS[i % PS2_COLORS.length];

        return (
          <div key={i}>
            <Trail
              trackingRef={ref}
              color={trailColor !== "#ffffff" ? trailColor : color}
              trailLength={trailLength}
              width={trailWidth}
            />
            <div
              ref={ref}
              className="absolute left-0 top-0 will-change-transform"
            >
              <Orb size={orbSize} color={color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

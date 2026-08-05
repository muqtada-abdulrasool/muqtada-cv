import gsap from "gsap";
import { useEffect, useRef } from "react";

interface OrbProps {
  color?: string;
  size?: number;
  colorConsumption?: number;
}

export default function Orb({ color = "#ffffff", size = 80 }: OrbProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef.current) return;

    const timeline = gsap.timeline({
      repeat: -1,
      repeatRefresh: true,
    });

    timeline.to(divRef.current, {
      x: "random(-2, 2)",
      y: "random(-2, 2)",
      duration: 1.2,
      ease: "none",
    });

    return () => {
      timeline.kill();
    };
  }, []);

  // Proportional sizing based on the `size` prop
  const ringSize = size * 0.25;
  const innerSize = size * 0.2;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer Color Glow */}
      <div
        className="absolute h-full w-full blur-2xl opacity-25"
        style={{ backgroundColor: color }}
      />

      {/* Outer Color Ring */}
      <div
        ref={divRef}
        className="absolute rounded-xl blur-[1px]"
        style={{
          width: ringSize,
          height: ringSize,
          backgroundColor: color,
        }}
      />

      {/* Inner Bright White Circle */}
      <div
        className="absolute rounded-xl bg-white blur-[2px]"
        style={{
          width: innerSize,
          height: innerSize,
        }}
      />
    </div>
  );
}

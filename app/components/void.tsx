import gsap from "gsap";
import { useEffect, useRef } from "react";

interface VoidProps {
  pattern: string;
  speed?: number;
  size?: number;
  textureSize?: number;
  textureAngle?: number;
}

export function Void({
  pattern,
  speed = 1,
  size = 50,
  textureSize = 200,
  textureAngle = 45,
}: VoidProps) {
  const leftDivRef = useRef<HTMLDivElement>(null);
  const rightDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!leftDivRef.current || !rightDivRef.current) return;

    const leftLoop = gsap.to(leftDivRef.current, {
      backgroundPositionX: `-${textureSize}`,
      ease: "none",
      duration: (textureSize / 50) * speed,
      repeat: -1,
    });

    const rightLoop = gsap.to(rightDivRef.current, {
      backgroundPositionX: `+${textureSize}`,
      ease: "none",
      duration: (textureSize / 50) * speed,
      repeat: -1,
    });

    return () => {
      leftLoop.kill();
      rightLoop.kill();
    };
  }, []);

  return (
    <div className="flex flex-row w-full h-full bg-black fixed inset-0 z-back-max">
      <div
        className="relative overflow-hidden h-full bg-purple-800 mask-[linear-gradient(to_right,black_35%,transparent_100%)] perspective-midrange"
        style={{ minWidth: `${size / 2}%` }}
      >
        <div
          ref={leftDivRef}
          className="absolute w-[200vw] h-[200vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-repeat origin-center"
          style={{
            backgroundImage: `url('${pattern}')`,
            backgroundSize: `${textureSize}px ${textureSize}px`,
            transform: `rotateY(${textureAngle}deg)`,
          }}
        />
      </div>

      <div className="h-full w-full transparent"></div>

      <div
        className="relative overflow-hidden h-full  bg-purple-800 mask-[linear-gradient(to_left,black_35%,transparent_100%)] perspective-midrange"
        style={{ minWidth: `${size / 2}%` }}
      >
        <div
          ref={rightDivRef}
          className="absolute w-[200vw] h-[200vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-repeat origin-center"
          style={{
            backgroundImage: `url('${pattern}')`,
            backgroundSize: `${textureSize}px ${textureSize}px`,
            transform: `rotateY(-${textureAngle}deg)`,
          }}
        />
      </div>
    </div>
  );
}

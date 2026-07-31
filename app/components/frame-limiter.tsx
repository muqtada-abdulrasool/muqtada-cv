import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export function FrameLimiter({ fps = 60 }: { fps?: number }) {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    const interval = 1000 / fps;

    const loop = (time: number) => {
      frameId = requestAnimationFrame(loop);
      const delta = time - lastTime;

      if (delta >= interval) {
        lastTime = time - (delta % interval);
        advance(time / 1000); // Drives R3F rendering at the target FPS
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [advance, fps]);

  return null;
}

import { useEffect, useRef } from "react";

interface TrailProps {
  /** Pass the Ref of the element you want to follow directly */
  trackingRef: React.RefObject<HTMLElement | null>;
  color?: string;
  trailLength?: number;
  width?: number;
}

export function Trail({
  trackingRef,
  color = "#ffffff",
  trailLength = 90,
  width = 6,
}: TrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store coordinates in a mutable ref instead of React state
  const pointsRef = useRef<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Read position directly from the DOM
      if (trackingRef.current) {
        const rect = trackingRef.current.getBoundingClientRect();
        pointsRef.current.unshift({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }

      // 2. Cap the trail length
      if (pointsRef.current.length > trailLength) {
        pointsRef.current.pop();
      }

      const points = pointsRef.current;

      // 3. Draw the tapered, glowing ribbon
      if (points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];

          const progress = i / points.length; // 0.0 to 1.0
          const opacity = 1 - progress;
          const currentWidth = width * (1 - progress);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          ctx.strokeStyle = color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = currentWidth;
          ctx.lineCap = "round";

          // Glow effect
          ctx.shadowBlur = 12;
          ctx.shadowColor = color;

          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [trackingRef, color, trailLength, width]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 block"
    />
  );
}

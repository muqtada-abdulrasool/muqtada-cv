import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { useEffect } from "react";

export function ScrollSync() {
  useEffect(() => {
    const lenis = new Lenis({
      // Controls smooth interpolation rate (between 0 and 1)
      // Lower = smoother/floatier (e.g. 0.05), Higher = snappier (e.g. 0.2). Default is 0.1
      lerp: 0.05,

      // OR use duration in seconds instead of lerp:
      // duration: 1.2,

      // Custom easing curve (defaults to exponential out)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

      // Adjust how far each mouse wheel tick scrolls (default is 1)
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return null;
}

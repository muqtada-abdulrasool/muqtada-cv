import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { Outlet } from "react-router";
import { useRef } from "react";
import { FrameLimiter } from "~/components/frame-limiter";
import OrbMachine from "~/components/orb-machine";
import { ScrollSync } from "~/components/scroll-sync";

export default function CanvasLayout() {
  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    <div ref={containerRef} className="relative h-full w-full flex flex-col">
      {/* Normal HTML */}
      <Outlet />

      {/* Orb Machine */}
      {/* <OrbMachine count={4} /> */}

      {/* Scroll Synchronizer to Prevent 3D Model lag */}
      <ScrollSync />

      {/* Global Canvas */}
      <Canvas
        eventSource={containerRef}
        camera={{ fov: 15, position: [0, 0, 20] }}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
        }}

        dpr={1}
        frameloop="never"
      >
        <FrameLimiter fps={60} />
        <View.Port />
      </Canvas>
    </div>
  );
}

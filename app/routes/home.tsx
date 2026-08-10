import { Void } from "~/components/void";
import type { Route } from "./+types/home";
import { View } from "@react-three/drei";
import RefractorCube from "~/components/refractor-cube";
import { useEffect, useMemo, useRef } from "react";
import { setOrbTarget } from "~/contexts/orb-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const cubeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOrbTarget(cubeRef.current);
  });

  return (
    <div className="flex flex-col grow items-center justify-center bg-blue-800 relative">
      {/* Background */}
      <Void
        pattern="/patterns/grid-me.png"
        textureSize={200}
        textureAngle={45}
        speed={10}
        size={50}
      />

      <View className="size-80" ref={cubeRef}>
        <RefractorCube />
      </View>
    </div>
  );
}

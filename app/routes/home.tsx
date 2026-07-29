import { Canvas, useFrame } from "@react-three/fiber";
import type { Route } from "./+types/home";
import MemoryCard from "~/components/memory-card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center bg-blue-800">
      <Canvas
        style={{ width: "10rem", height: "10rem" }}
        camera={{ fov: 15, position: [0, 0, 20] }}
      >
        <MemoryCard scale={0.5} bobHeight={0.5} />
        {/* <ambientLight intensity={10} position={[0, 0, 5]} /> */}
        <directionalLight position={[0, 0, 5]} intensity={5} />
      </Canvas>
      <p className="text-xs italic font-bold text-yellow-300">
        *Don't turn off the website when this icon shows up
      </p>
    </div>
  );
}

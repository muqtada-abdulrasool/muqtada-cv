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
    </div>
  );
}

import type { Route } from "./+types/home";
import MemoryCard from "~/components/memory-card";
import { Center, View } from "@react-three/drei";
import ReactableText3D from "~/components/reactable-text-3d";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col grow items-center justify-center bg-blue-800">
      <View className="size-40">
        <MemoryCard scale={0.5} bobHeight={0.5} />
        <directionalLight position={[0, 0, 5]} intensity={5} />
      </View>

      <p className="text-xs italic font-bold text-yellow-300">
        *Don't turn off the website when this icon shows up
      </p>

      {/* <View className="w-full h-20"> */}
      <div className="w-full h-20 absolute bottom-0">
        <ReactableText3D
          className="w-full h-20"

          characterInstablity={true}
          characterInstabilityEase="elastic.inOut"
        >
          This Site is Still Under Construction
        </ReactableText3D>
      </div>

      {/* </View> */}
    </div>
  );
}

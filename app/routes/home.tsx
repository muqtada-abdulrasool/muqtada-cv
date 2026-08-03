import type { Route } from "./+types/home";
import MemoryCard from "~/components/memory-card";
import { View } from "@react-three/drei";
import ReactableText3D from "~/components/reactable-text-3d";
import gsap from "gsap";
import { DEG2RAD } from "three/src/math/MathUtils.js";
import RefractorCube from "~/components/refractor-cube";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col grow items-center justify-center bg-blue-800">
      <div className="flex flex-row justify-center items-center">
        <View className="size-40">
          <RefractorCube />
          <directionalLight position={[0, 0, 5]} intensity={5} />
        </View>

        <div className="flex flex-col items-center">
          <View className="size-40">
            <MemoryCard scale={0.5} bobHeight={0.5} />
            <directionalLight position={[0, 0, 5]} intensity={5} />
          </View>

          <p className="text-xs italic font-bold text-yellow-300">
            *Don't turn off the website when this icon shows up
          </p>
        </div>

        <View className="size-40">
          <RefractorCube />
          <directionalLight position={[0, 0, 5]} intensity={5} />
        </View>
      </div>

      <div className="w-full h-20 ">
        <ReactableText3D
          className="w-full h-20"
          fontSize={1.5}
          animation={(g) => {
            gsap.set(g.rotation, { z: -15 * DEG2RAD });

            return gsap
              .timeline({
                repeat: -1,
                repeatDelay: 0.5,
              })
              .to(g.rotation, {
                z: 15 * DEG2RAD,
                duration: 0.8,
                ease: "elastic",
              })
              .to(
                g.rotation,
                {
                  z: -15 * DEG2RAD,
                  duration: 0.8,
                  ease: "elastic",
                },
                "+=0.5",
              );
          }}
        >
          This Site is Still Under Construction
        </ReactableText3D>
      </div>
    </div>
  );
}

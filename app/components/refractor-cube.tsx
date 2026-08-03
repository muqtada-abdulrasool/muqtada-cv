import { useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Text } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

export default function RefractorCube() {
  const cubeRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.3;
      cubeRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <>
      <Text fontSize={0.5} fontWeight={800}>
        MEOW
      </Text>
      <group ref={cubeRef}>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <Environment preset="city" environmentIntensity={2} />
          <MeshTransmissionMaterial
            backside={true} // Renders back faces for depth inside glass
            samples={8} // Refraction sample quality
            resolution={1024} // Buffer resolution
            transmission={0.95} // Overall transparency
            roughness={0} // Frosted/smooth glass slider
            ior={1.7} // Index of Refraction (1.5 = Standard Glass)
            thickness={0.4} // Refraction depth illusion
            chromaticAberration={0.1} // Rainbow color separation
            distortion={0.1} // Lens wave distortion
            color="#5CB3FF" // Glass tint: (Deep Blue: #003791, Bright Cyan: #5CB3FF, Dark Navy: #1a2930)
          />
        </mesh>
      </group>
    </>
  );
}

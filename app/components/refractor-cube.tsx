import {
  Edges,
  Environment,
  MeshTransmissionMaterial,
  RoundedBox,
  useCursor,
} from "@react-three/drei";
import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Color, type Group } from "three";
import { getRandomInt } from "~/utilities/RandomRange";
import gsap from "gsap";
import { useNavigate } from "react-router";

interface RefractorCubeProps {
  children?: React.ReactNode;
  size?: number | [number, number, number];
  rotation?: [number, number, number];
  ior?: number;
  thickness?: number;
  color?: string;
  lightIntensity?: number;
  resolution?: "low" | "high" | "extreme";
  envRot?: [number, number, number];
  env?: string;

  spin?: boolean;
  spinSpeed?: number;

  hoverable?: boolean;
  hoverColor?: string;

  to?: string;
}

export default function RefractorCube({
  children = <></>,
  size = 2,
  rotation = [0, 0, 0],
  ior = 1.8,
  thickness = 1.8,
  color = "#ffffff",
  lightIntensity = 1,
  spin = true,
  spinSpeed = 1,
  resolution = "high",
  envRot = [0, 90, 0],
  env = "/hdr/studio.hdr",
  hoverable = false,
  hoverColor = "#5CB3FF",
  to,
}: RefractorCubeProps) {
  const cubeRef = useRef<Group>(null);
  const materialRef = useRef<ComponentRef<typeof MeshTransmissionMaterial>>(
    null!,
  );

  const [hovered, setHovered] = useState(false);
  useCursor(hovered && hoverable);

  const navigate = useNavigate();

  // Spinning animations
  useEffect(() => {
    if (!cubeRef.current || !spin) return;

    const timeline = gsap.timeline({ repeat: -1 });
    timeline.to(cubeRef.current.rotation, {
      x: getRandomInt(1, 2) == 1 ? "+20" : "-20",
      y: getRandomInt(1, 2) == 1 ? "+20" : "-20",
      z: getRandomInt(1, 2) == 1 ? "+20" : "-20",
      duration:
        (getRandomInt(400, 800) * 0.1) / (hovered ? spinSpeed * 2 : spinSpeed),
      ease: "none",
    });
  }, [hovered]);

  // Hover animations
  useEffect(() => {
    if (!materialRef.current || !hoverable) return;

    const multiplier = hovered ? lightIntensity * 2 : lightIntensity;
    const baseColor = new Color(hovered ? hoverColor : color);

    // Boost RGB channels beyond 1.0 for HDR brightness intensity
    gsap.to(materialRef.current.color as Color, {
      r: baseColor.r * multiplier,
      g: baseColor.g * multiplier,
      b: baseColor.b * multiplier,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [hovered, color, hoverColor, lightIntensity]);

  return (
    <>
      {children}

      <group ref={cubeRef} rotation={rotation}>
        <RoundedBox
          args={typeof size == "number" ? [size, size, size] : size}
          radius={0.05}
          smoothness={4}
          onPointerOver={(e) => {
            if (!hoverable) return;

            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}

          onClick={() => {
            to && navigate(to);
          }}
        >
          <Environment
            files={env}
            environmentIntensity={lightIntensity}
            environmentRotation={envRot}
          />

          <MeshTransmissionMaterial
            ref={materialRef}
            backside={true} // Renders back faces for depth inside glass
            samples={8} // Refraction sample quality
            resolution={
              resolution == "low" ? 256 : resolution == "high" ? 512 : 1024
            } // Buffer resolution
            transmission={0.95} // Overall transparency
            roughness={0} // Frosted/smooth glass slider
            ior={ior} // Index of Refraction (1.5 = Standard Glass)
            thickness={thickness} // Refraction depth illusion
            chromaticAberration={0.1} // Rainbow color separation
            distortion={0.1} // Lens wave distortion
            color={color} // Glass tint: (Deep Blue: #003791, Bright Cyan: #5CB3FF, Dark Navy: #1a2930)
          />

          <Edges
            scale={1.002} // Prevents Z-fighting with glass faces
            threshold={15} // Isolates corner edges
            color="#003791" // Edge Color
          />
        </RoundedBox>
      </group>
    </>
  );
}

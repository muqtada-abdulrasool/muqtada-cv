import { useFrame, useLoader } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { type Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DEG2RAD, RAD2DEG } from "three/src/math/MathUtils.js";

interface MemoryCardProps {
  scale?: number;
  rotate?: number;
  bob?: boolean;
  bobHeight?: number;
}

export default function MemoryCard({
  scale = 1,
  rotate = 1,
  bob = true,
  bobHeight = 2,
}: MemoryCardProps) {
  const card = useLoader(GLTFLoader, "/models/memory-card.glb");
  const cardRef = useRef<Mesh>(null);

  // Rotation animation
  useEffect(() => {
    if (!rotate || !cardRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(cardRef.current.rotation, {
      y: `+=${360 * DEG2RAD * rotate}`,
      duration: 6,
      ease: "none",
    });
  }, [rotate]);

  // Bobbing animation
  useEffect(() => {
    if (!bob || !cardRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    cardRef.current.position.y = 0;
    tl.fromTo(
      cardRef.current.position,
      { y: 0 },
      { y: bobHeight, duration: 1.2, ease: "power1.out" },
    ).fromTo(
      cardRef.current.position,
      { y: bobHeight },
      { y: 0, duration: 1.2, ease: "power1.in" },
    );
  }, [bob, bobHeight]);

  return (
    <group ref={cardRef} scale={scale}>
      <primitive object={card.scene} />
    </group>
  );
}

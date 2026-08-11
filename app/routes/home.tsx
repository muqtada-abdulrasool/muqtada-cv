import { Void } from "~/components/void";
import type { Route } from "./+types/home";
import { View } from "@react-three/drei";
import RefractorCube from "~/components/refractor-cube";
import { useEffect, useMemo, useRef } from "react";
import { setOrbTarget } from "~/contexts/orb-context";
import Container from "~/components/container";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import ReactableText3D from "~/components/reactable-text-3d";
import gsap from "gsap";
import { DEG2RAD } from "three/src/math/MathUtils.js";
import { Separator } from "~/components/ui/separator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const orbRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOrbTarget(orbRef.current);
  });

  return (
    <div className="flex flex-col grow items-center justify-center p-20 gap-20 relative">
      {/* Background */}
      <Void
        pattern="/patterns/grid-me.png"
        textureSize={200}
        textureAngle={45}
        speed={10}
        size={50}
      />

      <Container>
        {/* Header with PFP, Title, and Job Title */}
        <div className="flex flex-row gap-10 items-center p-md">
          <Avatar className="size-60" ref={orbRef}>
            <AvatarImage src="/Muqtada.jpg" />
          </Avatar>

          <div className="flex flex-col gap-xs justify-center h-full">
            <div className="flex flex-col gap-sm">
              <ReactableText3D
                charactersFollowMouse
                FollowMouseRadius={200}
                fontPath="/fonts/Helvetica/Helvetica-Rounded-Bold.json"
                fontSize={1.8}
              >
                MUQTADA
              </ReactableText3D>
              <ReactableText3D
                charactersFollowMouse
                FollowMouseRadius={200}
                fontPath="/fonts/Helvetica/Helvetica-Rounded-Bold.json"
                fontSize={1.8}
              >
                ABDULRASOOL
              </ReactableText3D>
            </div>

            <ReactableText3D
              fontPath="/fonts/Helvetica/Helvetica.json"
              fontSize={1}
              color={"yellow"}

              applyAnimationToAllCharacters={false}
              repeatTriggerCount={1}
              masterAnimationRepeat={0}
              animation={(g) =>
                gsap.timeline({ repeat: 4 }).to(g.rotation, {
                  y: `+=${Math.PI * 2}`,
                  duration: 0.1,
                  ease: "none",
                })
              }
            >
              *Frontend Developer
            </ReactableText3D>
          </div>
        </div>

        {/* <Separator /> */}

        {/* Bio */}
        <fieldset className="rounded-lg border border-input p-4">
          <legend className="-ml-1 px-1 text-md text-foreground">
            About Me
          </legend>
          <div className="text-foreground text-lg">
            Frontend & Backend Developer and Computer Engineering student with a
            history in React, TypeScript, Music, & English Writing.
            <br />
            <br />
            Experienced in leading development teams, crafting pleasant
            interfaces, and delivering creative solutions across diverse
            projects from game jams to university projects.
          </div>
        </fieldset>
      </Container>
    </div>
  );
}

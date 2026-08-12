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
import { Separator } from "~/components/ui/separator";
import RefractorSkill from "~/components/refractor-skill";
import {
  IconAbc,
  IconBallpen,
  IconBrandTypescript,
  IconBrush,
  IconCloud,
  IconFileTypeCss,
  IconFileTypeHtml,
  IconFileTypeTs,
  IconHome,
  IconHtml,
  IconMusic,
  IconPaint,
  IconPencil,
  IconServer,
  IconSettings,
  IconUser,
  IconUsersGroup,
  IconWriting,
} from "@tabler/icons-react";
import { DEG2RAD } from "three/src/math/MathUtils.js";

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
    <div className="flex flex-col grow items-center p-20 gap-20 relative">
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

        <Separator className="mt-xl mb-xl relative flex flex-col justify-center items-center">
          <div className="absolute text-center text-2xl text-white w-30 bg-blue-800 -top-4.5">
            <ReactableText3D
              fontSize={1}
              className="m-auto"
              sceneClassname="-m-4"
              color="yellow"
              animation={(g) => {
                return gsap
                  .timeline()
                  .fromTo(
                    g.rotation,
                    {
                      z: 0 * DEG2RAD,
                      duration: 1,
                      ease: "elastic",
                    },
                    {
                      z: -15 * DEG2RAD,
                      duration: 1,
                      ease: "elastic",
                    },
                  )
                  .to(g.rotation, {
                    z: 15 * DEG2RAD,
                    duration: 1,
                    ease: "elastic",
                  });
              }}
            >
              Skills
            </ReactableText3D>
          </div>
        </Separator>

        {/* Skills */}
        <div className="grid grid-cols-2 gap-md">
          <RefractorSkill icon={<IconBallpen />} color="white" scale={1.5}>
            Frontend
          </RefractorSkill>

          <RefractorSkill icon={<IconServer />} color="white" scale={1.5}>
            Backend
          </RefractorSkill>
        </div>

        <div className="grid grid-cols-3 gap-md">
          <RefractorSkill icon={<IconHtml />} color="white">
            HTML
          </RefractorSkill>

          <RefractorSkill icon={<IconFileTypeCss />} color="white">
            CSS
          </RefractorSkill>

          <RefractorSkill icon={<IconBrandTypescript />} color="white">
            TypeScript
          </RefractorSkill>

          <RefractorSkill icon={<IconUsersGroup />} color="white">
            Technical Lead
          </RefractorSkill>

          <RefractorSkill icon={<IconAbc />} color="white">
            English Writing
          </RefractorSkill>

          <RefractorSkill icon={<IconCloud />} color="white">
            DevOps
          </RefractorSkill>

          <RefractorSkill icon={<IconMusic />} color="white">
            Music
          </RefractorSkill>

          <RefractorSkill icon={<IconWriting />} color="white">
            Creative Writing
          </RefractorSkill>

          <RefractorSkill icon={<IconBrush />} color="white">
            Drawing
          </RefractorSkill>
        </div>
      </Container>
    </div>
  );
}

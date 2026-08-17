import { Void } from "~/components/void";
import type { Route } from "./+types/home";
import { Center, Image, Text3D, useFont, View } from "@react-three/drei";
import RefractorCube from "~/components/refractor-cube";
import { useEffect, useMemo, useRef, useState } from "react";
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
import Seperator3D from "~/components/seperator-3d";
import { DoubleSide, Group, Mesh } from "three";
import { getRandomInt } from "~/utilities/RandomRange";
import { Button, buttonVariants } from "~/components/ui/button";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Muqtada's Portfolio" },
    {
      name: "description",
      content:
        "Welcome to Muqtada Abdulrasool's portfolio website! Be careful, for if you open it with your phone, it might implode!",
    },
  ];
}

export default function Home() {
  const DRPRef = useRef<Group>(null);
  const orbRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOrbTarget(orbRef.current);
  }, []);

  return (
    <div className="flex flex-col grow items-center p-20 gap-20 relative text-white">
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
        <div className="flex flex-row gap-10 items-center justify-center p-md">
          {/* <Avatar className="size-60" ref={orbRef}>
            <AvatarImage src="/Muqtada.jpg" />
          </Avatar> */}

          <div className="flex flex-col gap-xs items-center justify-center h-full">
            <div className="flex flex-col gap-sm items-center">
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
                gsap.timeline({ repeat: 4 }).fromTo(
                  g.rotation,
                  {
                    y: 0,
                    duration: 0.1,
                    ease: "none",
                  },
                  {
                    y: 360 * DEG2RAD,
                    duration: 0.1,
                    ease: "none",
                  },
                )
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

        <Seperator3D
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
        </Seperator3D>

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

        <Seperator3D
          fontSize={1}
          className="m-auto"
          sceneClassname="-m-4"
          color="yellow"
          applyAnimationToAllCharacters={false}
          repeatTriggerCount={1}
          masterAnimationRepeat={0}
          animation={(g) => {
            return gsap.timeline({ repeat: 4 }).fromTo(
              g.rotation,
              {
                x: 0 * DEG2RAD,
                ease: "none",
              },
              {
                x: 360 * DEG2RAD,
                duration: 0.2,
                ease: "none",
              },
            );
          }}
        >
          Projects
        </Seperator3D>

        {/* Projects */}
        <div className="flex flex-col gap-xl w-full">
          {/* DRP */}
          <div className="flex flex-row gap-md size-full">
            <DRP />
            <div className="w-1/2 flex flex-col gap-sm">
              <div className="text-2xl font-bold">
                Digital Recruitment Platform
              </div>
              <Separator />
              <div>
                I was the <em>technical lead</em>, the{" "}
                <em>frontend developer</em>, and the <em>DevOps</em> for the
                Digital Recruitment Platform.
                <br />
                <br />
                The DRP is a platform where companies browser and make
                interviews with graduates and students to find suitable hires.
                <br />
                <br />
                The platform has the following:
                <br />
                <strong>+50 companies</strong>
                <br />
                <strong>+200 graduate/student</strong>
                <br />
                <br />
                In the technical lead side, I handled team motivation and
                consistancy, managed tasks in a cenetral website (Trello). I
                kept schedules, called meetings, outlined goals, and kept the
                project within reasonable scope.
                <br />
                <br />
                In terms of the Frontend, the website used React Router and
                Mantine primarily. It supported dark and light themes, as well
                as stylized custom themes. Most importantly, considering the
                platform ran in Iraq, the website had a seamless localization
                implementation. One click and the website turns Arabic in
                milliseconds.
                <br />
                <br />
                Server wise, I handled the Linux server myself. I setup the
                firewall, all networking pipeline, and setup Coolify, the modern
                open source self-hosting platform. I had also implemented a
                pipeline for deploying the platform safely on testing servers
                before publication.
                <br />
                <br />
                An offline, serverless version of the platform available to be
                viewed freely at any time on my website. Consider the button
                below to check it out: (Warning: offline version isn't
                compatible with the Safari browser.)
                <br />
                <br />
              </div>
              <Link
                to="https://drp.muqtada.cv"
                target="_blank"
                className={buttonVariants({
                  variant: "default",
                  // className: "bg-[#DBD854]!",
                })}
              >
                Open Offline DRP
              </Link>
              {/* <Link
                to="https://drp.aliraqia.edu.iq"
                target="_blank"
                className={buttonVariants({
                  variant: "default",
                  // className: "bg-[#DBD854]!",
                })}
              >
                Open Official DRP
              </Link> */}
            </div>
          </div>

          <Separator />

          {/* Portfolio Website */}
          <div className="flex flex-row gap-md size-full">
            <MuqtadaCV />
            <div className="w-1/2 flex flex-col gap-sm">
              <div className="text-2xl font-bold">Portfolio Website</div>
              <Separator />
              <div>
                I had developed my portfolio with the intention of improving
                niche, rare-to-find skills in the industry. This included, but
                not limited to, <em>rendering 3D models</em>,{" "}
                <em>animations</em>, and{" "}
                <em>creative design approaches that stand out</em>.
                <br />
                <br />
                The portfolio utilizes the library <em>THREE.js</em> to render
                3D elements in the page. I had refrained from using multiple
                canvases throughout as to not hit the WebGL limit, and as such,
                I had to render one fixed canvas with multiple view components
                to render 3D models whenever I needed. This layout renders the
                3D models only at a limited 60 FPS as to not throttle the user's
                computer.
                <br />
                <br />
                The main inspiration for the portfolio, as you may guess, is the
                PlayStation 2. And one of its most difficult effects to
                replicate was the refractor cube. I worked to fine-tune the
                THREE.js shader to make it look as close as possible to how the
                cubes look in the PS2, though, with some added effects.
                <br />
                <br />
                The background is also inspired by the PS2, though I had taken
                some creative liberties here to shake things up a bit. It may
                come as a surprise, but the background is actually just an
                illusion. Using actual 3D models to render infinite scrolling
                was somewhat wasteful in terms of performance, as such, I had
                utilized the CSS perspective warp effect to achieve the look you
                see right now.
                <br />
                <br />I had put much effort and work into the 3D text of the
                website. They are not only animated by choice, they act like
                normal, selectable HTML text. This allows for a seemless
                interaction between the user and the website.
                <br />
                <br />
              </div>
              <Link
                to="https://muqtada.cv"
                target="_blank"
                className={buttonVariants({
                  variant: "default",
                  // className: "bg-[#DBD854]!",
                })}
              >
                Open Portfolio
              </Link>
            </div>
          </div>

          <Separator />

          {/* Heart. Lungs. Liver. Nerves. */}
          <div className="flex flex-row gap-md size-full">
            <HeartLungsLiverNerves />
            <div className="w-1/2 flex flex-col gap-sm">
              <div className="text-2xl font-bold">
                Heart. Lungs. Liver. Nerves.
              </div>
              <Separator />
              <div>
                This is a fan-made musical track I had composed and produced on
                my own.
                <br />
                <br />I used the Digital Audio Workstation{" "}
                <em>Bitwig Studio</em> to compose and produce. All instruments
                and sounds are of my own chosing except the vocal chop.
                <br />
                <br />
                The track had gathered the following statistics:
                <br />
                <strong>~500,000 Streams on Spotify</strong>
                <br />
                <strong>~420,000 Views on YouTube</strong>
                <br />
                <br />
              </div>
              <Link
                to="https://open.spotify.com/track/31PMtjcs0cM1AQMBGLjmgO"
                target="_blank"
                className={buttonVariants({
                  variant: "default",
                  // className: "bg-[#DBD854]!",
                })}
              >
                Listen on Spotify
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

useFont.preload("/fonts/tilges.json");

export function DRP() {
  const [textRef, setTextRef] = useState<Group | null>(null);

  useEffect(() => {
    if (!textRef) return;
    const DRPTL = gsap.timeline({ repeat: -1, repeatRefresh: true });
    DRPTL.to(
      textRef.rotation,
      {
        x: () => getRandomInt(-10, -40) * DEG2RAD,
        duration: getRandomInt(1200, 3200) * 0.001,
        ease: "none",
      },
      0,
    )
      .to(
        textRef.rotation,
        {
          y: () => getRandomInt(5, 20) * DEG2RAD,
          duration: getRandomInt(1200, 3200) * 0.001,
          ease: "none",
        },
        0,
      )
      .to(
        textRef.rotation,
        {
          z: () => getRandomInt(5, 20) * DEG2RAD,
          duration: getRandomInt(1200, 3200) * 0.001,
          ease: "none",
        },
        0,
      );
  }, [textRef]);

  return (
    <div className="flex justify-center items-center w-1/2 h-60 aspect-square sticky top-0">
      <View className="w-64 h-64 scale-140">
        <Center ref={setTextRef}>
          <ambientLight intensity={1.8} position={[0, 2, 1]} />
          <directionalLight
            castShadow
            position={[-5, 8, 5]}
            intensity={2.5}
            shadow-mapSize={[1024, 1024]}
          />

          <Text3D
            height={1}
            size={1.5}
            position={[0, 0, 0]}
            font="/fonts/tilges.json"
            curveSegments={32}
            bevelEnabled
            bevelSegments={8}
            bevelSize={0.05}
            bevelThickness={0.05}
          >
            D
            <meshStandardMaterial color={"#12b886"} />
          </Text3D>

          <Text3D
            height={1}
            size={1.5}
            position={[1.8, 0, 0]}
            font="/fonts/tilges.json"
            curveSegments={32}
            bevelEnabled
            bevelSegments={8}
            bevelSize={0.05}
            bevelThickness={0.05}
          >
            R
            <meshStandardMaterial color={"#228be6"} />
          </Text3D>

          <Text3D
            height={1}
            size={1.5}
            position={[3.6, 0, 0]}
            font="/fonts/tilges.json"
            curveSegments={32}
            bevelEnabled
            bevelSegments={8}
            bevelSize={0.05}
            bevelThickness={0.05}
          >
            P
            <meshStandardMaterial color={"#ff6fa1"} />
          </Text3D>
        </Center>
      </View>
    </div>
  );
}

export function MuqtadaCV() {
  return (
    <div className="flex justify-center items-center w-1/2 h-60 aspect-square sticky top-0">
      <View className="w-64 h-64 scale-140">
        <RefractorCube
          resolution="extreme"
          // color="purple"
          lightIntensity={1}
        />
        <RefractorCube resolution="high" size={1} />
      </View>
    </div>
  );
}

export function HeartLungsLiverNerves() {
  const [ref, setRef] = useState<Group | null>(null);

  useEffect(() => {
    if (!ref) return;
    const DRPTL = gsap.timeline({ repeat: -1, repeatRefresh: true });
    DRPTL.to(
      ref.rotation,
      {
        y: () => `+=${360 * DEG2RAD}`,
        duration: getRandomInt(4200, 6200) * 0.001,
        ease: "none",
      },
      0,
    );
  }, [ref]);

  return (
    <div className="flex justify-center items-center w-1/2 h-60 aspect-square sticky top-0">
      <View className="w-64 h-64 scale-140">
        <group ref={setRef}>
          <RefractorCube
            resolution="extreme"
            lightIntensity={1.0}
            size={[3, 0.4, 3]}
            spin={false}
            rotation={[90 * DEG2RAD, 0, 0]}
            ior={1}
            thickness={0.5}
            env="/hdr/dawn.hdr"
          >
            <Image url="/icons/hlln.png" scale={2.5} side={DoubleSide} />
          </RefractorCube>
        </group>
      </View>
    </div>
  );
}

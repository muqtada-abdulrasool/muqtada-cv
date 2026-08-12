import { Image, View } from "@react-three/drei";
import React, { isValidElement, useMemo } from "react";
import { renderToString } from "react-dom/server";
import RefractorCube from "./refractor-cube";

interface IconImageProps extends Omit<
  React.ComponentProps<typeof Image>,
  "url" | "texture"
> {
  icon: React.ReactElement;
  color?: string;
  scale?: number;
}

export function IconImage({
  icon,
  color = "white",
  scale = 1,
  ...props
}: IconImageProps) {
  const url = useMemo(() => {
    // 1. Inject custom color/stroke onto the React icon element
    const coloredIcon = React.cloneElement(
      icon as React.ReactElement<{ color?: string; stroke?: string }>,
      { color, stroke: color },
    );

    let svgString = renderToString(coloredIcon).replaceAll(
      "currentColor",
      color,
    );

    // 2. Ensure mandatory SVG namespace is present for Image loaders
    if (!svgString.includes("xmlns=")) {
      svgString = svgString.replace(
        "<svg",
        '<svg xmlns="http://www.w3.org/2000/svg"',
      );
    }

    // 3. Set explicit 256x256 pixel resolution so WebGL can rasterize the bitmap
    if (svgString.includes("width=")) {
      svgString = svgString
        .replace(/width="[^"]*"/, 'width="256"')
        .replace(/height="[^"]*"/, 'height="256"');
    } else {
      svgString = svgString.replace("<svg", '<svg width="256" height="256"');
    }

    // 4. Encode as Base64 for fail-proof texture parsing
    const base64 =
      typeof window !== "undefined"
        ? btoa(unescape(encodeURIComponent(svgString)))
        : Buffer.from(svgString).toString("base64");

    return `data:image/svg+xml;base64,${base64}`;
  }, [icon, color]);

  return <Image url={url} transparent scale={2 * scale} {...props} />;
}

interface RefractorSkillProps {
  icon?: React.ReactElement;
  color?: string;
  scale?: number;
  children?: React.ReactNode;
}

export default function RefractorSkill({
  icon,
  color = "white",
  scale = 1.1,
  children,
}: RefractorSkillProps) {
  return (
    <div className="flex flex-col gap-md items-center w-full">
      <View
        style={{
          width: 128 * Math.pow(scale, 1.2),
          height: 128 * Math.pow(scale, 1.2),
        }}
      >
        <RefractorCube size={3 * Math.pow(scale, 0.1)}>
          {icon && isValidElement(icon) && (
            <IconImage icon={icon} color={color} />
          )}
        </RefractorCube>
      </View>

      {children && (
        <div
          className="text-foreground text-center font-bold"
          style={{ fontSize: 22 * Math.pow(scale, 1.2) }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

import { Separator } from "@base-ui/react/separator";
import ReactableText3D, {
  type ReactableText3DProps,
} from "./reactable-text-3d";
import type React from "react";

interface Seperator3DProps extends Omit<ReactableText3DProps, "children"> {
  children: string;
}

export default function Seperator3D(props: Seperator3DProps) {
  return (
    <div className="w-full h-fit flex flex-row items-center justify-center gap-xl mt-xl mb-xl">
      <div className="flex-1 h-0.5 bg-input" />

      <ReactableText3D {...props}>{props.children}</ReactableText3D>

      <div className="flex-1 h-0.5 bg-input" />
    </div>
  );
}

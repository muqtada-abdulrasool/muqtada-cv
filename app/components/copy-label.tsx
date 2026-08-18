import { IconCheck, IconClipboard } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface CopyLabelProps {
  children?: string;
  className?: string;
}

export default function CopyLabel({
  children = "",
  className,
}: CopyLabelProps) {
  const [copied, setCopied] = useState(false);

  const CopyValue = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={`flex flex-row gap-0 h-10 ${className}`}>
      <Button
        variant={"default"}
        className={
          "rounded-se-none rounded-ee-none text-lg font-bold h-full pointer-events-none flex-1"
        }
      >
        {children}
      </Button>
      <div className="flex flex-row border-top-start-radius-md">
        <Button
          variant={"outline"}
          className={"rounded-es-none rounded-ss-none h-full"}
          onClick={() => CopyValue(children)}
          style={{ pointerEvents: copied ? "none" : undefined }}
        >
          {copied ? <IconCheck /> : <IconClipboard />}
        </Button>
      </div>
    </div>
  );
}

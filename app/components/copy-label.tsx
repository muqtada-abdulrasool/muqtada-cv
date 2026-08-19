import { IconCheck, IconClipboard } from "@tabler/icons-react";
import { Button, buttonVariants } from "./ui/button";
import { useState } from "react";
import { cn } from "~/lib/utils";

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
      <div
        className={cn(
          buttonVariants({ variant: "default" }),
          "rounded-se-none rounded-ee-none text-lg font-bold h-full flex-1 select-text cursor-text hover:bg-primary",
        )}
      >
        {children}
      </div>
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

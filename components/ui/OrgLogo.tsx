import React from "react";
import { cn } from "@/lib/utils";

/** A company or school logo on a white tile, or a lettered badge if there's no logo file. */
export const OrgLogo = ({ name, src, className }: { name: string; src?: string; className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg",
      src ? "bg-white p-1" : "border border-purple/40 bg-purple/15 text-sm font-bold text-purple",
      className
    )}
  >
    {src ? <img src={src} alt="" className="h-full w-full object-contain" /> : name.charAt(0)}
  </span>
);

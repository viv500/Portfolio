import React from "react";
import type { LinkItem, Platform } from "@/components/data";
import { cn } from "@/lib/utils";

const DOC = (
  <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V9h5.5L13 3.5ZM8 13v1.5h8V13H8Zm0 3.5V18h8v-1.5H8ZM8 10v1.5h3V10H8Z" />
);

const PATHS: Record<Platform, React.ReactNode> = {
  resume: DOC,
  pdf: DOC,
  github: (
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  ),
  gitlab: (
    <path d="m23.6 9.6-.03-.09L20.3.97a.85.85 0 0 0-1.62.08l-2.2 6.75H7.52L5.32 1.05A.85.85 0 0 0 3.7.97L.43 9.5l-.03.09a6.06 6.06 0 0 0 2 7l.02.01.03.02 4.98 3.73 2.46 1.87 1.5 1.13a1 1 0 0 0 1.22 0l1.5-1.13 2.46-1.87 5.01-3.75.01-.01a6.07 6.07 0 0 0 2-7Z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  ),
  devpost: (
    <path d="M6.2 0 0 12l6.2 12h11.6L24 12 17.8 0H6.2Zm1.76 5.6h4.2c3.6 0 6.04 2.5 6.04 6.4s-2.44 6.4-6.04 6.4h-4.2V5.6Zm2.8 2.5v7.8h1.3c2.14 0 3.3-1.5 3.3-3.9s-1.16-3.9-3.3-3.9h-1.3Z" />
  ),
  email: (
    <path d="M2 4h20a2 2 0 0 1 2 2v.4l-12 7.2L0 6.4V6a2 2 0 0 1 2-2Zm22 4.73V18a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.73l11.49 6.9a1 1 0 0 0 1.02 0L24 8.73Z" />
  ),
  youtube: (
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.4.52A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.13c1.9.52 9.4.52 9.4.52s7.5 0 9.4-.52a3 3 0 0 0 2.1-2.13A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.57V8.43L15.82 12 9.6 15.57Z" />
  ),
  web: (
    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm8.95 11h-3.98a18 18 0 0 0-1.5-6.5A9.03 9.03 0 0 1 20.95 11ZM12 21c-1.1-1.3-2.7-4.1-2.96-8h5.92C14.7 16.9 13.1 19.7 12 21Zm-2.96-10C9.3 7.1 10.9 4.3 12 3c1.1 1.3 2.7 4.1 2.96 8H9.04ZM8.53 4.5A18 18 0 0 0 7.03 11H3.05a9.03 9.03 0 0 1 5.48-6.5ZM3.05 13h3.98a18 18 0 0 0 1.5 6.5A9.03 9.03 0 0 1 3.05 13Zm12.42 6.5a18 18 0 0 0 1.5-6.5h3.98a9.03 9.03 0 0 1-5.48 6.5Z" />
  ),
};

export const PlatformIcon = ({ platform, className }: { platform: Platform; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("h-4 w-4 shrink-0", className)}>
    {PATHS[platform]}
  </svg>
);

export const PlatformLink = ({ link, className }: { link: LinkItem; className?: string }) => {
  const external = !link.href.startsWith("mailto:");
  return (
    <a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm text-white-100 transition hover:border-purple/60 hover:text-white",
        className
      )}
    >
      <PlatformIcon platform={link.platform} />
      <span>{link.label}</span>
    </a>
  );
};

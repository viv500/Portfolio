"use client";

import React from "react";
import Image from "next/image";
import { hackathons, type Project } from "@/components/data";
import { previews, stamps, type Stamp } from "@/components/data/airport";
import { GateHeader } from "./GateHeader";

// Hackathons as a card grid: screenshot, project name, event + year, and the award. Winners lead
// in a larger row; the rest follow in a smaller one. A small ink stamp in the corner is pure
// decoration (the card text carries the information). Every card opens the project.

// Stamp inks, as tokens (globals.css). "blue" and "violet" are drawn in warm inks: blue is kept
// for the daytime sky and the logbook's COMPLETED stamp only.
export const INK: Record<Stamp["ink"], string> = {
  blue: "rgb(var(--stamp-brown))",
  red: "rgb(var(--stamp-red))",
  green: "rgb(var(--stamp-green))",
  violet: "rgb(var(--stamp-olive))",
  teal: "rgb(var(--stamp-teal))",
};

/** Roughens stamp edges so they read as ink, not vector shapes. Render once per page (the logbook stamps use it too). */
export const InkFilter = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true">
    <filter id="ink-rough">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
      <feDisplacementMap in="SourceGraphic" scale="1.6" />
    </filter>
  </svg>
);

const WINNERS = ["watchdog", "canify", "datafest"];

const split = (context: string) => {
  const m = context.match(/^(.*?)\s*(\d{4})$/);
  return m ? { event: m[1], year: m[2] } : { event: context, year: "" };
};

/** Small ink stamp ("Admitted", event, year): decoration, always bottom-right of the text area. */
const CornerStamp = ({ project, size }: { project: Project; size: "lg" | "sm" }) => {
  const stamp = stamps[project.slug] ?? { ink: "blue", shape: "round", rotate: -6 };
  const color = INK[stamp.ink];
  const { event, year } = split(project.context);
  const dims = size === "lg" ? "h-[63px] w-[63px] text-[6px]" : "h-[49px] w-[49px] text-[5px]";
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none flex shrink-0 ${dims} ${stamp.shape === "rect" ? "rounded-[5px]" : "rounded-full"} flex-col items-center justify-center border-2 p-1 text-center font-mono font-bold uppercase leading-tight opacity-90`}
      style={{ borderColor: color, color, rotate: `${Math.max(-7, Math.min(7, stamp.rotate || -5))}deg` }}
    >
      <span className="tracking-[0.12em] opacity-80">Admitted</span>
      <span className="mt-0.5 max-w-full truncate">{event}</span>
      <span className="mt-0.5 rounded-[2px] border px-1 tracking-[0.12em]" style={{ borderColor: color }}>
        {year}
      </span>
    </span>
  );
};

/** How each card image sits in its frame: "contain" shows a chart whole; otherwise a crop focus. */
const FIT: Record<string, string> = { datafest: "contain", canify: "50% 70%" };

/** Winners' pin: small metallic gold pilot wings, top-left of the image. */
const WingsPin = () => (
  <svg aria-hidden="true" viewBox="0 0 80 28" className="absolute left-2.5 top-2.5 z-10 w-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)]">
    <defs>
      <linearGradient id="wings-gold" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fbe7a1" />
        <stop offset="0.45" stopColor="#e2b44a" />
        <stop offset="1" stopColor="#9c6f1a" />
      </linearGradient>
    </defs>
    {/* Feathered wings either side of a round shield with a star. */}
    {[1, -1].map((d) => (
      <g key={d} transform={d === -1 ? "translate(80 0) scale(-1 1)" : undefined}>
        <path d="M30 10 C 22 6, 10 5, 1 7 C 6 9, 10 10, 14 11 C 9 12, 6 13, 3 15 C 10 15, 15 15, 19 14 C 15 16, 12 18, 10 20 C 18 19, 25 17, 31 15 Z" fill="url(#wings-gold)" stroke="#7a5512" strokeWidth="0.6" />
      </g>
    ))}
    <circle cx="40" cy="13" r="10" fill="url(#wings-gold)" stroke="#7a5512" strokeWidth="0.8" />
    <path d="M40 6.8l1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="#8a5f14" />
  </svg>
);

/** For a project with no screenshot: its name as a small logo on passport paper. */
const Placeholder = ({ title }: { title: string }) => (
  <span className="passport-paper absolute inset-0 flex flex-col items-center justify-center gap-2">
    <span aria-hidden="true" className="grid grid-cols-3 gap-[3px]">
      {["stamp-brown", "stamp-red", "stamp-green", "bag-6", "stamp-brown", "stamp-olive", "stamp-teal", "stamp-red", "bag-1"].map((t) => `rgb(var(--${t}))`).map((c, i) => (
        <span key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />
      ))}
    </span>
    <span className="font-sign text-xl font-extrabold tracking-tight text-[#1c2636]">{title}</span>
  </span>
);

const Card = ({ project, size }: { project: Project; size: "lg" | "sm" }) => {
  const { event, year } = split(project.context);
  const img = previews[project.slug];
  const lg = size === "lg";
  return (
    <a
      href={`#hackathons/${project.slug}`}
      className={`clickable on-paper flex h-full flex-col overflow-hidden rounded-xl pass-stock text-[#1a1a1a] elev-2 ${lg ? "winner" : ""}`}
      aria-label={`${project.title}, ${project.context}${project.badge ? `, ${project.badge}` : ""}${lg ? ", winner" : ""}. Details`}
    >
      <div className={`relative shrink-0 ${lg ? "aspect-[2.35/1]" : "aspect-[2.8/1]"} bg-[#e9dcc4]`}>
        {img ? (
          <Image src={img} alt="" fill sizes={lg ? "(min-width: 768px) 360px, 100vw" : "(min-width: 768px) 260px, 50vw"} className={FIT[project.slug] === "contain" ? "object-contain" : "object-cover"} style={FIT[project.slug] && FIT[project.slug] !== "contain" ? { objectPosition: FIT[project.slug] } : undefined} />
        ) : (
          <Placeholder title={project.title} />
        )}
        {lg && <WingsPin />}
      </div>
      <div className={`relative flex flex-1 flex-col ${lg ? "px-3.5 py-3" : "px-3 py-2.5"}`}>
        <div className={`font-sign font-extrabold leading-tight ${lg ? "text-[17px]" : "text-[14px]"}`}>{project.title}</div>
        <div className={`mt-0.5 text-black/65 ${lg ? "text-[13.5px]" : "text-[12.5px]"}`}>
          {event} · {year}
        </div>
        {project.badge && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-b from-[#f1d27a] to-[#d4a033] px-2.5 py-1 text-[12.5px] font-bold leading-tight text-[#3b2a05] shadow-sm ring-1 ring-[#a8842b]">
              ★ {project.badge}
            </span>
          </div>
        )}
        {/* The affordance bottom-left; the stamp overlays the bottom-right of the text area (never the screenshot). */}
        <div className="mt-auto pt-2">
          <span className="affordance">Details →</span>
        </div>
        <span className={`absolute ${lg ? "bottom-3 right-3.5" : "bottom-2.5 right-3"}`}>
          <CornerStamp project={project} size={size} />
        </span>
      </div>
    </a>
  );
};

export const PassportControl = () => {
  const winners = WINNERS.map((slug) => hackathons.find((h) => h.slug === slug)).filter(Boolean) as Project[];
  const rest = hackathons.filter((h) => !WINNERS.includes(h.slug));
  return (
    <section id="hackathons" className="amb-desk scroll-mt-14 px-4 py-10 md:px-6 md:py-12">
      <InkFilter />
      <div className="mx-auto max-w-6xl">
        <GateHeader letter="D" en="Passport Control" label="Hackathons" intro="Seven hackathons, three wins, $3,500 in prizes." hint="Each card opens the project" />
        <ul className="grid gap-5 md:grid-cols-3">
          {winners.map((p) => (
            <li key={p.slug}>
              <Card project={p} size="lg" />
            </li>
          ))}
        </ul>
        <ul className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
          {rest.map((p) => (
            <li key={p.slug}>
              <Card project={p} size="sm" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

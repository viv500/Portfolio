"use client";

import React from "react";
import { motion } from "framer-motion";
import { hackathons, wins, type Project } from "@/components/data";
import { previews, stamps, type Stamp } from "@/components/data/airport";
import Image from "next/image";
import { GateHeader } from "./GateHeader";

export const INK: Record<Stamp["ink"], string> = {
  blue: "#2b4c9b",
  red: "#b8322a",
  green: "#2f7a4f",
  violet: "#5b3f8f",
  teal: "#1f6f78",
};

/** Roughens stamp edges so they read as ink, not vector shapes. Render once per page. */
export const InkFilter = () => (
  <svg width="0" height="0" className="absolute" aria-hidden="true">
    <filter id="ink-rough">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
      <feDisplacementMap in="SourceGraphic" scale="1.6" />
    </filter>
  </svg>
);

const split = (context: string) => {
  const m = context.match(/^(.*?)\s*(\d{4})$/);
  return m ? { event: m[1], year: m[2] } : { event: context, year: "" };
};

export const InkStamp = ({ project, stamp, size = "md" }: { project: Project; stamp: Stamp; size?: "sm" | "md" }) => {
  const color = INK[stamp.ink];
  const { event, year } = split(project.context);
  const dims = size === "sm" ? "w-32 h-32 text-[9px]" : "w-40 h-40 md:w-44 md:h-44 text-[10px]";
  const shape =
    stamp.shape === "round" ? "rounded-full" : stamp.shape === "oval" ? "rounded-[50%] !h-28 md:!h-32 !w-44 md:!w-52" : "rounded-[6px] !h-32 md:!h-36";
  return (
    <div className={`ink relative flex ${dims} ${shape} flex-col items-center justify-center border-[3px] p-2 text-center font-mono font-bold uppercase leading-tight`} style={{ borderColor: color, color }}>
      <div className={`absolute inset-[5px] ${stamp.shape === "rect" ? "rounded-[3px]" : "rounded-[inherit]"} border`} style={{ borderColor: color }} />
      <span className="tracking-[0.2em] opacity-80">Admitted</span>
      <span className="mt-1 font-sign text-[15px] font-extrabold leading-none tracking-tight md:text-[17px]">{project.title}</span>
      <span className="mt-1 max-w-[90%] truncate">{event}</span>
      <span className="mt-0.5 rounded-[2px] border px-1.5 tracking-[0.2em]" style={{ borderColor: color }}>
        {year}
      </span>
    </div>
  );
};

export const PassportControl = () => {
  const ordered = [...wins.map((s) => hackathons.find((h) => h.slug === s)!), ...hackathons.filter((h) => !wins.includes(h.slug))];
  return (
    <section id="hackathons" className="amb-desk scroll-mt-14 px-4 py-16 md:px-6 md:py-24">
      <InkFilter />
      <div className="mx-auto max-w-6xl">
        <GateHeader letter="D" en="Passport Control" label="Hackathons" intro="Seven hackathons, three wins, $3,500 in prizes." hint="Each stamp opens the project" />

        <div className="relative rounded-lg bg-cover p-2 elev-4 md:p-2.5">
        <div className="passport-paper spread-curve relative overflow-hidden rounded-md px-4 py-8 md:px-10 md:py-12">
          {/* Centre fold of the open passport. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-1/3 -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_30%,rgba(60,40,20,0.1)_44%,rgba(60,40,20,0.26)_50%,rgba(60,40,20,0.1)_56%,rgba(255,255,255,0.18)_70%,transparent_100%)] md:block" />
          <div aria-hidden="true" className="pointer-events-none absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-black/60">Visas · Entries</div>
          <div aria-hidden="true" className="pointer-events-none absolute right-5 top-4 font-mono text-[10px] text-black/60">07</div>

          <ul className="grid grid-cols-1 place-items-center gap-x-4 gap-y-24 pt-20 min-[480px]:grid-cols-2 md:grid-cols-4">
            {ordered.map((project, i) => {
              const stamp = stamps[project.slug] ?? { ink: "blue", shape: "round", rotate: 0 };
              const win = wins.includes(project.slug);
              return (
                <li key={project.slug} className={i === 3 ? "md:col-start-1" : ""}>
                  <motion.a
                    href={`#hackathons/${project.slug}`}
                    aria-label={`${project.title}, ${project.context}${project.badge ? `, ${project.badge}` : ""}`}
                    initial={{ opacity: 0, scale: 1.7, rotate: stamp.rotate - 10 }}
                    whileInView={{ opacity: 0.92, scale: 1, rotate: stamp.rotate }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18, delay: (i % 4) * 0.12 }}
                    whileHover={{ scale: 1.05, opacity: 1 }}
                    className="group relative block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/60"
                  >
                    {previews[project.slug] && (
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 z-0 w-28 bg-white p-1.5 pb-5 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-out [transform:translate(22%,-102%)_rotate(9deg)_scale(0.82)] group-hover:[transform:translate(28%,-118%)_rotate(12deg)_scale(1.05)] group-focus-visible:[transform:translate(28%,-118%)_rotate(12deg)_scale(1.05)] md:w-32"
                      >
                        <span className="relative block aspect-[4/3] overflow-hidden bg-black/10">
                          <Image src={previews[project.slug]} alt="" fill sizes="128px" className="object-cover" />
                        </span>
                      </span>
                    )}
                    <span className="relative z-10 block">
                      <InkStamp project={project} stamp={stamp} />
                    </span>
                    {win && (
                      <span
                        className="absolute -bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-[2px] bg-gradient-to-b from-[#f1d27a] to-[#c9a23f] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#3b2a05] shadow ring-1 ring-[#a8842b]"
                        style={{ rotate: `${-stamp.rotate}deg` }}
                      >
                        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
                          <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
                        </svg>
                        {project.badge}
                      </span>
                    )}
                  </motion.a>
                </li>
              );
            })}
          </ul>
        </div>
        </div>
      </div>
    </section>
  );
};

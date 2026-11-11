"use client";

import React from "react";
import { motion } from "framer-motion";
import { projects } from "@/components/data";
import { passCodes, previews } from "@/components/data/airport";
import Image from "next/image";
import { GateHeader } from "./GateHeader";
import { PlaneIcon } from "./CheckIn";

type Pass = { slug: string; title: string; tagline: string; context: string; badge?: string; stack: string[]; href: string };

// The flagship lives under Arctic Wolf, but it's the project most worth seeing, so it boards first.
const PASSES: Pass[] = [
  {
    slug: "allocator",
    title: "AWS Dedicated Host Allocator",
    tagline: "A Go CLI that keeps retrying AWS Mac host allocation in the background and notifies you when it succeeds. Internal tool, so no public repo.",
    context: "Arctic Wolf · 2026",
    badge: "3+ teams adopted",
    stack: ["Go", "AWS SDK", "launchd", "AWS SSO"],
    href: "#experience/arctic-wolf",
  },
  ...projects.map((p) => ({ slug: p.slug, title: p.title, tagline: p.tagline, context: p.context, badge: p.badge, stack: p.stack, href: `#projects/${p.slug}` })),
];

/** Deterministic barcode from a string. */
const Barcode = ({ seed, className = "" }: { seed: string; className?: string }) => {
  let h = 2166136261;
  const bars: number[] = [];
  for (let i = 0; i < 46; i++) {
    h ^= seed.charCodeAt(i % seed.length) + i;
    h = Math.imul(h, 16777619) >>> 0;
    bars.push(1 + (h % 3));
  }
  let x = 0;
  return (
    <svg viewBox="0 0 120 30" preserveAspectRatio="none" className={className} aria-hidden="true">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w * 0.9} height="30" fill="#1a1a1a" /> : null;
        x += w * 0.9 + 0.6;
        return rect;
      })}
    </svg>
  );
};

/** An aircraft window cut into the pass, looking out on the project. */
const PassWindow = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="relative h-28 w-[4.6rem] shrink-0 rounded-[2.3rem] bg-gradient-to-b from-[#e9e4d8] to-[#cfc8b8] p-[5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.25)] sm:h-32 sm:w-[5.4rem]">
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgb(var(--sky-1)),rgb(var(--sky-2))_60%,rgb(var(--sky-3)))] shadow-[inset_0_3px_8px_rgba(0,0,0,0.55)]">
      {src ? (
        <Image src={src} alt="" fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
      ) : (
        <span aria-hidden="true" className="absolute left-[-20%] top-[55%] h-6 w-[140%] rounded-full bg-white/50 blur-md" />
      )}
      {/* Glass reflection. */}
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_40%)]" />
    </div>
  </div>
);

const Field = ({ k, v, className = "" }: { k: string; v: React.ReactNode; className?: string }) => (
  <div className={className}>
    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/60">{k}</div>
    <div className="mt-0.5 font-sign text-[13px] font-bold uppercase text-[#1a1a1a]">{v}</div>
  </div>
);

const BoardingPass = ({ pass, index }: { pass: Pass; index: number }) => {
  const code = passCodes[pass.slug] ?? { from: "YKF", to: "DEV", seat: `${index + 1}A` };
  const gate = `C${index + 1}`;
  return (
    <motion.a
      href={pass.href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 2) * 0.08 }}
      whileHover={{ y: -6, rotate: index % 2 ? 0.6 : -0.6 }}
      className="group flex overflow-hidden rounded-lg pass-stock text-[#1a1a1a] elev-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sign"
    >
      {/* Main ticket. */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between lightbox px-4 py-2 font-sign text-[11px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <PlaneIcon className="h-3.5 w-3.5 rotate-45" /> VJ Air · Boarding pass
          </span>
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-3">
            <span className="font-sign text-3xl font-extrabold tracking-tight md:text-4xl">{code.from}</span>
            <span className="flex flex-1 items-center gap-1 text-black/60">
              <span className="h-px flex-1 border-t border-dashed border-black/30" />
              <PlaneIcon className="h-4 w-4 rotate-90 text-black/60 transition-transform duration-500 group-hover:translate-x-2" />
              <span className="h-px flex-1 border-t border-dashed border-black/30" />
            </span>
            <span className="font-sign text-3xl font-extrabold tracking-tight md:text-4xl">{code.to}</span>
          </div>
          <div className="mt-3 flex gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-sign text-lg font-bold leading-tight md:text-xl">{pass.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-black/65">{pass.tagline}</p>
            </div>
            <PassWindow src={previews[pass.slug]} alt={pass.title} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-dashed border-black/15 pt-3">
            <Field k="Flight" v={pass.context.split("·")[0].trim()} className="col-span-2" />
            <Field k="Class" v={pass.badge ?? "Economy"} />
          </div>
          <div className="mt-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/60">Cargo</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {pass.stack.slice(0, 5).map((s) => (
                <span key={s} className="rounded-[2px] border border-black/15 px-1.5 py-0.5 font-mono text-[10.5px]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Perforation, with half-circle notches top and bottom. */}
      <div className="relative w-3 shrink-0">
        <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-wall shadow-[inset_0_-2px_3px_rgba(0,0,0,0.6)]" />
        <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-wall shadow-[inset_0_2px_3px_rgba(0,0,0,0.6)]" />
        <span className="pass-perf absolute inset-y-3 left-1/2 w-[3px] -translate-x-1/2" />
      </div>

      {/* Stub. */}
      <div className="flex w-[5.5rem] shrink-0 flex-col justify-between bg-pass-shade p-3 sm:w-28">
        <div className="space-y-2.5">
          <Field k="Gate" v={gate} />
          <Field k="Seat" v={code.seat} />
        </div>
        <Barcode seed={pass.slug} className="my-3 h-10 w-full" />
        <span className="font-mono text-[10px] font-bold uppercase text-black/60 transition group-hover:text-black">Board →</span>
      </div>
    </motion.a>
  );
};

export const Gates = () => (
  <section id="projects" className="amb-hall scroll-mt-14 px-4 py-16 md:px-6 md:py-24">
    <div className="mx-auto max-w-6xl">
      <GateHeader letter="C" en="Gates C1–C4" label="Projects" intro="Tools and research. Each pass opens the full write-up." />
      <div className="grid gap-6 md:grid-cols-2">
        {PASSES.map((pass, i) => (
          <BoardingPass key={pass.slug} pass={pass} index={i} />
        ))}
      </div>
    </div>
  </section>
);

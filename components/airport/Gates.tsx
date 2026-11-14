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
/** Porthole. Its inner shape matches the artwork's 0.65 aspect, so `art` (a designed image with
 * words, like the allocator's) is never cropped; art also skips the hover zoom. */
/**
 * The allocator's window: a macOS-style notification over the sunset sky. Drawn as SVG, so the
 * text stays crisp at any size; the viewBox matches the porthole, so it scales to fit.
 */
const AllocatorWindow = () => (
  <svg viewBox="0 0 200 310" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Notification: Host Allocator, mac2.metal allocated in us-east-1b after 3 days of retries">
    <defs>
      <linearGradient id="alloc-sky" x1="0" x2="0" y1="0" y2="1">
        {/* The dusk sky tokens (warm in golden hour, blue by day). */}
        <stop offset="0" style={{ stopColor: "rgb(var(--sky-0))" }} />
        <stop offset="0.38" style={{ stopColor: "rgb(var(--sky-1))" }} />
        <stop offset="0.62" style={{ stopColor: "rgb(var(--sky-2))" }} />
        <stop offset="1" style={{ stopColor: "rgb(var(--sky-3))" }} />
      </linearGradient>
      <filter id="alloc-shadow" x="-20%" y="-40%" width="140%" height="190%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.45" />
      </filter>
    </defs>
    <rect width="200" height="310" fill="url(#alloc-sky)" />
    {/* Frosted dark glass banner, centred vertically. */}
    <g filter="url(#alloc-shadow)">
      <rect x="9" y="122" width="182" height="66" rx="14" fill="rgba(40,34,44,0.82)" stroke="rgba(255,255,255,0.14)" />
    </g>
    {/* App icon: the EC2 hexagon. */}
    <path d="M28 132.5 l8.5 4.9 v9.8 l-8.5 4.9 -8.5 -4.9 v-9.8 z" fill="#e07b22" />
    <rect x="24.4" y="138.6" width="5.2" height="5.2" fill="none" stroke="#fff" strokeWidth="0.9" />
    <rect x="26.4" y="140.6" width="5.2" height="5.2" fill="none" stroke="#fff" strokeWidth="0.9" />
    <g fontFamily="var(--font-sign), -apple-system, sans-serif">
      <text x="42" y="146" fill="rgba(255,255,255,0.78)" fontSize="10.5" fontWeight="600" letterSpacing="0.3">HOST ALLOCATOR</text>
      <text x="181" y="146" fill="rgba(255,255,255,0.55)" fontSize="9.5" textAnchor="end">now</text>
      <text x="20" y="164" fill="#fff" fontSize="12" fontWeight="700">✓ mac2.metal allocated</text>
      <text x="20" y="179" fill="rgba(255,255,255,0.72)" fontSize="9.5">us-east-1b · after 3 days of retries</text>
    </g>
  </svg>
);

const PassWindow = ({ src, alt, art = false, focus, children }: { src?: string; alt: string; art?: boolean; focus?: string; children?: React.ReactNode }) => (
  <div className="relative h-32 w-[5.4rem] shrink-0 rounded-[2.3rem] bg-gradient-to-b from-[#e9e4d8] to-[#cfc8b8] p-[5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.25)] sm:h-[8.5rem] sm:w-[5.6rem]">
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgb(var(--sky-1)),rgb(var(--sky-2))_60%,rgb(var(--sky-3)))] shadow-[inset_0_3px_8px_rgba(0,0,0,0.55)]">
      {art && <span aria-hidden="true" className="absolute inset-0 bg-[#141317]" />}
      {children ? (
        children
      ) : src ? (
        art ? (
          // Inset into the porthole's straight-sided middle band, so the rounded ends never clip it.
          <span className="absolute inset-x-[3%] inset-y-[17%]">
            <Image src={src} alt="" fill sizes="110px" className="object-contain" />
          </span>
        ) : (
          <Image src={src} alt="" fill sizes="110px" className="object-cover transition-transform duration-500 group-hover:scale-110" style={focus ? { objectPosition: focus } : undefined} />
        )
      ) : (
        <span aria-hidden="true" className="absolute left-[-20%] top-[55%] h-6 w-[140%] rounded-full bg-white/50 blur-md" />
      )}
      {/* Glass reflection. */}
      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_40%)]" />
    </div>
  </div>
);

/** One end of a pass's route: a small FROM/TO eyebrow, the big word, and a caption under it. */
const RouteEnd = ({ eyebrow, word, caption, align = "left" }: { eyebrow: string; word: string; caption: string; align?: "left" | "right" }) => {
  const size = word.length <= 4 ? "text-[22px] sm:text-[27px] md:text-[32px]" : word.length <= 6 ? "text-lg sm:text-[22px] md:text-[27px]" : "text-base sm:text-lg md:text-[23px]";
  return (
    <div className={`min-w-0 max-w-[45%] shrink-0 sm:max-w-none ${align === "right" ? "text-right" : ""}`}>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/55">{eyebrow}</div>
      <div className={`whitespace-nowrap font-sign font-extrabold leading-none tracking-tight ${size}`}>{word}</div>
      <div className="mt-1 text-[10.5px] leading-tight text-black/60 sm:whitespace-nowrap sm:text-[11.5px]">{caption}</div>
    </div>
  );
};

const Field = ({ k, v, className = "" }: { k: string; v: React.ReactNode; className?: string }) => (
  <div className={className}>
    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/60">{k}</div>
    <div className="mt-0.5 font-sign text-[13px] font-bold uppercase text-[#1a1a1a]">{v}</div>
  </div>
);

/** Where to centre a window's crop (the ECG's QRS spike sits right of centre). */
const FOCUS: Record<string, string> = { ecg: "62% 50%", wat2eat: "50% 40%" };

/** Short CLASS labels where the badge is too long for the field. */
const CLASS: Record<string, string> = { allocator: "3+ teams" };

const BoardingPass = ({ pass, index }: { pass: Pass; index: number }) => {
  const code = passCodes[pass.slug] ?? { from: "IDEA", fromCap: "", to: "SHIPPED", toCap: "", seat: `${index + 1}A` };
  const gate = `C${index + 1}`;
  return (
    <motion.a
      href={pass.href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: (index % 2) * 0.08 }}
      className="clickable on-paper group flex overflow-hidden rounded-lg pass-stock text-[#1a1a1a] elev-3"
    >
      {/* Main ticket. */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between lightbox px-4 py-1.5 font-sign text-[11px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <PlaneIcon className="h-3.5 w-3.5 rotate-45" /> VJ Air · Boarding pass
          </span>
        </div>
        {/* Compact layout: all the text on the left, the porthole beside it on the right. */}
        <div className="flex gap-4 px-4 pb-3 pt-2.5 md:px-[18px]">
          <div className="min-w-0 flex-1">
            {/* Route: the problem it starts from → the result. Long words step the size down so each fits on one line. */}
            <div className="flex items-start gap-3">
              <RouteEnd eyebrow="From" word={code.from} caption={code.fromCap} />
              <span className="mt-[24px] flex min-w-[2rem] flex-1 items-center gap-1 text-black/60">
                <span className="h-px flex-1 border-t border-dashed border-black/30" />
                <PlaneIcon className="h-4 w-4 shrink-0 rotate-90 text-black/60 transition-transform duration-500 group-hover:translate-x-2" />
                <span className="h-px flex-1 border-t border-dashed border-black/30" />
              </span>
              <RouteEnd eyebrow="To" word={code.to} caption={code.toCap} align="right" />
            </div>
            <h3 className="mt-2 font-sign text-[17px] font-bold leading-tight">{pass.title}</h3>
            <p className="mt-1 line-clamp-3 text-[13.5px] sm:line-clamp-2 leading-snug text-black/65" title={pass.tagline}>{pass.tagline}</p>
            {/* Flight and class on one line, then the cargo on one row. */}
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-0.5 border-t sm:flex-nowrap border-dashed border-black/15 pt-1.5 font-sign text-[12px] font-bold uppercase">
              <span className="min-w-0 sm:truncate">
                <span className="mr-1.5 font-mono text-[9px] font-normal tracking-[0.18em] text-black/60">Flight</span>
                {pass.context.split("·")[0].trim()}
              </span>
              <span className="whitespace-nowrap">
                <span className="mr-1.5 font-mono text-[9px] font-normal tracking-[0.18em] text-black/60">Class</span>
                {CLASS[pass.slug] ?? pass.badge ?? "Economy"}
              </span>
            </div>
            <div className="mt-1.5 flex h-[19px] flex-wrap gap-1 overflow-hidden">
              {pass.stack.slice(0, 5).map((s) => (
                <span key={s} className="rounded-[2px] border border-black/15 px-1.5 py-px font-mono text-[10.5px]">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden shrink-0 self-center sm:block">
            <PassWindow src={previews[pass.slug]} alt={pass.title} art={pass.slug === "internship-bot"} focus={FOCUS[pass.slug]}>
              {pass.slug === "allocator" ? <AllocatorWindow /> : null}
            </PassWindow>
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
      <div className="flex w-[5.5rem] shrink-0 flex-col justify-between bg-pass-shade p-3">
        <div className="space-y-2.5">
          <Field k="Gate" v={gate} />
          <Field k="Seat" v={code.seat} />
        </div>
        <Barcode seed={pass.slug} className="my-2 h-9 w-full" />
        <span className="affordance !font-medium">Details →</span>
      </div>
    </motion.a>
  );
};

export const Gates = () => (
  <section id="projects" className="amb-hall scroll-mt-14 px-4 py-10 md:px-6 md:py-12">
    <div className="mx-auto max-w-6xl">
      <GateHeader letter="C" en="Connecting flights" label="Projects" intro="Tools and research." hint="Each boarding pass opens the full write-up" />
      <div className="grid gap-3 md:grid-cols-2">
        {PASSES.map((pass, i) => (
          <BoardingPass key={pass.slug} pass={pass} index={i} />
        ))}
      </div>
    </div>
  </section>
);

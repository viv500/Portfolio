"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { impact, roles, techGroups } from "@/components/data";
import { flights } from "@/components/data/airport";
import { GateHeader } from "./GateHeader";
import { Airspeed, Altimeter, Attitude, Bezel, Heading, TurnCoordinator, VerticalSpeed, useInstrumentProgress } from "./instruments";

const Screws = () => (
  <>
    <span className="screw absolute left-2 top-2" />
    <span className="screw absolute right-2 top-2" />
    <span className="screw absolute bottom-2 left-2" />
    <span className="screw absolute bottom-2 right-2" />
  </>
);

/** Backlit white panel lettering. */
const PanelLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`font-mono text-[9px] uppercase tracking-[0.25em] text-ink/70 [text-shadow:0_0_6px_rgb(var(--ink)/0.35)] ${className}`}>{children}</span>
);

// ── Overhead panel: the tech stack as rows of switches ──────────────────
const Switch = ({ label, i }: { label: string; i: number }) => {
  const [on, setOn] = useState(i % 4 !== 3);
  return (
    <button type="button" aria-pressed={on} onClick={() => setOn((v) => !v)} className="group flex w-[4.6rem] flex-col items-center gap-1.5 focus-visible:outline-none" title={label}>
      <span className="relative flex h-9 w-6 items-center justify-center rounded-[5px] bg-gradient-to-b from-raised to-floor shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_3px_rgba(0,0,0,0.7)] group-focus-visible:ring-2 group-focus-visible:ring-sign">
        <span className="h-3 w-3 rounded-full bg-[#050607] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)]" />
        <span
          className={`absolute left-1/2 h-5 w-2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#8d929b] via-[#e7e9ed] to-[#7a7f88] shadow-[0_2px_3px_rgba(0,0,0,0.6)] transition-all duration-150 ${on ? "top-0" : "top-[1rem]"}`}
        />
      </span>
      <span className="text-center font-mono text-[9px] uppercase leading-tight text-ink/75 [text-shadow:0_0_6px_rgb(var(--ink)/0.25)]">{label}</span>
    </button>
  );
};

const Overhead = () => (
  <div className="overhead-panel metal relative rounded-t-[22px] px-5 pb-6 pt-8 md:px-8">
    <Screws />
    <div className="mb-5 flex items-center justify-between">
      <PanelLabel>Overhead panel · Stack</PanelLabel>
      <PanelLabel className="hidden text-ink/70 sm:inline">Systems</PanelLabel>
    </div>
    <div className="grid gap-x-6 gap-y-6 md:grid-cols-2 xl:grid-cols-3">
      {techGroups.map((g) => (
        <div key={g.name} className="recessed rounded-md bg-wall/70 p-3">
          <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-white/[0.06] pb-1.5">
            <span className="font-sign text-[12px] font-bold uppercase tracking-wide text-ink">{g.name}</span>
          </div>
          <div className="flex flex-wrap gap-y-3">
            {g.items.map((item, i) => (
              <Switch key={item} label={item} i={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── Glareshield: the dark padded lip between the overhead and main panels ─
const GlareshieldLip = () => (
  <div aria-hidden="true" className="relative z-10 -mx-1 h-7 rounded-b-[28px] bg-[linear-gradient(180deg,rgb(var(--cabin)),rgb(var(--cabin-dark)))] shadow-[0_18px_30px_-10px_rgb(var(--sh)/0.6),inset_0_1px_0_rgba(255,255,255,0.08)]" />
);

// ── The six-pack ────────────────────────────────────────────────────────
// Instruments in their real positions: ASI, ATT, ALT on top; TC, HDG, VSI below.
// Each is matched to one stat in `impact` by index.
const SIX = [
  { stat: 0, kind: "asi" },
  { stat: 3, kind: "att" },
  { stat: 1, kind: "alt" },
  { stat: 4, kind: "tc" },
  { stat: 2, kind: "hdg" },
  { stat: 5, kind: "vsi" },
] as const;

const Instrument = ({ stat, kind, index }: { stat: number; kind: (typeof SIX)[number]["kind"]; index: number }) => {
  const s = impact[stat];
  const { ref, p } = useInstrumentProgress(index * 0.12);
  const face =
    kind === "asi" ? <Airspeed p={p} value={s.value} /> :
    kind === "att" ? <Attitude p={p} /> :
    kind === "alt" ? <Altimeter p={p} value={s.value} /> :
    kind === "tc" ? <TurnCoordinator p={p} /> :
    kind === "hdg" ? <Heading p={p} value={s.value} /> :
    <VerticalSpeed p={p} value={s.value} />;
  return (
    <a ref={ref} href={`#${s.route}`} className="group flex flex-col items-center gap-2 focus-visible:outline-none" aria-label={`${s.prefix ?? ""}${s.value}${s.suffix ?? ""} ${s.label}. ${s.detail}`}>
      <div className="w-full max-w-[11.5rem] transition-transform duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-sign">
        <Bezel label={s.label}>{face}</Bezel>
      </div>
      {/* Backlit placard. */}
      <div className="device w-full max-w-[11.5rem] rounded-[3px] border border-black bg-gradient-to-b from-panel to-floor px-2 py-1.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="font-mono text-[15px] font-bold text-ink [text-shadow:0_0_8px_rgb(var(--ink)/0.35)]">
          {s.prefix}
          {s.value}
          <span className="text-[11px] text-ink/70">{s.suffix}</span>
        </div>
        <div className="font-sign text-[11.5px] font-semibold leading-tight text-ink/70 group-hover:text-ink">{s.label}</div>
      </div>
    </a>
  );
};

// ── Navigation display: the career as a flight plan ─────────────────────
const ROUTE = [
  { id: "DXB", label: "DUBAI", sub: "ORIGIN", x: 70, y: 232, href: "#about" },
  { id: "RMT", label: "ASSISTNOW", sub: "S24", x: 118, y: 190, href: "#experience/assistnow" },
  { id: "YKF", label: "UW CSC", sub: "F24", x: 92, y: 146, href: "#experience/csc" },
  { id: "DTW", label: "ROCKET", sub: "S25", x: 168, y: 118, href: "#experience/rocket" },
  { id: "YKF", label: "ARCTIC WOLF", sub: "W26", x: 132, y: 80, href: "#experience/arctic-wolf" },
  { id: "YYZ", label: "SHOPIFY", sub: "W27 · NEXT", x: 196, y: 36, href: "#experience" },
];

const NavDisplay = () => {
  const flown = ROUTE.slice(0, 5);
  const last = ROUTE[4];
  const next = ROUTE[5];
  const ax = (last.x + next.x) / 2;
  const ay = (last.y + next.y) / 2;
  const heading = (Math.atan2(next.x - last.x, last.y - next.y) * 180) / Math.PI;
  return (
    <div className="metal relative flex h-full flex-col rounded-xl p-3">
      <Screws />
      <div className="device glass recessed relative flex-1 overflow-hidden rounded-md bg-screen">
        <svg viewBox="0 0 300 260" className="h-full w-full" role="img" aria-label="Navigation display showing my career route from Dubai to Shopify">
          {/* Compass arc. */}
          <path d="M20 250 A 150 150 0 0 1 280 250" fill="none" stroke="rgb(var(--ink) / 0.5)" />
          {Array.from({ length: 19 }).map((_, i) => {
            const a = -90 + i * 10;
            const x1 = 150 + Math.sin((a * Math.PI) / 180) * 150;
            const y1 = 250 - Math.cos((a * Math.PI) / 180) * 150;
            const x2 = 150 + Math.sin((a * Math.PI) / 180) * (i % 3 === 0 ? 140 : 145);
            const y2 = 250 - Math.cos((a * Math.PI) / 180) * (i % 3 === 0 ? 140 : 145);
            return <line key={i} x1={Math.round(x1 * 100) / 100} y1={Math.round(y1 * 100) / 100} x2={Math.round(x2 * 100) / 100} y2={Math.round(y2 * 100) / 100} stroke="rgb(var(--ink) / 0.55)" />;
          })}
          <path d="M20 250 A 150 150 0 0 1 280 250" fill="none" stroke="rgb(var(--ink) / 0.12)" transform="translate(75 62) scale(0.5)" />
          <text x="10" y="16" fill="rgb(var(--ops))" fontSize="9" fontFamily="var(--font-mono), monospace">GS 480  TAS 492</text>
          <text x="290" y="16" fill="rgb(var(--magenta))" fontSize="9" textAnchor="end" fontFamily="var(--font-mono), monospace">YYZ  W27</text>
          <text x="10" y="252" fill="rgb(var(--cyan))" fontSize="8" fontFamily="var(--font-mono), monospace">ROUTE · CAREER</text>
          {/* Flown legs. */}
          <polyline points={flown.map((w) => `${w.x},${w.y}`).join(" ")} fill="none" stroke="rgb(var(--ink) / 0.75)" strokeWidth="1.6" />
          {/* Active leg. */}
          <motion.line
            x1={last.x}
            y1={last.y}
            x2={next.x}
            y2={next.y}
            stroke="rgb(var(--magenta))"
            strokeWidth="2.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
          {ROUTE.map((w, i) => {
            const active = i === ROUTE.length - 1;
            return (
              <a key={w.label} href={w.href}>
                <g className="cursor-pointer">
                  <path d={`M${w.x} ${w.y - 6} L${w.x + 6} ${w.y} L${w.x} ${w.y + 6} L${w.x - 6} ${w.y} Z`} fill="none" stroke={active ? "rgb(var(--magenta))" : "rgb(var(--ink))"} strokeWidth="1.5" />
                  <text x={w.x + 10} y={w.y - 1} fill={active ? "rgb(var(--magenta))" : "rgb(var(--ink))"} fontSize="9" fontWeight="700" fontFamily="var(--font-mono), monospace">
                    {w.label}
                  </text>
                  <text x={w.x + 10} y={w.y + 9} fill="rgb(var(--cyan))" fontSize="7.5" fontFamily="var(--font-mono), monospace">
                    {w.id} {w.sub}
                  </text>
                  <rect x={w.x - 10} y={w.y - 12} width="90" height="26" fill="transparent" />
                </g>
              </a>
            );
          })}
          {/* Own aircraft, on the active leg. */}
          <g transform={`translate(${Math.round(ax)} ${Math.round(ay)}) rotate(${Math.round(heading)})`}>
            <path d="M0 -9 L6 7 L0 4 L-6 7 Z" fill="rgb(var(--live))" />
          </g>
        </svg>
      </div>
      <div className="mt-2 flex justify-between px-1">
        <PanelLabel>ND · Flight plan</PanelLabel>
        <PanelLabel className="text-ink/70">Select a waypoint</PanelLabel>
      </div>
    </div>
  );
};

// ── ECAM: what shipped ──────────────────────────────────────────────────
const LOG = roles.flatMap((role) =>
  role.stories
    .filter((s) => s.stat)
    .map((s) => ({ sys: (flights[role.slug]?.dest ?? role.company).replace("ROCKET MORTGAGE", "ROCKET"), title: s.title, stat: s.stat!, href: `#experience/${role.slug}` }))
);

const Ecam = () => (
  <div className="metal relative rounded-xl p-3">
    <Screws />
    <div className="device glass recessed relative rounded-md bg-screen px-4 py-3 font-mono text-[11px] leading-relaxed md:text-xs">
      <div className="mb-2 flex justify-between border-b border-white/10 pb-1.5 text-[10px]">
        <span className="text-ink/80">ECAM · SHIPPED</span>
        <span className="text-ops">NORMAL</span>
      </div>
      <ol className="grid gap-y-0.5 lg:grid-cols-2 lg:gap-x-8">
        {LOG.map((e, i) => (
          <motion.li key={e.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.12 * i }}>
            <a href={e.href} className="grid grid-cols-[minmax(0,1fr)] gap-x-3 rounded px-1 py-0.5 transition hover:bg-white/[0.05] sm:grid-cols-[6.5rem_minmax(0,1fr)]">
              <span className="text-live">{e.sys}</span>
              <span>
                <span className="text-ops">{e.title.toUpperCase()}</span> <span className="text-cyan">{e.stat}</span>
              </span>
            </a>
          </motion.li>
        ))}
      </ol>
    </div>
    <div className="mt-2 px-1">
      <PanelLabel>Lower ECAM</PanelLabel>
    </div>
  </div>
);

export const Cockpit = () => (
  <section id="ops" className="amb-cockpit scroll-mt-14 px-4 pb-16 pt-10 md:px-6 md:pb-24">
    <div className="mx-auto max-w-6xl">
      <GateHeader letter="B" en="Flight Deck" label="Impact · Stack" intro="Results from my internships, on the instruments. Select any instrument or waypoint for the details." />
      {/* On phones the instruments come first and the long switch panel moves to the end. */}
      <div className="flex flex-col">
      <div className="order-3 mt-6 md:order-none md:mt-0">
        <Overhead />
      </div>
      <div className="order-1 md:order-none">
        <GlareshieldLip />
      </div>
      <div className="device metal relative order-2 -mt-3 rounded-b-[22px] px-4 pb-8 pt-10 md:order-none md:px-8">
        <Screws />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <PanelLabel className="mb-4 block">Primary flight instruments</PanelLabel>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
              {SIX.map((it, i) => (
                <Instrument key={it.kind} stat={it.stat} kind={it.kind} index={i} />
              ))}
            </div>
          </div>
          <div className="flex min-h-[20rem] flex-col">
            <NavDisplay />
          </div>
        </div>
        <div className="mt-8">
          <Ecam />
        </div>
      </div>
      </div>
    </div>
  </section>
);

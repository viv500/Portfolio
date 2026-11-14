"use client";

import React from "react";
import { motion } from "framer-motion";
import { impact, roles } from "@/components/data";
import { SystemsChecklist } from "./Checklist";
import { shipped } from "@/components/data/airport";
import { GateHeader } from "./GateHeader";
import { Airspeed, Altimeter, Bezel, useInstrumentProgress } from "./instruments";

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

// ── Impact: a stat grid ──────────────────────────────────────────────────
// The numbers are the content, so they're the primary element: big, bold, in the accent colour,
// with the label and the company under them. Two stats keep a gauge whose metaphor fits
// (airspeed -> faster builds; a clock-style dial -> hours saved); the rest are numbers only.
const COMPANY: Record<string, string> = Object.fromEntries(roles.map((r) => [r.slug, r.company.replace("Rocket Mortgage", "Rocket")]));
const GAUGE: Partial<Record<number, "asi" | "clock">> = { 0: "asi", 1: "clock" };

const StatCard = ({ i }: { i: number }) => {
  const s = impact[i];
  const gauge = GAUGE[i];
  const { ref, p } = useInstrumentProgress(i * 0.1);
  const slug = s.route.split("/")[1] ?? "";
  return (
    <a
      ref={ref}
      href={`#${s.route}`}
      className="clickable device flex h-full flex-col gap-3 rounded-xl bg-gradient-to-b from-panel to-floor p-3.5 sm:flex-row sm:items-center md:p-4"
      aria-label={`${s.prefix ?? ""}${s.value}${s.suffix ?? ""} ${s.label}, at ${COMPANY[slug] ?? ""}. Details`}
    >
      {gauge && (
        <div className="w-[4.5rem] shrink-0 self-center sm:w-[5.5rem] md:w-[6.25rem]">
          <Bezel label={s.label}>{gauge === "asi" ? <Airspeed p={p} value={s.value} bare /> : <Altimeter p={p} value={s.value} bare />}</Bezel>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="font-sign text-[31px] font-extrabold leading-none text-sign [text-shadow:0_0_12px_rgb(var(--sign)/0.3)] md:text-[40px]">
          {s.prefix && <span className="text-[0.6em]">{s.prefix}</span>}
          {s.value}
          <span className="ml-1 text-[0.45em] font-bold">{(s.suffix ?? "").trim()}</span>
        </div>
        <div className="mt-2 text-[14.5px] font-medium leading-snug text-ink/90">{s.label}</div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <span className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11.5px] font-medium text-ink/80">{COMPANY[slug]}</span>
          <span className="affordance">Details →</span>
        </div>
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
      <div className="mb-2 flex items-baseline justify-between px-1">
        <span className="font-sign text-[15px] font-bold text-ink">Career route</span>
        <PanelLabel>Nav display</PanelLabel>
      </div>
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
              <a key={w.label} href={w.href} className="waypoint">
                <g className="cursor-pointer">
                  {/* Hit box: a subtle outline that turns gold on hover/focus (the shared clickable look, in SVG). */}
                  <rect className="waypoint-box" x={w.x - 10} y={w.y - 12} width={Math.max(w.label.length * 5.6 + 8, (w.id.length + w.sub.length + 1) * 4.6) + 24} height="25" rx="4" fill="transparent" />
                  <path d={`M${w.x} ${w.y - 6} L${w.x + 6} ${w.y} L${w.x} ${w.y + 6} L${w.x - 6} ${w.y} Z`} fill="none" stroke={active ? "rgb(var(--magenta))" : "rgb(var(--ink))"} strokeWidth="1.5" />
                  <text x={w.x + 10} y={w.y - 1} fill={active ? "rgb(var(--magenta))" : "rgb(var(--ink))"} fontSize="9" fontWeight="700" fontFamily="var(--font-mono), monospace">
                    {w.label}
                    <tspan fill="rgb(var(--sign))" dx="3">↗</tspan>
                  </text>
                  <text x={w.x + 10} y={w.y + 9} fill="rgb(var(--cyan))" fontSize="7.5" fontFamily="var(--font-mono), monospace">
                    {w.id} {w.sub}
                  </text>
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
      <div className="mt-2 px-1 text-[12px] text-ink/70">Each waypoint opens that role.</div>
    </div>
  );
};

// ── EICAS: what shipped ──────────────────────────────────────────────────
// Dark screen styling, but sentence case in the body font so it reads at a glance.
const LOG = roles.flatMap((role) =>
  role.stories
    .filter((s) => shipped[s.title])
    .map((s) => ({ sys: role.company.replace("Rocket Mortgage", "Rocket").replace("UW Computer Science Club", "UW CS Club"), ...shipped[s.title], href: `#experience/${role.slug}` }))
);

/** Where things stand, at the bottom of the EICAS screen. */
const STATUS: [string, string][] = [
  ["Status", "Open to Summer 2027 SWE internships"],
  ["Next", "Shopify · Backend & Infra · Winter 2027"],
  ["Focus", "Cloud infra, CI/build systems, AI developer tooling"],
];

// Stretches to the height of the career-route panel beside it (desktop); the status block sits at
// the bottom of the screen, below a thin rule.
const Eicas = () => (
  <div className="metal relative flex h-full flex-col rounded-xl p-3">
    <Screws />
    <div className="device glass recessed relative flex flex-1 flex-col rounded-md bg-screen px-4 py-3 text-[14px] leading-snug md:px-5 md:text-[15px]">
      <div className="mb-1 flex justify-between border-b border-white/10 pb-1.5 font-mono text-[10px]">
        <span className="text-ink/80">EICAS · ALSO SHIPPED</span>
        <span className="text-ops">NORMAL</span>
      </div>
      <ol className="flex flex-1 flex-col justify-center">
        {LOG.map((e) => (
          <li key={e.n + e.text} className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-2 last:border-b-0">
            <span className="text-ink/90">
              <span className="whitespace-nowrap font-semibold text-cyan">{e.n}</span> {e.text}
            </span>
            <span className="shrink-0 whitespace-nowrap text-right text-[12px] text-live/90">{e.sys}</span>
          </li>
        ))}
      </ol>
      <dl className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-2.5 border-t border-white/15 pt-4">
        {STATUS.map(([k, v]) => (
          <React.Fragment key={k}>
            <dt className="pt-[3px] font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60">{k}</dt>
            <dd className="text-[14px] leading-snug text-ink/90">{v}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
    <div className="mt-2 px-1">
      <PanelLabel>Also shipped · Lower EICAS</PanelLabel>
    </div>
  </div>
);

export const Cockpit = () => (
  <section id="ops" className="amb-cockpit scroll-mt-14 px-4 py-10 md:px-6 md:py-12">
    <div className="mx-auto max-w-6xl">
      <GateHeader letter="B" en="Flight deck" label="Impact" intro="Results from my internships, on the instruments." hint="Select any result or waypoint for details" />
      {/* The instruments come first; the stack checklist follows. */}
      <div className="flex flex-col">
      {/* The stack, as a checklist card, below the panels. */}
      <div className="order-3 mt-10">
        <SystemsChecklist />
      </div>
      <div className="device metal relative order-2 rounded-[22px] px-4 pb-8 pt-10 md:px-8">
        <Screws />
        <PanelLabel className="mb-4 block">Impact · Key results</PanelLabel>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
          {impact.map((_, i) => (
            <StatCard key={i} i={i} />
          ))}
        </div>
        {/* Secondary visuals: the career route and the shipped list. */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="flex min-h-[20rem] flex-col">
            <NavDisplay />
          </div>
          <Eicas />
        </div>
      </div>
      </div>
    </div>
  </section>
);

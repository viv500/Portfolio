"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { HZ, P, VIEW_H, VIEW_W, VP, col, r1 } from "./flightdeck/geometry";
import { Shell } from "./flightdeck/Shell";
import { Panel } from "./flightdeck/Panel";
import { resumePath } from "@/components/data";

// The landing scene: an airliner flight deck at the start of the take-off roll. Scrolling flies
// the take-off. Three layered SVGs share one camera (see flightdeck/geometry.ts):
//   1. the world outside, 2. the cockpit shell and HUD, 3. the glareshield and panel.
// Shake and parallax move only those layers; the name card and buttons stay still.

const ground = (X: number, z: number, h: number) => P(X, -h, z);
const quadBase = (X1: number, X2: number, z1: number, z2: number, h: number) =>
  `M${[ground(X1, z1, h), ground(X2, z1, h), ground(X2, z2, h), ground(X1, z2, h)].map((p) => p.join(" ")).join(" L")} Z`;
const quad = quadBase;
const face = (pts: [number, number, number][], h: number) => `M${pts.map(([X, Y, z]) => P(X, Y - h, z).join(" ")).join(" L")} Z`;

// ── Outside ─────────────────────────────────────────────────────────────
// ── Runways and taxiways ────────────────────────────────────────────────
// Explicit one-point perspective: every line parallel to our heading is a ground line at a
// fixed lateral offset X, so on screen it runs from the vanishing point (behind the centre
// post, on the horizon) at a slope of eyeHeight / X. Offsets are in eye heights:
//   main runway edges ±8   → about 7° below the horizon, meeting the sill near the outer
//                            edges of the two front panes
//   parallel taxiway ~14   → about 4°, much shallower
//   parallel runway 24–31  → about 2°, a thin sliver to the right
// The surfaces are static; only markings and lights move, sliding out from the vanishing
// point as distance travelled (d) increases.
const RWY = 8;
const TWY_L = 12.6;
const TWY_R = 15.4;
const TWY_C = (TWY_L + TWY_R) / 2;
const PRW_L = 24;
const PRW_R = 31;
const FAR = 900; // effectively the horizon
const EXITS = [70, 150, 240]; // rapid-exit taxiways, by distance along the runway
const EXIT_RUN = (TWY_L - RWY) / Math.tan((30 * Math.PI) / 180); // 30° in plan

/** Static surfaces and edge lines. Depends only on height, so it doesn't re-render during the roll. */
const GroundSurfaces = memo(function GroundSurfaces({ h }: { h: number }) {
  const strip = (X1: number, X2: number) => quad(X1, X2, 0.9, FAR, h);
  const line = (X: number, wdt: number) => quad(X - wdt, X + wdt, 0.9, FAR, h);
  return (
    <g>
      <path d={strip(PRW_L, PRW_R)} style={{ fill: col("runway") }} />
      <path d={strip(TWY_L, TWY_R)} style={{ fill: col("taxiway") }} />
      <path d={strip(-RWY, RWY)} style={{ fill: col("runway") }} />
      {/* Edge lines: main runway, taxiway (yellow) and parallel runway. */}
      <path d={`${line(-RWY + 0.25, 0.12)} ${line(RWY - 0.25, 0.12)} ${line(PRW_L + 0.2, 0.1)} ${line(PRW_R - 0.2, 0.1)}`} fill="rgba(240,240,235,0.6)" />
      <path d={`${line(TWY_L + 0.15, 0.06)} ${line(TWY_R - 0.15, 0.06)}`} fill="rgba(255,205,60,0.45)" />
    </g>
  );
});

/** Rapid-exit taxiways: strips leaving the runway's right edge at 30°, narrowing with distance. */
const RapidExits = ({ d, h }: { d: number; h: number }) => {
  const parts: string[] = [];
  const dots: [number, number, number][] = [];
  for (const s0 of EXITS) {
    const z0 = s0 - d;
    const z1 = z0 + EXIT_RUN;
    if (z1 < 1.2 || z0 > FAR) continue;
    const w = 0.9;
    const pts: [number, number][] = [
      [RWY, Math.max(1.2, z0 - w)],
      [RWY, Math.max(1.2, z0 + w * 2.2)],
      [TWY_L, Math.max(1.2, z1 + w)],
      [TWY_L, Math.max(1.2, z1 - w * 2.2)],
    ];
    parts.push(`M${pts.map(([X, z]) => ground(X, z, h).join(" ")).join(" L")} Z`);
    for (let k = 1; k < 6; k++) {
      const f = k / 6;
      const X = RWY + (TWY_L - RWY) * f;
      const z = z0 + EXIT_RUN * f;
      if (z < 1.5) continue;
      const [x, y] = ground(X, z, h);
      dots.push([x, y, Math.max(0.5, 4 / z)]);
    }
  }
  return (
    <g>
      <path d={parts.join(" ")} style={{ fill: col("taxiway") }} />
      <g style={{ opacity: "calc(var(--lights) * 0.6 + 0.4)" }}>
        {dots.map(([x, y, rr], i) => (
          <circle key={i} cx={r1(x)} cy={r1(y)} r={r1(rr)} fill="#3dff8c" />
        ))}
      </g>
    </g>
  );
};

/** Markings and lights that move: dashes and dots slide along their perspective lines. */
const GroundMarkings = ({ d, h, lite }: { d: number; h: number; lite: boolean }) => {
  const dash = (X: number, half: number, len: number, period: number, near = 1.2, far = 420) => {
    const out: string[] = [];
    const first = Math.floor(d / period) * period;
    for (let s0 = first; s0 - d < far; s0 += period) {
      const z1 = s0 - d;
      const z2 = z1 + len;
      if (z2 < near) continue;
      out.push(quad(X - half, X + half, Math.max(near, z1), z2, h));
    }
    return out.join(" ");
  };
  const dots = (Xs: number[], period: number, size: number, far = 260) => {
    const out: [number, number, number][] = [];
    const first = Math.floor(d / period) * period;
    for (let s0 = first; s0 - d < far; s0 += period) {
      const z = s0 - d;
      if (z < 1.2) continue;
      for (const X of Xs) {
        const [x, y] = ground(X, z, h);
        out.push([x, y, Math.max(0.45, size / z)]);
      }
    }
    return out;
  };
  // Threshold piano keys at the start of the roll; they scroll away under us.
  const keys = [-6.6, -5.4, -4.2, -3, -1.8, 1.8, 3, 4.2, 5.4, 6.6].map((X) => quad(X - 0.4, X + 0.4, Math.max(1.2, 12 - d), 18 - d, h));
  // Phones only see the middle of the scene: the taxiway and parallel runway are almost
  // entirely off-screen there, so skip their lights and draw fewer, nearer runway lights.
  const edgeLights = lite ? dots([-RWY, RWY], 6, 9, 120) : dots([-RWY, RWY], 4, 9);
  const twyGreen = lite ? [] : dots([TWY_C], 3, 5, 200);
  const twyBlue = lite ? [] : dots([TWY_L, TWY_R], 5, 5, 200);
  const prwLights = lite ? [] : dots([PRW_L, PRW_R], 6, 4, 260);
  return (
    <g>
      {18 - d > 1.2 && <path d={keys.join(" ")} fill="rgba(245,245,240,0.88)" />}
      <path d={dash(0, 0.34, 3.4, 6)} fill="rgba(245,245,240,0.92)" />
      {!lite && <path d={dash(TWY_C, 0.08, 1.6, 3, 1.2, 300)} fill="rgba(255,205,60,0.85)" />}
      {!lite && <path d={dash((PRW_L + PRW_R) / 2, 0.15, 3.4, 6, 1.2, 300)} fill="rgba(245,245,240,0.7)" />}
      <g style={{ opacity: "calc(var(--lights) * 0.5 + 0.5)" }}>
        {edgeLights.map(([x, y, rr], i) => (
          <circle key={`e${i}`} cx={r1(x)} cy={r1(y)} r={r1(rr)} fill="#fff6dc" />
        ))}
        {prwLights.map(([x, y, rr], i) => (
          <circle key={`p${i}`} cx={r1(x)} cy={r1(y)} r={r1(rr)} fill="#fff6dc" />
        ))}
      </g>
      <g style={{ opacity: "calc(var(--lights) * 0.6 + 0.4)" }}>
        {twyGreen.map(([x, y, rr], i) => (
          <circle key={`g${i}`} cx={r1(x)} cy={r1(y)} r={r1(rr)} fill="#3dff8c" />
        ))}
        {twyBlue.map(([x, y, rr], i) => (
          <circle key={`b${i}`} cx={r1(x)} cy={r1(y)} r={r1(rr)} fill="#4f8cff" />
        ))}
      </g>
    </g>
  );
};

const Ground = ({ d, h, lite = false }: { d: number; h: number; lite?: boolean }) => (
  <g>
    <GroundSurfaces h={Math.round(h * 100) / 100} />
    {!lite && <RapidExits d={d} h={h} />}
    <GroundMarkings d={d} h={h} lite={lite} />
  </g>
);

type Building = { X1: number; X2: number; s: number; depth: number; H: number; tower?: boolean; terminal?: boolean };
const BUILDINGS: Building[] = [];

const BuildingShape = ({ b, d, h }: { b: Building; d: number; h: number }) => {
  const z1 = Math.max(1.2, b.s - d);
  const z2 = b.s - d + b.depth;
  if (z2 < 1.5 || b.s - d > 260) return null;
  const inner = b.X2 < 0 ? b.X2 : b.X1;
  const winY = b.H * 0.55;
  return (
    <g>
      {/* Ground shadow on the sun side. */}
      <path d={face([[inner, 0, z1], [inner, 0, z2], [inner + (inner < 0 ? 1.2 : -1.2), 0, z2], [inner + (inner < 0 ? 1.2 : -1.2), 0, z1]], h)} fill="rgba(0,0,0,0.22)" />
      <path d={face([[b.X1, b.H, z1], [b.X2, b.H, z1], [b.X2, b.H, z2], [b.X1, b.H, z2]], h)} style={{ fill: col("building-roof") }} />
      <path d={face([[inner, 0, z1], [inner, 0, z2], [inner, b.H, z2], [inner, b.H, z1]], h)} style={{ fill: col("building-side") }} />
      {b.terminal && <path d={face([[inner, b.H * 0.25, z1], [inner, b.H * 0.25, z2], [inner, b.H * 0.85, z2], [inner, b.H * 0.85, z1]], h)} style={{ fill: col("glass-band") }} />}
      <path d={face([[b.X1, 0, z1], [b.X2, 0, z1], [b.X2, b.H, z1], [b.X1, b.H, z1]], h)} style={{ fill: col("building") }} />
      {!b.terminal && <path d={face([[b.X1 + 0.4, winY, z1], [b.X2 - 0.4, winY, z1], [b.X2 - 0.4, winY + 0.25, z1], [b.X1 + 0.4, winY + 0.25, z1]], h)} fill="#ffd28a" style={{ opacity: "calc(var(--lights) * 0.9)" }} />}
      {b.tower && <path d={face([[b.X1 - 0.5, b.H, z1], [b.X2 + 0.5, b.H, z1], [b.X2 + 0.5, b.H + 1.4, z1], [b.X1 - 0.5, b.H + 1.4, z1]], h)} fill="#ffe2a8" style={{ opacity: "var(--lights)" }} />}
    </g>
  );
};

// ── DXB concourse ───────────────────────────────────────────────────────
// A long, low tube with a vaulted roof of alternating silver ribs and teal glass, a blue glass
// facade along its runway side, and jet bridges at each stand.
// On the left of the runway, seen through the left side windows; it ends before the HUD area.
const C_IN = -26; // glass wall facing the runway
const C_RIDGE = -31;
const C_WALL = 1.0;
const C_RISE = 2.3;
// Two identical concourses one behind the other, with a short gap (where the tower stands).
const CONCOURSES: [number, number][] = [
  [24, 104],
  [114, 194],
];
const STANDS = CONCOURSES.flatMap(([a]) => [8, 20, 32, 44, 56, 68].map((o) => a + o));
const arc = (z: number, h: number, upto = Math.PI / 2, n = 6) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = (upto * i) / n;
    return P(C_RIDGE - (C_RIDGE - C_IN) * Math.cos(t), C_WALL + C_RISE * Math.sin(t) - h, z);
  });

const Concourse = ({ d, h, C_S0, C_S1, lite = false }: { d: number; h: number; C_S0: number; C_S1: number; lite?: boolean }) => {
  if (C_S1 - d < 2) return null;
  const z0 = Math.max(1.6, C_S0 - d);
  const segs: { d: string; glass: boolean }[] = [];
  // Phones draw the roof in fewer, larger ribs (the concourse is small in the corner there).
  const step = lite ? 6 : 3;
  const n = lite ? 3 : 6;
  for (let s0 = C_S0, k = 0; s0 < C_S1; s0 += step, k++) {
    const za = Math.max(1.6, s0 - d);
    const zb = s0 + step - d;
    if (zb <= 1.6 || za > 260) continue;
    const A = arc(za, h, Math.PI / 2, n);
    const B = arc(zb, h, Math.PI / 2, n).reverse();
    segs.push({ d: `M${[...A, ...B].map((p) => p.join(" ")).join(" L")} Z`, glass: k % 2 === 1 });
  }
  const zEnd = C_S1 - d;
  const wall = face([[C_IN, 0, z0], [C_IN, 0, zEnd], [C_IN, C_WALL, zEnd], [C_IN, C_WALL, z0]], h);
  const cap = `M${[...arc(z0, h, Math.PI, 10), P(C_IN + 2 * (C_RIDGE - C_IN), -h, z0), P(C_IN, -h, z0)].map((p) => p.join(" ")).join(" L")} Z`;
  const mullions = Array.from({ length: 14 }, (_, i) => C_S0 + i * 9 - d)
    .filter((z) => z > z0 && z < zEnd)
    .map((z) => `M${P(C_IN, -h, z).join(" ")} L${P(C_IN, C_WALL - h, z).join(" ")}`)
    .join(" ");
  return (
    <g>
      <path d={face([[C_IN + 1.4, 0, z0], [C_IN + 1.4, 0, zEnd], [C_IN, 0, zEnd], [C_IN, 0, z0]], h)} fill="rgba(0,0,0,0.2)" />
      {segs.map((sg, i) => (
        <path key={i} d={sg.d} style={{ fill: sg.glass ? col("glass-band") : col("vault") }} />
      ))}
      <path d={wall} style={{ fill: col("glass-band") }} />
      <path d={wall} fill="url(#to-glass-sheen)" />
      <path d={mullions} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
      {/* The rounded glass end facing us, as on Concourse A. */}
      <path d={cap} style={{ fill: col("glass-band") }} />
      <path d={`M${arc(z0, h, Math.PI, 10).map((p) => p.join(" ")).join(" L")}`} fill="none" style={{ stroke: col("vault") }} strokeWidth="2" />
      <g style={{ opacity: "calc(var(--lights) * 0.8)" }}>
        <path d={face([[C_IN, 0.35, z0], [C_IN, 0.35, zEnd], [C_IN, 0.42, zEnd], [C_IN, 0.42, z0]], h)} fill="#ffd28a" />
      </g>
    </g>
  );
};

/** DXB-style control tower: a blue core inside a white A-frame of arched legs, a ringed cab and a mast. */
const AtcTower = ({ s, d, h }: { s: number; d: number; h: number }) => {
  const z = s - d;
  if (z < 4 || z > 260) return null;
  const X = -36; // in the gap between the two concourses
  const pt = (dx: number, Y: number) => P(X + dx, Y - h, z).join(" ");
  const H = 10;
  return (
    <g>
      {/* Core. */}
      <path d={`M${pt(-0.55, 0)} L${pt(0.55, 0)} L${pt(0.55, H)} L${pt(-0.55, H)} Z`} style={{ fill: col("tower-core") }} />
      <path d={`M${pt(0.15, 0)} L${pt(0.55, 0)} L${pt(0.55, H)} L${pt(0.15, H)} Z`} fill="rgba(0,0,0,0.18)" />
      {/* White A-frame legs, curving in to meet the cab, with cross-braces. */}
      <path d={`M${pt(-2.6, 0)} Q${pt(-2.3, H * 0.75)} ${pt(-1.1, H)} M${pt(2.6, 0)} Q${pt(2.3, H * 0.75)} ${pt(1.1, H)}`} fill="none" style={{ stroke: col("vault") }} strokeWidth={r1(Math.max(0.8, 120 / z))} strokeLinecap="round" />
      <path d={`M${pt(-2.4, 2)} L${pt(-0.55, 4)} M${pt(2.4, 2)} L${pt(0.55, 4)} M${pt(-2.2, 5)} L${pt(-0.55, 7)} M${pt(2.2, 5)} L${pt(0.55, 7)}`} fill="none" style={{ stroke: col("vault") }} strokeWidth={r1(Math.max(0.5, 50 / z))} />
      {/* Cab: rings and glass bands that flare outward towards a wide flat roof, then a lattice mast. */}
      <path d={`M${pt(-0.9, H)} L${pt(0.9, H)} L${pt(1.15, H + 0.5)} L${pt(-1.15, H + 0.5)} Z`} style={{ fill: col("vault") }} />
      <path d={`M${pt(-1.15, H + 0.5)} L${pt(1.15, H + 0.5)} L${pt(1.35, H + 1.2)} L${pt(-1.35, H + 1.2)} Z`} style={{ fill: col("glass-band") }} />
      <path d={`M${pt(-1.35, H + 1.2)} L${pt(1.35, H + 1.2)} L${pt(1.5, H + 1.6)} L${pt(-1.5, H + 1.6)} Z`} style={{ fill: col("vault") }} />
      <path d={`M${pt(-1.5, H + 1.6)} L${pt(1.5, H + 1.6)} L${pt(1.75, H + 2.4)} L${pt(-1.75, H + 2.4)} Z`} style={{ fill: col("glass-band") }} />
      <path d={`M${pt(-1.85, H + 2.4)} L${pt(1.85, H + 2.4)} L${pt(1.85, H + 2.75)} L${pt(-1.85, H + 2.75)} Z`} style={{ fill: col("vault") }} />
      <path d={`M${pt(-0.35, H + 2.75)} L${pt(0, H + 4.2)} L${pt(0.35, H + 2.75)} M${pt(-0.25, H + 3.2)} L${pt(0.25, H + 3.2)} M${pt(-0.15, H + 3.7)} L${pt(0.15, H + 3.7)}`} fill="none" style={{ stroke: col("vault") }} strokeWidth="0.8" />
      <circle cx={P(X, H + 4.2 - h, z)[0]} cy={P(X, H + 4.2 - h, z)[1]} r="0.9" fill="#ff4a3a" style={{ opacity: "calc(var(--lights) + 0.3)" }} />
      <path d={`M${pt(-1.3, H + 0.85)} L${pt(1.3, H + 0.85)}`} stroke="#ffd59a" strokeWidth="0.6" style={{ opacity: "var(--lights)" }} />
    </g>
  );
};

const JetBridge = ({ s, d, h }: { s: number; d: number; h: number }) => {
  const z = s - d;
  if (z < 2.5 || z > 220) return null;
  return (
    <g>
      <path d={face([[C_IN + 3.2, 0.75, z], [C_IN, 0.75, z], [C_IN, 0.75, z + 0.7], [C_IN + 3.2, 0.75, z + 0.7]], h)} style={{ fill: col("vault") }} />
      <path d={face([[C_IN + 3.2, 0.4, z], [C_IN, 0.4, z], [C_IN, 0.75, z], [C_IN + 3.2, 0.75, z]], h)} style={{ fill: col("building-side") }} />
      <path d={face([[C_IN + 2.6, 0, z + 0.3], [C_IN + 2.5, 0, z + 0.3], [C_IN + 2.5, 0.4, z + 0.3], [C_IN + 2.6, 0.4, z + 0.3]], h)} fill="#333" />
    </g>
  );
};

/** A parked widebody, nose-in at its stand, drawn from one shared symbol. */
const Jet = ({ s, d, h }: { s: number; d: number; h: number }) => {
  const z = s - d + 0.35;
  if (z < 3 || z > 220) return null;
  const [x, y] = P(C_IN + 5.4, -h, z);
  const k = r1((440 / z) * 1.7);
  // Mirrored so the nose points left, into its stand.
  return <use href="#jet-art" transform={`translate(${x} ${y}) scale(${-k} ${k})`} />;
};

const Surroundings = ({ d, h, lite = false }: { d: number; h: number; lite?: boolean }) => {
  const blue: [number, number, number][] = [];
  for (let s = 0; s < 260; s += 2) {
    const z = s - d;
    if (z < 1 || z > 160) continue;
    for (const X of [] as number[]) {
      const [x, y] = ground(X, z, h);
      blue.push([x, y, Math.max(0.6, 5 / z)]);
    }
  }
  const zA = Math.max(1, -10 - d);
  const taxiEnd = 260 - d;
  const apronA = Math.max(1, 20 - d);
  const apronB = 200 - d;
  // Yellow lead-in lines from the apron taxiway to each stand.
  const leads = STANDS.map((st) => quad(-25, -18, Math.max(1, st + 0.25 - d), Math.max(1.05, st + 0.45 - d), h)).join(" ");
  return (
    <>
      {/* Apron in front of the terminal, with its taxiway line and stand lead-ins. */}
      {apronB > 1 && (
        <>
          <path d={quad(-26, -15, apronA, apronB, h)} style={{ fill: col("apron") }} />
          <path d={quad(-17.1, -16.95, apronA, apronB, h)} fill="rgba(255,205,60,0.7)" />
          <path d={leads} fill="rgba(255,205,60,0.6)" />
        </>
      )}
      {[...BUILDINGS]
        .sort((a, b) => b.s - a.s)
        .map((b, i) => (
          <BuildingShape key={i} b={b} d={d} h={h} />
        ))}
      <AtcTower s={108} d={d} h={h} />
      {[...CONCOURSES].reverse().map(([a, b]) => (
        <Concourse key={a} C_S0={a} C_S1={b} d={d} h={h} lite={lite} />
      ))}
      {STANDS.map((st) => (
        <JetBridge key={st} s={st} d={d} h={h} />
      ))}
      {STANDS.map((st) => (
        <Jet key={st} s={st} d={d} h={h} />
      ))}
      <g style={{ opacity: "calc(var(--lights) + 0.15)" }}>
        {blue.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r1(r)} fill="#4f8cff" />
        ))}
      </g>
    </>
  );
};

// ── Dubai skyline ───────────────────────────────────────────────────────
// Screen-space silhouettes on the horizon, in three layers: a pale hazy back row, the Sheikh Zayed
// Road cluster with the landmarks, and the Burj Khalifa well above everything else.
const hash = (n: number) => {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const BACK_ROW = Array.from({ length: 38 }, (_, i) => [520 + i * 11 + hash(i) * 6, 6 + hash(i + 50) * 14, 6 + hash(i + 90) * 5] as const);
// [x, height, width, top]: flat, slanted or crowned tops, unevenly spaced.
const SZR: [number, number, number, "flat" | "slant" | "crown" | "spire"][] = [
  [596, 15, 6, "flat"], [628, 21, 5, "slant"], [668, 18, 5, "crown"], [676, 24, 6, "flat"], [684, 14, 4, "slant"],
  [712, 26, 5, "spire"], [719, 19, 6, "flat"], [727, 31, 5, "crown"], [734, 22, 5, "slant"], [741, 17, 6, "flat"],
  [752, 28, 5, "flat"], [759, 20, 4, "crown"], [768, 23, 6, "slant"], [779, 16, 5, "flat"], [816, 18, 6, "crown"],
  [825, 13, 5, "flat"], [836, 21, 5, "slant"], [846, 15, 6, "flat"], [860, 11, 5, "flat"],
];
const tower = ([x, t, w, top]: (typeof SZR)[number]) => {
  const y = HZ - t;
  if (top === "slant") return `M${x} ${HZ} V${y + 3} L${x + w} ${y} V${HZ} Z`;
  if (top === "crown") return `M${x} ${HZ} V${y + 2} L${x + w / 2} ${y - 3} L${x + w} ${y + 2} V${HZ} Z`;
  if (top === "spire") return `M${x} ${HZ} V${y} H${x + w / 2 - 0.4} V${y - 7} H${x + w / 2 + 0.4} V${y} H${x + w} V${HZ} Z`;
  return `M${x} ${HZ} V${y} H${x + w} V${HZ} Z`;
};
// Burj Khalifa: staggered setbacks that step in on alternating sides, and a long needle spire.
// Left of centre in the skyline, so it stays in frame on narrow screens.
const BURJ_X = 616;
const BURJ = (() => {
  const L = [[0, 7.5], [12, 7.5], [12, 6.2], [24, 6.2], [24, 5], [36, 5], [36, 3.8], [47, 3.8], [47, 2.8], [57, 2.8], [57, 1.8], [66, 1.8], [66, 1.1], [74, 1.1]];
  const R = [[0, 7.5], [18, 7.5], [18, 6], [30, 6], [30, 4.6], [42, 4.6], [42, 3.4], [52, 3.4], [52, 2.4], [61, 2.4], [61, 1.5], [70, 1.5], [70, 1.1], [74, 1.1]];
  const up = R.map(([y, w]) => `${BURJ_X + w} ${HZ - y}`);
  const down = [...L].reverse().map(([y, w]) => `${BURJ_X - w} ${HZ - y}`);
  return `M${up.join(" L")} L${BURJ_X + 0.5} ${HZ - 80} L${BURJ_X} ${HZ - 100} L${BURJ_X - 0.5} ${HZ - 80} L${down.join(" L")} Z`;
})();
// Emirates Towers: two slim towers with sharp triangular tops, one taller.
const EMIRATES = [
  `M688 ${HZ} V${HZ - 30} L692 ${HZ - 42} L696 ${HZ - 30} V${HZ} Z`,
  `M699 ${HZ} V${HZ - 25} L702.5 ${HZ - 35} L706 ${HZ - 25} V${HZ} Z`,
];
// Cayan Tower: a twisting tower, its outline zig-zagging as the floors rotate.
const CAYAN = (() => {
  const x = 796;
  const pts: string[] = [];
  for (let i = 0; i <= 8; i++) pts.push(`${x + 5 + (i % 2 ? 1.2 : -1.2)} ${HZ - i * 3.6}`);
  for (let i = 8; i >= 0; i--) pts.push(`${x + (i % 2 ? -1.2 : 1.2)} ${HZ - i * 3.6}`);
  return `M${pts.join(" L")} Z`;
})();
// Museum of the Future: a low torus on a mound. Dubai Frame: a tall thin rectangle frame.
const MUSEUM = `M648 ${HZ - 2} a7.5 6 0 1 0 15 0 a7.5 6 0 1 0 -15 0 Z M651.5 ${HZ - 2} a4 2.6 0 1 1 8 0 a4 2.6 0 1 1 -8 0 Z`;
const FRAME = `M572 ${HZ} V${HZ - 27} H584 V${HZ} H581.6 V${HZ - 24.6} H574.4 V${HZ} Z`;

const Skyline = memo(function Skyline() {
  const lights: [number, number][] = [];
  SZR.forEach(([x, t, w], i) => {
    for (let k = 0; k < 4; k++) if (hash(i * 7 + k) > 0.35) lights.push([x + 1 + hash(i * 3 + k) * (w - 2), HZ - 2 - hash(i * 11 + k) * (t - 4)]);
  });
  for (let k = 0; k < 14; k++) lights.push([BURJ_X - 3 + hash(k + 200) * 6, HZ - 3 - hash(k + 300) * 60]);
  return (
    <g>
      <g style={{ fill: col("skyline-far") }}>
        {BACK_ROW.map(([x, t, w], i) => (
          <rect key={i} x={r1(x)} y={r1(HZ - t)} width={r1(w)} height={r1(t)} />
        ))}
      </g>
      <rect x="-1000" y={HZ - 40} width="3000" height="42" fill="url(#to-haze)" />
      <g style={{ fill: col("skyline") }}>
        {SZR.map((b, i) => (
          <path key={i} d={tower(b)} />
        ))}
        {EMIRATES.map((p) => (
          <path key={p} d={p} />
        ))}
        <path d={CAYAN} />
        <path d={MUSEUM} fillRule="evenodd" />
        <path d={FRAME} />
        <path d={BURJ} />
      </g>
      {/* A cooler sheen down one side of the Burj and the Emirates Towers. */}
      <path d={`M${BURJ_X} ${HZ} V${HZ - 74} L${BURJ_X + 1.1} ${HZ - 74} L${BURJ_X + 7.5} ${HZ} Z`} fill="rgba(255,255,255,0.08)" />
      <g style={{ opacity: "var(--lights)" }}>
        {lights.map(([x, y], i) => (
          <rect key={i} x={r1(x)} y={r1(y)} width="0.8" height="0.6" fill={i % 5 ? "#ffd59a" : "#fff1d6"} />
        ))}
      </g>
      <circle cx={BURJ_X} cy={HZ - 100} r="1" fill="#ff4a3a" style={{ opacity: "calc(var(--lights) + 0.3)" }} />
      <rect x="-1000" y={HZ - 12} width="3000" height="14" fill="url(#to-haze)" />
    </g>
  );
});

/** Sky, sun, stars and the distant city: everything that doesn't change frame to frame. */
const Backdrop = memo(function Backdrop() {
  return (
    <>
      <rect x="-1000" y={-2000} width="3000" height={2000 + HZ} fill="url(#to-sky)" />
      <g style={{ opacity: "var(--stars)" }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <circle key={i} cx={((i * 151) % 1400) - 200} cy={-300 + ((i * 89) % 330)} r={i % 5 ? 0.7 : 1.2} fill="#fff" />
        ))}
      </g>
      <circle cx="330" cy={HZ - 6} r="170" fill="url(#to-sun)" style={{ opacity: "var(--sun)" }} />
      {/* Soft clouds, daytime only. They drift slowly; reduced motion holds them still. */}
      <g className="cloud-drift" style={{ opacity: "var(--clouds)" }} filter="url(#to-cloud-blur)">
        {[
          [120, 70, 110, 16],
          [430, 40, 140, 18],
          [760, 95, 120, 14],
          [980, 55, 100, 15],
          [-120, 120, 130, 15],
          [600, 150, 90, 10],
        ].map(([x, y, rx, ry], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity="0.85" />
            <ellipse cx={x - rx * 0.35} cy={y - ry * 0.7} rx={rx * 0.45} ry={ry * 1.1} fill="#fff" opacity="0.9" />
            <ellipse cx={x + rx * 0.25} cy={y - ry * 0.5} rx={rx * 0.4} ry={ry} fill="#fff" opacity="0.85" />
          </g>
        ))}
      </g>
      <Skyline />
      <rect x="-1000" y={HZ} width="3000" height="1400" fill="url(#to-ground)" />
      {/* A few long sand ripples for texture. */}
      <g style={{ stroke: col("ground-far", 0.6) }} strokeWidth="1" fill="none">
        <path d={`M-200 ${HZ + 14} Q 200 ${HZ + 11} 600 ${HZ + 15} T 1300 ${HZ + 13}`} />
        <path d={`M-200 ${HZ + 34} Q 250 ${HZ + 30} 700 ${HZ + 36} T 1300 ${HZ + 32}`} />
        <path d={`M-200 ${HZ + 70} Q 300 ${HZ + 64} 800 ${HZ + 72} T 1300 ${HZ + 66}`} />
      </g>
      <rect x="-1000" y={HZ - 1} width="3000" height="2" style={{ fill: col("sky-3", 0.8) }} />
      <g style={{ opacity: "var(--lights)" }}>
        {Array.from({ length: 90 }).map((_, i) => (
          <circle key={i} cx={((i * 37) % 1400) - 200} cy={HZ + 2 + ((i * 13) % 6)} r="1" fill="#ffd59a" opacity={0.4 + ((i * 7) % 5) / 10} />
        ))}
      </g>
    </>
  );
});

const OutsideDefs = memo(function OutsideDefs() {
  return (
    <defs>
      <linearGradient id="to-sky" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={-420} y2={HZ}>
        <stop offset="0" style={{ stopColor: col("sky-0") }} />
        <stop offset="0.45" style={{ stopColor: col("sky-1") }} />
        <stop offset="0.8" style={{ stopColor: col("sky-2") }} />
        <stop offset="0.975" style={{ stopColor: col("sky-3") }} />
        <stop offset="1" style={{ stopColor: col("sky-3") }} />
      </linearGradient>
      <linearGradient id="to-ground" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={HZ} y2={HZ + 260}>
        <stop offset="0" style={{ stopColor: col("ground-far") }} />
        <stop offset="1" style={{ stopColor: col("ground") }} />
      </linearGradient>
      <filter id="to-cloud-blur" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <linearGradient id="to-haze" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: col("haze", 0) }} />
        <stop offset="0.75" style={{ stopColor: col("haze", 0.55) }} />
        <stop offset="1" style={{ stopColor: col("haze", 0.2) }} />
      </linearGradient>
      <linearGradient id="to-glass-sheen" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <clipPath id="jet-fin">
        <path d="M-1.6 -0.5 L-1.1 -0.5 L-1.38 -1.1 L-1.56 -1.1 Q-1.6 -1.1 -1.6 -1.05 Z" />
      </clipPath>
      {/* One widebody, side-on with its nose to the right. White, with a UAE flag on the tail. */}
      <g id="jet-art">
        <ellipse cx="0" cy="0" rx="1.8" ry="0.12" fill="rgba(0,0,0,0.28)" />
        <path d="M-1.6 -0.5 L1.35 -0.5 Q1.62 -0.5 1.65 -0.39 Q1.62 -0.29 1.35 -0.27 L-1.42 -0.27 Q-1.66 -0.32 -1.6 -0.5 Z" style={{ fill: col("jet") }} />
        <path d="M-1.58 -0.31 L1.4 -0.31" stroke="rgba(0,0,0,0.12)" strokeWidth="0.04" />
        <path d="M-0.25 -0.34 L0.55 -0.34 L0.28 -0.2 L-0.38 -0.2 Z" style={{ fill: col("jet") }} stroke="rgba(0,0,0,0.25)" strokeWidth="0.02" />
        <ellipse cx="0.22" cy="-0.19" rx="0.24" ry="0.075" style={{ fill: col("jet") }} stroke="rgba(0,0,0,0.3)" strokeWidth="0.02" />
        <path d="M-1.0 -0.43 H1.15" stroke="rgba(30,40,60,0.6)" strokeWidth="0.03" strokeDasharray="0.04 0.05" />
        <path d="M1.42 -0.44 L1.55 -0.44" stroke="#1a2230" strokeWidth="0.05" />
        <path d="M-0.08 -0.27 V0 M1.05 -0.27 V0" stroke="#333" strokeWidth="0.03" />
        {/* Tail after the Emirates scheme: green, white and black stripes sweep down and forward
            from the trailing edge into a red band that runs from mid-fin onto the fuselage. */}
        <g clipPath="url(#jet-fin)">
          <rect x="-1.62" y="-1.12" width="0.56" height="0.64" fill="#fff" />
          <path d="M-1.64 -1.05 L-1.4 -0.93 L-1.36 -0.86 L-1.64 -0.96 Z" fill="#00843d" />
          <path d="M-1.64 -0.88 L-1.33 -0.76 L-1.28 -0.68 L-1.64 -0.79 Z" fill="#111" />
          <path d="M-1.42 -0.94 L-1.35 -0.96 L-0.98 -0.44 L-1.14 -0.44 Z" fill="#d0202a" />
          <rect x="-1.62" y="-1.12" width="0.56" height="0.64" fill="#000" style={{ opacity: "var(--jet-dim)" }} />
        </g>
        <path d="M-1.18 -0.5 L-1.03 -0.5 L-0.86 -0.29 L-1.0 -0.28 Z" fill="#d0202a" />
        <path d="M-1.6 -0.5 L-1.1 -0.5 L-1.38 -1.1 L-1.56 -1.1 Q-1.6 -1.1 -1.6 -1.05 Z" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.02" />
      </g>
      <radialGradient id="to-sun">
        <stop offset="0" stopColor="#fff6dc" />
        <stop offset="0.08" stopColor="#ffd88a" stopOpacity="0.95" />
        <stop offset="0.35" stopColor="#ff9a4a" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ff7a3a" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
});

const CALLOUTS: [number, string][] = [
  [0, "THRUST SET"],
  [0.22, "80 KNOTS"],
  [0.42, "V1"],
  [0.5, "ROTATE"],
  [0.56, "V2"],
  [0.66, "POSITIVE RATE"],
  [0.71, "GEAR UP"],
];

const Layer = React.forwardRef<HTMLDivElement, { children: React.ReactNode; label?: string }>(function Layer({ children, label }, ref) {
  // The slight overscan (and the compositing hint) is only needed for desktop mouse parallax.
  return (
    <div ref={ref} className="absolute inset-0 md:inset-[-12px] md:will-change-transform">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        {children}
      </svg>
    </div>
  );
});

export const Takeoff = () => {
  const ref = useRef<HTMLDivElement>(null);
  const outsideRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reduced motion: a still frame of the climb, no parallax, no shake.
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [touch, setTouch] = useState(false);
  const reducedRef = useRef(false);
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reducedRef.current);
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setCompact(mq.matches);
      compactRef.current = mq.matches;
    };
    setTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const progress = useMotionValue(0);
  // Scroll progress → scene timeline (rotation at 0.5). The roll keeps its length; the climb is
  // cut short so the sequence ends soon after GEAR UP, while the airport is still in view.
  const SCENE_END = 0.76;
  const ROLL_SHARE = 0.66;
  const p = useTransform(progress, (u) =>
    reducedRef.current ? 0.72 : u < ROLL_SHARE ? (u / ROLL_SHARE) * 0.5 : 0.5 + ((u - ROLL_SHARE) / (1 - ROLL_SHARE)) * (SCENE_END - 0.5)
  );

  // Scroll input in the hero drives the take-off through an inertial glide with a speed limit:
  //  - input is normalised (wheel, trackpad and touch feel alike) and moves a target;
  //  - the target can sit at most LEAD ahead of (or behind) the actual progress, so hard or
  //    repeated flicks don't queue up a long run;
  //  - progress glides towards the target, but never faster than the full take-off in MIN_MS,
  //    in either direction. Below that, slower scrolling means slower playback.
  // The page scroll follows the progress, so the hero stays pinned until the take-off is done.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones and tablets: the hero is a single screen. While the page is at the very top, swipes
    // drive the take-off through the same capped glide as on desktop, without ever moving the
    // page by script (that fights native scrolling and stutters on iOS and Android). Once the
    // take-off is done, the next swipe scrolls the page normally.
    const touchMode = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const MIN_MS = 3500;
    const LEAD = 0.15;
    const PX_PER_RUN = 720; // normalised scroll distance for the whole take-off
    const MAX_EVENT_PX = 60; // per-event clamp, so one big flick event counts like a notch
    const GLIDE = 6; // 1/s: how quickly progress closes the gap to the target
    let auto = false; // set by a click: keep the target just ahead until the take-off is done
    // Hand-off: when the take-off completes, glide to the next section and swallow the burst of
    // scrolling still coming in (people spam-scroll when the plane won't go faster), so they land
    // on the next section instead of shooting past it. A short pause releases normal scrolling.
    // The guard has a hard limit (HANDOFF_MAX_MS from the hand-off, about the glide plus a short
    // grace), so continuous spam can't hold it forever; a brief pause releases it sooner.
    let guard = false;
    let lastGuarded = 0;
    let guardEnd = 0;
    const HANDOFF_QUIET_MS = 250;
    const HANDOFF_MAX_MS = 1000;
    const handoff = () => {
      guard = true;
      lastGuarded = performance.now();
      guardEnd = lastGuarded + HANDOFF_MAX_MS;
      const el = document.getElementById("top");
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    };
    let target = 0;
    let raf = 0;
    let lastInput = 0; // time of the last wheel/touch/key input we let the browser scroll with
    let last = 0;
    // Measured against the pinned hero rather than the window: mobile browser toolbars change
    // innerHeight mid-scroll, which would make progress jump.
    const range = () => Math.max(1, (ref.current?.offsetHeight ?? 0) - (stickyRef.current?.offsetHeight ?? window.innerHeight));
    const inZone = () => (touchMode ? window.scrollY <= 2 : window.scrollY <= range() + 2);
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const cur = progress.get();
      if (auto) target = Math.min(1, cur + LEAD);
      const gap = target - cur;
      const maxStep = dt / (MIN_MS / 1000);
      const step = Math.max(-maxStep, Math.min(maxStep, gap * Math.min(1, GLIDE * dt) + Math.sign(gap) * Math.min(Math.abs(gap), maxStep * 0.15)));
      const next = Math.abs(gap) < 0.0005 ? target : cur + step;
      progress.set(next);
      if (!touchMode) window.scrollTo({ top: next * range(), behavior: "instant" as ScrollBehavior });
      if (next !== target || (auto && next < 1)) raf = requestAnimationFrame(tick);
      else {
        raf = 0;
        last = 0;
        if (next >= 1 && (auto || (cur < 1 && !touchMode))) {
          auto = false;
          handoff();
        }
      }
    };
    const push = (px: number, e: Event) => {
      const now = performance.now();
      if (guard) {
        if (now > guardEnd || now - lastGuarded > HANDOFF_QUIET_MS) guard = false;
        else if (px > 0) {
          e.preventDefault();
          lastGuarded = now;
          return;
        }
      }
      lastInput = now;
      auto = false;
      if (!inZone()) return;
      const cur = progress.get();
      // At the end and still going down (or at the start going up): let the page scroll normally.
      if ((px > 0 && cur >= 1 && target >= 1) || (px < 0 && cur <= 0 && target <= 0)) return;
      e.preventDefault();
      const d = Math.max(-MAX_EVENT_PX, Math.min(MAX_EVENT_PX, px));
      target = Math.min(1, Math.max(0, Math.min(cur + LEAD, Math.max(cur - LEAD, target + d / PX_PER_RUN))));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      push(e.deltaY * unit, e);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      push((touchY - y) * 1.6, e);
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable]")) return;
      const map: Record<string, number> = { ArrowDown: 60, ArrowUp: -60, PageDown: 300, PageUp: -300, " ": e.shiftKey ? -300 : 300 };
      if (e.key in map) push(map[e.key], e);
    };
    // Scrolling that bypasses the handlers (scrollbar drag, links) re-syncs the take-off.
    const onScroll = () => {
      if (touchMode) return; // on touch, progress comes only from swipes at the top of the page
      if (guard) return; // the hand-off glide is in charge
      if (raf || !inZone()) {
        if (!raf && !inZone() && progress.get() < 1) {
          target = 1;
          progress.set(1);
        }
        return;
      }
      // Landing inside the hero from outside (e.g. a big scroll up): don't snap; glide there at
      // the capped speed, holding the page at the current take-off position meanwhile.
      const cur = progress.get();
      const t = Math.min(1, Math.max(0, window.scrollY / range()));
      if (Math.abs(t - cur) <= 0.01) return;
      if (performance.now() - lastInput < 300) {
        target = Math.min(cur + LEAD, Math.max(cur - LEAD, t));
        if (!raf) raf = requestAnimationFrame(tick);
      } else {
        // Links, Skip and scrollbar drags: follow the page, no cap.
        target = t;
        progress.set(t);
      }
    };
    // Clicking anywhere on the scene (not a button or link) plays the take-off at the same capped pace.
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.("a, button, nav, input, label")) return;
      if (!ref.current?.contains(e.target as Node) || progress.get() >= 1) return;
      auto = true;
      lastInput = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    ref.current?.addEventListener("click", onClick);
    const host = ref.current;
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      host?.removeEventListener("click", onClick);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [progress]);
  useMotionValueEvent(progress, "change", (t) => ref.current?.setAttribute("data-progress", t.toFixed(3)));

  const [s, setS] = useState({ t: 0, d: 0, h: 1, kt: 0, alt: 0, call: CALLOUTS[0][1], thrust: 0, pitch: 0, horizon: 0 });
  const pending = useRef<number | null>(null);
  const compactRef = useRef(false);
  const frame = useRef(0);
  const drawn = useRef(-1);
  const trailing = useRef<number | null>(null);
  const latest = useRef(0);
  useMotionValueEvent(p, "change", (t) => {
    // Scroll events can outpace frames; render at most once per frame.
    latest.current = t;
    if (pending.current !== null) return;
    pending.current = requestAnimationFrame(() => {
      pending.current = null;
      // Phones: redraw the scene at most every third frame, and only on a visible change.
      // (The world motion and shake are motion values and still run every frame.)
      if (compactRef.current) {
        frame.current += 1;
        const t = latest.current;
        const settled = t === 0 || t >= 0.999;
        if (!settled && (frame.current % 3 !== 0 || Math.abs(t - drawn.current) < 0.006)) {
          // Make sure the final position is drawn once scrolling stops.
          if (trailing.current) clearTimeout(trailing.current);
          trailing.current = window.setTimeout(() => {
            drawn.current = latest.current;
            update(latest.current);
          }, 90);
          return;
        }
        drawn.current = t;
      }
      update(latest.current);
    });
  });
  const update = (t: number) => {
    const d = t < 0.5 ? (t / 0.5) ** 2 * 90 : 90 + (t - 0.5) * 2 * 190;
    const climb = Math.max(0, (t - 0.52) / 0.48);
    setS({
      t,
      d,
      h: 1 + climb ** 1.4 * 9,
      kt: Math.round(t < 0.5 ? (t / 0.5) * 150 : 150 + (t - 0.5) * 70),
      alt: Math.round((climb ** 1.4 * 3000) / 10) * 10,
      call: [...CALLOUTS].reverse().find(([at]) => t >= at)?.[1] ?? CALLOUTS[0][1],
      thrust: Math.min(1, t / 0.04),
      pitch: t < 0.5 ? 0 : Math.min(15, ((t - 0.5) / 0.12) * 15),
      // Same curve as worldY below, as a number for the HUD.
      horizon: t < 0.5 ? 0 : t < 0.64 ? ((t - 0.5) / 0.14) * 52 : 52 + ((t - 0.64) / 0.36) * 6,
    });
  };

  // Rotation: the nose comes up about 15° and holds.
  const worldY = useTransform(p, [0.5, 0.64, 1], [0, 52, 58]);
  // Convert scene units to CSS pixels for the composited layer (the SVG is "slice"-scaled).
  const [unit, setUnit] = useState({ k: 1, ox: "50%", oy: "34%" });
  useEffect(() => {
    const measure = () => {
      const el = outsideRef.current;
      if (!el) return;
      const w = el.offsetWidth;
      const hgt = el.offsetHeight;
      const k = Math.max(w / VIEW_W, hgt / VIEW_H);
      // Rotation pivots on the vanishing point (VP, HZ), wherever "slice" puts it on screen.
      setUnit({ k, ox: `${w / 2 + (VP - VIEW_W / 2) * k}px`, oy: `${hgt / 2 + (HZ - VIEW_H / 2) * k}px` });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (outsideRef.current) ro.observe(outsideRef.current);
    return () => ro.disconnect();
  }, []);
  const worldYPx = useTransform(worldY, (v) => v * unit.k);
  const worldOrigin = `${unit.ox} ${unit.oy}`;
  const pitchRot = useTransform(p, [0.5, 0.66, 1], [0, -1.2, -0.4]);
  const shake = useTransform(p, (t) => (t < 0.5 && !reducedRef.current ? Math.sin(t * 900) * 1.6 * (t / 0.5) : 0));
  const cue = useTransform(p, [0, 0.1], [1, 0]);

  // Mouse parallax: a few pixels between layers, only on desktop and while the scene is on screen.
  useEffect(() => {
    if (reduced || compact || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    let visible = false;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (outsideRef.current) outsideRef.current.style.transform = `translate3d(${(-cx * 7).toFixed(2)}px, ${(-cy * 4).toFixed(2)}px, 0)`;
      if (panelRef.current) panelRef.current.style.transform = `translate3d(${(cx * 5).toFixed(2)}px, ${(cy * 4).toFixed(2)}px, 0)`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: MouseEvent) => {
      if (!visible) return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced, compact]);

  const airborne = s.t > 0.56;
  const climbing = s.t >= 0.66; // POSITIVE RATE
  const fma: [string, string, string] = climbing ? ["THR REF", "LNAV", "VNAV SPD"] : ["THR REF", "TO/GA", "TO/GA"];
  // Yokes: pulled back at ROTATE, easing to a gentle climb position after POSITIVE RATE.
  const ease = (x: number) => x * x * (3 - 2 * x);
  const pull = s.t < 0.5 ? 0 : s.t < 0.58 ? ease((s.t - 0.5) / 0.08) : 1 - 0.08 * ease(Math.min(1, (s.t - 0.58) / 0.42));
  const jitter = s.t < 0.5 && !reduced ? Math.sin(s.t * 1300) * 0.8 * (s.t / 0.5) : 0;

  return (
    <div ref={ref} className={reduced || touch ? "relative h-screen cursor-pointer" : "relative h-[140vh] cursor-pointer"}>
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden bg-floor">
        {/* The scene. Only this part shakes. */}
        <motion.div className="absolute inset-0" style={{ y: shake }}>
          {/* The world outside. Its climb motion is a transform on an HTML layer (composited by
              the GPU) rather than on an SVG group, which Chrome would repaint every frame. */}
          <div ref={outsideRef} className="absolute inset-0 md:inset-[-12px] md:will-change-transform">
            <motion.div className="absolute inset-0 will-change-transform" style={{ y: worldYPx, rotate: pitchRot, transformOrigin: worldOrigin }}>
              <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full overflow-visible" role="img" aria-label="View from an airliner flight deck during take-off">
                <OutsideDefs />
                <Backdrop />
                <Surroundings d={s.d} h={s.h} lite={compact} />
                <Ground d={s.d} h={s.h} lite={compact} />
              </svg>
            </motion.div>
          </div>
          <Layer>
            <Shell compact={compact} fma={fma} call={s.call} kt={s.kt} alt={s.alt} horizon={s.horizon} climb={Math.min(1, Math.max(0, (s.t - 0.55) / 0.1)) * 8} />
          </Layer>
          <Layer ref={panelRef}>
            <Panel ias={s.kt} alt={s.alt} pitch={s.pitch} n1={22 + s.thrust * 72} egt={420 + s.thrust * 360} ff={600 + s.thrust * 2240} thrust={s.thrust} airborne={airborne} fma={fma} pull={pull} jitter={jitter} detail={!compact} />
          </Layer>
        </motion.div>

        {/* Name card and actions: pinned, readable before anything animates. */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-6">
          <div className="sign-housing inline-flex">
            <div className="lightbox rounded-[3px] px-4 py-2.5 font-sign text-[#1a1206]">
              <p className="text-lg font-extrabold leading-tight md:text-2xl">Vivek Jude Manoj</p>
              <p className="text-xs font-semibold text-[#2a1d0a] md:text-sm">Backend &amp; Infrastructure Engineer</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2 pb-1">
            <a href={resumePath} target="_blank" rel="noopener noreferrer" className="btn-gold whitespace-nowrap rounded-[4px] px-3 py-1.5 font-mono text-[11px] font-bold">
              Résumé ↗
            </a>
            <a href="#top" className="btn-gold whitespace-nowrap rounded-[4px] px-3 py-1.5 font-mono text-[11px] font-bold">
              Skip →
            </a>
          </div>
        </div>
        <motion.div style={{ opacity: cue }} className="pointer-events-none absolute inset-x-0 bottom-[23%] flex justify-center">
          <span className="bob rounded-full bg-black/55 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-white shadow-lg">Scroll to take off ↓</span>
        </motion.div>
      </div>
    </div>
  );
};

"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { HZ, P, VIEW_H, VIEW_W, VP, col, r1 } from "./flightdeck/geometry";
import { Shell } from "./flightdeck/Shell";
import { Panel } from "./flightdeck/Panel";
import { resumePath } from "@/components/data";

// The landing scene: an airliner flight deck at the start of the take-off roll. Scrolling flies
// the take-off. Three layered SVGs share one camera (see flightdeck/geometry.ts):
//   1. the world outside, 2. the cockpit shell and HUD, 3. the glareshield and panel.
// Shake and parallax move only those layers; the name card and buttons stay still.

const RUNWAY_END = 200;
const ground = (X: number, z: number, h: number) => P(X, -h, z);
const quad = (X1: number, X2: number, z1: number, z2: number, h: number) =>
  `M${[ground(X1, z1, h), ground(X2, z1, h), ground(X2, z2, h), ground(X1, z2, h)].map((p) => p.join(" ")).join(" L")} Z`;
const face = (pts: [number, number, number][], h: number) => `M${pts.map(([X, Y, z]) => P(X, Y - h, z).join(" ")).join(" L")} Z`;

// ── Outside ─────────────────────────────────────────────────────────────
const Runway = ({ d, h }: { d: number; h: number }) => {
  const zFar = RUNWAY_END - d;
  if (zFar < 0.95) return null;
  const zNear = Math.max(0.9, -10 - d);
  const dashes: string[] = [];
  for (let s = 0; s < RUNWAY_END - 6; s += 3) {
    const z1 = s - d;
    const z2 = z1 + 1.4;
    if (z2 < 0.9 || z1 > 300) continue;
    dashes.push(quad(-0.07, 0.07, Math.max(z1, 0.9), z2, h));
  }
  const lights: [number, number, number][] = [];
  for (let s = 0; s < RUNWAY_END; s += 1.6) {
    const z = s - d;
    if (z < 0.9 || z > 140) continue;
    for (const X of [-1.25, 1.25]) {
      const [x, y] = ground(X, z, h);
      lights.push([x, y, Math.max(0.6, 6 / z)]);
    }
  }
  const keys = [-0.9, -0.66, -0.42, 0.42, 0.66, 0.9].map((X) => quad(X - 0.08, X + 0.08, Math.max(0.9, zFar - 4), zFar, h)).join(" ");
  return (
    <>
      <path d={quad(-1.15, 1.15, zNear, zFar, h)} style={{ fill: col("runway") }} />
      <path d={`${quad(-1.08, -1.02, zNear, zFar, h)} ${quad(1.02, 1.08, zNear, zFar, h)}`} fill="rgba(240,240,235,0.55)" />
      <path d={dashes.join(" ")} fill="rgba(245,245,240,0.9)" />
      <path d={keys} fill="rgba(245,245,240,0.8)" />
      <g style={{ opacity: "var(--lights)" }}>
        {lights.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r1(r)} fill={i % 2 ? "#ffe9b0" : "#fff3d6"} />
        ))}
      </g>
    </>
  );
};

type Building = { X1: number; X2: number; s: number; depth: number; H: number; tower?: boolean };
const BUILDINGS: Building[] = [
  { X1: -17, X2: -11, s: 24, depth: 4, H: 3 },
  { X1: -17, X2: -16.1, s: 70, depth: 0.9, H: 9, tower: true },
  { X1: -20, X2: -13, s: 92, depth: 5, H: 3.6 },
  { X1: -15, X2: -10, s: 150, depth: 4, H: 2.8 },
  { X1: 10, X2: 22, s: 40, depth: 7, H: 2.6 },
  { X1: 12, X2: 17, s: 112, depth: 4, H: 3.2 },
  { X1: 9, X2: 14, s: 175, depth: 4, H: 2.6 },
];

const BuildingShape = ({ b, d, h }: { b: Building; d: number; h: number }) => {
  const z1 = b.s - d;
  const z2 = z1 + b.depth;
  if (z1 < 1.2 || z1 > 260) return null;
  const inner = b.X2 < 0 ? b.X2 : b.X1;
  const winY = b.H * 0.55;
  return (
    <g>
      <path d={face([[b.X1, b.H, z1], [b.X2, b.H, z1], [b.X2, b.H, z2], [b.X1, b.H, z2]], h)} style={{ fill: col("building-roof") }} />
      <path d={face([[inner, 0, z1], [inner, 0, z2], [inner, b.H, z2], [inner, b.H, z1]], h)} style={{ fill: col("building-side") }} />
      <path d={face([[b.X1, 0, z1], [b.X2, 0, z1], [b.X2, b.H, z1], [b.X1, b.H, z1]], h)} style={{ fill: col("building") }} />
      <path d={face([[b.X1 + 0.4, winY, z1], [b.X2 - 0.4, winY, z1], [b.X2 - 0.4, winY + 0.25, z1], [b.X1 + 0.4, winY + 0.25, z1]], h)} fill="#ffd28a" style={{ opacity: "calc(var(--lights) * 0.9)" }} />
      {b.tower && <path d={face([[b.X1 - 0.5, b.H, z1], [b.X2 + 0.5, b.H, z1], [b.X2 + 0.5, b.H + 1.4, z1], [b.X1 - 0.5, b.H + 1.4, z1]], h)} fill="#ffe2a8" style={{ opacity: "var(--lights)" }} />}
    </g>
  );
};

const Surroundings = ({ d, h }: { d: number; h: number }) => {
  const blue: [number, number, number][] = [];
  for (let s = 0; s < 260; s += 2) {
    const z = s - d;
    if (z < 1 || z > 160) continue;
    for (const X of [-5.6, -4.4]) {
      const [x, y] = ground(X, z, h);
      blue.push([x, y, Math.max(0.6, 5 / z)]);
    }
  }
  const zA = Math.max(1, -10 - d);
  const taxiEnd = 260 - d;
  return (
    <>
      {taxiEnd > 1 && <path d={quad(-5.5, -4.5, zA, taxiEnd, h)} style={{ fill: col("runway", 0.75) }} />}
      {taxiEnd > 1 && <path d={quad(-5.03, -4.97, zA, taxiEnd, h)} fill="rgba(255,205,60,0.55)" />}
      {[...BUILDINGS]
        .sort((a, b) => b.s - a.s)
        .map((b, i) => (
          <BuildingShape key={i} b={b} d={d} h={h} />
        ))}
      <g style={{ opacity: "calc(var(--lights) + 0.15)" }}>
        {blue.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r1(r)} fill="#4f8cff" />
        ))}
      </g>
    </>
  );
};

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
      <rect x="-1000" y={HZ} width="3000" height="1400" fill="url(#to-ground)" />
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
  [0.8, "GEAR UP"],
];

const Layer = React.forwardRef<HTMLDivElement, { children: React.ReactNode; label?: string }>(function Layer({ children, label }, ref) {
  return (
    <div ref={ref} className="absolute inset-[-12px] will-change-transform">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        {children}
      </svg>
    </div>
  );
});

export const Takeoff = () => {
  const ref = useRef<HTMLDivElement>(null);
  const outsideRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Reduced motion: a still frame of the climb, no parallax, no shake.
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const reducedRef = useRef(false);
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reducedRef.current);
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const p = useTransform(scrollYProgress, (t) => (reducedRef.current ? 0.75 : t));

  const [s, setS] = useState({ t: 0, d: 0, h: 1, kt: 0, alt: 0, call: CALLOUTS[0][1], thrust: 0, pitch: 0, horizon: 0 });
  useMotionValueEvent(p, "change", (t) => {
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
  });

  // Rotation: the nose comes up about 15° and holds.
  const worldY = useTransform(p, [0.5, 0.64, 1], [0, 52, 58]);
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
  const fma: [string, string, string] = airborne ? ["MAN FLX", "SRS", "NAV"] : ["MAN FLX", "SRS", "RWY"];

  return (
    <div ref={ref} className={reduced ? "relative h-screen" : "relative h-[170vh]"}>
      <div className="sticky top-0 h-screen overflow-hidden bg-floor">
        {/* The scene. Only this part shakes. */}
        <motion.div className="absolute inset-0" style={{ y: shake }}>
          <Layer ref={outsideRef} label="View from an airliner flight deck during take-off">
            <OutsideDefs />
            <motion.g style={{ y: worldY, rotate: pitchRot, originX: `${VP}px`, originY: `${HZ}px` }}>
              <Backdrop />
              <Surroundings d={s.d} h={s.h} />
              <Runway d={s.d} h={s.h} />
            </motion.g>
          </Layer>
          <Layer>
            <Shell compact={compact} call={s.call} kt={s.kt} alt={s.alt} horizon={s.horizon} climb={Math.min(1, Math.max(0, (s.t - 0.55) / 0.1)) * 8} />
          </Layer>
          <Layer ref={panelRef}>
            <Panel ias={s.kt} alt={s.alt} pitch={s.pitch} n1={22 + s.thrust * 72} egt={420 + s.thrust * 360} ff={600 + s.thrust * 2240} thrust={s.thrust} airborne={airborne} fma={fma} />
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
        <motion.div style={{ opacity: cue }} className="pointer-events-none absolute inset-x-0 bottom-[6%] flex justify-center">
          <span className="bob rounded-full bg-black/55 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-white shadow-lg backdrop-blur-sm">Scroll to take off ↓</span>
        </motion.div>
      </div>
    </div>
  );
};

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PlaneIcon, useClock } from "./CheckIn";

// Everything is in % of the strip (the SVG uses the same 0–100 space with preserveAspectRatio
// "none"). The glide path is a straight descent, then a short flare: a quadratic curve that is
// tangent to the descent at F and level at the touchdown point T, the runway threshold. Scaling
// keeps a Bézier a Bézier, so the plane, computed on the same curve, sits exactly on the dashes.
const START = { x: 4, y: 12 };
const AIM = { x: 58, y: 85 }; // where the descent line would meet the runway; the flare's control point
const T = { x: 64, y: 85 }; // touchdown: the threshold (start of the runway strip, on its centreline)
const STOP = { x: 80, y: 85 }; // end of the roll-out
const F = { x: START.x + 0.92 * (AIM.x - START.x), y: START.y + 0.92 * (AIM.y - START.y) }; // flare start
const GLIDE_PATH = `M${START.x} ${START.y} L${F.x.toFixed(2)} ${F.y.toFixed(2)} Q${AIM.x} ${AIM.y} ${T.x} ${T.y}`;

/** Point on the glide path at u ∈ [0, 1] (by parameter, not distance), in %. */
const pathAt = (u: number) => {
  const split = 0.9; // the straight part takes 90% of the parameter, the flare the last 10%
  if (u <= split) {
    const k = u / split;
    return { x: START.x + (F.x - START.x) * k, y: START.y + (F.y - START.y) * k };
  }
  const k = (u - split) / (1 - split);
  const m = 1 - k;
  return { x: m * m * F.x + 2 * m * k * AIM.x + k * k * T.x, y: m * m * F.y + 2 * m * k * AIM.y + k * k * T.y };
};

/**
 * The landing between the in-flight sections and the airport ones: as you scroll past it, the
 * plane flies down the dashed glide path, flares (nose up about 5°, descent flattening), touches
 * down at the threshold and rolls a short way along the runway. Static at the end with reduced motion.
 */
export const Landing = () => {
  const ref = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { local } = useClock();
  const [size, setSize] = useState({ w: 1100, h: 240 });
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Sample the path in screen pixels, so the plane moves at an even speed and its heading matches
  // the line as drawn (the % space is stretched differently at every width).
  const table = useMemo(() => {
    const N = 240;
    const pts = Array.from({ length: N + 1 }, (_, i) => pathAt(i / N));
    const len = [0];
    for (let i = 1; i <= N; i++) len.push(len[i - 1] + Math.hypot(((pts[i].x - pts[i - 1].x) * size.w) / 100, ((pts[i].y - pts[i - 1].y) * size.h) / 100));
    return { pts, len, total: len[N], N };
  }, [size]);
  const at = (d: number) => {
    const { pts, len, total, N } = table;
    const target = Math.min(1, Math.max(0, d)) * total;
    let i = 1;
    while (i < N && len[i] < target) i++;
    const a = pts[i - 1];
    const b = pts[i];
    const f = (target - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]);
    const heading = (Math.atan2(((b.y - a.y) * size.h) / 100, ((b.x - a.x) * size.w) / 100) * 180) / Math.PI;
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, heading, u: (i - 1 + f) / N };
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Approach over the first part of the strip's pass through the viewport, then the roll-out.
  const t = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);
  const roll = useTransform(scrollYProgress, [0.6, 0.78], [0, 1]);
  const pose = useTransform([t, roll], ([a, r]: number[]) => {
    if (reduced) return { x: STOP.x, y: STOP.y, rot: 90 };
    if (r > 0) return { x: T.x + (STOP.x - T.x) * (1 - (1 - r) * (1 - r)), y: T.y, rot: 90 - 5 * (1 - r) };
    const p = at(a);
    // PlaneIcon points up; 90° turns it to point right along the path. In the flare the nose
    // comes up by up to 5° relative to the path.
    const flare = Math.max(0, (p.u - 0.9) / 0.1);
    return { x: p.x, y: p.y, rot: 90 + p.heading - 5 * flare };
  });
  const left = useTransform(pose, (q) => `${q.x}%`);
  const top = useTransform(pose, (q) => `${q.y}%`);
  const rotate = useTransform(pose, (q) => q.rot);

  return (
    <div id="landing" ref={ref} className="device relative overflow-hidden border-y border-black bg-floor">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div ref={strip} className="relative h-52 md:h-60">
          {/* Glide path, approach lights and runway. */}
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={GLIDE_PATH} fill="none" stroke="rgb(var(--sign) / 0.45)" strokeWidth="1" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
            <line x1="0" x2="100" y1="86" y2="86" stroke="rgba(255,255,255,0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <rect x="62" y="82" width="36" height="6" fill="#2a2b2e" />
            <line x1="66" x2="97" y1="85" y2="85" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="62.6" x2="64.4" y1={82.8 + i * 1.4} y2={82.8 + i * 1.4} stroke="rgba(255,255,255,0.75)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          {/* Approach lights and PAPI (two red, two white: on the glide path). */}
          <div aria-hidden="true" className="absolute bottom-[14%] left-[46%] flex gap-[1.2%]" style={{ width: "15%" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="board-blink h-1.5 w-1.5 rounded-full bg-sign shadow-[0_0_8px_rgb(var(--sign))]" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
          <div aria-hidden="true" className="absolute bottom-[25%] left-[88%] flex gap-1">
            {["#e5484d", "#e5484d", "#f4f1ea", "#f4f1ea"].map((c, i) => (
              <span key={i} className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
            ))}
          </div>
          {/* Centred on its point with framer's x/y (a CSS translate class would be overridden by the rotate). */}
          <motion.div aria-hidden="true" style={{ left, top, rotate, x: "-50%", y: "-50%" }} className="absolute text-sign drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
            <PlaneIcon className="h-7 w-7 md:h-9 md:w-9" />
          </motion.div>

          {/* Announcement. */}
          <div className="absolute right-0 top-[8%] max-w-[60%] text-right md:top-[12%]">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-flap/60">Descending · Seatbelt sign on</p>
            <p className="mt-2 font-sign text-xl font-bold text-flap md:text-3xl">Now arriving YKF</p>
            <p className="mt-1 font-mono text-xs text-flap/70 md:text-sm">
              Waterloo, home of the University of Waterloo
            </p>
            <p className="mt-0.5 font-mono text-xs text-flap/60 md:text-sm">
              Local time <span className="text-live">{local}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

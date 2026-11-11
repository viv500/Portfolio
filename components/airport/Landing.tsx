"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlaneIcon, useClock } from "./CheckIn";

// Glide path, in % of the strip: from top-left down to the touchdown point on the runway.
const START = { x: 4, y: 12 };
const TOUCH = { x: 66, y: 78 };
const STOP = { x: 84, y: 78 };

/**
 * The landing between the in-flight sections and the airport ones: a descent strip where the
 * plane follows the glide path down to the runway as you scroll past it.
 */
export const Landing = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { local } = useClock();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Descend over the first 60% of the strip's pass through the viewport, then roll out.
  const t = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);
  const roll = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const left = useTransform([t, roll], ([a, r]: number[]) =>
    r > 0 ? `${TOUCH.x + (STOP.x - TOUCH.x) * (1 - (1 - r) * (1 - r))}%` : `${START.x + (TOUCH.x - START.x) * a}%`
  );
  const top = useTransform(t, (a) => `${START.y + (TOUCH.y - START.y) * a}%`);
  // Slightly nose-down on the approach, flaring level just before touchdown.
  const rotate = useTransform(t, [0, 0.85, 1], [100, 100, 90]);

  return (
    <div id="landing" ref={ref} className="device relative overflow-hidden border-y border-black bg-floor">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative h-52 md:h-60">
          {/* Glide path, approach lights and runway. */}
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1={START.x} y1={START.y} x2={TOUCH.x} y2={TOUCH.y} stroke="rgb(var(--sign) / 0.45)" strokeWidth="1" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
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
          <motion.div aria-hidden="true" style={{ left, top, rotate }} className="absolute -translate-x-1/2 -translate-y-1/2 text-sign drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
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

"use client";

import React from "react";
import { motion, useMotionValue, useScroll, useMotionValueEvent } from "framer-motion";
import { PlaneIcon } from "./CheckIn";
import { takeoffClimb, takeoffPlaying } from "./takeoffBus";

/** How far along the strip the plane is when the take-off ends (the climb out of DXB). */
const CLIMB_X = 6;

/**
 * The flight from Dubai to Waterloo. During the intro take-off, ALT climbs 0 → 37,000 FT and the
 * plane leaves DXB; after that the scroll position flies it across the strip: cruise, descend
 * into the landing strip, then on the ground through the airport sections.
 */
export const FlightProgress = () => {
  const { scrollYProgress } = useScroll();
  const left = useMotionValue(`${CLIMB_X}%`);
  const [readout, setReadout] = React.useState({ alt: 37000, eta: "13:55" });
  const set = (alt: number, eta: string) =>
    setReadout((prev) => {
      const next = { alt: Math.round(alt / 500) * 500, eta };
      return prev.alt === next.alt && prev.eta === next.eta ? prev : next;
    });

  // The take-off.
  useMotionValueEvent(takeoffClimb, "change", (c) => {
    if (!takeoffPlaying()) return;
    left.set(`${c * CLIMB_X}%`);
    set(c * 37000, "13:55");
  });
  React.useEffect(() => {
    if (takeoffPlaying()) {
      left.set("0%");
      set(0, "13:55");
    }
    // Take-off over: at cruise, wherever the page is.
    const done = () => {
      const p = scrollYProgress.get();
      left.set(`${CLIMB_X + Math.min(1, Math.max(0, p)) * (100 - CLIMB_X)}%`);
      set(37000, "13:55");
    };
    const start = () => {
      left.set("0%");
      set(0, "13:55");
    };
    window.addEventListener("takeoff:done", done);
    window.addEventListener("takeoff:start", start);
    return () => {
      window.removeEventListener("takeoff:done", done);
      window.removeEventListener("takeoff:start", start);
    };
  }, [left, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (takeoffPlaying()) return;
    left.set(`${CLIMB_X + Math.min(1, Math.max(0, p)) * (100 - CLIMB_X)}%`);
    const el = document.getElementById("landing");
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const land = el && max > 0 ? Math.min(1, (el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2) / max) : 0.8;
    const descent = Math.max(0.05, land * 0.25);
    // Already at cruise when the page starts (the captain says so); descend into the landing strip.
    const alt = p >= land ? 0 : p > land - descent ? ((land - p) / descent) * 37000 : 37000;
    const minutes = Math.max(0, Math.round((1 - Math.min(1, p / land)) * 835)); // DXB to YYZ is about 13 h 55 min.
    set(alt, p >= land ? "LANDED" : `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`);
  });

  return (
    <div aria-hidden="true" className="flight-strip fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-floor">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1.5 font-mono text-[10px] text-flap/70 md:px-6">
        <span className="text-flap">DXB</span>
        <div className="relative h-4 flex-1">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(237,234,224,0.3)_0_4px,transparent_4px_8px)]" />
          <motion.div style={{ width: left }} className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-sign" />
          <motion.div style={{ left }} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-sign">
            <PlaneIcon className="h-3.5 w-3.5 rotate-90" />
          </motion.div>
        </div>
        <span className="text-flap">YKF</span>
        <span className="hidden w-28 sm:inline">{readout.alt > 0 ? `ALT ${readout.alt.toLocaleString("en-CA")} FT` : "ON GROUND"}</span>
        <span className="hidden w-24 md:inline">{readout.eta === "LANDED" ? "LANDED · YKF" : `ETA ${readout.eta}`}</span>
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { PlaneIcon } from "./CheckIn";

/** Scroll position as a flight from Dubai to Waterloo: the plane crosses the strip as you read. */
export const FlightProgress = () => {
  const { scrollYProgress } = useScroll();
  const left = useTransform(scrollYProgress, (p) => `${Math.min(100, Math.max(0, p * 100))}%`);
  const [readout, setReadout] = React.useState({ alt: 0, eta: "13:55" });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Climb for the first fifth, cruise, then descend over the last fifth.
    const alt = p < 0.2 ? (p / 0.2) * 37000 : p > 0.8 ? ((1 - p) / 0.2) * 37000 : 37000;
    const minutes = Math.round((1 - p) * 835); // DXB to YYZ is about 13 h 55 min.
    const next = { alt: Math.round(alt / 500) * 500, eta: `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}` };
    setReadout((prev) => (prev.alt === next.alt && prev.eta === next.eta ? prev : next));
  });

  return (
    <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-floor">
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
        <span className="hidden w-28 sm:inline">ALT {readout.alt.toLocaleString("en-CA")} FT</span>
        <span className="hidden w-20 md:inline">ETA {readout.eta}</span>
      </div>
    </div>
  );
};

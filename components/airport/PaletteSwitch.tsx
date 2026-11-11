"use client";

import React, { useEffect, useRef, useState } from "react";

// Golden hour is the main theme; "day" is the light theme (clear morning, baby blue and silver).
// The stored choice is applied before first paint by the script in app/layout.tsx.
export const PALETTE_KEY = "palette";
type Palette = "golden" | "day";

const Sun = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const Moon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
    <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
  </svg>
);

type TransitionDocument = Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } };

/** iOS-style day/golden-hour switch, bottom-left above the flight strip. */
export const PaletteSwitch = () => {
  const [palette, setPalette] = useState<Palette | null>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPalette(document.documentElement.dataset.palette === "day" ? "day" : "golden");
  }, []);

  if (!palette) return null;
  const day = palette === "day";

  const apply = (next: Palette) => {
    document.documentElement.dataset.palette = next;
    try {
      localStorage.setItem(PALETTE_KEY, next);
    } catch {}
    setPalette(next);
  };

  // The new theme spreads out from the switch as a growing circle.
  const toggle = () => {
    const next: Palette = day ? "golden" : "day";
    const doc = document as TransitionDocument;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduced || !button.current) return apply(next);
    const rect = button.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(() => apply(next)).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  const tip = day ? "Switch to golden hour" : "Switch to daytime";
  return (
    <div className="group fixed bottom-10 left-4 z-[6500]">
    <span role="tooltip" className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 font-mono text-[10px] text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      {tip}
    </span>
    <button
      ref={button}
      type="button"
      role="switch"
      aria-checked={day}
      aria-label={tip}
      onClick={toggle}
      className={`flex h-8 w-14 items-center rounded-full border p-0.5 shadow-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sign ${
        day ? "border-[#b98a3e] bg-[#f3dfb8]" : "border-white/35 bg-black/70"
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full shadow transition-transform duration-300 ease-out motion-reduce:transition-none ${
          day ? "translate-x-6 bg-white text-[#b56d00]" : "translate-x-0 bg-[#2a1d14] text-[#f5b23a]"
        }`}
      >
        {day ? <Sun /> : <Moon />}
      </span>
    </button>
    </div>
  );
};

"use client";
import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

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

// View Transitions isn't in this TypeScript version's DOM types yet.
type TransitionDocument = Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } };

/** An iOS-style switch in the bottom-left corner: moon in the knob for dark, sun for light. */
export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => setMounted(true), []);
  if (!mounted || pathname?.startsWith("/aviation")) return null;

  const light = resolvedTheme === "light";

  // The new theme spreads out from the switch as a growing circle. Browsers without the
  // View Transitions API, or visitors who prefer reduced motion, get an instant switch.
  const toggle = () => {
    const next = light ? "dark" : "light";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as TransitionDocument;
    if (!doc.startViewTransition || reduced || !button.current) {
      setTheme(next);
      return;
    }
    const rect = button.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    const transition = doc.startViewTransition(() => {
      root.classList.remove(light ? "light" : "dark");
      root.classList.add(next);
      flushSync(() => setTheme(next));
    });
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      ref={button}
      onClick={toggle}
      className={`fixed bottom-4 left-4 z-[6000] flex h-8 w-14 items-center rounded-full border p-0.5 shadow-lg backdrop-blur transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple ${
        light ? "border-black/10 bg-amber-200/80" : "border-white/15 bg-white/10"
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full shadow transition-transform duration-300 ease-out motion-reduce:transition-none ${
          light ? "translate-x-6 bg-white text-amber-500" : "translate-x-0 bg-[#1b1530] text-purple"
        }`}
      >
        {light ? <Sun /> : <Moon />}
      </span>
    </button>
  );
};

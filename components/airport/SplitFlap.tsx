"use client";

import React, { useEffect, useRef, useState } from "react";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·-/:+&'";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Text on a split-flap board. Each cell flips through characters before landing on its own,
 * left to right, like a departures board updating. Starts when it scrolls into view and
 * replays whenever `text` changes.
 */
export const SplitFlap = ({
  text,
  length,
  className = "",
  cellClassName = "",
  delay = 0,
  /** Flips each cell runs through before settling. */
  spins = 7,
}: {
  text: string;
  length?: number;
  className?: string;
  cellClassName?: string;
  delay?: number;
  spins?: number;
}) => {
  const target = (length ? text.toUpperCase().padEnd(length, " ").slice(0, length) : text.toUpperCase()).split("");
  const [shown, setShown] = useState<string[]>(() => target.map(() => " "));
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const key = target.join("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (reducedMotion()) {
      setShown(target);
      return;
    }
    const timers: number[] = [];
    let cancelled = false;
    const start = window.setTimeout(() => {
      // Each cell gets its own step count so they settle in a ripple, not all at once.
      const steps = target.map((_, i) => spins + i * 1.4);
      let tick = 0;
      const id = window.setInterval(() => {
        if (cancelled) return;
        tick += 1;
        setShown((prev) =>
          prev.map((c, i) => {
            if (tick >= steps[i]) return target[i];
            if (target[i] === " " && tick > 2) return " ";
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
        );
        if (tick >= Math.max(...steps)) window.clearInterval(id);
      }, 55);
      timers.push(id);
    }, delay);
    timers.push(start);
    return () => {
      cancelled = true;
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, key]);

  return (
    <span ref={ref} className={`inline-flex ${className}`} aria-label={text} role="text">
      {shown.map((c, i) => (
        <span key={i} aria-hidden="true" className={`flap-cell ${cellClassName}`}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
};

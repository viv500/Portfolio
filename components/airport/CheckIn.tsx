"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { profile } from "@/components/data";
import { CrewBadge } from "./CrewBadge";
import { takeoffPlaying } from "./takeoffBus";

const TYPE_MS = 700; // the ACARS line types in over this long
const acarsText = () =>
  `${document.documentElement.dataset.palette === "day" ? "Good afternoon" : "Good evening"} from the flight deck, this is Captain Vivek speaking. We’ve reached cruising altitude, so here’s a bit about what I do.`;

/** Dim static stars for the top of the page at golden hour (fixed positions: same on server and client). */
const STARS = [
  [6, 18, 1.5], [14, 42, 1], [23, 12, 1.2], [31, 55, 1], [38, 24, 1.6], [47, 8, 1], [55, 38, 1.2],
  [63, 16, 1], [71, 47, 1.4], [79, 21, 1], [86, 36, 1.2], [93, 10, 1.5], [98, 52, 1],
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** Waterloo local time, and a METAR-style UTC stamp (DDHHMMZ). */
export const useClock = () => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return { local: "--:--", zulu: "------Z" };
  const local = now.toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Toronto" });
  const zulu = `${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}Z`;
  return { local, zulu };
};

export const PlaneIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M21.5 15.5v-2l-8-5V3a1.5 1.5 0 0 0-3 0v5.5l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5l-2-1.5v-6l8 2.5Z" />
  </svg>
);

/**
 * The intro after take-off: a captain's PA, printed like an ACARS message on a cockpit screen,
 * then the headline, a one-line bio, the two actions and a few flight-info fields.
 */
export const CheckIn = () => {
  const { local, zulu } = useClock();
  // Reveal after the intro take-off: the ACARS line types in, then the rest fades in.
  const [stage, setStage] = useState<"shown" | "hidden" | "typing">("shown");
  const [typed, setTyped] = useState("");
  const sky = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let revealedAt = performance.now();
    let scrolled = false;
    if (takeoffPlaying()) setStage("hidden");
    const onStart = () => setStage("hidden");
    const onDone = () => {
      revealedAt = performance.now();
      setTyped("");
      setStage("typing");
    };
    // The horizon glow and stars fade out over the first 40% of the viewport; and the first scroll after the reveal is timed.
    const onScroll = () => {
      if (sky.current) sky.current.style.opacity = String(Math.max(0, 1 - window.scrollY / (0.4 * window.innerHeight)));
      if (!scrolled && window.scrollY > 0 && !takeoffPlaying()) {
        scrolled = true;
        posthog.capture("time_to_first_scroll", { ms: Math.round(performance.now() - revealedAt) });
      }
    };
    window.addEventListener("takeoff:start", onStart);
    window.addEventListener("takeoff:done", onDone);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("takeoff:start", onStart);
      window.removeEventListener("takeoff:done", onDone);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (stage !== "typing") return;
    const text = acarsText();
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const n = Math.min(text.length, Math.round(((now - t0) / TYPE_MS) * text.length));
      setTyped(text.slice(0, n));
      if (n < text.length) raf = requestAnimationFrame(tick);
      else setStage("shown");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  return (
    <header id="top" data-reveal={stage} className="amb-terminal relative overflow-hidden border-b border-black">
      {/* The top of the sky the intro flew through: a faint horizon glow (white haze in daylight)
          and a few dim stars at golden hour. Fades out as you scroll. */}
      <div ref={sky} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48">
        <div className="reveal-first absolute inset-0">
        <div className="horizon-glow absolute inset-0" />
        <div className="horizon-stars absolute inset-0">
          {STARS.map(([x, y, r]) => (
            <span key={`${x}-${y}`} className="absolute rounded-full bg-[#fff4dc]" style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, opacity: 0.35 }} />
          ))}
        </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12">
        {/* Cabin sign: seatbelt off, we're at cruise. */}
        <div className="reveal-first mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="sign-housing inline-flex"><div className="sign-plate inline-flex items-stretch overflow-hidden rounded-[3px] font-sign text-sm font-bold">
            <span className="sign-letter px-2.5">
              <PlaneIcon className="h-4 w-4" />
            </span>
            <span className="px-3 py-1.5">Captain&apos;s announcement</span>
          </div></div>
          <div className="flex items-center gap-3 font-mono text-xs text-flap/70">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("takeoff:replay"))}
              className="replay-btn rounded-[3px] border border-white/15 px-2 py-1 text-[11px] text-flap/75 transition hover:border-sign/60 hover:text-flap"
            >
              ↻ Replay take-off
            </button>
            <span>
              FL370 · CRUISE <span className="ml-2 text-flap">{local}</span>
            </span>
          </div>
        </div>

        {/* The PA, as an ACARS message on a cockpit screen. */}
        <div className="reveal-first acars-bezel board-frame metal relative rounded-lg p-2 md:p-2.5">
          {["left-[5px] top-[5px]", "right-[5px] top-[5px]", "bottom-[5px] left-[5px]", "bottom-[5px] right-[5px]"].map((pos) => (
            <span key={pos} aria-hidden="true" className={`acars-screw screw absolute md:scale-110 ${pos}`} />
          ))}
          <div className="acars-screen device board-screen recessed relative rounded-md bg-floor px-4 py-3 font-mono md:px-6 md:py-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/10 pb-2 text-[10px] uppercase tracking-[0.2em] text-flap/70 md:text-[11px]">
            <span>
              <span className="text-ops">ACARS</span> · Cabin PA · From flight deck
            </span>
            <span>VJ 127 · {zulu}</span>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-ink md:text-[15px] [text-shadow:0_0_8px_rgb(var(--ink)/0.25)]">
            {stage === "shown" ? (
              <>
                {/* The greeting follows the active palette (CSS, so it changes live with the toggle). */}
                <span className="greet-evening">Good evening</span>
                <span className="greet-afternoon">Good afternoon</span> from the flight deck, this is Captain <span className="text-live">Vivek</span> speaking.
                We’ve reached cruising altitude, so here’s a bit about what I do.
              </>
            ) : (
              typed
            )}
            <span aria-hidden="true" className="board-blink ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-ink/80" />
          </p>
          </div>
        </div>

        {/* Desktop: headline, bio, strip and buttons on the left; the crew badge alone on the right,
            its top level with the headline. Phones: badge above the headline. */}
        {/* The text column is the headline's width (42rem); the badge is centred in the space between
            it and the right edge of the ACARS panel (no column gap, so the centre is exact). */}
        <div className="mt-14 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] md:gap-x-0">
          <CrewBadge className="reveal-item justify-self-center md:col-start-2 md:row-start-1 md:self-start" />
          <div className="reveal-item md:col-start-1 md:row-start-1">
            <h1 className="max-w-2xl font-sign text-[28px] font-bold leading-tight text-flap md:text-[44px]">{profile.hero}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-flap/65">
              I’m a fourth-year Computer Science and AI student at the <span className="font-medium text-flap/90">University of Waterloo</span>, working on
              backend and infrastructure: cloud, CI/build systems and AI developer tooling. Three SWE internships so far, with Shopify up next.
            </p>
            <dl className="mt-5 grid max-w-xs grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-white/10 bg-white/10 font-mono text-[9px] uppercase sm:text-[10px]">
              {[
                ["Next", "Shopify · W27"],
                ["Base", "UWaterloo"],
              ].map(([k, v]) => (
                <div key={k} className="bg-panel px-2.5 py-2">
                  <dt className="tracking-[0.2em] text-flap/60">{k}</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-flap/90">
                    {k === "Base" && <Image src="/logos/uwaterloo.svg" alt="University of Waterloo" width={24} height={24} className="h-6 w-6 shrink-0" />}
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            {/* Actions: identical size, icon cell and raised lip; Résumé filled gold, Contact outlined.
                Side by side on desktop, full-width and stacked on phones. */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#resume" className="btn-gold group flex h-12 w-full items-stretch overflow-hidden rounded-[4px] font-sign font-bold sm:w-44">
                <span className="sign-letter flex w-11 shrink-0 items-center justify-center text-lg">→</span>
                <span className="flex flex-1 items-center px-4">Résumé</span>
              </a>
              <a
                href="#contact"
                className="group flex h-12 w-full items-stretch overflow-hidden rounded-[4px] border border-sign-deep/80 font-sign font-bold text-sign-deep shadow-[0_4px_0_rgb(128_72_10/0.8),0_9px_16px_-6px_rgba(0,0,0,0.6)] transition hover:bg-sign/10 active:translate-y-[3px] sm:w-44"
              >
                <span className="flex w-11 shrink-0 items-center justify-center border-r border-sign-deep/50 text-lg">✉</span>
                <span className="flex flex-1 items-center px-4">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>

    </header>
  );
};

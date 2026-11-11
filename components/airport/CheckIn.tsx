"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { profile } from "@/components/data";

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

  return (
    <header id="top" className="amb-terminal relative overflow-hidden border-b border-black">
      {/* Overhead cabin lighting: a row of soft ceiling panels, nothing more. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex h-2 justify-around opacity-60">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="h-full w-24 rounded-b bg-gradient-to-b from-white/25 to-transparent" />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12">
        {/* Cabin sign: seatbelt off, we're at cruise. */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="sign-housing inline-flex"><div className="sign-plate inline-flex items-stretch overflow-hidden rounded-[3px] font-sign text-sm font-bold">
            <span className="sign-letter px-2.5">
              <PlaneIcon className="h-4 w-4" />
            </span>
            <span className="px-3 py-1.5">Captain&apos;s announcement</span>
          </div></div>
          <div className="font-mono text-xs text-flap/70">
            FL370 · CRUISE <span className="ml-2 text-flap">{local}</span>
          </div>
        </div>

        {/* The PA, as an ACARS message on a cockpit screen. */}
        <div className="acars-bezel board-frame metal relative rounded-lg p-2 md:p-2.5">
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
            {/* The greeting follows the active palette (CSS, so it changes live with the toggle). */}
            <span className="greet-evening">Good evening</span>
            <span className="greet-afternoon">Good afternoon</span>, this is your captain, <span className="text-live">Vivek Jude Manoj</span>. We&apos;ve reached cruising
            altitude, so sit back while I tell you a little about what I do.
            <span aria-hidden="true" className="board-blink ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-ink/80" />
          </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h1 className="max-w-2xl font-sign text-[28px] font-bold leading-tight text-flap md:text-[44px]">{profile.hero}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-flap/65">
              Infrastructure and developer tooling engineer. CS + AI at the <span className="font-medium text-flap/90">University of Waterloo</span>. Grew up in Dubai.
            </p>
            <dl className="mt-6 grid max-w-xs grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-white/10 bg-white/10 font-mono text-[9px] uppercase sm:text-[10px]">
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
          </div>
          <div className="flex flex-wrap gap-3 md:flex-col md:items-stretch">
            <a href="#resume" className="btn-gold group inline-flex items-stretch overflow-hidden rounded-[4px] font-sign font-bold">
              <span className="sign-letter px-3 text-lg">→</span>
              <span className="px-4 py-3">Résumé</span>
            </a>
            <a href="#contact" className="group inline-flex items-stretch overflow-hidden rounded-[3px] border border-sign-deep/70 font-sign font-bold text-sign-deep transition hover:bg-sign/10">
              <span className="flex items-center border-r border-sign-deep/40 px-3">✉</span>
              <span className="px-4 py-3">Contact</span>
            </a>
          </div>
        </div>
      </div>

    </header>
  );
};

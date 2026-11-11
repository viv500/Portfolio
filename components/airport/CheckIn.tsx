"use client";

import React, { useEffect, useState } from "react";
import { SplitFlap } from "./SplitFlap";
import { profile } from "@/components/data";

const MESSAGES = ["NOW BOARDING · SHOPIFY", "INFRA + DEV TOOLING", "CS + AI · UWATERLOO", "EX ARCTIC WOLF · ROCKET"];
const BOARD_WIDTH = 24;

const pad = (n: number) => String(n).padStart(2, "0");

/** Waterloo local time, and a METAR-style UTC stamp (DDHHMMZ). */
const useClock = () => {
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

export const CheckIn = () => {
  const [message, setMessage] = useState(0);
  const { local, zulu } = useClock();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setMessage((m) => (m + 1) % MESSAGES.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header id="top" className="amb-terminal relative overflow-hidden border-b border-black">
      {/* Overhead terminal lighting: a row of soft ceiling panels, nothing more. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex h-2 justify-around opacity-60">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="h-full w-24 rounded-b bg-gradient-to-b from-white/25 to-transparent" />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12">
        {/* Overhead terminal sign. */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="sign-housing inline-flex"><div className="sign-plate inline-flex items-stretch overflow-hidden rounded-[3px] font-sign text-sm font-bold">
            <span className="sign-letter px-2.5">
              <PlaneIcon className="h-4 w-4 -rotate-45" />
            </span>
            <span className="px-3 py-1.5">Departures</span>
          </div></div>
          <div className="font-mono text-xs text-flap/70">
            TERMINAL VJM · WATERLOO <span className="ml-2 text-flap">{local}</span>
          </div>
        </div>

        {/* The board. */}
        <div className="metal rounded-lg p-2.5 md:p-3"><div className="device recessed rounded-md bg-floor p-4 md:p-7">
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-flap/70 md:text-xs">
            <span>Passenger</span>
            <span className="hidden sm:inline">Gate · Infrastructure</span>
          </div>
          <h1 className="text-[16px] min-[420px]:text-[18px] sm:text-[32px] md:text-[44px] lg:text-[52px]">
            <SplitFlap text={profile.name} spins={10} />
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-6">
            <span className="board-blink font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-live md:text-xs">● Live</span>
            <div className="flap-sm text-[11px] min-[400px]:text-[12px] sm:text-[16px] md:text-[20px]">
              <SplitFlap text={MESSAGES[message]} length={BOARD_WIDTH} delay={600} spins={5} cellClassName="!text-live" />
            </div>
          </div>
        </div></div>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <p className="max-w-2xl font-sign text-2xl font-semibold leading-snug text-flap md:text-[34px]">{profile.hero}</p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-flap/65">
              Infrastructure and developer tooling engineer. Grew up in Dubai, studying CS + AI at Waterloo.
            </p>
            <dl className="mt-6 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-[3px] border border-white/10 bg-white/10 font-mono text-[10px] uppercase sm:text-[11px]">
              {[
                ["Next", "Shopify · W27"],
                ["Previous", "Arctic Wolf · Rocket"],
                ["Base", "UWaterloo"],
              ].map(([k, v]) => (
                <div key={k} className="bg-panel px-3 py-2.5">
                  <dt className="tracking-[0.2em] text-flap/70">{k}</dt>
                  <dd className="mt-1 text-flap">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-wrap gap-3 md:flex-col md:items-stretch">
            <a href="#resume" className="btn-gold group inline-flex items-stretch overflow-hidden rounded-[4px] font-sign font-bold">
              <span className="sign-letter px-3 text-lg">→</span>
              <span className="px-4 py-3">
                Boarding pass <span className="font-semibold opacity-60">· Resume</span>
              </span>
            </a>
            <a href="#contact" className="group inline-flex items-stretch overflow-hidden rounded-[3px] border border-sign-deep/70 font-sign font-bold text-sign-deep transition hover:bg-sign/10">
              <span className="flex items-center border-r border-sign-deep/40 px-3">✉</span>
              <span className="px-4 py-3">Contact</span>
            </a>
          </div>
        </div>
      </div>

      {/* METAR-style status strip. */}
      <div className="border-t border-black/10 bg-floor/60">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-hidden whitespace-nowrap px-4 py-2 font-mono text-[10px] text-flap/70 md:px-6 md:text-[11px]">
          <span className="text-flap/80">METAR CYKF {zulu}</span>
          <span>VIS 10SM</span>
          <span className="hidden sm:inline">CI/CD GREEN</span>
          <span className="hidden md:inline">BUILDS CACHED</span>
          <span className="ml-auto flex items-center gap-2 text-ops">
            <span className="h-1.5 w-1.5 rounded-full bg-ops" /> ALL SYSTEMS NOMINAL
          </span>
        </div>
      </div>
    </header>
  );
};

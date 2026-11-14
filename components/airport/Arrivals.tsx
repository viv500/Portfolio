"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { contactLinks, profile, resumePath } from "@/components/data";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { GateHeader } from "./GateHeader";
import { PlaneIcon } from "./CheckIn";
import { Carousel } from "./Carousel";

const BAG_COLOURS = ["#2f4f6f", "#7a2e2e", "#3c5a3a", "#5a4632", "#30343b", "#5b3f6b"];

const Bag = ({ link, i }: { link: (typeof contactLinks)[number]; i: number }) => (
  <a
    aria-hidden="true"
    tabIndex={-1}
    href={link.href}
    target={link.platform === "email" ? undefined : "_blank"}
    rel={link.platform === "email" ? undefined : "noopener noreferrer"}
    className="group relative flex w-44 shrink-0 flex-col items-center pt-4 focus-visible:outline-none"
  >
    {/* Handle. */}
    <span className="absolute top-0 h-5 w-14 rounded-t-lg border-[5px] border-b-0 border-[#a7adb6] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />
    <span
      className="relative flex h-24 w-full flex-col justify-end rounded-xl p-2 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5"
      style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 22%, transparent 45%, rgba(0,0,0,0.3) 100%), ${BAG_COLOURS[i % BAG_COLOURS.length]}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.3), 0 14px 22px -10px rgba(0,0,0,0.9)" }}
    >
      <span aria-hidden="true" className="absolute inset-x-3 top-3 h-px bg-white/15" />
      <span aria-hidden="true" className="absolute inset-x-3 top-5 h-px bg-black/20" />
      {/* Luggage tag. */}
      <span className="flex items-center gap-2 rounded-[3px] pass-stock px-2 py-1.5 text-[#1a1a1a] ring-2 ring-transparent transition group-hover:ring-sign group-focus-visible:ring-sign">
        <PlatformIcon platform={link.platform} className="h-4 w-4" />
        <span className="truncate font-mono text-[11px] font-bold">{link.platform === "email" ? "Email" : link.label}</span>
      </span>
    </span>
  </a>
);

export const Arrivals = () => {
  const [torn, setTorn] = useState(false);
  const email = contactLinks.find((l) => l.platform === "email")!;
  return (
    <section id="contact" className="scroll-mt-14 amb-arrivals border-t border-black pb-20 pt-10 md:pt-12">
      <div className="mx-auto max-w-[75rem] px-4 md:px-6">
        <GateHeader letter="F" en="Baggage claim" label="Contact & résumé" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          {/* Resume as a boarding pass with a tear-off stub. */}
          <div className="flex overflow-visible">
            <a href="#resume" className="group flex min-w-0 flex-1 flex-col rounded-l-lg pass-stock text-[#1a1a1a] elev-3">
              <div className="flex items-center justify-between rounded-tl-lg lightbox px-4 py-2 font-sign text-[11px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <PlaneIcon className="h-3.5 w-3.5 rotate-45" /> Résumé · Boarding pass
                </span>
                <span className="font-semibold opacity-60">PDF</span>
              </div>
              <div className="flex-1 p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/60">Passenger</div>
                <div className="font-sign text-2xl font-extrabold uppercase">{profile.name}</div>
                {/* Route, like the project passes: FROM/TO eyebrows, the code, a caption. */}
                <div className="mt-4 flex items-start gap-3">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/55">From</div>
                    <div className="font-sign text-3xl font-extrabold leading-none md:text-[32px]">YKF</div>
                    <div className="mt-1 text-[11.5px] text-black/60">Waterloo</div>
                  </div>
                  <span className="mt-[24px] flex min-w-[2rem] flex-1 items-center">
                    <span className="h-px flex-1 border-t border-dashed border-black/30" />
                    <PlaneIcon className="mx-1 h-4 w-4 rotate-90 text-black/60 transition-transform duration-500 group-hover:translate-x-2" />
                    <span className="h-px flex-1 border-t border-dashed border-black/30" />
                  </span>
                  <div className="max-w-[48%] text-right">
                    <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/55">To</div>
                    <div className="font-sign text-3xl font-extrabold leading-none md:text-[32px]">ANY</div>
                    <div className="mt-1 text-[11.5px] leading-tight text-black/60">open to relocation · Summer 2027</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-dashed border-black/15 pt-3 font-sign text-[13px] font-bold uppercase">
                  <div>
                    <div className="font-mono text-[9px] font-normal tracking-[0.18em] text-black/60">Class</div>Infra
                  </div>
                  <div>
                    <div className="font-mono text-[9px] font-normal tracking-[0.18em] text-black/60">Boards</div>Winter 2027
                  </div>
                  <div>
                    <div className="font-mono text-[9px] font-normal tracking-[0.18em] text-black/60">Seat</div>Open
                  </div>
                </div>
                <div className="mt-4 font-mono text-xs font-medium text-black/85 group-hover:text-black">View resume →</div>
              </div>
            </a>
            <div className="relative w-3 shrink-0 pass-stock">
              <span className="pass-perf absolute inset-y-2 left-1/2 w-[3px] -translate-x-1/2" />
            </div>
            <motion.a
              href={resumePath}
              download="Vivek-Jude-Manoj-Resume.pdf"
              onClick={() => setTorn(true)}
              animate={torn ? { rotate: 14, x: 18, y: 28, opacity: 0.4 } : { rotate: 0, x: 0, y: 0, opacity: 1 }}
              whileHover={torn ? undefined : { rotate: 4, x: 6 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              onAnimationComplete={() => torn && window.setTimeout(() => setTorn(false), 1600)}
              style={{ transformOrigin: "top left" }}
              className="flex w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-r-lg bg-pass-shade p-3 text-center text-[#1a1a1a] elev-3"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/60">Stub</span>
              <span className="text-2xl" aria-hidden="true">
                ↓
              </span>
              <span className="font-sign text-xs font-bold uppercase leading-tight">Tap to download</span>
            </motion.a>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-flap/70">Meeting point</p>
            <a href={email.href} className="mt-3 block break-all font-sign text-2xl font-bold text-flap transition hover:text-sign md:text-3xl">
              {email.label}
            </a>
            <p className="mt-3 text-base text-flap/70">Email is the best way to reach me. I&apos;m also on:</p>
            {/* Every link, once, in plain view. The carousel below is decoration. */}
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {contactLinks
                .filter((l) => l.platform !== "email")
                .map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-[3px] border border-white/10 bg-panel px-3 py-2.5 font-sign text-sm font-semibold text-flap transition hover:border-sign/60 hover:text-sign"
                    >
                      <PlatformIcon platform={l.platform} className="h-4 w-4 shrink-0" />
                      <span className="truncate">{l.label}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Baggage carousel. */}
      <div className="relative mt-16">
        <div className="mx-auto mb-3 flex max-w-[75rem] items-center gap-2 px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-flap/70 md:px-6">
          <span className="sign-letter h-5 w-5 rounded-[2px] text-[11px]">⧉</span> Links · Baggage claim
        </div>
        <Carousel count={contactLinks.length} renderBag={(i) => <Bag link={contactLinks[i]} i={i} />} />
      </div>

      <footer className="mx-auto mt-12 max-w-[75rem] px-4 text-center md:px-6">
        <p className="font-sign text-xl font-bold text-flap md:text-2xl">Thank you for flying with Vivek.</p>
      </footer>
    </section>
  );
};

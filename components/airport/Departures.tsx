"use client";

import React from "react";
import { roles } from "@/components/data";
import { flights } from "@/components/data/airport";
import { SplitFlap } from "./SplitFlap";
import { GateHeader } from "./GateHeader";
import { OrgLogo } from "@/components/ui/OrgLogo";

// Fixed column widths spread evenly across the board, so there are no big gaps.
// Phones: AIRLINE · DESTINATION · STATUS. Desktop: TIME · AIRLINE · FLIGHT · DESTINATION · GATE · STATUS.
const COLS = "grid-cols-[2.5rem_minmax(0,1fr)_5.4rem] md:grid-cols-[7.6rem_3.5rem_6.4rem_minmax(0,1fr)_3.6rem_9.4rem] md:gap-x-6";

/** Experience as a departures board. Each row opens that role's flight details. */
export const Departures = () => (
  <section id="experience" className="amb-hall scroll-mt-14 px-4 py-16 md:px-6 md:py-24">
    <div className="mx-auto max-w-6xl">
      <GateHeader letter="A" en="Departures" label="Experience" intro="Where I've worked. Select a flight for the full story." />

      <div className="board-frame metal rounded-lg p-2.5 md:p-3">
        <div className="mb-2 flex items-center justify-between px-2 pt-0.5"><span className="screw" /><span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink/70">Departures · Terminal VJM</span><span className="screw" /></div>
      <div className="device board-screen recessed overflow-hidden rounded-md bg-floor">
        <div className={`grid ${COLS} items-center gap-x-3 border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sign md:px-6`}>
          <span className="hidden md:block">Time</span>
          <span>
            <span className="hidden md:inline">Airline</span>
          </span>
          <span className="hidden md:block">Flight</span>
          <span>Destination</span>
          <span className="hidden md:block">Gate</span>
          <span className="text-right md:text-left">Status</span>
        </div>
        <ol>
          {roles.map((role, i) => {
            const f = flights[role.slug];
            if (!f) return null;
            const boarding = f.status === "BOARDING";
            const opens = role.stories.length > 0;
            const row = (
              <div className={`grid ${COLS} items-center gap-x-3 gap-y-2 text-[10px] min-[420px]:text-[11px] sm:text-[14px] md:text-[17px]`}>
                <span className="flap-sm hidden md:row-span-2 md:block md:self-center">
                  <SplitFlap text={f.time} length={7} delay={i * 120} />
                </span>
                {/* Airline: the company logo on a consistent rounded tile. */}
                <span className="row-span-2 flex items-center self-center">
                  <OrgLogo name={role.company} src={role.logo} className="h-10 w-10 rounded-[10px] p-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.5)] md:h-14 md:w-14 md:rounded-[12px] md:p-2" />
                  <span className="sr-only">{role.company}</span>
                </span>
                <span className="flap-sm hidden md:row-span-2 md:block md:self-center">
                  <SplitFlap text={f.flight} length={6} delay={i * 120 + 80} />
                </span>
                <span className="flap-sm min-w-0 overflow-hidden">
                  <SplitFlap text={f.dest} length={15} delay={i * 120 + 160} />
                </span>
                <span className="flap-sm hidden md:row-span-2 md:block md:self-center">
                  <SplitFlap text={f.gate} length={3} delay={i * 120 + 240} />
                </span>
                <span className={`flap-sm text-right md:row-span-2 md:self-center md:text-left ${boarding ? "board-blink" : ""}`}>
                  <SplitFlap text={f.status} length={8} delay={i * 120 + 300} cellClassName={boarding ? "!text-live" : "!text-ops"} />
                </span>
                {/* Plain-language line: role and term, under DESTINATION. */}
                <div className="col-span-2 col-start-2 flex flex-wrap items-center gap-x-2 text-sm text-flap/70 md:col-span-1 md:col-start-4">
                  <span>{role.shortTitle ?? role.title}</span>
                  <span aria-hidden="true">·</span>
                  <span>{role.dates}</span>
                  {opens && <span className="ml-auto font-mono text-xs text-sign opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">Flight details →</span>}
                </div>
              </div>
            );
            return (
              <li key={role.slug} className="border-b border-white/[0.06] last:border-b-0">
                {opens ? (
                  <a href={`#experience/${role.slug}`} className="group block px-4 py-4 transition hover:bg-white/[0.03] focus-visible:bg-white/[0.04] focus-visible:outline-none md:px-6">
                    {row}
                  </a>
                ) : (
                  <div className="bg-live/[0.04] px-4 py-4 md:px-6">{row}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      </div>
    </div>
  </section>
);

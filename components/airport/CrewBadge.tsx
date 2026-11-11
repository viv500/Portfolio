import React from "react";
import Image from "next/image";
import { PlaneIcon } from "./CheckIn";

// Barcode bars: fixed widths (1–3 px) so it renders the same on server and client.
const BARS = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2, 3];

/**
 * Airline crew ID badge with the headshot. The card's top is the layout box (so it lines up with
 * whatever sits beside it); the lanyard rises --hang px (the gap above the badge) to a small mount
 * on the panel above, without taking space. Slight tilt; it swings from that mount on hover
 * (static under reduced motion; see .badge-sway).
 */
export const CrewBadge = ({ className = "" }: { className?: string }) => (
  <div className={`badge-sway relative w-[150px] [--hang:56px] md:w-[187px] md:[--hang:48px] ${className}`}>
    {/* Lanyard: a mount under the panel above, the strap down to the card, and a metal clip. */}
    <span aria-hidden="true" className="absolute left-1/2 h-2 w-7 -translate-x-1/2 rounded-b-[3px] bg-gradient-to-b from-[#3a3f47] to-[#1d2026] shadow-[0_2px_3px_rgba(0,0,0,0.5)]" style={{ bottom: "calc(100% + var(--hang) - 8px)" }} />
    <span
      aria-hidden="true"
      className="absolute bottom-[calc(100%+6px)] left-1/2 w-4 -translate-x-1/2 bg-[repeating-linear-gradient(90deg,#1c2636_0_3px,#2b3a55_3px_6px)] shadow-[inset_0_-4px_6px_rgba(0,0,0,0.35)]"
      style={{ height: "calc(var(--hang) - 8px)" }}
    />
    <span aria-hidden="true" className="absolute -top-[9px] left-1/2 h-4 w-7 -translate-x-1/2 rounded-[4px] bg-gradient-to-b from-[#e9ebee] via-[#a9adb4] to-[#6f747c] shadow-[0_2px_3px_rgba(0,0,0,0.5)]" />
    <span aria-hidden="true" className="absolute left-1/2 top-[5px] z-10 h-2.5 w-2 -translate-x-1/2 rounded-b-sm bg-gradient-to-b from-[#a9adb4] to-[#6f747c]" />

    <div className="pass-stock w-full overflow-hidden rounded-xl text-[#1a1a1a] elev-3">
      <div className="lightbox relative flex items-center justify-center gap-1.5 px-2 pb-1.5 pt-3 font-sign text-[8.5px] font-bold uppercase tracking-[0.12em] md:text-[9.5px]">
        {/* Slot the clip goes through. */}
        <span aria-hidden="true" className="absolute left-1/2 top-1 h-1 w-6 -translate-x-1/2 rounded-full bg-black/50" />
        <PlaneIcon className="h-3 w-3 rotate-45" />
        VJ Air · Flight crew
      </div>
      <div className="px-2.5 pb-2.5 pt-2.5 md:px-3 md:pb-3">
        <div className="relative mx-auto aspect-[4/5] w-[80%] overflow-hidden rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.2)] ring-1 ring-black/15">
          <Image src="/media/crew/vivek-headshot.jpg" alt="Vivek Jude Manoj" fill sizes="(min-width: 768px) 150px, 120px" className="object-cover" />
        </div>
        <div className="mt-2 text-center font-sign text-[12px] font-extrabold uppercase leading-tight tracking-wide md:text-[13.5px]">Vivek Jude Manoj</div>
        <div className="mt-0.5 whitespace-nowrap text-center font-mono text-[6.5px] font-semibold uppercase tracking-[0.02em] text-black/65 md:text-[8px]">Captain · Infra &amp; Dev Tooling</div>
        <div className="mt-2 flex items-end justify-between gap-2 border-t border-dashed border-black/20 pt-1.5">
          <div aria-hidden="true" className="flex h-5 items-stretch gap-[1px] md:h-6">
            {BARS.map((w, i) => (
              <span key={i} className="bg-black/80" style={{ width: w }} />
            ))}
          </div>
          <div className="text-right font-mono leading-tight">
            <div className="text-[6.5px] uppercase tracking-[0.15em] text-black/55 md:text-[7px]">Crew ID</div>
            <div className="text-[10px] font-bold md:text-[11px]">VJM-127</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

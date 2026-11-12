"use client";

import React, { useState } from "react";
import { roles, type Role } from "@/components/data";
import { flights, type Flight } from "@/components/data/airport";
import { GateHeader } from "./GateHeader";
import { OrgLogo } from "@/components/ui/OrgLogo";

// Experience as a pilot's logbook, open on the flight deck.
// Large screens: an open spread. Each page is its own sheet, tilted a couple of degrees into the
// spine (a flat 3D tilt, so the text is never warped), with a deep, soft gutter shadow and the
// paper dimming slightly towards the spine. Rows have a fixed height so they line up across the
// fold. Left page: DATE · AIRCRAFT · ROLE. Right page: BASE · TERM · REMARKS · STATUS.
// Smaller screens: a single page, one block per entry.
// Table text stays in the regular fonts; only the stamps and the signature are "by hand".

const CITY: Record<string, string> = { YYZ: "Toronto", YKF: "Waterloo", DTW: "Detroit" };
const base = (gate: string) => (gate === "RMT" ? "Remote" : gate);
/** "JAN '27" → "Jan '27". */
const date = (t: string) => t.charAt(0) + t.slice(1, 3).toLowerCase() + t.slice(3);
const company = (role: Role) => role.company.replace("UW Computer Science Club", "UW CS Club");

// Column templates for each page, so header and rows line up.
const LEFT = "grid-cols-[3.8rem_10.5rem_minmax(0,1fr)]";
const RIGHT = "grid-cols-[4rem_6.6rem_minmax(0,1fr)_6.6rem]";
const RULE = "border-b border-[#9db4cf]/60"; // blue ruled lines
const ROW_H = "h-[88px] xl:h-[80px]"; // fixed, so both pages' rows line up (roles wrap more below xl)
const HEAD = "font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1c2636]";

const Stamp = ({ next }: { next: boolean }) => (
  <span
    className={`ink inline-block -rotate-6 rounded-[3px] border-2 px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${next ? "border-[#b8322a] text-[#b8322a]" : "border-[#2b4c9b] text-[#2b4c9b]"}`}
  >
    {next ? "Next" : "Completed"}
  </span>
);

/** Airport code with the city in a small tooltip on hover (and for screen readers). */
const Base = ({ gate }: { gate: string }) => {
  const code = base(gate);
  const city = CITY[gate];
  if (!city) return <span className="font-mono text-[12px]">{code}</span>;
  return (
    <span className="group/base relative inline-block font-mono text-[12px]">
      <abbr className="cursor-help no-underline decoration-dotted underline-offset-2 group-hover/base:underline">{code}</abbr>
      <span className="sr-only"> ({city})</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-[#1c2636] px-2 py-1 font-sign text-[11px] font-semibold normal-case text-white opacity-0 shadow-md transition-opacity group-hover/base:opacity-100"
      >
        {city}
      </span>
    </span>
  );
};

/** Hover hint, hung just under the role so it doesn't push the role off-centre. */
const Details = ({ show }: { show: boolean }) => (
  <span className={`absolute left-0 top-full mt-0.5 whitespace-nowrap font-mono text-[11px] leading-none text-[#2b4c9b] transition-opacity ${show ? "opacity-100" : "opacity-0"}`}>Flight details →</span>
);

// ── Large screens: the spread ─────────────────────────────────────────────

type Row = { role: Role; f: Flight; opens: boolean; next: boolean };

const Spread = ({ rows }: { rows: Row[] }) => {
  // Each entry spans both pages; hovering either half highlights (and opens) the whole line.
  const [hover, setHover] = useState<string | null>(null);
  const lineProps = (r: Row) => ({
    onMouseEnter: () => setHover(r.role.slug),
    onMouseLeave: () => setHover((h) => (h === r.role.slug ? null : h)),
  });
  const lit = (r: Row) => (r.opens && hover === r.role.slug ? "bg-[#2b4c9b]/[0.06]" : "");
  const page = "logbook-paper relative flex flex-col pb-8 pt-7";

  return (
    <div className="logbook-cover relative hidden rounded-lg p-2.5 elev-4 lg:block" style={{ perspective: 2200 }}>
      <div className="relative flex">
        {/* Left page: tilted into the spine (its outer edge rises towards you). */}
        <div className={`${page} page-curve-left w-1/2 rounded-l-md`} style={{ transform: "rotateY(2deg)", transformOrigin: "right center" }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[1.4rem] w-px bg-[#c0504d]/40" />
          <div className="pl-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1c2636]/70">Pilot&apos;s logbook · VJM</div>
          <div className={`mt-4 grid ${LEFT} items-center gap-x-4 border-y-2 border-[#1c2636]/70 py-2 pl-8 pr-10 ${HEAD}`}>
            <span>Date</span>
            <span>Aircraft</span>
            <span>Role</span>
          </div>
          <ol>
            {rows.map((r) => {
              const cells = (
                <div className={`grid ${LEFT} ${ROW_H} items-center gap-x-4 pl-8 pr-10 text-[14px]`}>
                  <span className="font-mono text-[12px] text-black/70">{date(r.f.time)}</span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <OrgLogo name={r.role.company} src={r.role.logo} className="h-8 w-8 shrink-0 rounded-[7px] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
                    <span className="truncate font-semibold">{company(r.role)}</span>
                  </span>
                  <span className="relative min-w-0 leading-snug">
                    <span className="block">{r.role.shortTitle ?? r.role.title}</span>
                    {r.opens && <Details show={hover === r.role.slug} />}
                  </span>
                </div>
              );
              return (
                <li key={r.role.slug} className={`${RULE} transition-colors ${lit(r)}`} {...lineProps(r)}>
                  {r.opens ? (
                    <a href={`#experience/${r.role.slug}`} className="block focus-visible:bg-[#2b4c9b]/[0.07] focus-visible:outline-none" onFocus={() => setHover(r.role.slug)} onBlur={() => setHover(null)}>
                      {cells}
                    </a>
                  ) : (
                    cells
                  )}
                </li>
              );
            })}
          </ol>
          <div className="mt-auto pl-8 pr-10 pt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-black/60">Totals carried forward · {rows.length} entries</div>
          {/* Paper dims slightly towards the spine. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-[linear-gradient(270deg,rgba(70,45,20,0.16),transparent)]" />
        </div>

        {/* Right page: tilted the other way. */}
        <div className={`${page} page-curve-right w-1/2 rounded-r-md`} style={{ transform: "rotateY(-2deg)", transformOrigin: "left center" }}>
          <div className="pr-8 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-[#1c2636]/70">Page 01</div>
          <div className={`mt-4 grid ${RIGHT} items-center gap-x-4 border-y-2 border-[#1c2636]/70 py-2 pl-10 pr-8 ${HEAD}`}>
            <span>Base</span>
            <span>Term</span>
            <span>Remarks</span>
            <span>Status</span>
          </div>
          <ol>
            {rows.map((r) => (
              <li
                key={r.role.slug}
                className={`${RULE} transition-colors ${lit(r)} ${r.opens ? "cursor-pointer" : ""}`}
                {...lineProps(r)}
                // The left half is the real link (keyboard and screen readers); this half just mirrors it for the mouse.
                onClick={r.opens ? () => (window.location.hash = `experience/${r.role.slug}`) : undefined}
              >
                <div className={`grid ${RIGHT} ${ROW_H} items-center gap-x-4 pl-10 pr-8 text-[14px]`}>
                  <span>
                    <Base gate={r.f.gate} />
                  </span>
                  <span className="text-black/75">{r.role.dates}</span>
                  <span className="text-black/75">{r.f.remarks}</span>
                  <span>
                    <Stamp next={r.next} />
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex items-end justify-between gap-3 pl-10 pr-8 pt-5">
            <span className="text-[11px] leading-tight text-black/60">I certify that the entries in this log are true.</span>
            <span className="shrink-0 -rotate-2 border-b border-black/40 px-2 font-hand text-[26px] leading-none text-[#1f3f8a]">V. J. Manoj</span>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-[linear-gradient(90deg,rgba(70,45,20,0.16),transparent)]" />
        </div>

        {/* Gutter: a deep, soft shadow where the pages meet the spine. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-28 -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(50,30,12,0.10)_30%,rgba(40,24,10,0.30)_47%,rgba(30,18,8,0.42)_50%,rgba(40,24,10,0.30)_53%,rgba(50,30,12,0.10)_70%,transparent_100%)]"
        />
      </div>
    </div>
  );
};

// ── Smaller screens: one page ─────────────────────────────────────────────

const Page = ({ rows }: { rows: Row[] }) => (
  <div className="logbook-cover relative rounded-lg p-2 elev-4 lg:hidden">
    <div className="logbook-paper relative overflow-hidden rounded-md pb-6 pt-5">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2 w-px bg-[#c0504d]/40" />
      <div className="flex justify-between px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1c2636]/70">
        <span>Logbook · VJM</span>
        <span>01</span>
      </div>
      <div className="mt-3 border-t-2 border-[#1c2636]/70" />
      <ol>
        {rows.map((r) => {
          const body = (
            <div className="flex items-start gap-3">
              <OrgLogo name={r.role.company} src={r.role.logo} className="mt-0.5 h-9 w-9 shrink-0 rounded-[8px] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-semibold">{company(r.role)}</span>
                  <span className="shrink-0 font-mono text-[11px] text-black/60">{date(r.f.time)}</span>
                </div>
                <div className="text-[14px] leading-snug text-black/80">{r.role.shortTitle ?? r.role.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[12px] text-black/60">
                  <span>{r.role.dates}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{base(r.f.gate)}{CITY[r.f.gate] ? ` (${CITY[r.f.gate]})` : ""}</span>
                  <span aria-hidden="true">·</span>
                  <span>{r.f.remarks}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Stamp next={r.next} />
                  {r.opens && <span className="font-mono text-[11px] text-[#2b4c9b]">Flight details →</span>}
                </div>
              </div>
            </div>
          );
          return (
            <li key={r.role.slug} className={RULE}>
              {r.opens ? (
                <a href={`#experience/${r.role.slug}`} className="block px-4 py-3 transition hover:bg-[#2b4c9b]/[0.05] focus-visible:bg-[#2b4c9b]/[0.07] focus-visible:outline-none">
                  {body}
                </a>
              ) : (
                <div className="px-4 py-3">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-5 grid gap-4 px-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-black/60">Totals carried forward · {rows.length} entries</div>
        <div className="flex items-end justify-between gap-3">
          <span className="text-[11px] leading-tight text-black/60">I certify that the entries in this log are true.</span>
          <span className="shrink-0 -rotate-2 border-b border-black/40 px-2 font-hand text-[26px] leading-none text-[#1f3f8a]">V. J. Manoj</span>
        </div>
      </div>
    </div>
  </div>
);

export const FlightLog = () => {
  const rows: Row[] = roles
    .filter((r) => flights[r.slug])
    .map((role) => {
      const f = flights[role.slug];
      return { role, f, opens: role.stories.length > 0, next: f.status === "BOARDING" };
    });
  return (
    <section id="experience" className="amb-cockpit scroll-mt-14 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <GateHeader letter="A" en="Pilot's logbook" label="Experience" intro="Where I've worked." hint="Select an entry for the full story" />
        <Spread rows={rows} />
        <Page rows={rows} />
      </div>
    </section>
  );
};

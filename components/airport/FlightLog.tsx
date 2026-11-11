"use client";

import React from "react";
import { roles, type Role } from "@/components/data";
import { flights, type Flight } from "@/components/data/airport";
import { GateHeader } from "./GateHeader";
import { OrgLogo } from "@/components/ui/OrgLogo";

// Experience as a pilot's logbook, open on the flight deck: a paper spread with ruled columns.
// Left page: DATE · AIRCRAFT · ROLE. Right page: ROUTE · TERM · REMARKS · STATUS. (Role sits on the
// wider left page so it can wrap instead of truncating.)
// Table text stays in the regular fonts; only the stamps and the signature are "by hand".

const HOME = "YKF";
const route = (gate: string) => (gate === "RMT" ? "RMT" : `${HOME} → ${gate}`);
/** "JAN '27" → "Jan '27". */
const date = (t: string) => t.charAt(0) + t.slice(1, 3).toLowerCase() + t.slice(3);

// Column templates for each page, so header and rows line up.
const LEFT = "grid-cols-[3.8rem_10.5rem_minmax(0,1fr)]";
const RIGHT = "grid-cols-[6.2rem_6.6rem_minmax(0,1fr)_6.6rem]";
const RULE = "border-b border-[#9db4cf]/60"; // blue ruled lines

const Stamp = ({ next }: { next: boolean }) => (
  <span
    className={`ink inline-block -rotate-6 rounded-[3px] border-2 px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${next ? "border-[#b8322a] text-[#b8322a]" : "border-[#2b4c9b] text-[#2b4c9b]"}`}
  >
    {next ? "Next" : "Completed"}
  </span>
);

const company = (role: Role) => role.company.replace("UW Computer Science Club", "UW CS Club");

const Aircraft = ({ role }: { role: Role }) => (
  <span className="flex min-w-0 items-center gap-2.5">
    <OrgLogo name={role.company} src={role.logo} className="h-8 w-8 shrink-0 rounded-[7px] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
    <span className="truncate font-semibold">{company(role)}</span>
  </span>
);

const Entry = ({ role, f }: { role: Role; f: Flight }) => {
  const next = f.status === "BOARDING";
  const opens = role.stories.length > 0;
  const details = opens && (
    <span className="whitespace-nowrap font-mono text-[11px] text-[#2b4c9b] opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">Flight details →</span>
  );
  const body = (
    <>
      {/* Phones: one page, one entry per block. */}
      <div className="flex items-start gap-3 md:hidden">
        <OrgLogo name={role.company} src={role.logo} className="mt-0.5 h-9 w-9 shrink-0 rounded-[8px] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate font-semibold">{company(role)}</span>
            <span className="shrink-0 font-mono text-[11px] text-black/60">{date(f.time)}</span>
          </div>
          <div className="text-[14px] leading-snug text-black/80">{role.shortTitle ?? role.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[12px] text-black/60">
            <span>{role.dates}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{route(f.gate)}</span>
            <span aria-hidden="true">·</span>
            <span>{f.remarks}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Stamp next={next} />
            {details}
          </div>
        </div>
      </div>

      {/* Desktop: one ruled line across the spread, split at the fold. */}
      <div className="hidden grid-cols-2 items-center text-[14px] md:grid">
        <div className={`grid ${LEFT} items-center gap-x-4 pr-10`}>
          <span className="font-mono text-[12px] text-black/70">{date(f.time)}</span>
          <Aircraft role={role} />
          <span className="min-w-0 leading-snug">
            <span className="block">{role.shortTitle ?? role.title}</span>
            {details}
          </span>
        </div>
        <div className={`grid ${RIGHT} items-center gap-x-4 pl-10`}>
          <span className="font-mono text-[12px]">{route(f.gate)}</span>
          <span className="text-black/75">{role.dates}</span>
          <span className="text-black/75">{f.remarks}</span>
          <span>
            <Stamp next={next} />
          </span>
        </div>
      </div>
    </>
  );
  return (
    <li className={RULE}>
      {opens ? (
        <a href={`#experience/${role.slug}`} className="group block px-4 py-3 transition hover:bg-[#2b4c9b]/[0.05] focus-visible:bg-[#2b4c9b]/[0.07] focus-visible:outline-none md:px-8">
          {body}
        </a>
      ) : (
        <div className="px-4 py-3 md:px-8">{body}</div>
      )}
    </li>
  );
};

export const FlightLog = () => {
  const entries = roles.filter((r) => flights[r.slug]);
  return (
    <section id="experience" className="amb-cockpit scroll-mt-14 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <GateHeader letter="A" en="Pilot's logbook" label="Experience" intro="Where I've worked. Select an entry for the full story." />

        <div className="logbook-cover relative rounded-lg p-2 elev-4 md:p-2.5">
          <div className="logbook-paper spread-curve relative overflow-hidden rounded-md pb-6 pt-5 md:pb-8 md:pt-7">
            {/* Centre fold. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-24 -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(60,40,20,0.08)_40%,rgba(60,40,20,0.22)_50%,rgba(60,40,20,0.08)_60%,transparent_100%)] md:block" />
            {/* Red margin rule on the left page. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2 w-px bg-[#c0504d]/40 md:left-[1.4rem]" />

            {/* Page heads. */}
            <div className="grid grid-cols-2 px-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#1c2636]/70 md:px-8">
              <span>
                <span className="hidden sm:inline">Pilot&apos;s </span>Logbook · VJM
              </span>
              <span className="text-right md:pl-10">
                <span className="hidden md:inline">Page </span>01
              </span>
            </div>

            {/* Column heads (desktop). */}
            <div className={`mt-4 hidden grid-cols-2 border-y-2 border-[#1c2636]/70 px-8 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1c2636] md:grid`}>
              <div className={`grid ${LEFT} gap-x-4 pr-10`}>
                <span>Date</span>
                <span>Aircraft</span>
                <span>Role</span>
              </div>
              <div className={`grid ${RIGHT} gap-x-4 pl-10`}>
                <span>Route</span>
                <span>Term</span>
                <span>Remarks</span>
                <span>Status</span>
              </div>
            </div>
            <div className="mt-3 border-t-2 border-[#1c2636]/70 md:hidden" />

            <ol>
              {entries.map((role) => (
                <Entry key={role.slug} role={role} f={flights[role.slug]} />
              ))}
            </ol>

            {/* Totals and the pilot's signature. */}
            <div className="mt-5 grid gap-4 px-4 md:grid-cols-2 md:px-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-black/60 md:pr-10">
                Totals carried forward · {entries.length} entries
              </div>
              <div className="flex items-end justify-between gap-3 md:pl-10">
                <span className="text-[11px] leading-tight text-black/60">I certify that the entries in this log are true.</span>
                <span className="shrink-0 border-b border-black/40 px-2 font-hand text-[26px] leading-none text-[#1f3f8a] -rotate-2">V. J. Manoj</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";

import React from "react";
import { roles, type Role } from "@/components/data";
import { flights, type Flight } from "@/components/data/airport";
import { GateHeader } from "./GateHeader";
import { OrgLogo } from "@/components/ui/OrgLogo";

// Experience, framed as a pilot's logbook: the navy binding, ruled paper, header and signature are
// the theme; the entries themselves are plain, readable cards. Each card shows logo + company,
// the full role, term, base, two key technologies and a status stamp, and opens the existing
// flight-details drawer. Desktop lays the card out in columns; phones stack it.

const CITY: Record<string, string> = { YYZ: "Toronto", YKF: "Waterloo", DTW: "Detroit" };
const company = (role: Role) => role.company.replace("UW Computer Science Club", "UW CS Club");

/** Desktop columns, shared by the header row and every entry so they line up. */
const COLS = "md:grid-cols-[15rem_minmax(0,1fr)_7.5rem_6rem]";

const Stamp = ({ next }: { next: boolean }) => (
  <span
    className={`ink inline-block -rotate-6 rounded-[3px] border-2 px-1.5 py-px font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${next ? "border-[#b8322a] text-[#b8322a]" : "border-[#2b4c9b] text-[#2b4c9b]"}`}
  >
    {next ? "Next" : "Completed"}
  </span>
);

/** Airport code; the city shows in a small tooltip on desktop and in brackets on phones. */
const Base = ({ gate }: { gate: string }) => {
  if (gate === "RMT") return <span>Remote</span>;
  const city = CITY[gate];
  return (
    <span className="group/base relative inline-block">
      <abbr className="cursor-help font-mono no-underline decoration-dotted underline-offset-2 group-hover/base:underline">{gate}</abbr>
      <span className="md:sr-only"> ({city})</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-[#1c2636] px-2 py-1 font-sign text-[11px] font-semibold text-white opacity-0 shadow-md transition-opacity group-hover/base:opacity-100 md:block"
      >
        {city}
      </span>
    </span>
  );
};


const Entry = ({ role, f, n }: { role: Role; f: Flight; n: number }) => {
  const next = f.status === "BOARDING";
  const opens = role.stories.length > 0;
  const body = (
    <div className={`grid grid-cols-2 items-center gap-x-5 gap-y-2.5 ${COLS}`}>
      {/* Logo, company, and term · base under it. */}
      <div className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
        <OrgLogo name={role.company} src={role.logo} className="h-9 w-9 shrink-0 rounded-[8px] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
        <div className="min-w-0">
          <div className="font-sign text-[15px] font-bold leading-tight text-[#1a1a1a]">{company(role)}</div>
          <div className="mt-0.5 text-[12.5px] text-black/65">
            {role.dates} · <Base gate={f.gate} />
          </div>
        </div>
      </div>
      {/* Full role, then the two key technologies. */}
      <div className="col-span-2 min-w-0 md:col-span-1">
        <div className="text-[14px] leading-snug text-[#1a1a1a]">{role.shortTitle ?? role.title}</div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {f.remarks.split(" · ").map((t) => (
            <span key={t} className="rounded-[3px] border border-[#1c2636]/20 bg-white/50 px-1.5 py-px font-mono text-[11px] text-[#1c2636]/85">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div>
        <Stamp next={next} />
      </div>
      <div className="text-right">
        {opens ? (
          <span className="details-btn inline-flex items-center rounded-[5px] border border-[#8a5f14]/70 px-2.5 py-1 font-mono text-[11.5px] font-bold text-[#6b4510] transition-colors">Details →</span>
        ) : (
          <span className="font-mono text-[11px] text-black/50">Starts W27</span>
        )}
      </div>
    </div>
  );
  // Entry number, in the gutter left of the margin rule.
  const num = (
    <span aria-hidden="true" className="absolute -left-7 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#8a6a4a]/70 md:-left-10">
      {String(n).padStart(2, "0")}
    </span>
  );
  return (
    <li className="relative">
      {num}
      {opens ? (
        // Highlighter-style hover: a warm fill across the row, a 3px gold left edge, and a brighter "Details →".
        <a
          href={`#experience/${role.slug}`}
          className="ledger-row group block cursor-pointer rounded-[6px] border border-[rgba(110,70,30,0.2)] bg-[rgb(250_244_230)] px-4 py-2 md:px-5"
          aria-label={`${company(role)}: ${role.shortTitle ?? role.title}, ${role.dates}. Details`}
        >
          {body}
        </a>
      ) : (
        <div className="rounded-[6px] border border-dashed border-[rgba(110,70,30,0.3)] bg-[rgb(246_238_220)] px-4 py-2 md:px-5">{body}</div>
      )}
    </li>
  );
};

export const FlightLog = () => {
  const entries = roles.filter((r) => flights[r.slug]);
  return (
    <section id="experience" className="amb-cockpit scroll-mt-14 px-4 py-10 md:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <GateHeader letter="A" en="Pilot's logbook" label="Experience" intro="Where I've worked." hint="Select an entry for the full story" />

        <div className="logbook-cover relative rounded-lg p-2 elev-4 md:p-2.5">
          {/* The page: a gutter, a double red margin rule, then the ledger. */}
          <div className="logbook-paper logbook-deep logbook-ruled on-paper relative rounded-md pb-4 pl-9 pr-3 pt-4 md:pb-4 md:pl-14 md:pr-6 md:pt-4">
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-7 w-[5px] border-x border-[rgba(192,80,77,0.45)] md:left-11" />
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#1c2636]/70">
              <span>Pilot&apos;s logbook · VJM</span>
              <span>Page 01</span>
            </div>

            <div className="relative mt-3">
              {/* Faint vertical column dividers, header to the last ruled line (desktop). */}
              <div aria-hidden="true" className={`pointer-events-none absolute inset-0 hidden gap-x-5 px-5 md:grid ${COLS}`}>
                <span />
                <span className="-ml-2.5 border-l border-[rgba(110,70,30,0.12)]" />
                <span className="-ml-2.5 border-l border-[rgba(110,70,30,0.12)]" />
                <span className="-ml-2.5 border-l border-[rgba(110,70,30,0.12)]" />
              </div>
              {/* Column labels (desktop). */}
              <div className={`hidden gap-x-5 border-y-2 border-[#1c2636]/70 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1c2636] md:grid ${COLS}`}>
                <span>Aircraft · Term · Base</span>
                <span>Role · Key tech</span>
                <span>Status</span>
                <span className="text-right">Details</span>
              </div>
              <div className="border-t-2 border-[#1c2636]/70 md:hidden" />
              <ol className="mt-1.5 grid gap-1.5">
                {entries.map((role, i) => (
                  <Entry key={role.slug} role={role} f={flights[role.slug]} n={i + 1} />
                ))}
              </ol>
            </div>

            {/* Totals and the pilot's signature. */}
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-black/60">Totals carried forward · {entries.length} entries</span>
              <span className="flex items-end gap-3">
                <span className="text-[11px] leading-tight text-black/60">I certify that the entries in this log are true.</span>
                <span className="shrink-0 -rotate-2 border-b border-black/40 px-2 font-hand text-[26px] leading-none text-[#1f3f8a]">V. J. Manoj</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

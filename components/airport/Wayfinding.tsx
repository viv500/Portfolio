"use client";

import React, { useEffect, useState } from "react";

export const GATES = [
  { id: "experience", letter: "A", label: "Departures", hint: "Experience" },
  { id: "ops", letter: "B", label: "Flight Deck", hint: "Impact" },
  { id: "projects", letter: "C", label: "Gates", hint: "Projects" },
  { id: "hackathons", letter: "D", label: "Passport Control", hint: "Hackathons" },
  { id: "about", letter: "E", label: "Passport", hint: "About" },
  { id: "contact", letter: "F", label: "Arrivals", hint: "Contact" },
] as const;

/** Sticky black-on-yellow airport sign that doubles as the page navigation. */
export const Wayfinding = () => {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = GATES.map((g) => document.getElementById(g.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className="lightbox sticky top-0 z-40 border-b border-black/50 !shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-2px_0_rgba(0,0,0,0.2),0_10px_24px_-10px_rgba(0,0,0,0.9)]">
      <ul className="mx-auto flex max-w-6xl overflow-x-auto px-2 font-sign text-[13px] font-bold text-sign-ink [scrollbar-width:none] md:px-4">
        {GATES.map((gate) => {
          const on = active === gate.id;
          return (
            <li key={gate.id} className="shrink-0">
              <a
                href={`#${gate.id}`}
                aria-current={on ? "location" : undefined}
                className={`flex items-center gap-2 px-3 py-2.5 transition-colors ${on ? "sign-letter !font-bold" : "hover:bg-black/10"}`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-[2px] text-[11px] ${on ? "lightbox" : "sign-letter"}`}>
                  {gate.letter}
                </span>
                {gate.label}
                <span className={`hidden font-semibold lg:inline ${on ? "text-sign/60" : "text-black/60"}`}>{gate.hint}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

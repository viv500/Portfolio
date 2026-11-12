import React from "react";

/**
 * Section header. The plain-language name (`label`) is the heading; the themed name (`en`) with
 * its gate letter is a small eyebrow label above it.
 */
export const GateHeader = ({
  letter,
  en,
  label,
  intro,
  hint,
  tone = "dark",
}: {
  letter: string;
  en: string;
  label: string;
  intro?: string;
  /** Interaction hint, shown on its own line in gold with a pointer icon. */
  hint?: string;
  tone?: "dark" | "light";
}) => (
  <div className="mb-8 md:mb-10">
    <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-sign">
      <span aria-hidden="true" className="sign-letter flex h-[18px] w-[18px] items-center justify-center rounded-[2px] text-[10px]">{letter}</span>
      {en}
    </p>
    <h2 className={`mt-2 font-sign text-3xl font-extrabold tracking-tight md:text-[44px] md:leading-[1.1] ${tone === "dark" ? "text-flap" : "text-black"}`}>{label}</h2>
    {intro && <p className={`section-sub mt-3 max-w-[65ch] text-[1.1rem] font-normal leading-relaxed ${tone === "light" ? "!text-black/80" : ""}`}>{intro}</p>}
    {hint && (
      <p className="mt-1.5 flex max-w-[65ch] items-center gap-2 text-[0.95rem] font-medium text-sign">
        <PointerIcon />
        {hint}
      </p>
    )}
  </div>
);

/** A small line-drawn pointing hand. */
const PointerIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 14a8 8 0 0 1-8 8" />
    <path d="M18 11v-1a2 2 0 0 0-4 0" />
    <path d="M14 10V9a2 2 0 0 0-4 0v1" />
    <path d="M10 9.5V4a2 2 0 0 0-4 0v10" />
    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  </svg>
);

export const Runway = () => <div aria-hidden="true" className="runway-line mx-auto my-0 max-w-6xl opacity-60" />;

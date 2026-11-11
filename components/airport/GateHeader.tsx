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
  tone = "dark",
}: {
  letter: string;
  en: string;
  label: string;
  intro?: string;
  tone?: "dark" | "light";
}) => (
  <div className="mb-8 md:mb-10">
    <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-sign">
      <span aria-hidden="true" className="sign-letter flex h-[18px] w-[18px] items-center justify-center rounded-[2px] text-[10px]">{letter}</span>
      {en}
    </p>
    <h2 className={`mt-2 font-sign text-3xl font-extrabold tracking-tight md:text-[44px] md:leading-[1.1] ${tone === "dark" ? "text-flap" : "text-black"}`}>{label}</h2>
    {intro && <p className={`mt-3 max-w-4xl text-base leading-relaxed ${tone === "dark" ? "text-flap/80" : "text-black/75"}`}>{intro}</p>}
  </div>
);

export const Runway = () => <div aria-hidden="true" className="runway-line mx-auto my-0 max-w-6xl opacity-60" />;

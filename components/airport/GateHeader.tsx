import React from "react";

/**
 * Section header. The plain-language name (`label`) is the heading; the airport sign above it
 * (letter plate + themed name, `en`) is a small, secondary flourish.
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
    <div className="sign-housing inline-flex opacity-80">
      <div className="inline-flex items-stretch overflow-hidden rounded-[3px] font-sign text-xs font-bold md:text-[13px]">
        <span className="sign-letter w-6 md:w-7">{letter}</span>
        <span className="sign-plate px-2.5 py-1">{en}</span>
      </div>
    </div>
    <h2 className={`mt-3 font-sign text-3xl font-extrabold tracking-tight md:text-[44px] md:leading-[1.1] ${tone === "dark" ? "text-flap" : "text-black"}`}>{label}</h2>
    {intro && <p className={`mt-3 max-w-4xl text-base leading-relaxed ${tone === "dark" ? "text-flap/80" : "text-black/75"}`}>{intro}</p>}
  </div>
);

export const Runway = () => <div aria-hidden="true" className="runway-line mx-auto my-0 max-w-6xl opacity-60" />;

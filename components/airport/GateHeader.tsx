import React from "react";

/** Section header styled as an overhead gate sign: letter plate, sign text, plain-language label. */
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
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="sign-housing inline-flex"><div className="inline-flex items-stretch overflow-hidden rounded-[3px] font-sign font-bold">
        <span className="sign-letter w-11 text-xl md:w-12 md:text-2xl">{letter}</span>
        <span className="sign-plate px-4 py-2 text-xl md:text-2xl">{en}</span>
      </div></div>
      <span className={`font-mono text-xs uppercase tracking-[0.25em] ${tone === "dark" ? "text-flap/70" : "text-black/60"}`}>{label}</span>
    </div>
    {intro && <p className={`mt-4 max-w-4xl text-base leading-relaxed ${tone === "dark" ? "text-flap/80" : "text-black/75"}`}>{intro}</p>}
  </div>
);

export const Runway = () => <div aria-hidden="true" className="runway-line mx-auto my-0 max-w-6xl opacity-60" />;

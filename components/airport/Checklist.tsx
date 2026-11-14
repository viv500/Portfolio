import React from "react";
import { techGroups } from "@/components/data";

// The tech stack as a pilot's checklist card on a clipboard, like the NORMAL CHECKLIST cards on
// the yokes: cream paper (in both themes), a brushed-metal clip, one row per group with a dotted
// leader to its items. Each item is the tool's own logo, unaltered (sources in
// public/logos/tech/SOURCES.md), and its name. Nothing here is interactive.

const LOGO: Record<string, string> = {
  AWS: "amazonwebservices",
  Azure: "azure",
  Docker: "docker",
  Kubernetes: "kubernetes",
  Terraform: "terraform",
  Linux: "linux",
  "GitHub Actions": "githubactions",
  Jenkins: "jenkins",
  Bazel: "bazel",
  OpenTelemetry: "opentelemetry",
  Prometheus: "prometheus",
  Go: "go",
  Python: "python",
  Java: "java",
  "C/C++": "cplusplus",
  TypeScript: "typescript",
  Rust: "rust",
  GraphQL: "graphql",
  React: "react",
  "Next.js": "nextjs",
  Flask: "flask",
  PostgreSQL: "postgresql",
  Redis: "redis",
  PyTorch: "pytorch",
  "scikit-learn": "scikitlearn",
  "LLM agents (MCP)": "mcp",
};

/** No official logo: a small neutral monogram badge instead. */
const Monogram = ({ name }: { name: string }) => (
  <span aria-hidden="true" className="inline-flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-[4px] border border-[#6b5a45]/40 bg-[#e9dcc4] px-1 font-sign text-[9px] font-bold leading-none text-[#4a3a28]">
    {name.split("/")[0].slice(0, 4)}
  </span>
);

const Clip = () => (
  <div aria-hidden="true" className="relative z-10 mx-auto -mb-4 h-8 w-40 max-w-[60%]">
    {/* Slim brushed-metal clip: a lit top edge, two screws, and the hinge roll under it. */}
    <div className="absolute inset-x-0 top-0 h-6 rounded-[6px] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_3px),linear-gradient(180deg,#f4f5f7_0%,#c5c9cf_35%,#959ba3_75%,#7c828b_100%)] ring-1 ring-black/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(0,0,0,0.3),0_4px_8px_-3px_rgba(0,0,0,0.55)]" />
    <span className="absolute left-3 top-[7px] h-2 w-2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#9aa0a8_60%,#5d636b)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]" />
    <span className="absolute right-3 top-[7px] h-2 w-2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#9aa0a8_60%,#5d636b)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35)]" />
    <span className="absolute inset-x-8 bottom-0 h-2.5 rounded-b-[5px] bg-gradient-to-b from-[#b3b8bf] to-[#6f747c] shadow-[0_2px_4px_-1px_rgba(0,0,0,0.5)]" />
  </div>
);

export const SystemsChecklist = () => (
  <div className="relative">
    <Clip />
    <div className="logbook-paper relative rounded-lg px-4 pb-4 pt-8 text-[#23201b] shadow-[0_16px_30px_-16px_rgba(0,0,0,0.6),0_2px_6px_rgba(60,40,20,0.18)] md:px-8 md:pb-5 md:pt-9">
      {/* Faint paper grain. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg bg-[repeating-linear-gradient(115deg,rgba(120,80,40,0.035)_0_1px,transparent_1px_7px)]" />
      <div className="relative flex items-baseline justify-between border-b border-[#6b5a45]/40 pb-2 font-mono text-[12px] font-bold uppercase tracking-[0.18em]">
        <span>Systems checklist</span>
        <span className="text-[10px] font-semibold tracking-[0.15em] text-black/50">Stack · Complete</span>
      </div>
      <ul className="relative">
        {techGroups.map((g) => (
          <li key={g.name} className="border-b border-dashed border-[#6b5a45]/20 py-4 last:border-b-0 md:flex md:items-center md:gap-3">
            {/* Group name, then a short dotted leader (desktop). */}
            <div className="flex shrink-0 items-center gap-2 md:w-[17.5rem]">
              <span aria-hidden="true" className="font-bold text-[#2f7a4f]">✓</span>
              <span className="whitespace-nowrap text-[14px] font-semibold">{g.name}</span>
              <span aria-hidden="true" className="ml-2 hidden h-[3px] w-full max-w-[80px] flex-1 bg-[radial-gradient(circle,rgba(60,40,20,0.5)_1px,transparent_1.2px)] bg-[length:6px_3px] bg-repeat-x md:block" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2.5 md:mt-0">
              {g.items.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-[15px] leading-none">
                  {LOGO[item] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/logos/tech/${LOGO[item]}.svg`} alt="" width={18} height={18} decoding="async" className="h-[18px] w-[18px] shrink-0 object-contain" />
                  ) : (
                    <Monogram name={item} />
                  )}
                  {item}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { DiagramName } from "@/components/data";
import { cn } from "@/lib/utils";

export const Frame = ({ caption, children, className }: { caption?: string; children: React.ReactNode; className?: string }) => (
  <figure className={cn("rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-6", className)}>
    {children}
    {caption && <figcaption className="mt-4 text-xs text-white/50">{caption}</figcaption>}
  </figure>
);

/** Cycles through `count` steps only while visible. Reduced motion jumps to the last step. */
function useStepper(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => clearInterval(id);
  }, [count, inView, ms, reduced]);
  return { ref, step: reduced ? count - 1 : step };
}

type Node = { label: string; sub?: string };

/** A left-to-right pipeline (top-to-bottom on phones) where each stage lights up in turn. */
export const Pipeline = ({ nodes, ms = 1100, className }: { nodes: Node[]; ms?: number; className?: string }) => {
  const { ref, step } = useStepper(nodes.length, ms);
  return (
    <div ref={ref} className={cn("flex flex-col items-stretch sm:flex-row sm:items-center", className)}>
      {nodes.map((node, i) => (
        <React.Fragment key={node.label}>
          <div
            className={cn(
              "flex-1 rounded-xl border px-3 py-2.5 text-center transition-all duration-500",
              i === step
                ? "border-purple bg-purple/15"
                : i < step
                  ? "border-purple/40 bg-white/[0.03]"
                  : "border-white/10 bg-white/[0.02]"
            )}
          >
            <div className="font-mono text-xs font-semibold text-white sm:text-[13px]">{node.label}</div>
            {node.sub && <div className="mt-0.5 text-[11px] leading-tight text-white/55">{node.sub}</div>}
          </div>
          {i < nodes.length - 1 && (
            <>
              <div className="flow-line hidden h-0.5 w-5 shrink-0 opacity-70 sm:block" />
              <div className="flow-line-y mx-auto h-4 w-0.5 shrink-0 opacity-70 sm:hidden" />
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

type Line = { text: string; tone?: "dim" | "ok" | "warn" | "err" | "cmd" };

const TONES: Record<NonNullable<Line["tone"]>, string> = {
  dim: "text-white/45",
  ok: "text-emerald-300",
  warn: "text-amber-200",
  err: "text-rose-300",
  cmd: "text-purple",
};

// One replay of the poller: wait on capacity, back off when throttled, stop on success.
const ALLOCATOR_FRAMES: { active: number; line?: Line }[] = [
  { active: 0, line: { text: "$ alloc setup", tone: "cmd" } },
  { active: 0, line: { text: "  type: mac2.metal   zones: a, b, c   every: 15m", tone: "dim" } },
  { active: 1, line: { text: "launchd: timer fired", tone: "dim" } },
  { active: 2, line: { text: "lock acquired", tone: "dim" } },
  { active: 3, line: { text: "AllocateHosts zone-a, zone-b, zone-c", tone: "dim" } },
  { active: 4, line: { text: "✗ insufficient capacity. Waiting for next try", tone: "warn" } },
  { active: 1, line: { text: "launchd: lid opened", tone: "dim" } },
  { active: 3, line: { text: "AllocateHosts zone-a", tone: "dim" } },
  { active: 4, line: { text: "↻ throttled. Backing off (max 15m)", tone: "warn" } },
  { active: 1, line: { text: "launchd: timer fired", tone: "dim" } },
  { active: 3, line: { text: "AllocateHosts zone-a, zone-b", tone: "dim" } },
  { active: 4, line: { text: "✓ host allocated in zone-b. Stopping", tone: "ok" } },
  { active: 5, line: { text: "🔔 macOS notification sent", tone: "ok" } },
];

const ALLOCATOR_STAGES = ["CLI menus", "launchd", "Lock file", "AllocateHosts", "Handle result", "Notify"];

const Allocator = () => {
  const { ref, step } = useStepper(ALLOCATOR_FRAMES.length + 2, 1000);
  const shown = ALLOCATOR_FRAMES.slice(0, Math.min(step + 1, ALLOCATOR_FRAMES.length));
  const active = shown[shown.length - 1].active;
  return (
    <Frame caption="Illustrative replay, not real output.">
      <div ref={ref} className="grid gap-4 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
        <ol className="flex flex-row flex-wrap gap-1.5 md:flex-col">
          {ALLOCATOR_STAGES.map((stage, i) => (
            <li
              key={stage}
              className={cn(
                "rounded-lg border px-3 py-1.5 font-mono text-xs transition-all duration-300",
                i === active ? "border-purple bg-purple/15 text-white" : "border-white/10 text-white/50"
              )}
            >
              {stage}
            </li>
          ))}
        </ol>
        <div className="keep-dark min-h-[19rem] overflow-hidden rounded-xl border border-white/10 bg-[rgb(2,0,36)] p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
          {shown.map((frame, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={cn("break-words", TONES[frame.line?.tone ?? "dim"])}>
              {frame.line?.text}
            </motion.div>
          ))}
          <span className="caret text-purple">▍</span>
        </div>
      </div>
    </Frame>
  );
};

const Bar = ({ label, width, value, accent }: { label: string; width: number; value: string; accent?: boolean }) => (
  <div>
    <div className="mb-1 flex justify-between text-xs text-white/70">
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
    <div className="h-7 overflow-hidden rounded-md bg-white/[0.05]">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${width}%` }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        className={cn("h-full rounded-md", accent ? "bg-purple" : "bg-white/25")}
      />
    </div>
  </div>
);

const Bazel = () => (
  <Frame caption="Bars are relative: the same ARM64 build before and after, about 40% shorter.">
    <div className="space-y-4">
      <Bar label="Before: cache lost when each container exits" width={100} value="100%" />
      <Bar label="After: cache persists on a Docker volume" width={60} value="~60%" accent />
    </div>
  </Frame>
);

const DIAGRAMS: Record<DiagramName, () => React.ReactElement> = {
  allocator: Allocator,
  bazel: Bazel,
  macnode: () => (
    <Frame>
      <Pipeline nodes={[{ label: "Dedicated Host", sub: "Mac on EC2" }, { label: "Custom AMI", sub: "Identical nodes" }, { label: "Jenkins", sub: "Pipelines" }, { label: "10+ jobs", sub: "Wider OS coverage" }]} />
    </Frame>
  ),
  migration: () => (
    <Frame>
      <Pipeline nodes={[{ label: "Bitbucket", sub: "Source of truth" }, { label: "Mirror clone", sub: "All branches & tags" }, { label: "Rewire CI", sub: "20+ pipelines" }, { label: "GitHub", sub: "Zero downtime" }]} />
    </Frame>
  ),
  mcp: () => (
    <Frame>
      <Pipeline nodes={[{ label: "GitHub", sub: "PRs" }, { label: "Azure DevOps", sub: "Sprints, builds" }, { label: "MCP bot", sub: "Brings it together" }, { label: "Slack", sub: "Where people are" }]} />
    </Frame>
  ),
  bot: () => (
    <Frame caption="The real pipeline, from the repo's workflow file.">
      <Pipeline nodes={[{ label: "cron", sub: ":07 :22 :37 :52" }, { label: "Restore state", sub: "actions/cache" }, { label: "Scrape 6 lists", sub: "Find new postings" }, { label: "Telegram", sub: "New ones only" }, { label: "Save state", sub: "if: always()" }]} />
    </Frame>
  ),
  ecg: () => (
    <Frame caption="Decision tree → MLP → attention model, all explained with the same SHAP method. From the project report.">
      <div className="space-y-4">
        <Bar label="Macro-F1 rises" width={35} value="0.18 → 0.29 → 0.35" accent />
        <Bar label="Plausibility falls" width={29} value="0.87 → 0.50 → 0.29" />
        <Bar label="Faithfulness falls" width={24} value="0.68 → 0.50 → 0.24" />
      </div>
    </Frame>
  ),
  datafest: () => (
    <Frame caption="Median days between follow-up visits, from the project's findings.">
      <div className="space-y-4">
        <Bar label="Metro patients" width={54} value="15 days" />
        <Bar label="Rural patients" width={100} value="28 days" accent />
      </div>
    </Frame>
  ),
};

export const Diagram = ({ name }: { name: DiagramName }) => {
  const Component = DIAGRAMS[name];
  return <Component />;
};

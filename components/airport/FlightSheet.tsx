"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { PanelContent } from "@/components/Panels";
import { BoxId, ExtraPanelId, hackathons, projects, roles } from "@/components/data";
import { flights } from "@/components/data/airport";
import { clearRoute, useHashRoute } from "@/lib/useHashRoute";
import { PlaneIcon } from "./CheckIn";

// Old bento routes, and section anchors, map onto the sections of the new page.
const SECTION_FOR: Record<string, string> = {
  experience: "experience",
  ops: "ops",
  impact: "ops",
  stack: "ops",
  projects: "projects",
  hackathons: "hackathons",
  about: "about",
  education: "about",
  moments: "about",
  contact: "contact",
  top: "top",
};

let locks = 0;

const label = (top: string, sub?: string) => {
  if (top === "experience") {
    const role = roles.find((r) => r.slug === sub);
    const f = sub ? flights[sub] : undefined;
    return { kicker: "Flight details", title: f ? `${f.flight} · ${f.dest} · ${f.gate}` : role?.company ?? "" };
  }
  if (top === "projects") return { kicker: "Gate C · Project", title: projects.find((p) => p.slug === sub)?.title ?? "" };
  if (top === "hackathons") return { kicker: "Passport control · Hackathon", title: hackathons.find((p) => p.slug === sub)?.title ?? "" };
  return { kicker: "Boarding pass", title: "Resume" };
};

const Sheet = ({ top, sub, route }: { top: BoxId | ExtraPanelId; sub?: string; route: string }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    locks += 1;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return clearRoute();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button, iframe, video[controls], object");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      locks = Math.max(0, locks - 1);
      if (!locks) document.body.style.overflow = "";
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [route]);

  const { kicker, title } = label(top, sub);

  return (
    <div className="fixed inset-0 z-[6000] flex justify-end">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={clearRoute} className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${kicker}: ${title}`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 34 }}
        className="device relative flex h-full w-full max-w-4xl flex-col border-l border-black amb-hall shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="flex shrink-0 items-stretch border-b border-black">
          <div className="sign-letter w-12 shrink-0">
            <PlaneIcon className="h-4 w-4 -rotate-45" />
          </div>
          <div className="sign-plate flex min-w-0 flex-1 flex-col justify-center px-4 py-2 font-sign">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{kicker}</span>
            <span className="truncate font-mono text-sm font-bold uppercase">{title}</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={clearRoute}
            aria-label="Close"
            className="flex w-14 shrink-0 items-center justify-center bg-floor text-lg text-sign transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-sign"
          >
            ✕
          </button>
        </div>
        <div ref={scrollRef} className="panel-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-8 md:px-10 md:py-10">
          <motion.div key={route} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <PanelContent id={top} sub={sub} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

/** Opens detail routes (#experience/arctic-wolf, #projects/ecg, #resume …) in a side sheet; plain section anchors just scroll. */
export const FlightSheet = () => {
  const route = useHashRoute();
  const [top, sub] = route.split("/");
  const isDetail = (["experience", "projects", "hackathons"].includes(top) && !!sub) || top === "resume";

  useEffect(() => {
    if (isDetail || !top) return;
    const id = SECTION_FOR[top];
    if (!id) return;
    // Wait a frame so a closing sheet has released the scroll lock.
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [route, top, isDetail]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence
        onExitComplete={() => {
          if (!document.querySelector('[role="dialog"]')) {
            locks = 0;
            document.body.style.overflow = "";
          }
        }}
      >
        {isDetail && <Sheet key={top} top={top as BoxId | ExtraPanelId} sub={sub} route={route} />}
      </AnimatePresence>
    </MotionConfig>
  );
};

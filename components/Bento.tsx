"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { BentoGrid, BentoGridItem, CARD_BACKGROUND } from "./ui/bento-grid";
import { CardVisual } from "./CardVisuals";
import { PanelContent } from "./Panels";
import { BoxId, ExtraPanelId, boxes, contactLinks, moments } from "./data";
import { useAvailableImages } from "@/lib/useAvailableMedia";
import { PlatformIcon } from "./ui/PlatformIcon";
import { clearRoute, useHashRoute } from "@/lib/useHashRoute";

const SPRING = { type: "spring", stiffness: 260, damping: 32 } as const;

const EXTRA_TITLES: Record<ExtraPanelId, string> = { resume: "Resume" };

const Panel = ({ id, sub, route }: { id: BoxId | ExtraPanelId; sub?: string; route: string }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearRoute();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button, iframe, video[controls], object");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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
      document.body.style.overflow = previousOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [route]);

  const title = boxes.find((box) => box.id === id)?.title ?? EXTRA_TITLES[id as ExtraPanelId];

  return (
    <div className="fixed inset-0 z-[6000] flex justify-center md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={clearRoute}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />
      <motion.div
        ref={dialogRef}
        layoutId={`card-${id}`}
        transition={SPRING}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ background: CARD_BACKGROUND, borderRadius: 24 }}
        className="relative flex h-full w-full max-w-5xl flex-col overflow-hidden border border-white/15"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-3 md:px-8">
          <span className="text-sm font-medium text-white/60">{title}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={clearRoute}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-purple hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple"
          >
            ✕
          </button>
        </div>
        <div ref={scrollRef} className="panel-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-8 md:px-10 md:py-10">
          <motion.div key={route} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.12 }}>
            <PanelContent id={id} sub={sub} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Bento = () => {
  const route = useHashRoute();
  const [top, sub] = route.split("/");
  const openId = (boxes.find((box) => box.id === top)?.id ?? (top in EXTRA_TITLES ? top : undefined)) as BoxId | ExtraPanelId | undefined;

  // On the live site, hide Moments until at least one photo exists, and let Impact take its row.
  const momentPhotos = useAvailableImages(moments.map((m) => m.src));
  const hideMoments = process.env.NODE_ENV === "production" && momentPhotos.checked && momentPhotos.available.length === 0;
  const shown = boxes
    .filter((box) => !(hideMoments && box.id === "moments"))
    .map((box) => (hideMoments && box.id === "impact" ? { ...box, className: "md:col-span-3" } : box));

  return (
    <MotionConfig reducedMotion="user">
      <section id="work" className="scroll-mt-8 py-12">
        <BentoGrid>
          {shown.map((box, i) => (
            <BentoGridItem key={box.id} id={box.id} index={i} title={box.title} description={box.description} className={box.className}>
              <CardVisual id={box.id} />
            </BentoGridItem>
          ))}
        </BentoGrid>
      </section>

      <footer className="flex flex-col items-center gap-4 border-t border-white/10 px-4 py-10 text-sm text-white/50">
        <div className="flex gap-5">
          {contactLinks.map((link) => (
            <a
              key={link.platform}
              href={link.href}
              target={link.platform === "email" ? undefined : "_blank"}
              rel={link.platform === "email" ? undefined : "noopener noreferrer"}
              aria-label={link.platform === "email" ? "Email" : link.label}
              className="transition hover:text-purple"
            >
              <PlatformIcon platform={link.platform} className="h-5 w-5" />
            </a>
          ))}
        </div>
        <span>Vivek Jude Manoj</span>
      </footer>

      <AnimatePresence>{openId && <Panel key={openId} id={openId} sub={sub} route={route} />}</AnimatePresence>
    </MotionConfig>
  );
};

export default Bento;

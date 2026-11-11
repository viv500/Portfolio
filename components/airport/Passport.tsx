"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { contactLinks, education, moments, profile } from "@/components/data";
import { useAvailableImages } from "@/lib/useAvailableMedia";
import { GateHeader } from "./GateHeader";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

const [GIVEN, SURNAME] = (() => {
  const parts = profile.name.toUpperCase().split(" ");
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
})();

const mrz = (s: string) => s.toUpperCase().replace(/[^A-Z0-9<]/g, "<").padEnd(44, "<").slice(0, 44);
const MRZ = [mrz(`P<VJM${SURNAME}<<${GIVEN.replace(/ /g, "<")}`), mrz("INFRA<DEVTOOLS<<SHOPIFY<W27<<UWATERLOO<CS<AI")];

// ── Page parts ───────────────────────────────────────────────────────────
const PageFrame = ({ n, side, children }: { n: number; side: "left" | "right"; children: React.ReactNode }) => (
  <div className={`passport-paper relative flex h-full min-h-[33rem] flex-col p-5 sm:p-7 ${side === "left" ? "md:rounded-l-md page-curve-left" : "md:rounded-r-md page-curve-right"} rounded-md md:rounded-none`}>
    {/* The paper curves down into the gutter: darker and slightly narrower near the spine. */}
    <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0 hidden w-1/3 md:block ${side === "left" ? "right-0 bg-[linear-gradient(270deg,rgba(60,40,20,0.22)_0%,rgba(60,40,20,0.08)_10%,rgba(255,255,255,0.18)_22%,transparent_60%)]" : "left-0 bg-[linear-gradient(90deg,rgba(60,40,20,0.22)_0%,rgba(60,40,20,0.08)_10%,rgba(255,255,255,0.18)_22%,transparent_60%)]"}`} />
    <div className="flex-1">{children}</div>
    <div className={`mt-4 font-mono text-[10px] text-black/60 ${side === "left" ? "text-left" : "text-right"}`}>{String(n).padStart(2, "0")}</div>
    {/* Page curl on the outer bottom corner; it lifts a little more on hover. */}
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 h-7 w-7 transition-all duration-300 group-hover/page:h-10 group-hover/page:w-10 ${
        side === "left"
          ? "left-0 rounded-tr-[10px] bg-[linear-gradient(45deg,rgb(var(--cover))_0%,rgb(var(--cover))_48%,rgba(0,0,0,0.18)_50%,rgb(var(--paper-shade))_62%,rgb(var(--paper))_100%)] md:rounded-bl-md"
          : "right-0 rounded-tl-[10px] bg-[linear-gradient(315deg,rgb(var(--cover))_0%,rgb(var(--cover))_48%,rgba(0,0,0,0.18)_50%,rgb(var(--paper-shade))_62%,rgb(var(--paper))_100%)] md:rounded-br-md"
      } shadow-[0_0_6px_rgba(0,0,0,0.15)]`}
    />
  </div>
);

const PageTitle = ({ en }: { en: string }) => (
  <div className="mb-4 border-b border-black/15 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cover">
    {en}
  </div>
);

const IdField = ({ en, v }: { en: string; v: string }) => (
  <div>
    <div className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-black/60">
      {en}
    </div>
    <div className="font-sign text-[13px] font-bold uppercase leading-tight text-[#1b1b1b] sm:text-sm">{v}</div>
  </div>
);

const IdentityPage = () => (
  <PageFrame n={1} side="left">
    <div className="mb-4 flex items-center justify-between">
      <span className="font-sign text-xs font-bold uppercase tracking-[0.2em] text-cover">Passport</span>
      <span className="font-mono text-[10px] text-black/60">TYPE P · VJM</span>
    </div>
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <div className="relative">
        <Image src={profile.photo} alt={profile.name} width={1050} height={1400} sizes="144px" className="h-auto w-full rounded-[3px] grayscale-[0.15] contrast-[1.05]" />
        {/* Holographic overlay on the photo. */}
        <span aria-hidden="true" className="absolute inset-0 rounded-[3px] bg-[radial-gradient(circle_at_70%_80%,rgba(120,170,255,0.18),transparent_45%)] mix-blend-screen" />
      </div>
      <div className="space-y-2.5">
        <IdField en="Surname" v={SURNAME} />
        <IdField en="Given names" v={GIVEN} />
        <IdField en="Place of origin" v="Dubai, UAE" />
        <IdField en="Residence" v="Waterloo, ON" />
        <IdField en="Occupation" v="Software engineer · Infra & dev tooling" />
        <IdField en="Next stop" v="Shopify · Winter 2027" />
      </div>
    </div>
    <div className="mt-6 overflow-hidden rounded-[2px] bg-white/40 px-2 py-2 font-mono text-[9.5px] leading-[1.5] tracking-[0.12em] text-black/75 sm:text-[11px]">
      {MRZ.map((line) => (
        <div key={line} className="truncate">
          {line}
        </div>
      ))}
    </div>
  </PageFrame>
);

const WhatIDoPage = () => (
  <PageFrame n={2} side="right">
    <PageTitle en="Observations · What I do" />
    <div className="space-y-3 text-[14px] leading-relaxed text-[#2a2620]">
      {profile.about.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
    <div className="mt-5 flex flex-wrap gap-1.5">
      {contactLinks.slice(0, 4).map((link) => (
        <a
          key={link.platform}
          href={link.href}
          target={link.platform === "email" ? undefined : "_blank"}
          rel={link.platform === "email" ? undefined : "noopener noreferrer"}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[4px] border border-black/25 bg-white/40 px-3 py-2 font-mono text-[11px] text-black/80 transition hover:border-black/60 hover:bg-white/70 hover:text-black"
        >
          <PlatformIcon platform={link.platform} className="h-3.5 w-3.5" />
          {link.platform === "email" ? "Email" : link.label}
        </a>
      ))}
    </div>
  </PageFrame>
);

const VisaPage = () => (
  <PageFrame n={3} side="left">
    <PageTitle en="Visas" />
    <div className="relative overflow-hidden rounded-[4px] border border-[#3f6b56]/40 bg-[#dbe8dc] p-4 shadow-sm">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-radial-gradient(circle_at_80%_20%,rgba(63,107,86,0.12)_0_1px,transparent_1px_6px)]" />
      <div className="relative">
        <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#2f5a46]">
          <span>Visa</span>
          <span>CS + AI</span>
        </div>
        <div className="mt-3 font-sign text-lg font-extrabold leading-tight text-[#14261d]">{education.school}</div>
        <div className="mt-1 text-[13px] leading-snug text-[#14261d]/80">{education.degree}</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <IdField en="Valid until" v="Dec 2027" />
          <IdField en="Clubs" v={education.activities.map((a) => a.replace(" Club", "")).join(" · ")} />
        </div>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
      {education.courseGroups.map((g) => (
        <div key={g.name}>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/60">{g.name}</div>
          <ul className="mt-1 space-y-0.5 text-[11.5px] leading-snug text-[#2a2620]">
            {g.courses.slice(0, 4).map((c) => (
              <li key={c}>{c.split(":")[1]?.trim() ?? c}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </PageFrame>
);

// Luggage-sticker colours for the interests: soft, distinct, never neon.
const STICKERS = [
  "bg-rose-200 text-rose-900 ring-rose-300",
  "bg-sky-200 text-sky-900 ring-sky-300",
  "bg-amber-200 text-amber-900 ring-amber-300",
  "bg-violet-200 text-violet-900 ring-violet-300",
  "bg-emerald-200 text-emerald-900 ring-emerald-300",
  "bg-pink-200 text-pink-900 ring-pink-300",
  "bg-teal-200 text-teal-900 ring-teal-300",
  "bg-orange-200 text-orange-900 ring-orange-300",
  "bg-indigo-200 text-indigo-900 ring-indigo-300",
  "bg-lime-200 text-lime-900 ring-lime-300",
  "bg-fuchsia-200 text-fuchsia-900 ring-fuchsia-300",
  "bg-cyan-200 text-cyan-900 ring-cyan-300",
];
const SHAPES = ["rounded-full", "rounded-[4px]", "rounded-[10px]"];
const TILT = [-4, 3, -2, 5, -5, 2, -3, 4, -1, 3, -4, 1, 5, -2, 2];

const TravelStamp = ({ top, big, bottom, color, rotate, round }: { top: string; big: string; bottom: string; color: string; rotate: number; round?: boolean }) => (
  <div
    className={`ink relative flex flex-col items-center justify-center border-[3px] p-3 text-center font-mono font-bold uppercase leading-tight opacity-80 ${round ? "h-28 w-28 rounded-full" : "h-24 w-36 rounded-[6px]"}`}
    style={{ borderColor: color, color, rotate: `${rotate}deg` }}
  >
    <span className="absolute inset-[4px] rounded-[inherit] border" style={{ borderColor: color }} />
    <span className="text-[8px] tracking-[0.18em]">{top}</span>
    <span className="font-sign text-2xl font-extrabold leading-none">{big}</span>
    <span className="mt-0.5 text-[8px] tracking-[0.15em]">{bottom}</span>
  </div>
);

const BeyondPage = () => (
  <PageFrame n={4} side="right">
    <PageTitle en="Beyond the code" />
    <p className="text-[14px] leading-relaxed text-[#2a2620]">{profile.origin}</p>
    <div className="mt-3 flex items-center gap-3 font-sign text-2xl font-extrabold text-cover">
      DXB
      <span className="flex flex-1 items-center">
        <span className="h-px flex-1 border-t-2 border-dotted border-cover/40" />
        <span className="mx-1 text-base">✈</span>
        <span className="h-px flex-1 border-t-2 border-dotted border-cover/40" />
      </span>
      YKF
    </div>
    <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-black/60">Luggage stickers · Interests</div>
    <ul className="mt-3 flex flex-wrap gap-2">
      {profile.interests.map((interest, i) => (
        <li
          key={interest}
          style={{ rotate: `${TILT[i % TILT.length]}deg` }}
          className={`px-2.5 py-1 font-sign text-[12px] font-bold uppercase tracking-wide shadow-sm ring-1 ${STICKERS[i % STICKERS.length]} ${SHAPES[i % SHAPES.length]}`}
        >
          {interest}
        </li>
      ))}
    </ul>
    <div aria-hidden="true" className="mt-8 flex flex-wrap items-center justify-around gap-4">
      <TravelStamp top="Departed" big="DXB" bottom="Dubai" color="#b8322a" rotate={-9} round />
      <TravelStamp top="Admitted" big="YKF" bottom="Waterloo · Student" color="#2b4c9b" rotate={6} />
    </div>
  </PageFrame>
);

const PHOTO_SRCS = moments.map((m) => m.src);

const PhotoPage = ({ n, side, from }: { n: number; side: "left" | "right"; from: number }) => {
  const { available } = useAvailableImages(PHOTO_SRCS);
  const shown = moments.filter((m) => available.includes(m.src)).slice(from, from + 3);
  return (
    <PageFrame n={n} side={side}>
      <PageTitle en={side === "left" ? "Moments" : "Moments, cont."} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-5 pt-1">
        {shown.map((m, i) => (
          <li
            key={m.src}
            className={`relative bg-white p-1.5 pb-1 shadow-md ${i === 2 ? "col-span-2 mx-auto w-[72%]" : ""}`}
            style={{ rotate: `${[-2.5, 2, -1][i]}deg` }}
          >
            <span aria-hidden="true" className="absolute -top-2 left-1/2 z-10 h-4 w-12 -translate-x-1/2 rotate-[-3deg] bg-[#f3e7b5]/85" />
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 320px, 45vw" className="object-cover" />
            </div>
            <p className="mt-1 truncate font-mono text-[9.5px] text-black/60">{m.alt}</p>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
};

const SPREADS: [React.ReactNode, React.ReactNode][] = [
  [<IdentityPage key="id" />, <WhatIDoPage key="what" />],
  [<VisaPage key="visa" />, <BeyondPage key="beyond" />],
  [<PhotoPage key="p1" n={5} side="left" from={0} />, <PhotoPage key="p2" n={6} side="right" from={3} />],
];
const PAGES = SPREADS.flat();

// ── Cover and endpaper ───────────────────────────────────────────────────
const CoverFace = () => (
  <div className="passport-cover flex h-full w-full flex-col items-center justify-between rounded-r-xl px-6 py-10 text-center shadow-[inset_6px_0_10px_-6px_rgba(0,0,0,0.6)]">
    <div className="foil font-sign text-sm font-bold uppercase tracking-[0.35em]">Vivek Jude Manoj</div>
    <svg viewBox="0 0 100 100" className="foil h-28 w-28" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="50" cy="50" r="38" />
      <ellipse cx="50" cy="50" rx="16" ry="38" />
      <path d="M12 50h76M18 32h64M18 68h64" />
      <path d="M50 4 Q 92 20 88 62" strokeDasharray="3 3" />
      <path d="M85 58l3 6 4-5" />
      <path fill="currentColor" stroke="none" d="M50 8l2.2 4.4 4.8.7-3.5 3.4.8 4.8L50 19l-4.3 2.3.8-4.8-3.5-3.4 4.8-.7z" />
    </svg>
    <div>
      <div className="foil font-sign text-3xl font-extrabold uppercase tracking-[0.25em]">Passport</div>
      <div className="foil mx-auto mt-5 h-5 w-8 rounded-[3px] border border-current opacity-80" aria-hidden="true" />
      <div className="mt-6 font-mono text-[11px] text-[#e9d9a8]/80">Click to open →</div>
    </div>
  </div>
);

// ── Overlay controls ─────────────────────────────────────────────────────
const NavArrow = ({ side, label, onClick, small }: { side: "left" | "right"; label: string; onClick: () => void; small?: boolean }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`btn-gold pointer-events-auto absolute z-30 flex items-center justify-center rounded-full font-sign text-xl font-extrabold ${
      small ? "top-[calc(50%_-_1.375rem)] h-11 w-11" : "top-[calc(50%_-_1.75rem)] h-14 w-14"
    } ${side === "left" ? (small ? "left-1" : "-left-7") : small ? "right-1" : "-right-7"}`}
  >
    {side === "left" ? "←" : "→"}
  </button>
);

const PageCount = ({ text }: { text: string }) => (
  <span className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/65 px-3 py-1 font-mono text-[10px] text-white shadow-lg backdrop-blur-sm">{text}</span>
);

// ── Booklet ──────────────────────────────────────────────────────────────
// The section always uses the open-book footprint. Closed, the cover lies over the right-hand
// page (hinged at the spine) with the endpaper on the left. It swings open when the passport
// scrolls into view; its back face is page 1, so it lands seamlessly on the spread.
export const Passport = () => {
  const [open, setOpen] = useState(false);
  const [settled, setSettled] = useState(false); // true once the cover has finished opening
  const [spread, setSpread] = useState(0);
  const [page, setPage] = useState(0); // single-page view on phones
  const [turning, setTurning] = useState<null | { dir: 1 | -1; from: number }>(null);
  const opened = useRef(false); // has the cover ever opened (decides where a remounted cover starts)
  const autoOpened = useRef(false);
  const book = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  const openCover = useCallback(() => {
    setSpread(0);
    setPage(0);
    setOpen(true);
    if (reduced.current) setSettled(true);
  }, []);
  const closeCover = useCallback(() => {
    setSpread(0);
    setPage(0);
    setSettled(false);
    setOpen(false);
  }, []);

  // Open on first view; with reduced motion, start open.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      opened.current = true;
      autoOpened.current = true;
      setOpen(true);
      setSettled(true);
      return;
    }
    const el = book.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !autoOpened.current) {
          autoOpened.current = true;
          window.setTimeout(openCover, 350);
          io.disconnect();
        }
      },
      { threshold: 0.55 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [openCover]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = spread + dir;
      if (next < 0 || next >= SPREADS.length || turning || !settled) return;
      if (reduced.current) {
        setSpread(next);
        return;
      }
      setTurning({ dir, from: spread });
      setSpread(next);
    },
    [spread, turning, settled]
  );
  // Going back from the first spread closes the cover again.
  const back = useCallback(() => {
    if (turning) return;
    if (!open) return;
    if (spread === 0) closeCover();
    else go(-1);
  }, [spread, turning, open, go, closeCover]);
  const forward = useCallback(() => (open ? go(1) : openCover()), [open, go, openCover]);
  const pageBack = () => (page === 0 ? closeCover() : setPage((p) => p - 1));
  const pageNext = () => (open ? setPage((p) => Math.min(PAGES.length - 1, p + 1)) : openCover());
  const lastSpread = spread === SPREADS.length - 1;

  /** Clicking empty space on a page turns it; links and buttons inside the page don't. */
  const onPage = (dir: 1 | -1) => (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (dir === 1) forward();
    else back();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) return;
      const el = document.getElementById("about");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.6 || r.bottom < window.innerHeight * 0.4) return;
      const phone = window.innerWidth < 768;
      if (e.key === "ArrowRight") (phone ? pageNext : forward)();
      if (e.key === "ArrowLeft") (phone ? pageBack : back)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // While a leaf turns, the half it hasn't covered yet keeps showing the old page.
  const left = turning?.dir === 1 ? SPREADS[turning.from][0] : SPREADS[spread][0];
  const right = turning?.dir === -1 ? SPREADS[turning.from][1] : SPREADS[spread][1];
  const coverStart = opened.current ? -180 : 0;

  const pageWrap = "group/page relative h-full transition-transform duration-300 hover:-translate-y-1 hover:drop-shadow-[0_10px_12px_rgba(0,0,0,0.25)]";

  return (
    <section id="about" className="amb-desk scroll-mt-14 overflow-hidden px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <GateHeader letter="E" en="Passport" label="About" intro="Who I am, where I'm from and what I'm into." />

        <div ref={book}>
          {/* Desktop. Closed, only the front cover shows, centred; as it swings open the book slides
              across so the open spread ends up centred. Each half tilts slightly into the spine. */}
          <div className="hidden md:block" style={{ perspective: 2200 }}>
            <motion.div
              className="relative mx-auto flex max-w-5xl"
              initial={false}
              animate={{ x: open ? "0%" : "-25%" }}
              transition={{ duration: reduced.current ? 0 : 1.1, ease: [0.5, 0.05, 0.2, 1] }}
              // Flat stacking (no preserve-3d) so the cover, page turns and arrows always sit on top
              // of the tilted pages; the perspective here still gives the swings their depth.
              style={{ perspective: 2200 }}
            >
              <motion.div
                className="w-1/2 rounded-l-lg bg-cover p-2 pr-0 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]"
                initial={false}
                animate={{ opacity: open ? 1 : 0 }}
                // Closing: the left board goes as soon as the cover has swung past it.
                transition={{ duration: open ? 0.25 : 0.15, delay: open ? 0.5 : 0.45 }}
                style={{ transformPerspective: 1800, rotateY: 4, originX: 1 }}
              >
                <div className={`${pageWrap} ${open ? "cursor-pointer" : ""}`} style={{ visibility: settled ? "visible" : "hidden" }} onClick={onPage(-1)} title={open ? (spread === 0 ? "Close passport" : "Previous page") : undefined}>
                  {left}
                </div>
              </motion.div>
              <motion.div
                className="w-1/2 rounded-r-lg bg-cover p-2 pl-0 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)]"
                initial={false}
                // Flat while closed, so no sliver of page shows past the edge of the cover.
                animate={{ rotateY: open ? -4 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformPerspective: 1800, originX: 0 }}
              >
                <div className={`${pageWrap} ${lastSpread && open ? "" : "cursor-pointer"}`} onClick={onPage(1)} title={!open ? "Open passport" : lastSpread ? undefined : "Next page"}>
                  {right}
                </div>
              </motion.div>
              {open && <div aria-hidden="true" className="pointer-events-none absolute inset-y-2 left-1/2 z-[5] w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.14)_42%,rgba(0,0,0,0.32)_50%,rgba(0,0,0,0.14)_58%,transparent)]" />}

              {/* Page turn: front is the page leaving, back is the page arriving. */}
              <AnimatePresence>
                {turning && (
                  <motion.div
                    key={`${turning.from}-${turning.dir}`}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: turning.dir === 1 ? -180 : 180 }}
                    transition={{ duration: 0.75, ease: [0.45, 0.05, 0.25, 1] }}
                    onAnimationComplete={() => setTurning(null)}
                    className={`absolute inset-y-2 z-10 w-[calc(50%-0.5rem)] ${turning.dir === 1 ? "left-1/2" : "left-2"}`}
                    style={{ transformStyle: "preserve-3d", transformOrigin: turning.dir === 1 ? "left center" : "right center" }}
                  >
                    <div className="absolute inset-0 [backface-visibility:hidden]">{SPREADS[turning.from][turning.dir === 1 ? 1 : 0]}</div>
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{SPREADS[spread][turning.dir === 1 ? 0 : 1]}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The front cover: the whole right board, hinged at the spine. Its back is page 1. */}
              {!settled && (
                <motion.div
                  key={open ? "opening" : "closing"}
                  initial={{ rotateY: open ? 0 : coverStart }}
                  animate={{ rotateY: open ? -180 : 0 }}
                  transition={{ duration: 1.1, ease: [0.5, 0.05, 0.2, 1] }}
                  onAnimationComplete={() => {
                    if (open) {
                      opened.current = true;
                      setSettled(true);
                    }
                  }}
                  className="absolute inset-y-0 left-1/2 z-20 w-1/2"
                  style={{ transformStyle: "preserve-3d", transformOrigin: "left center" }}
                >
                  <button type="button" aria-label="Open passport" onClick={openCover} className="absolute inset-0 rounded-r-xl shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] [backface-visibility:hidden] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sign">
                    <CoverFace />
                  </button>
                  <div className="absolute inset-0 rounded-l-lg bg-cover p-2 pr-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">{SPREADS[0][0]}</div>
                </motion.div>
              )}

              {/* Controls on the passport itself. */}
              {open && <NavArrow side="left" label={spread === 0 ? "Close passport" : "Previous page"} onClick={back} />}
              {(!open || !lastSpread) && <NavArrow side="right" label={open ? "Next page" : "Open passport"} onClick={forward} />}
              {settled && <PageCount text={`Pages ${spread * 2 + 1}–${spread * 2 + 2} of ${PAGES.length}`} />}
            </motion.div>
          </div>

          {/* Phones: one page at a time, with the cover over it while closed. */}
          <div className="relative md:hidden" style={{ perspective: 1400 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                initial={{ rotateY: 70, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -70, opacity: 0 }}
                transition={{ duration: 0.3 }}
                drag={open ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) pageNext();
                  if (info.offset.x > 60) pageBack();
                }}
                onTap={(e, info) => {
                  if (!open || (e.target as HTMLElement).closest("a, button")) return;
                  if (info.point.x - window.scrollX > window.innerWidth / 2) pageNext();
                  else pageBack();
                }}
                style={{ transformOrigin: "left center" }}
                className="group/page relative rounded-lg bg-cover p-1.5"
              >
                {PAGES[page]}
              </motion.div>
            </AnimatePresence>
            {!settled && (
              <motion.div
                key={open ? "m-opening" : "m-closing"}
                initial={{ rotateY: open ? 0 : -160, opacity: open ? 1 : 0 }}
                animate={{ rotateY: open ? -160 : 0, opacity: open ? 0 : 1 }}
                transition={{ duration: 0.9, ease: [0.5, 0.05, 0.2, 1] }}
                onAnimationComplete={() => {
                  if (open) {
                    opened.current = true;
                    setSettled(true);
                  }
                }}
                className="absolute inset-1.5 z-20"
                style={{ transformOrigin: "left center" }}
              >
                <button type="button" aria-label="Open passport" onClick={openCover} className="absolute inset-0">
                  <CoverFace />
                </button>
              </motion.div>
            )}
            <div className="pointer-events-none absolute inset-0">
              {open && <NavArrow side="left" label={page === 0 ? "Close passport" : "Previous page"} onClick={pageBack} small />}
              {(!open || page < PAGES.length - 1) && <NavArrow side="right" label={open ? "Next page" : "Open passport"} onClick={pageNext} small />}
              <PageCount text={open ? `Page ${page + 1} of ${PAGES.length}` : "Cover"} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

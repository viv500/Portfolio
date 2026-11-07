"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { BoxId, contactLinks, education, hackathons, impact, moments, profile, projects, roles, techGroups, wins } from "@/components/data";
import { useAvailableImages } from "@/lib/useAvailableMedia";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { cn } from "@/lib/utils";

// Card visuals sit in normal flow, so each box is only as tall as its content.

export const CountUp = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => (
  <span className="tabular-nums">
    {prefix}
    {value}
    {suffix}
  </span>
);

// The first sentence stays bright; the rest is softer so the card doesn't read as one heavy block.
const [INTRO_LEAD, INTRO_REST] = (() => {
  const cut = profile.summary.indexOf(". ") + 1;
  return cut > 0 ? [profile.summary.slice(0, cut), profile.summary.slice(cut)] : [profile.summary, ""];
})();

const About = () => (
    <div className="flex items-center gap-5 px-5 pb-5">
      <p className="min-w-0 flex-1 text-base leading-snug text-white/65 sm:text-lg md:text-[1.35rem] md:leading-relaxed">
        <span className="font-medium text-white">{INTRO_LEAD}</span>
        {INTRO_REST}
      </p>
      <div className="relative aspect-[3/4] w-[38%] shrink-0 overflow-hidden rounded-2xl border border-white/10 md:w-[24%]">
        <Image
          src={profile.photo}
          alt={profile.name}
          fill
          priority
          sizes="(min-width: 768px) 260px, 40vw"
          className="origin-[0%_55%] scale-[1.35] object-cover object-center"
        />
      </div>
    </div>
);

const Experience = () => (
  <ol className="relative mx-5 mb-5 space-y-4">
    <span aria-hidden="true" className="flow-line-y absolute bottom-4 left-[15px] top-4 w-0.5 opacity-60" />
    {roles.map((role) => (
      <li key={role.slug} className="relative flex items-center gap-3">
        <OrgLogo name={role.company} src={role.logo} className={role.incoming ? "ring-2 ring-purple ring-offset-2 ring-offset-[var(--card-bg)]" : undefined} />
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-sm font-semibold text-white">{role.company}</span>
            <span className="shrink-0 text-xs text-white/50">{role.dates}</span>
          </div>
          <div className="truncate text-xs text-white/60">{role.title}</div>
        </div>
      </li>
    ))}
  </ol>
);

const Impact = () => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-5 pb-5 sm:grid-cols-3">
    {impact.map((stat) => (
      <div key={stat.label}>
        <div className="text-2xl font-bold text-white md:text-4xl">
          <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
        </div>
        <div className="truncate text-[11px] text-white/60">{stat.label}</div>
      </div>
    ))}
  </div>
);

const Stack = () => (
  <div className="grid gap-x-6 gap-y-4 px-5 pb-5 sm:grid-cols-2">
    {techGroups.map((group) => (
      <div key={group.name}>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-purple/80">{group.name}</div>
        <div className="flex flex-wrap gap-1.5">
          {group.items.map((item) => (
            <span key={item} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-xs text-white-100">
              {item}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

type Tile = { title: string; kicker: string; note: string; preview?: React.ReactNode };

/**
 * Previews start muted so the grid doesn't turn into a wall of screenshots, then come to
 * full colour when the card is hovered (or, on touch screens, when scrolled into the middle).
 */
const Preview = ({ src, position = "center", dark }: { src: string; position?: string; dark?: boolean }) => (
  <img
    data-dark={dark || undefined}
    src={src}
    alt=""
    loading="lazy"
    style={{ objectPosition: position }}
    className="h-full w-full object-cover"
  />
);

const AllocatorPreview = () => (
  <div className="keep-dark flex h-full flex-col justify-center gap-1 bg-[rgb(2,0,36)] px-3 font-mono text-[10px] leading-snug sm:text-[11px]">
    <div className="text-purple">$ alloc run --type mac2.metal</div>
    <div className="text-white/45">AllocateHosts zone-a, zone-b, zone-c</div>
    <div className="text-amber-200/90">✗ insufficient capacity, retrying</div>
    <div className="text-emerald-300">✓ host allocated in zone-b</div>
  </div>
);

// One heartbeat: P wave, QRS spike, T wave. Repeated across the preview.
const BEAT: [number, number][] = [[0, 0], [10, 0], [14, -5], [18, 0], [24, 0], [26, 4], [29, -34], [32, 12], [35, 0], [44, 0], [50, -9], [56, 0], [70, 0]];
const ECG_PATH = [0, 1, 2, 3, 4]
  .flatMap((n) => BEAT.map(([x, y]) => `${n * 70 + x},${58 + y}`))
  .map((pt, i) => (i ? "L" : "M") + pt)
  .join(" ");

/** The model's attention lands on the QRS spikes, which is what a cardiologist looks at too. */
const EcgPreview = () => (
  <svg viewBox="0 0 330 100" preserveAspectRatio="xMidYMid slice" className="keep-dark h-full w-full bg-[rgb(2,0,36)]" aria-hidden="true">
    <defs>
      <pattern id="ecg-grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M10 0H0V10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      </pattern>
    </defs>
    <rect width="330" height="100" fill="url(#ecg-grid)" />
    {[0, 1, 2, 3, 4].map((n) => (
      <rect key={n} x={n * 70 + 22} y="12" width="16" height="76" rx="3" fill="rgb(203,172,249)" opacity="0.22" />
    ))}
    <path d={ECG_PATH} fill="none" stroke="#e5e7eb" strokeWidth="1.6" strokeLinejoin="round" />
    <text x="50" y="94" fill="rgb(203,172,249)" fontSize="8" fontFamily="ui-monospace, monospace">attention → QRS</text>
  </svg>
);

const TilePreview = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const centred = useInView(ref, { margin: "-35% 0px -35% 0px" });
  return (
    <div
      ref={ref}
      data-centred={centred}
      className="tile-preview mb-3 h-32 overflow-hidden rounded-lg border border-white/10 bg-black md:h-36"
    >
      {children}
    </div>
  );
};

const Tiles = ({ items }: { items: Tile[] }) => (
  <div className="grid grid-cols-1 gap-2 px-5 pb-5 md:grid-cols-3 md:gap-3">
    {items.map((item) => (
      <div key={item.title} className="tile min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3 md:p-4">
        {item.preview && <TilePreview>{item.preview}</TilePreview>}
        <div className="truncate font-mono text-[11px] text-purple">{item.kicker}</div>
        <div className="mt-1.5 truncate text-sm font-semibold text-white md:text-base">{item.title}</div>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/60">{item.note}</p>
      </div>
    ))}
  </div>
);

const PREVIEWS: Record<string, React.ReactNode> = {
  "internship-bot": <Preview src="/media/thumbs/internship-bot.jpg" position="left top" dark />,
  ecg: <EcgPreview />,
  canify: <Preview src="/media/thumbs/canify.jpg" position="center top" />,
  datafest: <Preview src="/media/thumbs/datafest.jpg" position="center" />,
  watchdog: <Preview src="/media/thumbs/watchdog.jpg" position="80% center" />,
};

const PROJECT_TILES: Tile[] = [
  { title: "AWS Host Allocator", kicker: "Go · AWS", note: "Retries AWS Mac host allocation until capacity frees up.", preview: <AllocatorPreview /> },
  ...projects.slice(0, 2).map((p) => ({ title: p.title, kicker: p.stack[0] + " · " + p.stack[1], note: p.tagline, preview: PREVIEWS[p.slug] })),
];

const WIN_TILES: Tile[] = wins
  .map((slug) => hackathons.find((h) => h.slug === slug)!)
  .map((h) => ({ title: h.title, kicker: h.context, note: h.badge ?? h.tagline, preview: PREVIEWS[h.slug] }));

const Education = () => (
  <div className="px-5 pb-5">
    <div className="mb-3 flex items-center gap-3">
      <OrgLogo name={education.school} src={education.logo} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{education.school}</div>
        <div className="truncate text-xs text-white/70">Computer Science + AI Specialization</div>
        <div className="font-mono text-[11px] text-purple">{education.dates.replace("Expected graduation: ", "Class of ")}</div>
      </div>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {["Operating Systems", "Distributed Systems", "Networks", "Compilers", "Databases", "Algorithms", "Machine Learning", "Security"].map((course) => (
        <span key={course} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-white-100">
          {course}
        </span>
      ))}
    </div>
  </div>
);

const MOMENT_SRCS = moments.map((m) => m.src);

/** Crossfades between whichever moment photos exist, with a slow zoom. */
const Moments = () => {
  const { checked, available } = useAvailableImages(MOMENT_SRCS);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reduced || available.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % available.length), 4200);
    return () => clearInterval(id);
  }, [available.length, reduced]);

  if (!checked) return <div className="mx-5 mb-5 aspect-[5/2] rounded-xl bg-white/[0.04]" />;
  if (!available.length) {
    return (
      <div className="mx-5 mb-5 flex aspect-[5/2] flex-col items-center justify-center rounded-xl border border-dashed border-purple/40 bg-purple/[0.04] p-3 text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest text-purple">Photo placeholder</span>
        <code className="mt-1 font-mono text-[11px] text-white/60">public/media/moments/</code>
      </div>
    );
  }
  const src = available[index % available.length];
  const caption = moments.find((m) => m.src === src)?.alt;
  return (
    <div className="relative mx-5 mb-5 aspect-[5/2] overflow-hidden rounded-xl border border-white/10">
      <AnimatePresence initial={false}>
        <motion.img
          key={src}
          src={src}
          alt={caption}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9 }, scale: { duration: 5.2, ease: "linear" } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="keep-dark absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-8">
        <p className="truncate text-xs font-medium text-white">{caption}</p>
      </div>
    </div>
  );
};

const Contact = () => (
  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 pb-5">
    <span className="text-sm font-medium text-white">vjmanoj@uwaterloo.ca</span>
    <div className="flex gap-4 text-white/70">
      {contactLinks
        .filter((link) => link.platform !== "email")
        .map((link) => (
          <span key={link.href} className="inline-flex items-center gap-1.5 text-xs">
            <PlatformIcon platform={link.platform} className="h-4 w-4" />
            {link.label}
          </span>
        ))}
    </div>
  </div>
);

export const CardVisual = ({ id }: { id: BoxId }) => {
  switch (id) {
    case "about":
      return <About />;
    case "experience":
      return <Experience />;
    case "impact":
      return <Impact />;
    case "stack":
      return <Stack />;
    case "projects":
      return <Tiles items={PROJECT_TILES} />;
    case "hackathons":
      return <Tiles items={WIN_TILES} />;
    case "education":
      return <Education />;
    case "moments":
      return <Moments />;
    case "contact":
      return <Contact />;
  }
};

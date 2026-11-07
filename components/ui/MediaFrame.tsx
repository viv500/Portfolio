"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Media } from "@/components/data";

const Placeholder = ({ item }: { item: Media }) => (
  <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-purple/40 bg-purple/[0.04] p-5 text-center">
    <span className="font-mono text-[11px] uppercase tracking-widest text-purple">
      {item.kind === "video" ? "Video placeholder" : "Image placeholder"}
    </span>
    <span className="text-sm text-white-100">{item.alt}</span>
    <code className="break-all font-mono text-xs text-white/60">public{item.src}</code>
    {item.spec && <span className="text-xs text-white/50">{item.spec}</span>}
  </div>
);

/** Click-to-load, so visitors don't load YouTube unless they want to watch. */
const YouTube = ({ item }: { item: Media }) => {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${item.src}?autoplay=1`}
        title={item.alt}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-2xl"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl"
      aria-label={`Play ${item.alt}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${item.src}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover opacity-70 transition duration-300 group-hover:scale-105 group-hover:opacity-90"
      />
      <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple text-black transition group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
};

/**
 * Plays muted on a loop while on screen (browsers only autoplay muted video), and pauses
 * when scrolled away so off-screen videos don't use bandwidth. Controls let people unmute.
 * Visitors who prefer reduced motion get a paused video they can start themselves.
 */
const LoopingVideo = ({ item, onMissing }: { item: Media; onMissing: () => void }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [muted, setMuted] = useState(true);
  // Phone recordings are tall, so size those by height rather than filling the width.
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    if (inView) video.play().catch(() => {});
    else video.pause();
  }, [inView, reduced]);

  const unmute = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
  };

  return (
    <div className={portrait ? "relative mx-auto w-fit" : "relative"}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        controls
        preload={reduced ? "metadata" : "auto"}
        aria-label={item.alt}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onLoadedMetadata={(e) => setPortrait(e.currentTarget.videoHeight > e.currentTarget.videoWidth)}
        className={
          portrait
            ? "block max-h-[72vh] w-auto rounded-2xl border border-white/10 bg-black"
            : "w-full rounded-2xl border border-white/10 bg-black"
        }
      >
        <source src={item.src} onError={onMissing} />
      </video>
      {muted && (
        <button
          type="button"
          onClick={unmute}
          className="keep-dark absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:border-purple hover:text-purple"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z" />
          </svg>
          Unmute
        </button>
      )}
    </div>
  );
};

/** Phone screenshots are tall, so size those by height rather than filling the width. */
const StillImage = ({ item, onMissing }: { item: Media; onMissing: () => void }) => {
  const [portrait, setPortrait] = useState(false);
  return (
    <img
      src={item.src}
      alt={item.alt}
      loading="lazy"
      onError={onMissing}
      onLoad={(e) => setPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth * 1.2)}
      className={
        portrait
          ? "mx-auto block max-h-[72vh] w-auto rounded-2xl border border-white/10 bg-black"
          : "w-full rounded-2xl border border-white/10 bg-black object-contain"
      }
    />
  );
};

export const MediaFrame = ({ item }: { item: Media }) => {
  const [missing, setMissing] = useState(false);

  if (item.kind === "youtube") return <YouTube item={item} />;
  if (missing) return process.env.NODE_ENV === "production" ? null : <Placeholder item={item} />;

  if (item.kind === "video") return <LoopingVideo item={item} onMissing={() => setMissing(true)} />;
  return <StillImage item={item} onMissing={() => setMissing(true)} />;
};

const ROW_COLS: Record<number, string> = { 1: "mx-auto max-w-md", 2: "grid-cols-2", 3: "grid-cols-3" };

/** Wide media spans the full width. Consecutive `half` items share a row, up to three per row. */
export const MediaGrid = ({ items }: { items: Media[] }) => {
  if (!items.length) return null;
  const rows: Media[][] = [];
  for (const item of items) {
    const last = rows[rows.length - 1];
    if (item.half && last && last[0].half && last.length < 3) last.push(item);
    else rows.push([item]);
  }
  return (
    <div className="space-y-4">
      {rows.map((row) =>
        row[0].half ? (
          <div key={row[0].src} className={`grid items-center gap-3 sm:gap-4 ${ROW_COLS[row.length]}`}>
            {row.map((item) => (
              <MediaFrame key={item.src} item={item} />
            ))}
          </div>
        ) : (
          <MediaFrame key={row[0].src} item={row[0]} />
        )
      )}
    </div>
  );
};

"use client";

import React, { useEffect, useRef, useState } from "react";

// A baggage belt: one decorative row of bags gliding left to right and wrapping round. Positions
// are set in a requestAnimationFrame loop (transforms only), paused off-screen, on hover or focus,
// and frozen with reduced motion. The link buttons above are the real way to reach each link.

const H = 150;
const BELT_Y = 122; // belt centreline
const SPEED = 38; // px per second
const BAG_W = 176;
const BAG_H = 112;
const GAP = 215; // distance between bag starts

export const Carousel = ({ count, renderBag }: { count: number; renderBag: (i: number, copy: boolean) => React.ReactNode }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const bagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slats = useRef<SVGPathElement>(null);
  const [w, setW] = useState(1200);
  const n = Math.max(count, Math.ceil((w + BAG_W) / GAP) + 1);
  const span = n * GAP;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let s = 0;
    let last = 0;
    let raf = 0;
    let visible = false;
    let paused = false;
    const place = () => {
      bagRefs.current.forEach((bag, i) => {
        if (!bag) return;
        const x = ((s + i * GAP) % span) - BAG_W;
        bag.style.transform = `translate3d(${x.toFixed(1)}px, ${BELT_Y - 6 - BAG_H}px, 0)`;
      });
      slats.current?.setAttribute("stroke-dashoffset", (-s).toFixed(1));
    };
    const loop = (t: number) => {
      if (last) s += ((t - last) / 1000) * SPEED;
      last = t;
      place();
      raf = requestAnimationFrame(loop);
    };
    const update = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (visible && !paused && !reduced) raf = requestAnimationFrame(loop);
    };
    place();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    io.observe(el);
    const pause = () => {
      paused = true;
      update();
    };
    const resume = () => {
      paused = false;
      update();
    };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [span]);

  const belt = `M0 ${BELT_Y} L${w} ${BELT_Y}`;
  return (
    <div ref={wrap} aria-hidden="true" className="relative overflow-hidden" style={{ height: H }}>
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${H}`} preserveAspectRatio="none">
        {/* Skirt, then the belt: dark rim, rubber surface, moving slats, a lit edge. */}
        <path d={`M0 ${BELT_Y + 18} L${w} ${BELT_Y + 18}`} stroke="rgb(var(--floor))" strokeWidth="16" />
        <path d={belt} stroke="#0b0b0c" strokeWidth="36" />
        <path d={belt} stroke="#3a3d43" strokeWidth="30" />
        <path ref={slats} d={belt} stroke="#1c1e21" strokeWidth="30" strokeDasharray="2.5 36" />
        <path d={belt} stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" transform="translate(0 -14)" />
      </svg>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            bagRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ width: BAG_W }}
        >
          {renderBag(i % count, i >= count)}
        </div>
      ))}
    </div>
  );
};

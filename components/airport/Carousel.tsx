"use client";

import React, { useEffect, useRef, useState } from "react";

// A baggage carousel seen from the side: bags ride the front belt, curve round the far end,
// and come back along the back belt, smaller and dimmer because they're further away.
// Positions are set in a requestAnimationFrame loop, paused off-screen, on hover or focus,
// and frozen with reduced motion.

const H = 250;
const FRONT = 205; // belt centreline, front run
const BACK = 95; // belt centreline, back run
const X0 = -220; // both runs start/end off-screen on the left
const SPEED = 38; // px per second
const BAG_W = 176;
const BAG_H = 112;

type Geo = { xc: number; rx: number; ry: number; cy: number; L1: number; C: number; T: number };

const geometry = (w: number): Geo => {
  const xc = Math.max(160, w - (w < 640 ? 90 : 150));
  const rx = w < 640 ? 70 : 95;
  const ry = (FRONT - BACK) / 2;
  const L1 = xc - X0;
  const C = Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
  return { xc, rx, ry, cy: (FRONT + BACK) / 2, L1, C, T: 2 * L1 + C };
};

/** Point on the loop at distance s, plus how near the front it is (1 = front, 0 = back). */
const at = (g: Geo, s: number) => {
  s = ((s % g.T) + g.T) % g.T;
  if (s < g.L1) return { x: X0 + s, y: FRONT, depth: 1 };
  if (s < g.L1 + g.C) {
    const th = ((s - g.L1) / g.C) * Math.PI;
    return { x: g.xc + g.rx * Math.sin(th), y: g.cy + g.ry * Math.cos(th), depth: (1 + Math.cos(th)) / 2 };
  }
  return { x: g.xc - (s - g.L1 - g.C), y: BACK, depth: 0 };
};

export const Carousel = ({ count, renderBag }: { count: number; renderBag: (i: number, copy: boolean) => React.ReactNode }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const bagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slats = useRef<SVGPathElement>(null);
  const [w, setW] = useState(1200);
  const g = geometry(w);
  const n = Math.max(count, Math.floor(g.T / 215));

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
      const spacing = g.T / n;
      bagRefs.current.forEach((bag, i) => {
        if (!bag) return;
        const p = at(g, s + i * spacing);
        const scale = 0.74 + 0.26 * p.depth;
        bag.style.transform = `translate3d(${(p.x - (BAG_W * scale) / 2).toFixed(1)}px, ${(p.y - 6 - BAG_H * scale).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        bag.style.zIndex = String(Math.round(p.depth * 20));
        bag.style.filter = `brightness(${(0.62 + 0.38 * p.depth).toFixed(2)})`;
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
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [g.T, g.L1, g.C, g.xc, g.rx, g.ry, g.cy, n]);

  const loopPath = `M${X0} ${FRONT} L${g.xc} ${FRONT} A ${g.rx} ${g.ry} 0 0 0 ${g.xc} ${BACK} L${X0} ${BACK}`;
  const island = `M${X0} ${BACK + 15} L${g.xc} ${BACK + 15} A ${g.rx - 15} ${g.ry - 15} 0 0 1 ${g.xc} ${FRONT - 15} L${X0} ${FRONT - 15} Z`;
  const skirt = `M${X0} ${FRONT + 18} L${g.xc} ${FRONT + 18} A ${g.rx + 18} ${g.ry + 18} 0 0 0 ${g.xc + g.rx + 18} ${g.cy}`;

  return (
    <div ref={wrap} className="relative overflow-hidden" style={{ height: H }}>
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="belt-island" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" style={{ stopColor: "rgb(var(--edge))" }} />
            <stop offset="1" style={{ stopColor: "rgb(var(--raised))" }} />
          </linearGradient>
        </defs>
        {/* Skirt under the front run and the turn. */}
        <path d={skirt} fill="none" stroke="rgb(var(--floor))" strokeWidth="16" />
        {/* Belt: dark rim, rubber surface, moving slats. */}
        <path d={loopPath} fill="none" stroke="#0b0b0c" strokeWidth="36" />
        <path d={loopPath} fill="none" stroke="#3a3d43" strokeWidth="30" />
        <path ref={slats} d={loopPath} fill="none" stroke="#1c1e21" strokeWidth="30" strokeDasharray="2.5 36" />
        <path d={loopPath} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" transform="translate(0 -14)" />
        {/* Steel island in the middle. */}
        <path d={island} fill="url(#belt-island)" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />
        <path d={`M${X0} ${BACK + 15} L${g.xc} ${BACK + 15}`} stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      </svg>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            bagRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{ width: BAG_W }}
        >
          {renderBag(i % count, i >= count)}
        </div>
      ))}
    </div>
  );
};

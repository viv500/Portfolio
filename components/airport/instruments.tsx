"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";

// Classic "six-pack" flight instruments, drawn in a 200×200 viewBox centred on (100, 100).
// Each takes `p`, a 0→1 motion value that runs when the panel scrolls into view.

const r2 = (n: number) => Math.round(n * 100) / 100;
const polar = (deg: number, r: number) => [r2(100 + Math.sin((deg * Math.PI) / 180) * r), r2(100 - Math.cos((deg * Math.PI) / 180) * r)] as const;
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = polar(from, r);
  const [x2, y2] = polar(to, r);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

const INK = "rgb(var(--ink))";
const DIM = "rgb(var(--ink) / 0.55)";

const Ticks = ({ from, to, count, major = 2, r = 86, color = INK }: { from: number; to: number; count: number; major?: number; r?: number; color?: string }) => (
  <>
    {Array.from({ length: count + 1 }).map((_, i) => {
      const a = from + ((to - from) * i) / count;
      const big = i % major === 0;
      const [x1, y1] = polar(a, big ? r - 11 : r - 6);
      const [x2, y2] = polar(a, r);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={big ? 2.4 : 1.2} />;
    })}
  </>
);

const Numbers = ({ items, r = 64, size = 13 }: { items: { a: number; t: string }[]; r?: number; size?: number }) => (
  <>
    {items.map(({ a, t }) => {
      const [x, y] = polar(a, r);
      return (
        <text key={t + a} x={x} y={r2(y + size * 0.36)} fill={INK} fontSize={size} fontWeight="700" textAnchor="middle" fontFamily="var(--font-sign), sans-serif">
          {t}
        </text>
      );
    })}
  </>
);

/** A pointer needle that rotates about the centre. */
const Needle = ({ angle, length = 74, width = 4, color = "rgb(var(--ink))", tail = 14 }: { angle: MotionValue<number>; length?: number; width?: number; color?: string; tail?: number }) => (
  <motion.g style={{ rotate: angle, originX: "100px", originY: "100px" }}>
    <path d={`M ${100 - width / 2} ${100 + tail} L ${100 - width / 2} ${100 - length + 10} L 100 ${100 - length} L ${100 + width / 2} ${100 - length + 10} L ${100 + width / 2} ${100 + tail} Z`} fill={color} />
  </motion.g>
);

const Hub = () => <circle cx="100" cy="100" r="7" fill="#1a1c20" stroke="rgb(var(--edge))" strokeWidth="1.5" />;

const Caption = ({ y, children, size = 8 }: { y: number; children: React.ReactNode; size?: number }) => (
  <text x="100" y={y} fill={DIM} fontSize={size} textAnchor="middle" letterSpacing="1.5" fontFamily="var(--font-mono), monospace">
    {children}
  </text>
);

// ── Airspeed: % faster builds ───────────────────────────────────────────
export const Airspeed = ({ p, value }: { p: MotionValue<number>; value: number }) => {
  const ang = (v: number) => -150 + v * 3; // 0..100 → -150..150
  const angle = useTransform(p, (t) => ang(value * t + Math.sin(t * Math.PI) * 6));
  return (
    <>
      <path d={arc(ang(0), ang(30), 80)} stroke={INK} strokeWidth="4" fill="none" />
      <path d={arc(ang(30), ang(70), 82)} stroke="rgb(var(--ops))" strokeWidth="6" fill="none" />
      <path d={arc(ang(70), ang(90), 82)} stroke="rgb(var(--live))" strokeWidth="6" fill="none" />
      <line x1={polar(ang(90), 70)[0]} y1={polar(ang(90), 70)[1]} x2={polar(ang(90), 88)[0]} y2={polar(ang(90), 88)[1]} stroke="rgb(var(--alert))" strokeWidth="3.5" />
      <Ticks from={ang(0)} to={ang(100)} count={20} />
      <Numbers items={[0, 20, 40, 60, 80, 100].map((v) => ({ a: ang(v), t: String(v) }))} r={62} />
      <Caption y={74}>BUILD SPEED</Caption>
      <Caption y={136}>% FASTER</Caption>
      <Needle angle={angle} />
      <Hub />
    </>
  );
};

// ── Attitude indicator: teams adopted (the tool is stable, wings level) ───
export const Attitude = ({ p }: { p: MotionValue<number> }) => {
  // Bank in, overshoot and settle level.
  const bank = useTransform(p, (t) => -28 * Math.cos(t * Math.PI * 2.5) * (1 - t));
  const pitch = useTransform(p, (t) => 14 * (1 - t) * Math.sin(t * Math.PI * 3));
  return (
    <>
      <defs>
        <clipPath id="att-clip">
          <circle cx="100" cy="100" r="84" />
        </clipPath>
        <linearGradient id="att-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1f5f9e" />
          <stop offset="1" stopColor="#5fa6d8" />
        </linearGradient>
        <linearGradient id="att-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8a5a2b" />
          <stop offset="1" stopColor="#4a2e14" />
        </linearGradient>
      </defs>
      <g clipPath="url(#att-clip)">
        <motion.g style={{ rotate: bank, y: pitch, originX: "100px", originY: "100px" }}>
          <rect x="-60" y="-60" width="320" height="160" fill="url(#att-sky)" />
          <rect x="-60" y="100" width="320" height="160" fill="url(#att-ground)" />
          <line x1="-60" y1="100" x2="260" y2="100" stroke="#fff" strokeWidth="2" />
          {[-20, -10, 10, 20].map((d) => (
            <line key={d} x1={100 - (Math.abs(d) === 10 ? 18 : 28)} x2={100 + (Math.abs(d) === 10 ? 18 : 28)} y1={100 - d * 2} y2={100 - d * 2} stroke="#fff" strokeWidth="1.5" opacity="0.85" />
          ))}
        </motion.g>
      </g>
      {/* Bank scale. */}
      {[-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60].map((a) => {
        const [x1, y1] = polar(a, 84);
        const [x2, y2] = polar(a, a % 30 === 0 ? 72 : 77);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={a % 30 === 0 ? 2.4 : 1.4} />;
      })}
      <path d="M100 18 l-5 -9 h10 z" fill="rgb(var(--live))" />
      {/* Fixed aircraft symbol. */}
      <path d="M48 100 h30 l8 9 M152 100 h-30 l-8 9" stroke="rgb(var(--live))" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="3.5" fill="rgb(var(--live))" />
    </>
  );
};

// ── Altimeter: hours saved per allocation ───────────────────────────────
export const Altimeter = ({ p, value }: { p: MotionValue<number>; value: number }) => {
  const long = useTransform(p, (t) => value * t * 36 * 10); // the long hand sweeps the dial several times
  const short = useTransform(p, (t) => value * t * 36);
  const [drum, setDrum] = React.useState("00.0");
  useMotionValueEvent(p, "change", (t) => setDrum((value * t).toFixed(1).padStart(4, "0")));
  return (
    <>
      <Ticks from={0} to={360} count={50} major={5} />
      <Numbers items={Array.from({ length: 10 }).map((_, i) => ({ a: i * 36, t: String(i) }))} r={64} size={15} />
      {/* Counter drum. */}
      <rect x="80" y="128" width="40" height="18" rx="2" fill="#050607" stroke="rgb(var(--edge))" />
      <text x="100" y="141.5" fill={INK} fontSize="11" textAnchor="middle" fontFamily="var(--font-mono), monospace">
        {drum}
      </text>
      <Caption y={76}>HRS SAVED</Caption>
      <Needle angle={short} length={46} width={7} />
      <Needle angle={long} length={78} width={3.5} />
      <Hub />
    </>
  );
};

// ── Turn coordinator: hours a week of context switching saved ───────────
export const TurnCoordinator = ({ p }: { p: MotionValue<number> }) => {
  const bank = useTransform(p, (t) => -20 * t);
  const ball = useTransform(p, (t) => Math.sin(t * Math.PI * 2) * 10 * (1 - t));
  return (
    <>
      {/* Standard-rate marks at 20° each way. */}
      {[-90, -70, 70, 90].map((a) => {
        const [x1, y1] = polar(a + 0, 84);
        const [x2, y2] = polar(a, 68);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth="3" />;
      })}
      <text x="40" y="132" fill={INK} fontSize="13" fontWeight="700" fontFamily="var(--font-sign), sans-serif">L</text>
      <text x="152" y="132" fill={INK} fontSize="13" fontWeight="700" fontFamily="var(--font-sign), sans-serif">R</text>
      <Caption y={50}>TURN COORDINATOR</Caption>
      <Caption y={62} size={7}>20 HRS / WK</Caption>
      <motion.g style={{ rotate: bank, originX: "100px", originY: "100px" }}>
        <path d="M30 100 H170" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="100" cy="100" r="9" fill={INK} />
        <path d="M100 91 V78 M92 82 h16" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
      {/* Inclinometer. */}
      <path d="M62 150 Q100 166 138 150" stroke="rgb(var(--edge))" strokeWidth="16" fill="none" strokeLinecap="round" />
      <line x1="92" y1="148" x2="92" y2="164" stroke={DIM} />
      <line x1="108" y1="148" x2="108" y2="164" stroke={DIM} />
      <motion.circle cx="100" cy="157" r="6" fill="#0a0a0a" stroke="rgb(var(--ink) / 0.4)" style={{ x: ball }} />
    </>
  );
};

// ── Heading indicator: pipelines migrated (heading 020) ─────────────────
export const Heading = ({ p, value }: { p: MotionValue<number>; value: number }) => {
  const card = useTransform(p, (t) => -(value * t) - (1 - t) * 90);
  return (
    <>
      <motion.g style={{ rotate: card, originX: "100px", originY: "100px" }}>
        <Ticks from={0} to={360} count={72} major={2} r={86} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = i * 30;
          const t = ["N", "3", "6", "E", "12", "15", "S", "21", "24", "W", "30", "33"][i];
          const [x, y] = polar(a, 62);
          return (
            <text key={t} x={x} y={r2(y + 5)} fill={/[NESW]/.test(t) ? "rgb(var(--sign))" : INK} fontSize={/[NESW]/.test(t) ? 17 : 13} fontWeight="700" textAnchor="middle" fontFamily="var(--font-sign), sans-serif" transform={`rotate(${a} ${x} ${r2(y)})`}>
              {t}
            </text>
          );
        })}
      </motion.g>
      {/* Lubber line and aircraft. */}
      <path d="M100 10 l-6 10 h12 z" fill="rgb(var(--live))" />
      <path d="M100 74 V128 M78 96 H122 M90 124 H110" stroke="rgb(var(--live))" strokeWidth="4" strokeLinecap="round" />
      <Caption y={150}>PIPELINES</Caption>
    </>
  );
};

// ── Vertical speed: API latency down 35% ────────────────────────────────
export const VerticalSpeed = ({ p, value }: { p: MotionValue<number>; value: number }) => {
  const ang = (v: number) => 270 + v * 4.25; // 0 at nine o'clock, up clockwise, down anticlockwise
  const angle = useTransform(p, (t) => ang(-value * t));
  return (
    <>
      <Ticks from={ang(-40)} to={ang(40)} count={16} />
      <Numbers items={[-40, -30, -20, -10, 0, 10, 20, 30].map((v) => ({ a: ang(v), t: String(Math.abs(v)) }))} r={62} />
      <text x="118" y="78" fill={DIM} fontSize="9" fontFamily="var(--font-mono), monospace">UP</text>
      <text x="112" y="130" fill={DIM} fontSize="9" fontFamily="var(--font-mono), monospace">DN</text>
      <Caption y={150}>LATENCY %</Caption>
      <Needle angle={angle} />
      <Hub />
    </>
  );
};

/** Square metal mount with four screws, a recessed black face and glass. */
export const Bezel = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="metal relative aspect-square w-full rounded-[14%] p-[7%]" aria-hidden="true">
    {["left-[5%] top-[5%]", "right-[5%] top-[5%]", "left-[5%] bottom-[5%]", "right-[5%] bottom-[5%]"].map((pos) => (
      <span key={pos} className={`screw absolute ${pos}`} />
    ))}
    <div className="device glass relative h-full w-full rounded-full bg-screen shadow-[inset_0_4px_14px_rgba(0,0,0,0.95),0_0_0_3px_rgb(var(--floor)),0_0_0_5px_rgb(var(--edge)/0.6)]">
      <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={label}>
        {children}
      </svg>
    </div>
  </div>
);

/** A 0→1 progress value that runs once when `ref` scrolls into view. */
export const useInstrumentProgress = (delay = 0) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const p = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      p.set(1);
      return;
    }
    const c = animate(p, 1, { duration: 2.2, delay, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [inView, p, delay]);
  return { ref, p };
};

import React, { memo, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { P, poly, r1 } from "./geometry";

// The throttle quadrant on the pedestal, in the scene's perspective (seen from above and behind):
// a dark body with a lighter top face, a slot per lever, tick scales, the speedbrake (left, DOWN),
// the flap lever (right, in its UP–30 gate at 15), fuel control switches and a PARK BRAKE label.
// The two thrust levers slide forward along their slots, driven by one motion value (0 idle →
// 1 take-off thrust): a transform only, so nothing re-renders while they move.
// No filters; flat shapes and gradients; static parts memoised.

const TOP_Y = -0.6; // the quadrant's top face (the pedestal is at -0.66)
const AFT_Z = 0.78; // its aft (near) edge
const FWD_Z = 1.0; // its forward edge
const HALF_W = 0.115;
const THRUST_X = [-0.028, 0.028];
const SPEEDBRAKE_X = -0.088;
const FLAP_X = 0.088;
const SLOT_FROM = 0.795;
const SLOT_TO = 0.975;
/** Thrust lever travel along the slot (z of the grip), idle → take-off. */
const LEVER_Z = [0.8, 0.905] as const;
const GRIP_Y = -0.53;
const FLAP_DETENTS: [string, number][] = [["UP", 0.965], ["1", 0.94], ["5", 0.915], ["15", 0.89], ["20", 0.865], ["25", 0.84], ["30", 0.815]];

const slot = (X: number, w = 0.006) => poly([[X - w, TOP_Y, SLOT_FROM], [X + w, TOP_Y, SLOT_FROM], [X + w, TOP_Y, SLOT_TO], [X - w, TOP_Y, SLOT_TO]]);
const tickAt = (X: number, z: number, len: number) => {
  const [x1, y1] = P(X, TOP_Y, z);
  const [x2] = P(X + len, TOP_Y, z);
  return `M${r1(x1)} ${r1(y1)} H${r1(x2)}`;
};

/** A small grip drawn in local units at depth 1, placed by translate + scale(1/z). */
const placed = (X: number, Y: number, z: number) => {
  const [x, y] = P(X, Y, z);
  return `translate(${r1(x)} ${r1(y)}) scale(${(1 / z).toFixed(4)})`;
};

const Body = memo(function Body() {
  const top = poly([[-HALF_W, TOP_Y, AFT_Z], [HALF_W, TOP_Y, AFT_Z], [HALF_W, TOP_Y, FWD_Z], [-HALF_W, TOP_Y, FWD_Z]]);
  const front = poly([[-HALF_W, TOP_Y, AFT_Z], [HALF_W, TOP_Y, AFT_Z], [HALF_W, -0.66, AFT_Z], [-HALF_W, -0.66, AFT_Z]]);
  const [fx, fy] = P(0, -0.63, AFT_Z); // middle of the front face
  const fs = 440 / AFT_Z;
  const ticks = THRUST_X.flatMap((X) => [0.82, 0.85, 0.88, 0.91, 0.94, 0.965].map((z, i) => tickAt(X + (X < 0 ? -0.02 : 0.012), z, i % 2 ? 0.006 : 0.009)));
  const flapGate = FLAP_DETENTS.map(([, z]) => tickAt(FLAP_X + 0.011, z, 0.008));
  return (
    <g>
      <defs>
        <linearGradient id="quad-top" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3b3e44" />
          <stop offset="1" stopColor="#53575e" />
        </linearGradient>
        <linearGradient id="quad-front" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2a2c30" />
          <stop offset="1" stopColor="#17181b" />
        </linearGradient>
        <linearGradient id="grip" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f2f0ea" />
          <stop offset="0.55" stopColor="#d6d3cb" />
          <stop offset="1" stopColor="#9e9b94" />
        </linearGradient>
      </defs>
      {/* Body: lighter top face, darker front face, a lit edge between them. */}
      <path d={top} fill="url(#quad-top)" />
      <path d={front} fill="url(#quad-front)" />
      <path d={`M${P(-HALF_W, TOP_Y, AFT_Z).join(" ")} L${P(HALF_W, TOP_Y, AFT_Z).join(" ")}`} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      {/* Slots. */}
      {[...THRUST_X, SPEEDBRAKE_X, FLAP_X].map((X) => (
        <path key={X} d={slot(X)} fill="#0b0c0e" />
      ))}
      {/* White tick scales beside the thrust slots, and the flap gate with its detent labels. */}
      <path d={[...ticks, ...flapGate].join(" ")} stroke="rgba(255,255,255,0.75)" strokeWidth="0.8" />
      {FLAP_DETENTS.map(([label, z]) => {
        const [x, y] = P(FLAP_X + 0.022, TOP_Y, z);
        return (
          <text key={label} x={r1(x)} y={r1(y + 1.6)} fontSize={r1(0.0105 * (440 / z))} fill="rgba(255,255,255,0.8)" fontFamily="var(--font-mono), monospace">
            {label}
          </text>
        );
      })}
      {/* Speedbrake at DOWN (aft): slim shaft, small pale grip. */}
      <g transform={placed(SPEEDBRAKE_X, -0.585, 0.81)}>
        <rect x="-1.4" y="0" width="2.8" height="6.6" fill="#2a2c30" />
        <path d="M-4 -5 L4 -5 L3 2 L-3 2 Z" fill="url(#grip)" stroke="#5f5c56" strokeWidth="0.5" />
      </g>
      {/* Flap lever in the gate at 15: rectangular grip. */}
      <g transform={placed(FLAP_X, -0.597, 0.89)}>
        <rect x="-1.4" y="0" width="2.8" height="1.4" fill="#2a2c30" />
        <rect x="-6.5" y="-4" width="13" height="5" rx="1" fill="url(#grip)" stroke="#5f5c56" strokeWidth="0.5" />
      </g>
      {/* Front face: two fuel control switches (RUN) and PARK BRAKE. */}
      {THRUST_X.map((X, i) => {
        const [x, y] = P(X, -0.628, AFT_Z);
        return (
          <g key={X}>
            <rect x={r1(x - 0.007 * fs)} y={r1(y - 0.008 * fs)} width={r1(0.014 * fs)} height={r1(0.012 * fs)} rx="1.5" fill="#0d0e10" stroke="#5a5e66" strokeWidth="0.6" />
            <text x={r1(x)} y={r1(y + 0.014 * fs)} fontSize={r1(0.0075 * fs)} fill="rgba(255,255,255,0.7)" textAnchor="middle" fontFamily="var(--font-mono), monospace">
              RUN {i + 1}
            </text>
          </g>
        );
      })}
      <text x={r1(fx - 0.088 * fs)} y={r1(fy + 0.004 * fs)} fontSize={r1(0.0068 * fs)} fill="#e8b04a" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="700">
        PARK BRAKE
      </text>
    </g>
  );
});

/** One thrust lever, in local units at depth 1 (scene units × 440), grip at the origin. */
const LeverArt = memo(function LeverArt({ side }: { side: -1 | 1 }) {
  // The grip runs outward from just beside the centre line: a chunky bone with rounded ends.
  const w = 14;
  const inner = side * 2.6;
  const outer = side * (2.6 + w);
  const x0 = Math.min(inner, outer);
  return (
    <g>
      {/* Shaft down into the slot. */}
      <rect x={-1.6} y="0" width="3.2" height={r1(-(TOP_Y - GRIP_Y) * 440)} fill="#1d1f23" />
      {/* Reverse-thrust lever folded flat against the front of the shaft. */}
      <rect x={side > 0 ? -1 : -5} y="7" width="6" height="2.2" rx="1" fill="#0f1012" />
      {/* Grip. */}
      <path
        d={`M${x0 + 2} -4.4 Q${x0 + w / 2} -2.6 ${x0 + w - 2} -4.4 Q${x0 + w + 1} -4.6 ${x0 + w + 1} 0 Q${x0 + w + 1} 4.6 ${x0 + w - 2} 4.4 Q${x0 + w / 2} 2.6 ${x0 + 2} 4.4 Q${x0 - 1} 4.6 ${x0 - 1} 0 Q${x0 - 1} -4.6 ${x0 + 2} -4.4 Z`}
        fill="url(#grip)"
        stroke="#6b6861"
        strokeWidth="0.5"
      />
      <path d={`M${x0 + 3} -3 Q${x0 + w / 2} -1.6 ${x0 + w - 3} -3`} stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" fill="none" />
      {/* TO/GA button on the front of the grip. */}
      <circle cx={outer - side * 3} cy="0" r="1.6" fill="#101113" />
    </g>
  );
});

const leverAt = (X: number, v: number) => placed(X, GRIP_Y, LEVER_Z[0] + (LEVER_Z[1] - LEVER_Z[0]) * v);

// The transform attribute is written straight from the motion value: no re-render as it moves.
const Lever = ({ X, side, t }: { X: number; side: -1 | 1; t: MotionValue<number> }) => {
  const ref = useRef<SVGGElement>(null);
  useMotionValueEvent(t, "change", (v) => ref.current?.setAttribute("transform", leverAt(X, v)));
  return (
    <g ref={ref} transform={leverAt(X, t.get())}>
      <LeverArt side={side} />
    </g>
  );
};

export const Quadrant = ({ thrust }: { thrust: MotionValue<number> }) => (
  <g>
    <Body />
    <Lever X={THRUST_X[0]} side={-1} t={thrust} />
    <Lever X={THRUST_X[1]} side={1} t={thrust} />
  </g>
);

import React, { memo, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { P, r1 } from "./geometry";

// The 777 throttle quadrant on the pedestal, in the scene's perspective (viewer above and behind):
// a deep, boxy housing whose top surface arcs fore-aft, wide booted slots, two chunky thrust
// levers (the hero) with big grips that read almost as one bar, the speedbrake (left, DOWN) and
// the flap lever (right, in a notched gate at 15), and fuel control toggles on the aft face.
// Static SVG with gradients only (no filters). The thrust lever is one shared drawing (<use>),
// placed by a transform written straight from the take-off timeline: no re-renders as it moves.

const W = 0.13; // housing half-width
const FLOOR_Y = -0.66; // the pedestal surface
const AFT_Z = 0.76; // aft (near) face
const FWD_Z = 1.02; // forward end
const MID_Z = (AFT_Z + FWD_Z) / 2;
/** The top surface arcs fore-aft: highest in the middle, falling away at both ends. */
const topY = (z: number) => -0.58 - 0.05 * ((z - MID_Z) / ((FWD_Z - AFT_Z) / 2)) ** 2;
const THRUST_X = [-0.027, 0.027] as const;
const SPEEDBRAKE_X = -0.094;
const FLAP_X = 0.086;
const SLOT = [0.79, 0.995] as const;
// The thrust levers pivot about a point inside the housing (below the top surface): the grip
// swings on an arc from the aft end of its slot (idle) to the forward end (take-off thrust).
const PIVOT = { Y: -0.675, z: 0.885, R: 0.11 } as const;
const SWING = [-0.72, 0.33] as const; // lever angle from vertical (radians), idle → take-off
// On the near half of the arc: past its crest the surface falls away and compresses everything.
const FLAP_DETENTS: [string, number][] = [["UP", 0.905], ["1", 0.889], ["5", 0.873], ["15", 0.857], ["20", 0.841], ["25", 0.825], ["30", 0.809]];

type Pt = [number, number];
const pt = (X: number, z: number, dy = 0): Pt => P(X, topY(z) + dy, z) as Pt;
const along = (X: number, from: number, to: number, n = 8, dy = 0): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => pt(X, from + ((to - from) * i) / n, dy));
const ptsStr = (pts: Pt[]) => pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(" L");
const closed = (pts: Pt[]) => `M${ptsStr(pts)} Z`;
const open = (pts: Pt[]) => `M${ptsStr(pts)}`;
/** A strip on the arc between two X positions (a face, a slot, a chamfer). */
const strip = (X1: number, X2: number, from = AFT_Z, to = FWD_Z) => closed([...along(X1, from, to), ...along(X2, to, from)]);
const seg = (a: Pt, b: Pt) => `M${r1(a[0])} ${r1(a[1])} L${r1(b[0])} ${r1(b[1])}`;
/** Placement for a part drawn in depth-1 units: translate to the surface point, scale 1/z. */
const placed = (X: number, z: number, stretch = 1) => {
  const [x, y] = pt(X, z);
  const k = 1 / z;
  return `translate(${r1(x)} ${r1(y)}) scale(${k.toFixed(4)} ${(k * stretch).toFixed(4)})`;
};

const Defs = memo(function Defs() {
  return (
    <defs>
      <linearGradient id="q-top" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#4d5057" />
        <stop offset="1" stopColor="#3a3d42" />
      </linearGradient>
      <linearGradient id="q-front" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#2c2e32" />
        <stop offset="1" stopColor="#18191c" />
      </linearGradient>
      <linearGradient id="q-shadow" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.7" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="q-shaft" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#3a3c41" />
        <stop offset="0.6" stopColor="#25272b" />
        <stop offset="1" stopColor="#141518" />
      </linearGradient>
      <linearGradient id="q-grip" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#f3f1ec" />
        <stop offset="0.6" stopColor="#d9d6cf" />
        <stop offset="1" stopColor="#a8a59e" />
      </linearGradient>
      <linearGradient id="q-grip-top" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#e8e6e0" />
      </linearGradient>
      <radialGradient id="q-collar" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#e3e5e9" />
        <stop offset="1" stopColor="#6d7178" />
      </radialGradient>
      {/* The thrust lever, drawn once at depth 1 (scene units × 440), origin at the middle of the
          grip; the shaft runs down from it into the slot. */}
      <g id="q-thrust-lever">
        <ellipse cx="0" cy="16.5" rx="6" ry="1.8" fill="#050506" />
        {/* Tapered shaft: front face and a darker side face. */}
        <path d="M-3.4 3 L1.8 3 L2.4 16.5 L-4.4 16.5 Z" fill="url(#q-shaft)" />
        <path d="M1.8 3 L3.4 3 L4.4 16.5 L2.4 16.5 Z" fill="#0e0f11" />
        {/* Reverse-thrust lever, folded against the front of the main lever. */}
        <rect x="-1.9" y="7.5" width="3.8" height="8" rx="1" fill="#18191c" stroke="#3d4046" strokeWidth="0.5" />
        <rect x="-3.4" y="5.6" width="6.8" height="3" rx="1.2" fill="#8e9298" />
        {/* Grip: a wide rounded block, top face and front face. */}
        <rect x="-11.5" y="-9" width="23" height="7" rx="3" fill="url(#q-grip-top)" />
        <rect x="-11.5" y="-5" width="23" height="10" rx="3.4" fill="url(#q-grip)" stroke="#8d8a83" strokeWidth="0.5" />
        {/* TO/GA button on the front of the grip. */}
        <rect x="-2.4" y="0.6" width="4.8" height="2.6" rx="1" fill="#0b0b0c" />
      </g>
    </defs>
  );
});

/** The housing, slots, gate, markings and the aft panel. Static. */
const Housing = memo(function Housing() {
  const top = strip(-W, W);
  const [fl, fr] = [pt(-W, AFT_Z), pt(W, AFT_Z)];
  const [bl, br] = [P(-W, FLOOR_Y, AFT_Z) as Pt, P(W, FLOOR_Y, AFT_Z) as Pt];
  const front = closed([fl, fr, br, bl]);
  // Chamfers along both top edges, and the outer sides below them, give the box visible thickness.
  const E = W + 0.012;
  const chamferL = strip(-E, -W);
  const chamferR = strip(W, E);
  const sideL = closed([...along(-E, AFT_Z, FWD_Z), ...along(-E, FWD_Z, AFT_Z, 8, -0.016)]);
  const sideR = closed([...along(E, AFT_Z, FWD_Z), ...along(E, FWD_Z, AFT_Z, 8, -0.016)]);
  const shadow = closed([P(-E, FLOOR_Y, AFT_Z) as Pt, P(E, FLOOR_Y, AFT_Z) as Pt, P(E + 0.01, FLOOR_Y, AFT_Z - 0.05) as Pt, P(-E - 0.01, FLOOR_Y, AFT_Z - 0.05) as Pt]);
  const rim = [open(along(-E, AFT_Z, FWD_Z)), open(along(E, AFT_Z, FWD_Z)), seg(pt(-W, FWD_Z), pt(W, FWD_Z))].join(" ");
  const slot = (X: number, half: number) => strip(X - half, X + half, SLOT[0], SLOT[1]);
  const brush = THRUST_X.map((X) => `${open(along(X - 0.006, SLOT[0], SLOT[1]))} ${open(along(X + 0.006, SLOT[0], SLOT[1]))}`).join(" ");
  const ticks = [THRUST_X[0] - 0.024, THRUST_X[1] + 0.017].flatMap((X) =>
    [0.82, 0.85, 0.88, 0.91, 0.94, 0.97].map((z, i) => seg(pt(X, z), pt(X + (i % 2 ? 0.005 : 0.008), z)))
  );
  // The flap gate: notches on its outer edge at each detent.
  const notches = FLAP_DETENTS.map(([, z]) => seg(pt(FLAP_X + 0.007, z), pt(FLAP_X + 0.013, z)));
  const fs = 440 / AFT_Z;
  const frontMidY = (fl[1] + bl[1]) / 2;
  return (
    <g>
      <path d={shadow} fill="url(#q-shadow)" />
      <path d={sideL} fill="#1d1f22" />
      <path d={sideR} fill="#1d1f22" />
      <path d={front} fill="url(#q-front)" />
      <path d={top} fill="url(#q-top)" />
      <path d={chamferL} fill="#5a5d64" />
      <path d={chamferR} fill="#5a5d64" />
      {/* Rim light on the edges facing the windows: warm at golden hour, white by day. */}
      <path d={rim} fill="none" stroke="rgb(var(--sunlit))" strokeOpacity="0.55" strokeWidth="1" />
      <path d={seg(fl, fr)} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      {/* Slots: wide thrust slots with black brush strips; narrower speedbrake and flap slots. */}
      <path d={slot(THRUST_X[0], 0.013)} fill="#060607" />
      <path d={slot(THRUST_X[1], 0.013)} fill="#060607" />
      <path d={slot(SPEEDBRAKE_X, 0.006)} fill="#060607" />
      <path d={slot(FLAP_X, 0.006)} fill="#060607" />
      <path d={brush} stroke="#2b2c30" strokeWidth="1.1" fill="none" />
      <path d={[...ticks, ...notches].join(" ")} stroke="rgba(255,255,255,0.8)" strokeWidth="0.8" />
      {FLAP_DETENTS.map(([label, z]) => {
        const [x, y] = pt(FLAP_X + 0.024, z);
        return (
          <text key={label} x={r1(x)} y={r1(y + 1.8)} fontSize={r1(0.0095 * (440 / z))} fill="rgba(255,255,255,0.85)" fontFamily="var(--font-mono), monospace">
            {label}
          </text>
        );
      })}
      {/* Speedbrake at DOWN: a short lever with a flat paddle grip. */}
      <g transform={placed(SPEEDBRAKE_X, 0.815)}>
        <rect x="-1.8" y="-15" width="3.6" height="15" fill="url(#q-shaft)" />
        <path d="M-7 -22 L7 -22 L5.5 -14 L-5.5 -14 Z" fill="url(#q-grip)" stroke="#8d8a83" strokeWidth="0.5" />
      </g>
      {/* Flap lever in the gate at 15: rectangular grip. */}
      <g transform={placed(FLAP_X, 0.857)}>
        <rect x="-6" y="-3.2" width="12" height="6" rx="1.4" fill="url(#q-grip)" stroke="#8d8a83" strokeWidth="0.5" />
      </g>
      {/* Aft face: fuel control toggles (metal collar, small dark lever) and PARK BRAKE. */}
      {THRUST_X.map((X, i) => {
        const [x] = P(X, 0, AFT_Z);
        return (
          <g key={X}>
            <circle cx={r1(x)} cy={r1(frontMidY + 1)} r={r1(0.0055 * fs)} fill="url(#q-collar)" />
            <rect x={r1(x - 0.0022 * fs)} y={r1(frontMidY + 1 - 0.013 * fs)} width={r1(0.0044 * fs)} height={r1(0.013 * fs)} rx="1" fill="#141518" />
            <text x={r1(x + 0.011 * fs)} y={r1(frontMidY + 3)} fontSize={r1(0.0068 * fs)} fill="rgba(255,255,255,0.75)" fontFamily="var(--font-mono), monospace">
              RUN {i + 1}
            </text>
          </g>
        );
      })}
      <text x={r1(P(-0.1, 0, AFT_Z)[0])} y={r1(frontMidY + 3)} fontSize={r1(0.0066 * fs)} fill="#e8b04a" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="700">
        PARK BRAKE
      </text>
    </g>
  );
});

/** Thrust lever placement at travel v (0 idle → 1 take-off): the grip's point on the swing arc,
 *  scaled for distance (≈1.2 → 1.07), with a slight forward tilt; the drawn shaft length is fixed. */
const leverAt = (X: number, v: number) => {
  const th = SWING[0] + (SWING[1] - SWING[0]) * v;
  const z = PIVOT.z + PIVOT.R * Math.sin(th);
  const [x, y] = P(X, PIVOT.Y + PIVOT.R * Math.cos(th), z);
  const k = 1 / z;
  return `translate(${r1(x)} ${r1(y)}) scale(${k.toFixed(4)} ${(k * (1 - 0.06 * v)).toFixed(4)})`;
};

// The transform attribute is written straight from the motion value: no re-render as it moves.
const Lever = ({ X, t }: { X: number; t: MotionValue<number> }) => {
  const ref = useRef<SVGUseElement>(null);
  useMotionValueEvent(t, "change", (v) => ref.current?.setAttribute("transform", leverAt(X, v)));
  return <use ref={ref} href="#q-thrust-lever" transform={leverAt(X, t.get())} />;
};

export const Quadrant = ({ thrust }: { thrust: MotionValue<number> }) => (
  <g>
    <Defs />
    <Housing />
    <Lever X={THRUST_X[0]} t={thrust} />
    <Lever X={THRUST_X[1]} t={thrust} />
  </g>
);

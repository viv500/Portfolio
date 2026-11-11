import React, { memo } from "react";
import { P, affine, col, poly, ps, r1, type V3 } from "./geometry";
import { EngineDisplay, Memo, Nd, Pfd, SCREEN_H, SCREEN_W } from "./Displays";

// Glareshield, main instrument panel, pedestal and side consoles, all in perspective.

const GS_Y = -0.24; // glareshield top
const LIP_Y = -0.31; // bottom of the glareshield lip
const LIP_Z = 1.12;
const PANEL_Z = 1.14;
const PANEL_BOTTOM = -0.66;

// Points on the angled side sections ("wings") of the main panel, which turn in towards the pilots.
const wingL = (u: number, Y: number): V3 => [-0.3 - 0.6 * u, Y, PANEL_Z - 0.28 * u];
const wingR = (u: number, Y: number): V3 => [0.3 + 0.6 * u, Y, PANEL_Z - 0.28 * u];

/** A display in a recessed bezel, mapped onto the panel, with knobs, glow and glass sheen. */
const Screen = ({ transform, children, knobs = "left" }: { transform: string; children: React.ReactNode; knobs?: "left" | "right" | "none" }) => (
  <g transform={transform}>
    {/* Recess and bezel. */}
    <rect x="-9" y="-8" width={SCREEN_W + 18} height={SCREEN_H + 16} rx="5" fill="#0a0b0d" />
    <rect x="-9" y="-8" width={SCREEN_W + 18} height={SCREEN_H + 16} rx="5" fill="none" stroke={col("rim", 0.18)} strokeWidth="1.2" />
    <rect x="-3" y="-3" width={SCREEN_W + 6} height={SCREEN_H + 6} rx="2" fill="#000" />
    {/* Glow spilling from the screen. */}
    <rect x="-1" y="-1" width={SCREEN_W + 2} height={SCREEN_H + 2} fill="none" stroke="rgba(95,212,232,0.25)" strokeWidth="2" />
    <rect width={SCREEN_W} height={SCREEN_H} style={{ fill: col("screen") }} />
    {children}
    <rect width={SCREEN_W} height={SCREEN_H} fill="url(#screen-sheen)" />
    {knobs !== "none" &&
      [16, 50, 84].map((y) => (
        <g key={y}>
          <circle cx={knobs === "left" ? -5 : SCREEN_W + 5} cy={y} r="3" fill="url(#knob)" stroke="#000" strokeWidth="0.5" />
        </g>
      ))}
  </g>
);

const Structure = memo(function Structure() {
  // Glareshield top surface: from the base of the windscreen back to the lip.
  const [lx, ly] = P(-1.0, GS_Y, LIP_Z);
  const topSurface = `M${lx} ${ly} L246 309 L266 302 L495 282 L505 282 L734 302 L754 309 L${1000 - lx} ${ly} Z`;
  const lip = poly([
    [-1.0, GS_Y, LIP_Z],
    [1.0, GS_Y, LIP_Z],
    [1.0, LIP_Y, LIP_Z],
    [-1.0, LIP_Y, LIP_Z],
  ]);
  const centre = poly([[-0.3, LIP_Y, PANEL_Z], [0.3, LIP_Y, PANEL_Z], [0.3, PANEL_BOTTOM, PANEL_Z], [-0.3, PANEL_BOTTOM, PANEL_Z]]);
  const wingLeft = poly([wingL(0, LIP_Y), wingL(1, LIP_Y), wingL(1, PANEL_BOTTOM), wingL(0, PANEL_BOTTOM)]);
  const wingRight = poly([wingR(0, LIP_Y), wingR(1, LIP_Y), wingR(1, PANEL_BOTTOM), wingR(0, PANEL_BOTTOM)]);
  // Pedestal between the seats, and the side consoles under the side windows.
  const pedestal = poly([[-0.17, -0.66, 1.12], [0.17, -0.66, 1.12], [0.19, -0.66, 0.45], [-0.19, -0.66, 0.45]]);
  const pedFrontL = poly([[-0.17, -0.66, 1.12], [-0.19, -0.66, 0.45], [-0.19, -1.2, 0.45], [-0.17, -1.2, 1.12]]);
  const pedFrontR = poly([[0.17, -0.66, 1.12], [0.19, -0.66, 0.45], [0.19, -1.2, 0.45], [0.17, -1.2, 1.12]]);
  // Side consoles sit under the side windows: wall at X ±1.05, console top at Y -0.45.
  const consoleTopL = poly([[-1.05, -0.45, 1.22], [-0.8, -0.45, 1.16], [-0.8, -0.45, 0.45], [-1.05, -0.45, 0.45]]);
  const consoleTopR = poly([[1.05, -0.45, 1.22], [0.8, -0.45, 1.16], [0.8, -0.45, 0.45], [1.05, -0.45, 0.45]]);
  const consoleWallL = poly([[-1.05, -0.37, 1.24], [-1.05, -0.37, 0.45], [-1.05, -0.45, 0.45], [-1.05, -0.45, 1.22]]);
  const consoleWallR = poly([[1.05, -0.37, 1.24], [1.05, -0.37, 0.45], [1.05, -0.45, 0.45], [1.05, -0.45, 1.22]]);
  const consoleFaceL = poly([[-0.8, -0.45, 1.16], [-0.8, -0.45, 0.45], [-0.8, -1.1, 0.45], [-0.8, -1.1, 1.16]]);
  const consoleFaceR = poly([[0.8, -0.45, 1.16], [0.8, -0.45, 0.45], [0.8, -1.1, 0.45], [0.8, -1.1, 1.16]]);
  const [tx, ty] = P(-0.92, -0.45, 1.0);
  const tillerR = (0.05 * 440) / 1.0;
  return (
    <g>
      {/* Main panel. */}
      <path d={wingLeft} fill="url(#wing-l)" />
      <path d={wingRight} fill="url(#wing-r)" />
      <path d={centre} fill="url(#panel-centre)" />
      <path d={`M${ps(wingL(0, LIP_Y))} L${ps(wingL(0, PANEL_BOTTOM))} M${ps(wingR(0, LIP_Y))} L${ps(wingR(0, PANEL_BOTTOM))}`} stroke="rgba(0,0,0,0.6)" strokeWidth="1.6" />
      {/* Shadow under the glareshield. */}
      <path d={poly([wingL(1, LIP_Y), wingR(1, LIP_Y), wingR(1, LIP_Y - 0.07), wingL(1, LIP_Y - 0.07)])} fill="url(#under-gs)" />

      {/* Side consoles with the tiller and armrests. */}
      <path d={consoleWallL} style={{ fill: col("cabin-dark") }} />
      <path d={consoleWallR} style={{ fill: col("cabin-dark") }} />
      <path d={consoleTopL} fill="url(#console-top)" />
      <path d={consoleTopR} fill="url(#console-top)" />
      <path d={consoleFaceL} style={{ fill: col("cabin-mid") }} />
      <path d={consoleFaceR} style={{ fill: col("cabin-mid") }} />
      <ellipse cx={tx} cy={r1(ty - 3)} rx={r1(tillerR)} ry={r1(tillerR * 0.42)} fill="#121316" stroke="#3b3f46" strokeWidth="2.5" />
      <circle cx={r1(tx + tillerR * 0.7)} cy={r1(ty - 6)} r="4" fill="#2b2e33" />
      <path d="M-40 600 C -10 520, 70 500, 120 520 C 150 530, 150 570, 140 600 Z" style={{ fill: col("cabin-dark") }} />
      <path d="M1040 600 C 1010 520, 930 500, 880 520 C 850 530, 850 570, 860 600 Z" style={{ fill: col("cabin-dark") }} />
      <path d="M-40 600 C -10 520, 70 500, 120 520" fill="none" stroke={col("rim", 0.25)} strokeWidth="1.5" />
      <path d="M1040 600 C 1010 520, 930 500, 880 520" fill="none" stroke={col("rim", 0.25)} strokeWidth="1.5" />

      {/* Pedestal. */}
      <path d={pedFrontL} style={{ fill: col("cabin-dark") }} />
      <path d={pedFrontR} style={{ fill: col("cabin-dark") }} />
      <path d={pedestal} fill="url(#pedestal)" />

      {/* Glareshield: top surface catching the sky, and the padded lip. */}
      <path d={topSurface} fill="url(#gs-top)" />
      <path d="M266 302 L495 282 M505 282 L734 302" stroke={col("rim", 0.5)} strokeWidth="1.5" />
      <path d={lip} fill="url(#gs-lip)" />
      <path d={`M${ps([-1.0, GS_Y, LIP_Z])} L${ps([1.0, GS_Y, LIP_Z])}`} stroke={col("rim", 0.35)} strokeWidth="1.4" />
      {/* Faint glow from the screens onto the underside of the lip. */}
      <ellipse cx="500" cy={P(0, LIP_Y, LIP_Z)[1]} rx="330" ry="10" fill="url(#lip-glow)" />
    </g>
  );
});

/** Autopilot control unit on the glareshield. These are targets, so they're labelled as such. */
const Fcu = memo(function Fcu() {
  const t = affine([-0.22, -0.248, LIP_Z - 0.004], [0.22, -0.248, LIP_Z - 0.004], [-0.22, -0.302, LIP_Z - 0.004], 220, 26);
  const windows = [
    { x: 62, label: "SPD", value: "160" },
    { x: 108, label: "HDG", value: "020" },
    { x: 158, label: "ALT", value: "5000" },
    { x: 204, label: "V/S", value: "-----" },
  ];
  return (
    <g transform={t} style={{ fontFamily: "var(--font-mono), monospace" }}>
      <rect width="220" height="26" rx="2" fill="#1a1c20" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
      <text x="5" y="12" fontSize="4.5" fill="rgba(255,255,255,0.6)">
        FCU
      </text>
      <text x="5" y="18" fontSize="4.5" fill="rgba(255,255,255,0.6)">
        TARGETS
      </text>
      {windows.map((w) => (
        <g key={w.label}>
          <text x={w.x} y="7" fontSize="4.5" fill="rgba(255,255,255,0.75)" textAnchor="middle">
            {w.label}
          </text>
          <rect x={w.x - 15} y="9" width="30" height="10" rx="1" fill="#050607" />
          <text x={w.x} y="16.8" fontSize="7.5" fill="#ffb000" textAnchor="middle">
            {w.value}
          </text>
          <circle cx={w.x} cy="23" r="2.4" fill="url(#knob)" />
        </g>
      ))}
    </g>
  );
});

export const Panel = ({
  ias,
  alt,
  pitch,
  n1,
  egt,
  ff,
  thrust,
  airborne,
  fma,
}: {
  ias: number;
  alt: number;
  pitch: number;
  n1: number;
  egt: number;
  ff: number;
  thrust: number;
  airborne: boolean;
  fma: [string, string, string];
}) => {
  const pfdL = affine(wingL(0.88, -0.35), wingL(0.52, -0.35), wingL(0.88, -0.54), SCREEN_W, SCREEN_H);
  const ndL = affine(wingL(0.44, -0.35), wingL(0.08, -0.35), wingL(0.44, -0.54), SCREEN_W, SCREEN_H);
  const ndR = affine(wingR(0.08, -0.35), wingR(0.44, -0.35), wingR(0.08, -0.54), SCREEN_W, SCREEN_H);
  const pfdR = affine(wingR(0.52, -0.35), wingR(0.88, -0.35), wingR(0.52, -0.54), SCREEN_W, SCREEN_H);
  const ewd = affine([-0.115, -0.335, PANEL_Z], [0.115, -0.335, PANEL_Z], [-0.115, -0.49, PANEL_Z], SCREEN_W, SCREEN_H);
  const sd = affine([-0.115, -0.51, PANEL_Z], [0.115, -0.51, PANEL_Z], [-0.115, -0.665, PANEL_Z], SCREEN_W, SCREEN_H);
  const gs = Math.round(ias);
  const nm = 6153 - Math.round(alt / 600);
  // Thrust levers move forward from idle as thrust is set.
  const levers = [-0.05, 0.05].map((X) => {
    const [bx, by] = P(X, -0.66, 0.86);
    const [hx, hy] = P(X, -0.55, 0.78 + thrust * 0.16);
    return { bx, by, hx, hy, s: 440 / (0.78 + thrust * 0.16) };
  });
  return (
    <g>
      <PanelDefs />
      <Structure />
      <Screen transform={pfdL}>
        <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
      </Screen>
      <Screen transform={ndL} knobs="none">
        <Nd gs={gs} nm={nm} />
      </Screen>
      <Screen transform={ewd} knobs="none">
        <EngineDisplay n1={n1} egt={egt} ff={ff} />
      </Screen>
      <Screen transform={sd} knobs="none">
        <Memo airborne={airborne} />
      </Screen>
      <Screen transform={ndR} knobs="none">
        <Nd gs={gs} nm={nm} />
      </Screen>
      <Screen transform={pfdR} knobs="right">
        <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
      </Screen>
      {levers.map((l, i) => (
        <g key={i}>
          <line x1={l.bx} y1={l.by} x2={l.hx} y2={l.hy} stroke="#1b1d21" strokeWidth={r1(0.02 * l.s)} strokeLinecap="round" />
          <rect x={r1(l.hx - 0.035 * l.s)} y={r1(l.hy - 0.014 * l.s)} width={r1(0.07 * l.s)} height={r1(0.028 * l.s)} rx="5" fill="url(#lever)" stroke="rgba(255,255,255,0.15)" />
        </g>
      ))}
      <Fcu />
    </g>
  );
};

const PanelDefs = memo(function PanelDefs() {
  return (
    <defs>
      <linearGradient id="wing-l" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
        <stop offset="1" style={{ stopColor: col("cabin-mid") }} />
      </linearGradient>
      <linearGradient id="wing-r" x1="1" x2="0" y1="0" y2="0">
        <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
        <stop offset="1" style={{ stopColor: col("cabin-mid") }} />
      </linearGradient>
      <linearGradient id="panel-centre" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: col("cabin-mid") }} />
        <stop offset="1" style={{ stopColor: col("cabin-dark") }} />
      </linearGradient>
      <linearGradient id="under-gs" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0.6" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gs-top" x1="0" x2="0" y1="1" y2="0">
        <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
        <stop offset="1" style={{ stopColor: col("cabin") }} />
      </linearGradient>
      <linearGradient id="gs-lip" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: col("cabin") }} />
        <stop offset="0.35" style={{ stopColor: col("cabin-mid") }} />
        <stop offset="1" style={{ stopColor: col("cabin-dark") }} />
      </linearGradient>
      <radialGradient id="lip-glow">
        <stop offset="0" stopColor="rgb(95,212,232)" stopOpacity="0.16" />
        <stop offset="1" stopColor="rgb(95,212,232)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="console-top" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: col("cabin") }} />
        <stop offset="1" style={{ stopColor: col("cabin-dark") }} />
      </linearGradient>
      <linearGradient id="pedestal" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: col("cabin-mid") }} />
        <stop offset="1" style={{ stopColor: col("cabin-dark") }} />
      </linearGradient>
      <linearGradient id="screen-sheen" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
        <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="knob" cx="0.35" cy="0.3" r="0.7">
        <stop offset="0" stopColor="#62676f" />
        <stop offset="1" stopColor="#16171a" />
      </radialGradient>
      <linearGradient id="lever" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#4a4e55" />
        <stop offset="1" stopColor="#1b1d21" />
      </linearGradient>
    </defs>
  );
});

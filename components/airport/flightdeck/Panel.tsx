import React, { memo } from "react";
import { P, SILL, affine, col, poly, ps, r1, type V3 } from "./geometry";
import { Eicas, Isfd, Nd, Pfd, SCREEN_H, SCREEN_W } from "./Displays";
import { Yoke } from "./Yoke";

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

// ── Glareshield hood (screen space) ─────────────────────────────────────
// A thin hood: a narrow top surface from the window sill to a rounded front lip that overhangs
// the displays. Flat across the front panes, wrapping down along the side-window sills.
const SHIFT = 40; // the panel below sits this much higher than its 3D layout, tucked under the hood
const LIP: [number, number][] = [[-220, 352], [-166, 346], [16, 330], [40, 324], [222, 288], [262, 280], [500, 280], [738, 280], [778, 288], [960, 324], [984, 330], [1166, 346], [1220, 352]];
const LIP_DEPTH = 24;
const line = (pts: [number, number][], dy = 0) => pts.map(([x, y]) => `${x} ${y + dy}`).join(" L");
const LIP_TOP = `M${line(LIP)}`;
const HOOD_TOP_MID = 280;
/** Where the window sill is at x, along the front panes. */
const sillAt = (x: number) => {
  for (let i = 1; i < SILL.length; i++) {
    const [x0, y0] = SILL[i - 1];
    const [x1, y1] = SILL[i];
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return SILL[SILL.length - 1][1];
};

const Hood = memo(function Hood() {
  const sill = SILL.map((p) => p.join(" ")).join(" L");
  const top = `M${sill} L${line([...LIP].reverse())} Z`;
  const lip = `M${line(LIP)} L${line([...LIP].reverse(), LIP_DEPTH)} Z`;
  // Defog vents: a row of small slots just in front of the windshield base.
  const vents = Array.from({ length: 30 }, (_, i) => 262 + i * 16.4)
    .filter((x) => Math.abs(x - 500) > 14)
    .map((x) => {
      const y = sillAt(x) + 6;
      return `M${r1(x - 5)} ${r1(y)} h10 v2.2 h-10 Z`;
    })
    .join(" ");
  return (
    <g>
      {/* Soft shadow cast onto the displays below the lip. */}
      <path d={`M${line(LIP, LIP_DEPTH)} L${line([...LIP].reverse(), LIP_DEPTH + 22)} Z`} fill="url(#under-gs)" />
      {/* Top surface: dark matte, a faint texture, and a soft reflection of the sky near the glass. */}
      <path d={top} fill="url(#gs-top)" />
      <path d={top} fill="url(#gs-grain)" />
      <path d={top} fill="url(#gs-reflect)" />
      <path d={vents} fill="rgba(0,0,0,0.55)" />
      <path d={`M${sill}`} fill="none" stroke={col("rim", 0.45)} strokeWidth="1.4" />
      <path d={lip} fill="url(#gs-lip)" />
      <path d={LIP_TOP} fill="none" stroke={col("rim", 0.35)} strokeWidth="1.6" />
      {/* Sunlight through the front panes, with hard shadows from the pillars and centre post. */}
      <g style={{ opacity: "var(--sunlight)" }}>
        <path d="M262 239 L490 252 L500 280 L272 280 Z" style={{ fill: col("sunlit", 0.16) }} />
        <path d="M510 252 L738 239 L728 280 L500 280 Z" style={{ fill: col("sunlit", 0.12) }} />
        <path d="M244 236 L262 239 L272 280 L250 282 Z" fill="rgba(0,0,0,0.28)" />
        <path d="M490 252 L510 252 L516 280 L496 280 Z" fill="rgba(0,0,0,0.3)" />
        <path d={LIP_TOP} fill="none" style={{ stroke: col("sunlit", 0.5) }} strokeWidth="2" />
      </g>
      {/* Faint glow from the screens onto the underside of the lip. */}
      <ellipse cx="500" cy={HOOD_TOP_MID + LIP_DEPTH + 2} rx="330" ry="8" fill="url(#lip-glow)" />
    </g>
  );
});

/** Parked windshield wipers, one at the base of each front pane. */
const Wipers = memo(function Wipers() {
  const wiper = (px: number, py: number, dir: 1 | -1) => (
    <g key={dir}>
      <path d={`M${px} ${py} L${px + dir * 92} ${py - 9}`} stroke="#0c0d0f" strokeWidth="3" strokeLinecap="round" />
      <path d={`M${px + dir * 30} ${py - 5} L${px + dir * 160} ${py - 16}`} stroke="#141518" strokeWidth="2.6" strokeLinecap="round" />
      <path d={`M${px + dir * 30} ${py - 3.6} L${px + dir * 160} ${py - 14.6}`} stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
      <circle cx={px} cy={py} r="4" fill="#1a1b1e" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
    </g>
  );
  return <g>{[wiper(274, 241, 1), wiper(726, 241, -1)]}</g>;
});

/** Sidewalls below the side windows: a padded panel seam and a gasper vent. */
const Sidewalls = memo(function Sidewalls() {
  const side = (m: (x: number) => number, key: string) => (
    <g key={key}>
      <path d={`M${m(-200)} 380 L${m(30)} 352 L${m(200)} 314`} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.6" />
      <path d={`M${m(-200)} 381.5 L${m(30)} 353.5 L${m(200)} 315.5`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <ellipse cx={m(96)} cy="372" rx="9" ry="7" fill="#101114" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      <ellipse cx={m(96)} cy="372" rx="4.5" ry="3.5" fill="#26282d" />
      <path d={`M${m(92)} 372 h8`} stroke="#000" strokeWidth="1" />
    </g>
  );
  return <g>{[side((x) => x, "l"), side((x) => 1000 - x, "r")]}</g>;
});

const Structure = memo(function Structure() {
  // Glareshield top surface: from the base of the windscreen back to the lip.
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


    </g>
  );
});

/** Boeing mode control panel on the glareshield. Values are autopilot targets, labelled as such. */
const Mcp = memo(function Mcp() {
  const W = 260;
  const k = 0.82;
  const t = `translate(${500 - (W * k) / 2} ${HOOD_TOP_MID + 4}) scale(${k})`;
  const windows = [
    { x: 40, label: "IAS/MACH", value: "160" },
    { x: 104, label: "HDG", value: "020" },
    { x: 168, label: "ALTITUDE", value: "5000" },
    { x: 226, label: "V/S", value: "" },
  ];
  const buttons = [
    { x: 64, label: "LNAV", lit: true },
    { x: 80, label: "VNAV", lit: true },
    { x: 128, label: "FLCH", lit: false },
    { x: 192, label: "A/P", lit: false },
  ];
  return (
    <g transform={t} style={{ fontFamily: "var(--font-mono), monospace" }}>
      <rect width={W} height="28" rx="2" fill="#2a2e35" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
      <text x="4" y="25.5" fontSize="3.4" fill="rgba(255,255,255,0.65)">
        MCP TARGETS
      </text>
      {/* Autothrottle arm switch. */}
      <text x="9" y="7" fontSize="3.4" fill="rgba(255,255,255,0.8)" textAnchor="middle">
        A/T ARM
      </text>
      <rect x="6" y="9" width="6" height="9" rx="1" fill="#16181c" />
      <rect x="7" y="9.5" width="4" height="4" rx="0.8" fill="#d8dbe0" />
      {windows.map((w) => (
        <g key={w.label}>
          <text x={w.x} y="6.5" fontSize="3.6" fill="rgba(255,255,255,0.82)" textAnchor="middle">
            {w.label}
          </text>
          <rect x={w.x - 14} y="8.5" width="28" height="9" rx="1" fill="#050607" />
          <text x={w.x} y="15.6" fontSize="7" fill="#ffb000" textAnchor="middle">
            {w.value}
          </text>
          <circle cx={w.x} cy="23" r="2.6" fill="url(#knob)" />
        </g>
      ))}
      {buttons.map((b) => (
        <g key={b.label}>
          <rect x={b.x - 7} y="18.5" width="14" height="8" rx="1" fill="#3a3f47" stroke="#000" strokeWidth="0.4" />
          <rect x={b.x - 5} y="19.5" width="10" height="1.4" rx="0.5" fill={b.lit ? "#5ff08f" : "#1b1d21"} />
          <text x={b.x} y="25" fontSize="3" fill="#e8ebef" textAnchor="middle">
            {b.label}
          </text>
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
  pull,
  jitter,
  detail,
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
  pull: number;
  jitter: number;
  detail: boolean;
}) => {
  const pfdL = affine(wingL(0.88, -0.35), wingL(0.52, -0.35), wingL(0.88, -0.54), SCREEN_W, SCREEN_H);
  const ndL = affine(wingL(0.44, -0.35), wingL(0.08, -0.35), wingL(0.44, -0.54), SCREEN_W, SCREEN_H);
  const ndR = affine(wingR(0.08, -0.35), wingR(0.44, -0.35), wingR(0.08, -0.54), SCREEN_W, SCREEN_H);
  const pfdR = affine(wingR(0.52, -0.35), wingR(0.88, -0.35), wingR(0.52, -0.54), SCREEN_W, SCREEN_H);
  const eicas = affine([-0.13, -0.34, PANEL_Z], [0.13, -0.34, PANEL_Z], [-0.13, -0.545, PANEL_Z], SCREEN_W, SCREEN_H);
  const isfd = affine([0.15, -0.37, PANEL_Z], [0.255, -0.37, PANEL_Z], [0.15, -0.475, PANEL_Z], SCREEN_W, SCREEN_H);
  const gs = Math.round(ias);
  const nm = 6153 - Math.round(alt / 600);
  // Throttles: two large handles that advance as thrust is set.
  const lever = (X: number, zTop: number, Ytop: number) => {
    const [bx, by] = P(X, -0.66, 0.84);
    const [hx, hy] = P(X, Ytop, zTop);
    return { bx, by, hx, hy, s: 440 / zTop };
  };
  const throttles = [-0.045, 0.045].map((X) => lever(X, 0.74 + thrust * 0.18, -0.55));
  return (
    <g>
      <PanelDefs />
      {/* Opaque backing from the glareshield down, so nothing outside ever shows behind the panel. */}
      <path d={`M${line(LIP)} V700 H-220 Z`} style={{ fill: col("cabin-dark") }} />
      <g transform={`translate(0 ${-SHIFT})`}>
      <Structure />
      <Screen transform={pfdL}>
        <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
      </Screen>
      <Screen transform={ndL} knobs="none">
        <Nd gs={gs} nm={nm} />
      </Screen>
      <Screen transform={eicas} knobs="none">
        <Eicas n1={n1} egt={egt} ff={ff} airborne={airborne} />
      </Screen>
      <Screen transform={isfd} knobs="none">
        <Isfd ias={ias} alt={alt} pitch={pitch} />
      </Screen>
      <Screen transform={ndR} knobs="none">
        <Nd gs={gs} nm={nm} />
      </Screen>
      <Screen transform={pfdR} knobs="right">
        <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
      </Screen>
      </g>
      <Sidewalls />
      <Hood />
      <Wipers />
      <g transform={`translate(0 ${-SHIFT})`}>
      {throttles.map((l, i) => (
        <g key={i}>
          <line x1={l.bx} y1={l.by} x2={l.hx} y2={l.hy} stroke="#1b1d21" strokeWidth={r1(0.022 * l.s)} strokeLinecap="round" />
          {/* T-handle with a light grip, as on the 777. */}
          <rect x={r1(l.hx - 0.05 * l.s)} y={r1(l.hy - 0.02 * l.s)} width={r1(0.1 * l.s)} height={r1(0.04 * l.s)} rx="6" fill="url(#lever)" stroke="rgba(255,255,255,0.18)" />
          <rect x={r1(l.hx - 0.04 * l.s)} y={r1(l.hy - 0.016 * l.s)} width={r1(0.08 * l.s)} height={r1(0.01 * l.s)} rx="2" fill="rgba(255,255,255,0.35)" />
          <text x={l.hx} y={r1(l.hy + 0.012 * l.s)} fontSize={r1(0.018 * l.s)} fill="#2a2d32" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="700">
            {i + 1}
          </text>
        </g>
      ))}
      <Yoke side="left" pull={pull} jitter={jitter} detail={detail} />
      <Yoke side="right" pull={pull} jitter={-jitter} detail={detail} />
      </g>
      <Mcp />
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
      <pattern id="gs-grain" width="3" height="3" patternUnits="userSpaceOnUse">
        <rect width="1" height="1" fill="rgba(255,255,255,0.035)" />
        <rect x="1.5" y="1.5" width="1" height="1" fill="rgba(0,0,0,0.12)" />
      </pattern>
      <linearGradient id="gs-reflect" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" style={{ stopColor: col("sky-2"), stopOpacity: 0.16 }} />
        <stop offset="0.6" style={{ stopColor: col("sky-2"), stopOpacity: 0 }} />
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
        <stop offset="0" stopColor="#e4e6ea" />
        <stop offset="0.5" stopColor="#b6bac1" />
        <stop offset="1" stopColor="#6e737b" />
      </linearGradient>
    </defs>
  );
});

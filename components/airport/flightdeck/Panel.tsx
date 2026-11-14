import React, { memo } from "react";
import { P, SILL, affine, sillAt, col, poly, ps, r1, type V3 } from "./geometry";
import { Eicas, Isfd, Nd, Pfd, SCREEN_H, SCREEN_W } from "./Displays";
import { Yoke } from "./Yoke";
import { Quadrant } from "./Quadrant";
import type { MotionValue } from "framer-motion";

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

// ── Glareshield (screen space) ─────────────────────────────────────────
// One continuous shape, after the 777 front panel: a straight centre section (MCP and both EFIS
// panels) whose ends round over at the shoulders and slope smoothly down and outward, following
// the outer display sections, to rounded tips at the panel's outer corners. Seen from slightly
// above, so a thin strip of its top surface runs back to the windscreen. Grey family, one shade
// darker than the panel; gradients only.
const SHIFT = 40; // the panel below sits this much higher than its 3D layout, tucked under the hood
const GS_TOP = 268; // top of the front face, centre section
const GS_BOTTOM = 298; // bottom of the front face, centre section
const HOOD_TOP_MID = GS_TOP;
const mirror = (d: string) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${(1000 - Number(x)).toFixed(1).replace(/\.0$/, "")} ${y}`);
// Left half of the front face's top edge, from the centre out to the tip (the right is mirrored).
const TOP_L = `L335 ${GS_TOP} C312 ${GS_TOP} 296 270 282 276 L70 314 C48 318 30 324 28 330`;
// The tip, and the bottom edge back in to the centre (it runs just above the display tops).
const BOTTOM_L = `C26 338 34 342 48 341 L262 315 C284 312 300 ${GS_BOTTOM} 335 ${GS_BOTTOM} L500 ${GS_BOTTOM}`;
/** Reverse a simple "L/C" chain so it can be walked from the other end (for the right half). */
const FACE = `M500 ${GS_TOP} ${TOP_L} ${BOTTOM_L} Z M500 ${GS_TOP} ${mirror(TOP_L)} ${mirror(BOTTOM_L)} Z`;
const TOP_EDGE = `M28 330 C30 324 48 318 70 314 L282 276 C296 270 312 ${GS_TOP} 335 ${GS_TOP} L665 ${GS_TOP} C688 ${GS_TOP} 704 270 718 276 L930 314 C952 318 970 324 972 330`;
const BOTTOM_EDGE = `M48 341 L262 315 C284 312 300 ${GS_BOTTOM} 335 ${GS_BOTTOM} L665 ${GS_BOTTOM} C700 ${GS_BOTTOM} 716 312 738 315 L952 341`;
/** The top surface: from the windscreen base (the sill) forward to the face's top edge. */
const TOP_SURFACE = (() => {
  const back = SILL.filter(([x]) => x > 28 && x < 972).reverse().map(([x, y]) => `L${x} ${y}`).join(" ");
  return `${TOP_EDGE} L972 315 ${back} L28 315 Z`;
})();
/** On a wing of the face, a point a fraction s of the way from its top edge to its bottom edge. */
const onWing = (x: number, s: number): [number, number] => {
  const top = 276 + ((314 - 276) * (282 - x)) / (282 - 70);
  const bot = 315 + ((341 - 315) * (262 - x)) / (262 - 48);
  return [x, top + s * (bot - top)];
};

const Hood = memo(function Hood() {
  const knobs: [number, number][] = [onWing(236, 0.5), onWing(206, 0.5)];
  const grille = onWing(78, 0.5);
  return (
    <g>
      <defs>
        <linearGradient id="gs-face" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: col("cabin-mid") }} />
          <stop offset="1" style={{ stopColor: col("cabin-dark") }} />
        </linearGradient>
        {/* Hood-top strip: dark matte, darker toward the glass. */}
        <linearGradient id="gs-top" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
          <stop offset="1" style={{ stopColor: col("cabin-mid") }} />
        </linearGradient>
        {/* EFIS panel, used either side of the MCP. */}
        <g id="gs-efis">
          <rect width="62" height="22" rx="1.5" style={{ fill: col("cabin-dark") }} stroke="rgba(0,0,0,0.55)" strokeWidth="1" />
          <path d="M1 0.9 H61" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
          {[12, 50].map((x) => (
            <circle key={x} cx={x} cy="11" r="4.2" fill="url(#knob)" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
          ))}
          {[22, 28, 34, 40].map((x) => (
            <g key={x}>
              <rect x={x - 2.2} y="6" width="4.4" height="3.6" rx="0.6" fill="#3d4148" />
              <rect x={x - 2.2} y="12.5" width="4.4" height="3.6" rx="0.6" fill="#3d4148" />
            </g>
          ))}
        </g>
        {/* Master WARNING over CAUTION: small square buttons, dull and unlit. */}
        <g id="gs-warn">
          <rect width="9" height="8.5" rx="0.8" fill="#5a3634" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
          <rect y="10" width="9" height="8.5" rx="0.8" fill="#5a4c32" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
          <text x="4.5" y="5.2" fontSize="1.9" fill="rgba(235,210,205,0.7)" textAnchor="middle" fontFamily="var(--font-mono), monospace">WARN</text>
          <text x="4.5" y="15.2" fontSize="1.9" fill="rgba(235,222,195,0.7)" textAnchor="middle" fontFamily="var(--font-mono), monospace">CAUT</text>
        </g>
      </defs>
      {/* Soft shadow from the underside onto the top of the display bezels. */}
      <path d={BOTTOM_EDGE} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="14" transform="translate(0 6)" />
      <path d={BOTTOM_EDGE} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth="6" transform="translate(0 3)" />
      {/* The thin top surface back to the windscreen, then the front face. */}
      <path d={TOP_SURFACE} fill="url(#gs-top)" />
      <path d={FACE} fill="url(#gs-face)" />
      <path d={FACE} fill="rgba(0,0,0,0.1)" />
      <path d={BOTTOM_EDGE} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.4" />
      {/* Light along the top edge: warm at golden hour, neutral by day. */}
      <path d={TOP_EDGE} fill="none" stroke="rgb(var(--sunlit))" strokeOpacity="0.45" strokeWidth="1.1" />
      {/* Contents: EFIS panels either side of the MCP (drawn separately), warning/caution at the ends. */}
      <use href="#gs-efis" x="328" y={GS_TOP + 4} />
      <use href="#gs-efis" x="610" y={GS_TOP + 4} />
      <use href="#gs-warn" x="312" y={GS_TOP + 6} />
      <use href="#gs-warn" x="679" y={GS_TOP + 6} />
      {/* On each wing: two small knobs (clock, map light) and a speaker grille near the tip. */}
      {[false, true].map((right) =>
        [...knobs.map(([x, y], i) => (
          <circle key={`${right}-k${i}`} cx={right ? 1000 - x : x} cy={y} r="3.2" fill="url(#knob)" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
        )),
        <g key={`${right}-g`}>
          <circle cx={right ? 1000 - grille[0] : grille[0]} cy={grille[1]} r="5.5" style={{ fill: col("cabin-dark") }} stroke="rgba(0,0,0,0.5)" strokeWidth="0.6" />
          {[-2.6, 0, 2.6].map((dy) => (
            <path key={dy} d={`M${(right ? 1000 - grille[0] : grille[0]) - 3.6} ${grille[1] + dy} h7.2`} stroke="rgba(0,0,0,0.55)" strokeWidth="0.9" />
          ))}
        </g>]
      )}
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
  // Pivots on the frame at the outer bottom corner of each pane, outside the glass.
  return <g>{[wiper(262, sillAt(262) - 3, 1), wiper(738, sillAt(738) - 3, -1)]}</g>;
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
  const k = 0.8;
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
  lever,
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
  /** Thrust lever position, 0 idle → 1 take-off thrust (a motion value: the levers move by transform). */
  lever: MotionValue<number>;
}) => {
  const pfdL = affine(wingL(0.88, -0.35), wingL(0.52, -0.35), wingL(0.88, -0.54), SCREEN_W, SCREEN_H);
  const ndL = affine(wingL(0.44, -0.35), wingL(0.08, -0.35), wingL(0.44, -0.54), SCREEN_W, SCREEN_H);
  const ndR = affine(wingR(0.08, -0.35), wingR(0.44, -0.35), wingR(0.08, -0.54), SCREEN_W, SCREEN_H);
  const pfdR = affine(wingR(0.52, -0.35), wingR(0.88, -0.35), wingR(0.52, -0.54), SCREEN_W, SCREEN_H);
  const eicas = affine([-0.13, -0.34, PANEL_Z], [0.13, -0.34, PANEL_Z], [-0.13, -0.545, PANEL_Z], SCREEN_W, SCREEN_H);
  const isfd = affine([0.15, -0.37, PANEL_Z], [0.255, -0.37, PANEL_Z], [0.15, -0.475, PANEL_Z], SCREEN_W, SCREEN_H);
  const gs = Math.round(ias);
  const nm = 6153 - Math.round(alt / 600);
  return (
    <g>
      <PanelDefs />
      {/* Opaque backing from the glareshield down, so nothing outside ever shows behind the panel. */}
      <path d={`M${SILL.map((q) => q.join(" ")).join(" L")} V700 H-220 Z`} style={{ fill: col("cabin-dark") }} />
      <g transform={`translate(0 ${-SHIFT})`}>
      <Structure />
      {/* On phones (detail off) the outboard PFDs and yokes are outside the crop, so skip them. */}
      {detail && (
        <Screen transform={pfdL}>
          <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
        </Screen>
      )}
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
      {detail && (
        <Screen transform={pfdR} knobs="right">
          <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
        </Screen>
      )}
      </g>
      <Sidewalls />
      <Hood />
      <Wipers />
      <g transform={`translate(0 ${-SHIFT})`}>
      <Quadrant thrust={lever} />
      {detail && <Yoke side="left" pull={pull} jitter={jitter} detail={detail} />}
      {detail && <Yoke side="right" pull={pull} jitter={-jitter} detail={detail} />}
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
    </defs>
  );
});

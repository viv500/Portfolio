import React, { memo } from "react";
import { P, SILL, affine, col, poly, ps, r1, type V3 } from "./geometry";
import { Eicas, Isfd, Nd, Pfd, SCREEN_H, SCREEN_W } from "./Displays";
import { Yoke } from "./Yoke";
import { Quadrant } from "./Quadrant";
import type { MotionValue } from "framer-motion";

// Glareshield, main instrument panel, pedestal and side consoles, all in perspective.

const PANEL_Z = 1.14; // the instrument panel, back under the hood
const PANEL_TOP = -0.3;
const PANEL_BOTTOM = -0.66;
const DISP_TOP = -0.355; // display tops sit just below the hood's underside
const DISP_BOTTOM = -0.555;
// The PFDs sit lower on the canted sections, tucked under the hood's angled ends.
const PFD_TOP = -0.435;
const PFD_BOTTOM = -0.625;

// The centre section (NDs, ISFD, EICAS) is flat to the camera; the outer sections, with the PFDs,
// are canted slightly towards each pilot.
const CENTRE_HALF = 0.475;
const wingPt = (side: -1 | 1, u: number, Y: number): V3 => [side * (CENTRE_HALF + 0.6 * u), Y, PANEL_Z - 0.16 * u];

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
// After a straight-on 777 flight deck: a thin matte hood top from the windscreen base, a vertical
// hood face carrying the EFIS panels and MCP, with short end sections angled back towards the
// viewer (their edges run to the vanishing point), and a deep shadowed underside with flood lights
// over the instrument panel. Static: gradients only.
const SHIFT = 40; // the pedestal, quadrant and yokes sit this much higher than their 3D layout
const VPX = 500;
const VPY = 205;
const FACE_TOP = 270; // top of the hood face (centre run)
const FACE_BOT = 315;
const UNDER_BOT = 342; // where the underside meets the instrument panel
const RUN = [311, 689] as const; // the straight centre run, over the inner edges of the PFDs
const END = [196, 804] as const; // the end sections stop above the outer edges of the PFDs
type XY = [number, number];
/** y on the line from the vanishing point through (x0, y0), at x. */
const toVp = (x0: number, y0: number) => (x: number) => VPY + ((y0 - VPY) * (x - VPX)) / (x0 - VPX);
/** Where the end sections' undersides meet the canted panel: just above the outer PFD bezels. */
const UNDER_END = 386;
const lineThrough = (x0: number, y0: number, x1: number, y1: number) => (x: number) => y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
const edgeL = { top: toVp(RUN[0], FACE_TOP), bot: toVp(RUN[0], FACE_BOT), under: lineThrough(RUN[0], UNDER_BOT, END[0], UNDER_END) };
const edgeR = { top: toVp(RUN[1], FACE_TOP), bot: toVp(RUN[1], FACE_BOT), under: lineThrough(RUN[1], UNDER_BOT, END[1], UNDER_END) };
const pts = (list: XY[]) => list.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(" L");
/** Where the window sill is at x. */
const sillAt = (x: number) => {
  for (let i = 1; i < SILL.length; i++) {
    const [x0, y0] = SILL[i - 1];
    const [x1, y1] = SILL[i];
    if (x >= x0 && x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return SILL[SILL.length - 1][1];
};
/** 2D affine placing a w×h drawing on the parallelogram tl, tr, bl. */
const onto = (tl: XY, tr: XY, bl: XY, w: number, h: number) =>
  `matrix(${((tr[0] - tl[0]) / w).toFixed(4)} ${((tr[1] - tl[1]) / w).toFixed(4)} ${((bl[0] - tl[0]) / h).toFixed(4)} ${((bl[1] - tl[1]) / h).toFixed(4)} ${r1(tl[0])} ${r1(tl[1])})`;
/** A point on a hood end section: x across it, s from its top edge (0) to its bottom edge (1). */
const onEnd = (e: typeof edgeL, x: number, s: number): XY => [x, e.top(x) + s * (e.bot(x) - e.top(x))];

const HoodDefs = memo(function HoodDefs() {
  return (
    <defs>
      <linearGradient id="hood-under" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#0d0b0a" />
        <stop offset="1" stopColor="#050404" />
      </linearGradient>
      <linearGradient id="hood-face" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#2c2824" />
        <stop offset="1" stopColor="#201d1a" />
      </linearGradient>
      <linearGradient id="flood-wash" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#ffe8c0" stopOpacity="0.2" />
        <stop offset="1" stopColor="#ffe8c0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="side-sill" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#a8977c" />
        <stop offset="1" stopColor="#6f6250" />
      </linearGradient>
      {/* EFIS control panel (one drawing, used left and right). */}
      <g id="hood-efis">
        <rect width="70" height="26" rx="1.5" fill="#1d1b19" stroke="rgba(0,0,0,0.7)" strokeWidth="1" />
        <path d="M1 1 H69" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
        {[14, 56].map((x) => (
          <g key={x}>
            <circle cx={x} cy="12" r="5.2" fill="#2d2b28" />
            <circle cx={x} cy="12" r="3.6" fill="url(#knob)" />
          </g>
        ))}
        {[25, 31, 37, 43].map((x) => (
          <rect key={x} x={x - 2.4} y="8" width="4.8" height="3.6" rx="0.6" fill="#3a3734" />
        ))}
        {[25, 31, 37, 43].map((x) => (
          <rect key={x} x={x - 2.4} y="15" width="4.8" height="3.6" rx="0.6" fill="#3a3734" />
        ))}
      </g>
      {/* End panel: master WARNING (red) and CAUTION (amber), unlit, and a few small buttons. */}
      <g id="hood-end">
        <rect width="80" height="26" rx="1.5" fill="#1d1b19" stroke="rgba(0,0,0,0.7)" strokeWidth="1" />
        <rect x="5" y="4" width="34" height="10" rx="1" fill="#5c1a15" />
        <rect x="42" y="4" width="34" height="10" rx="1" fill="#5c4313" />
        <text x="22" y="11" fontSize="4.4" fill="#d9a49c" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="700">WARNING</text>
        <text x="59" y="11" fontSize="4.4" fill="#e3c27e" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="700">CAUTION</text>
        {[12, 22, 32].map((x) => (
          <rect key={x} x={x - 3} y="17.5" width="6" height="4" rx="0.6" fill="#3a3734" />
        ))}
      </g>
    </defs>
  );
});

const Hood = memo(function Hood() {
  const sillRun = SILL.filter(([x]) => x > END[0] && x < END[1]) as XY[];
  const top: XY[] = [[END[0], sillAt(END[0])], ...sillRun, [END[1], sillAt(END[1])], [END[1], edgeR.top(END[1])], [RUN[1], FACE_TOP], [RUN[0], FACE_TOP], [END[0], edgeL.top(END[0])]];
  const face: XY[] = [[END[0], edgeL.top(END[0])], [RUN[0], FACE_TOP], [RUN[1], FACE_TOP], [END[1], edgeR.top(END[1])], [END[1], edgeR.bot(END[1])], [RUN[1], FACE_BOT], [RUN[0], FACE_BOT], [END[0], edgeL.bot(END[0])]];
  const endL: XY[] = [[END[0], edgeL.top(END[0])], [RUN[0], FACE_TOP], [RUN[0], FACE_BOT], [END[0], edgeL.bot(END[0])]];
  const endR: XY[] = [[END[1], edgeR.top(END[1])], [RUN[1], FACE_TOP], [RUN[1], FACE_BOT], [END[1], edgeR.bot(END[1])]];
  const under: XY[] = [[END[0], edgeL.bot(END[0])], [RUN[0], FACE_BOT], [RUN[1], FACE_BOT], [END[1], edgeR.bot(END[1])], [END[1], edgeR.under(END[1])], [RUN[1], UNDER_BOT], [RUN[0], UNDER_BOT], [END[0], edgeL.under(END[0])]];
  const topEdge = `M${pts([[END[0], edgeL.top(END[0])], [RUN[0], FACE_TOP], [RUN[1], FACE_TOP], [END[1], edgeR.top(END[1])]])}`;
  // Warm beige sills under the side windows, outboard of the hood ends, a little lower.
  const sideSill = (from: number, to: number) => {
    const xs = SILL.filter(([x]) => x > Math.min(from, to) && x < Math.max(from, to)).map(([x]) => x);
    const line = [from, ...xs.sort((a, b) => (from < to ? a - b : b - a)), to];
    const upper: XY[] = line.map((x) => [x, sillAt(x) + 4]);
    const lower: XY[] = [...line].reverse().map((x) => [x, sillAt(x) + 18 + Math.abs(x - 500) * 0.012]);
    return `M${pts([...upper, ...lower])} Z`;
  };
  const endPanel = (e: typeof edgeL, x0: number, x1: number) => onto(onEnd(e, x0, 0.22), onEnd(e, x1, 0.22), onEnd(e, x0, 0.8), 80, 26);
  return (
    <g>
      <HoodDefs />
      <path d={sideSill(-220, END[0] + 30)} fill="url(#side-sill)" />
      <path d={sideSill(1220, END[1] - 30)} fill="url(#side-sill)" />
      {/* 3. Underside: a deep shadow receding to the panel, two flood strips and a small housing. */}
      <path d={`M${pts(under)} Z`} fill="url(#hood-under)" />
      <path d={`M362 ${UNDER_BOT - 6} H470 M530 ${UNDER_BOT - 6} H638`} stroke="#ffe8c0" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="489" y={FACE_BOT + 3} width="22" height="11" rx="1.5" fill="#15130f" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
      {/* 1. Hood top: thin matte near-black, from the windscreen base to the face. */}
      <path d={`M${pts(top)} Z`} fill="#1a1816" />
      {/* 2. Hood face: centre run and the two angled end sections (lit a touch differently). */}
      <path d={`M${pts(face)} Z`} fill="url(#hood-face)" />
      <path d={`M${pts(endL)} Z`} fill="rgba(255,255,255,0.035)" />
      <path d={`M${pts(endR)} Z`} fill="rgba(0,0,0,0.12)" />
      <path d={`M${RUN[0]} ${FACE_TOP} V${FACE_BOT} M${RUN[1]} ${FACE_TOP} V${FACE_BOT}`} stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
      <path d={topEdge} fill="none" stroke="rgb(var(--sunlit))" strokeOpacity="0.45" strokeWidth="1.1" />
      <path d={`M${pts([[END[0], edgeL.bot(END[0])], [RUN[0], FACE_BOT], [RUN[1], FACE_BOT], [END[1], edgeR.bot(END[1])]])}`} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" />
      {/* Recessed panels: EFIS either side of the MCP, warning/caution on the end sections. */}
      <use href="#hood-efis" x={RUN[0] + 7} y={FACE_TOP + 9} />
      <use href="#hood-efis" x={RUN[1] - 77} y={FACE_TOP + 9} />
      <use href="#hood-end" transform={endPanel(edgeL, END[0] + 18, RUN[0] - 14)} />
      <use href="#hood-end" transform={endPanel(edgeR, RUN[1] + 14, END[1] - 18)} />
    </g>
  );
});

/** Flood light from the underside, washing the top of the instrument panel and bezels. */
const FloodWash = () => <rect x={RUN[0]} y={UNDER_BOT} width={RUN[1] - RUN[0]} height="30" fill="url(#flood-wash)" />;

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
  return <g>{[wiper(250, 239, 1), wiper(750, 239, -1)]}</g>;
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

/** The instrument panel: a flat centre section and two slightly canted outer sections. */
const PanelBody = memo(function PanelBody() {
  const centre = poly([[-CENTRE_HALF, PANEL_TOP, PANEL_Z], [CENTRE_HALF, PANEL_TOP, PANEL_Z], [CENTRE_HALF, PANEL_BOTTOM, PANEL_Z], [-CENTRE_HALF, PANEL_BOTTOM, PANEL_Z]]);
  const wing = (side: -1 | 1) => poly([wingPt(side, 0, PANEL_TOP), wingPt(side, 1, PANEL_TOP), wingPt(side, 1, PANEL_BOTTOM), wingPt(side, 0, PANEL_BOTTOM)]);
  return (
    <g>
      <path d={wing(-1)} fill="url(#wing-l)" />
      <path d={wing(1)} fill="url(#wing-r)" />
      <path d={centre} fill="url(#panel-centre)" />
      <path d={`M${ps(wingPt(-1, 0, PANEL_TOP))} L${ps(wingPt(-1, 0, PANEL_BOTTOM))} M${ps(wingPt(1, 0, PANEL_TOP))} L${ps(wingPt(1, 0, PANEL_BOTTOM))}`} stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" />
      {/* Small recessed panel right of the EICAS (gear/autobrake area). */}
      <path d={poly([[0.15, -0.37, PANEL_Z], [0.215, -0.37, PANEL_Z], [0.215, -0.5, PANEL_Z], [0.15, -0.5, PANEL_Z]])} fill="#141518" stroke="rgba(0,0,0,0.6)" strokeWidth="1" />
    </g>
  );
});

/** Pedestal and side consoles (in the shifted group with the quadrant and yokes). */
const Structure = memo(function Structure() {
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
  // About 55% of the hood's centre run, recessed into the face.
  const k = 0.8;
  const t = `translate(${500 - (W * k) / 2} ${FACE_TOP + 11}) scale(${k})`;
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
      <rect width={W} height="28" rx="2" fill="#24272c" stroke="rgba(0,0,0,0.7)" strokeWidth="1.2" />
      <path d={`M1 0.8 H${W - 1}`} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
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
  // Centre section, flat to the camera: ND, ISFD, EICAS, (gear panel), ND. PFDs on the canted outer sections.
  const disp = (x0: number, x1: number, top = DISP_TOP, bottom = DISP_BOTTOM) =>
    affine([x0, top, PANEL_Z], [x1, top, PANEL_Z], [x0, bottom, PANEL_Z], SCREEN_W, SCREEN_H);
  const ndL = disp(-0.465, -0.225);
  const isfd = disp(-0.21, -0.13, -0.37, -0.45);
  const eicas = disp(-0.12, 0.12);
  const ndR = disp(0.225, 0.465);
  const pfdL = affine(wingPt(-1, 0.45, PFD_TOP), wingPt(-1, 0.03, PFD_TOP), wingPt(-1, 0.45, PFD_BOTTOM), SCREEN_W, SCREEN_H);
  const pfdR = affine(wingPt(1, 0.03, PFD_TOP), wingPt(1, 0.45, PFD_TOP), wingPt(1, 0.03, PFD_BOTTOM), SCREEN_W, SCREEN_H);
  const gs = Math.round(ias);
  const nm = 6153 - Math.round(alt / 600);
  return (
    <g>
      <PanelDefs />
      {/* Opaque backing from the window sill down, so nothing outside ever shows behind the panel. */}
      <path d={`M${SILL.map((q) => q.join(" ")).join(" L")} V700 H-220 Z`} style={{ fill: col("cabin-dark") }} />
      {/* 4. Instrument panel, back under the hood. */}
      <PanelBody />
      {/* On phones (detail off) the outboard PFDs and yokes are outside the crop, so skip them. */}
      {detail && (
        <Screen transform={pfdL}>
          <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
        </Screen>
      )}
      <Screen transform={ndL} knobs="none">
        <Nd gs={gs} nm={nm} />
      </Screen>
      <Screen transform={isfd} knobs="none">
        <Isfd ias={ias} alt={alt} pitch={pitch} />
      </Screen>
      <Screen transform={eicas} knobs="none">
        <Eicas n1={n1} egt={egt} ff={ff} airborne={airborne} />
      </Screen>
      <Screen transform={ndR} knobs="none">
        <Nd gs={gs} nm={nm} />
      </Screen>
      {detail && (
        <Screen transform={pfdR} knobs="right">
          <Pfd ias={ias} alt={alt} pitch={pitch} fma={fma} />
        </Screen>
      )}
      <FloodWash />
      <Sidewalls />
      <g transform={`translate(0 ${-SHIFT})`}>
        <Structure />
      </g>
      {/* Layers 1–3: hood top, face (with the MCP) and underside. */}
      <Hood />
      <Mcp />
      <Wipers />
      <g transform={`translate(0 ${-SHIFT})`}>
        <Quadrant thrust={lever} />
        {detail && <Yoke side="left" pull={pull} jitter={jitter} detail={detail} />}
        {detail && <Yoke side="right" pull={pull} jitter={-jitter} detail={detail} />}
      </g>
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

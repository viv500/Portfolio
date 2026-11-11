import React, { memo } from "react";
import { CEILING_Y, F, P, VIEW_H, VIEW_W, WS_APILLAR_L, WS_FRONT_L, WS_MIDPILLAR_L, WS_POST, WS_SIDE1_L, WS_SIDE2_L, col, mx, poly, ps, r1, sp, type V2 } from "./geometry";

// The cockpit shell: ceiling with the overhead panel, windscreen frame, pillars, side windows,
// glass and lighting. Static, so it's memoised and only re-renders when the layout changes.

const PANES: V2[][] = [WS_FRONT_L, mx(WS_FRONT_L), WS_SIDE1_L, mx(WS_SIDE1_L), WS_SIDE2_L, mx(WS_SIDE2_L)];
export const PANE_PATHS = PANES.map(sp).join(" ");

// ── Overhead panel ──────────────────────────────────────────────────────
const OH_Y = CEILING_Y - 0.008; // the panel face hangs just below the ceiling liner
const ROWS = [1.74, 1.6, 1.47, 1.35, 1.24, 1.14, 1.05, 0.96, 0.88, 0.8, 0.72, 0.65, 0.58];
const COLS = Array.from({ length: 15 }, (_, i) => -0.42 + i * 0.06);
const kind = (r: number, c: number) => (r * 7 + c * 3 + ((r * c) % 4)) % 6; // deterministic variety

const Button = ({ X, z, lit, white }: { X: number; z: number; lit: boolean; white: boolean }) => {
  const w = 0.019;
  const d = 0.014;
  const bezel = poly([[X - w - 0.004, OH_Y + 0.004, z - d - 0.004], [X + w + 0.004, OH_Y + 0.004, z - d - 0.004], [X + w + 0.004, OH_Y + 0.004, z + d + 0.004], [X - w - 0.004, OH_Y + 0.004, z + d + 0.004]]);
  const face = poly([[X - w, OH_Y, z - d], [X + w, OH_Y, z - d], [X + w, OH_Y, z + d], [X - w, OH_Y, z + d]]);
  // The near edge of each button is its visible side wall, lit from below by the panel.
  const wall = poly([[X - w, OH_Y, z - d], [X + w, OH_Y, z - d], [X + w, OH_Y - 0.006, z - d], [X - w, OH_Y - 0.006, z - d]]);
  return (
    <g>
      <path d={bezel} fill="#08090b" />
      <path d={wall} style={{ fill: col("cabin-mid") }} />
      <path d={face} fill={lit ? (white ? "url(#oh-white)" : "url(#oh-amber)") : "url(#oh-off)"} />
      {lit && <path d={face} fill="none" stroke={white ? "rgba(235,245,255,0.5)" : "rgba(255,190,90,0.55)"} strokeWidth="1" />}
    </g>
  );
};

const Toggle = ({ X, z }: { X: number; z: number }) => {
  const [bx, by] = P(X, OH_Y, z);
  const [tx, ty] = P(X, OH_Y - 0.03, z - 0.012);
  const s = F / z;
  return (
    <g>
      <ellipse cx={bx} cy={by} rx={r1(0.012 * s)} ry={r1(0.006 * s)} fill="#0b0c0e" />
      <line x1={bx} y1={by} x2={tx} y2={ty} stroke="url(#oh-chrome)" strokeWidth={r1(Math.max(1, 0.006 * s))} strokeLinecap="round" />
      <circle cx={tx} cy={ty} r={r1(Math.max(0.8, 0.0045 * s))} fill="#d9dde3" />
    </g>
  );
};

const Knob = ({ X, z }: { X: number; z: number }) => {
  const [x, y] = P(X, OH_Y - 0.006, z);
  const s = F / z;
  return (
    <g>
      <ellipse cx={x} cy={r1(y + 0.004 * s)} rx={r1(0.016 * s)} ry={r1(0.009 * s)} fill="#050607" />
      <ellipse cx={x} cy={y} rx={r1(0.014 * s)} ry={r1(0.008 * s)} fill="url(#oh-knob)" />
      <line x1={x} y1={y} x2={r1(x + 0.009 * s)} y2={r1(y - 0.003 * s)} stroke="#e8ebef" strokeWidth="0.8" />
    </g>
  );
};

const Overhead = memo(function Overhead({ compact }: { compact: boolean }) {
  const rows = compact ? ROWS.filter((_, i) => i % 2 === 0) : ROWS;
  const cols = compact ? COLS.filter((_, i) => i % 2 === 0) : COLS;
  const seamsX = [-0.46, -0.2, 0.2, 0.46];
  const seamsZ = [1.81, 1.41, 1.0, 0.62];
  return (
    <g>
      {/* Ceiling liner, receding towards the windscreen. */}
      <path d={poly([[-0.8, CEILING_Y, 0.36], [0.8, CEILING_Y, 0.36], [0.8, CEILING_Y, 1.96], [-0.8, CEILING_Y, 1.96]])} fill="url(#ceiling)" />
      {/* Overhead panel. */}
      <path d={poly([[-0.46, OH_Y, 0.5], [0.46, OH_Y, 0.5], [0.46, OH_Y, 1.82], [-0.46, OH_Y, 1.82]])} fill="url(#oh-panel)" />
      {seamsX.map((X) => (
        <path key={`sx${X}`} d={`M${ps([X, OH_Y, 0.5])} L${ps([X, OH_Y, 1.82])}`} stroke="rgba(0,0,0,0.75)" strokeWidth="1.4" />
      ))}
      {seamsZ.map((z) => (
        <path key={`sz${z}`} d={`M${ps([-0.46, OH_Y, z])} L${ps([0.46, OH_Y, z])}`} stroke="rgba(0,0,0,0.7)" strokeWidth="1.2" />
      ))}
      {seamsX.flatMap((X) =>
        seamsZ.map((z) => {
          const [x, y] = P(X + (X < 0 ? 0.015 : -0.015), OH_Y, z + 0.02);
          return <circle key={`scr${X}${z}`} cx={x} cy={y} r={r1(Math.max(0.8, (0.005 * F) / z))} fill="#5b6068" stroke="#0a0b0d" strokeWidth="0.5" />;
        })
      )}
      {/* Synoptic lines between systems, as on the real panel. */}
      <path d={`M${ps([-0.27, OH_Y, 1.2])} L${ps([-0.03, OH_Y, 1.2])} L${ps([-0.03, OH_Y, 0.98])} L${ps([0.15, OH_Y, 0.98])}`} fill="none" stroke="rgba(255,190,90,0.35)" strokeWidth="1.2" />
      {rows.map((z, r) =>
        cols.map((X, c) => {
          const k = kind(r, c);
          if (k === 5) return null;
          if (k === 4) return <Toggle key={`${r}-${c}`} X={X} z={z} />;
          if (k === 3) return <Knob key={`${r}-${c}`} X={X} z={z} />;
          return <Button key={`${r}-${c}`} X={X} z={z} lit={k === 0 || (k === 1 && c % 3 === 0)} white={k === 1} />;
        })
      )}
      {/* Shadow where the ceiling meets the windscreen. */}
      <path d={poly([[-0.8, CEILING_Y, 1.6], [0.8, CEILING_Y, 1.6], [0.8, CEILING_Y, 1.96], [-0.8, CEILING_Y, 1.96]])} fill="url(#ceiling-ao)" />
    </g>
  );
});

// ── Frame, pillars and walls ─────────────────────────────────────────────
const line = (a: V2, b: V2) => `M${a.join(" ")} L${b.join(" ")}`;

const Frame = memo(function Frame() {
  const [fo, fob] = [WS_FRONT_L[2], WS_FRONT_L[3]];
  const [so, sob] = [WS_SIDE1_L[0], WS_SIDE1_L[3]];
  const R = (p: V2): V2 => [1000 - p[0], p[1]];
  return (
    <g>
      {/* Base wall, with the window openings cut out. */}
      <path fillRule="evenodd" fill="url(#wall)" d={`M-200 -200 H${VIEW_W + 200} V${VIEW_H + 200} H-200 Z ${PANE_PATHS}`} />
      {/* Slim A-pillars and side-window pillars, shaded across their width. */}
      <path d={sp(WS_APILLAR_L)} fill="url(#pillar-l)" />
      <path d={sp(mx(WS_APILLAR_L))} fill="url(#pillar-r)" />
      <path d={sp(WS_MIDPILLAR_L)} fill="url(#pillar-l)" />
      <path d={sp(mx(WS_MIDPILLAR_L))} fill="url(#pillar-r)" />
      <path d={sp(WS_POST)} fill="url(#post)" />
      {/* Window seals: a dark gasket and a bevelled inner edge. */}
      <path d={PANE_PATHS} fill="none" stroke="#050607" strokeWidth="4.5" strokeLinejoin="round" />
      <path d={PANE_PATHS} fill="none" stroke={col("cabin")} strokeWidth="1.4" strokeLinejoin="round" transform="translate(0.6 0.9)" />
      {/* Rim light from the sky on the edges that face the windows. */}
      <path d={`${line(fo, fob)} ${line(R(fo), R(fob))} ${line(so, sob)} ${line(R(so), R(sob))}`} stroke={col("rim", 0.55)} strokeWidth="1.8" fill="none" />
      <path d={`${line(WS_POST[0], WS_POST[3])} ${line(WS_POST[1], WS_POST[2])}`} stroke={col("rim", 0.35)} strokeWidth="0.9" />
      {/* Ambient occlusion in the corners. */}
      <rect x="-200" y="-200" width={VIEW_W + 400} height={VIEW_H + 400} fill="url(#corner-ao)" pointerEvents="none" />
    </g>
  );
});

const Glass = memo(function Glass() {
  return (
    <g pointerEvents="none">
      <path d={`${sp(WS_FRONT_L)} ${sp(mx(WS_FRONT_L))}`} fill="url(#glass-front)" />
      <path d={`${sp(WS_SIDE1_L)} ${sp(WS_SIDE2_L)}`} fill="url(#glass-side-l)" />
      <path d={`${sp(mx(WS_SIDE1_L))} ${sp(mx(WS_SIDE2_L))}`} fill="url(#glass-side-r)" />
      {/* A soft streak of glare across each front pane. */}
      <path d="M300 132 L338 130 L372 290 L338 293 Z" fill="rgba(255,255,255,0.045)" />
      <path d="M612 127 L640 129 L668 290 L644 288 Z" fill="rgba(255,255,255,0.035)" />
    </g>
  );
});

/** Gradients and filters for the shell. */
export const ShellDefs = () => (
  <defs>
    <linearGradient id="wall" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
      <stop offset="0.45" style={{ stopColor: col("cabin-mid") }} />
      <stop offset="1" style={{ stopColor: col("cabin-dark") }} />
    </linearGradient>
    <linearGradient id="header" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
      <stop offset="1" style={{ stopColor: col("cabin") }} />
    </linearGradient>
    <linearGradient id="ceiling" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" style={{ stopColor: col("cabin-mid") }} />
      <stop offset="1" style={{ stopColor: col("cabin-dark") }} />
    </linearGradient>
    <linearGradient id="ceiling-ao" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.55" />
    </linearGradient>
    <linearGradient id="oh-panel" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
      <stop offset="0.8" style={{ stopColor: col("cabin-mid") }} />
      <stop offset="1" style={{ stopColor: col("rim", 0.25) }} />
    </linearGradient>
    <linearGradient id="oh-amber" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#ffd79a" />
      <stop offset="1" stopColor="#e08a1e" />
    </linearGradient>
    <linearGradient id="oh-white" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="1" stopColor="#b8c6d6" />
    </linearGradient>
    <linearGradient id="oh-off" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#2a2d33" />
      <stop offset="1" stopColor="#15171a" />
    </linearGradient>
    <linearGradient id="oh-chrome" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#8d929b" />
      <stop offset="0.5" stopColor="#eef0f3" />
      <stop offset="1" stopColor="#7a7f88" />
    </linearGradient>
    <radialGradient id="oh-knob" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stopColor="#4a4f57" />
      <stop offset="1" stopColor="#141518" />
    </radialGradient>
    <linearGradient id="pillar-l" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
      <stop offset="0.75" style={{ stopColor: col("cabin") }} />
      <stop offset="1" style={{ stopColor: col("rim", 0.6) }} />
    </linearGradient>
    <linearGradient id="pillar-r" x1="1" x2="0" y1="0" y2="0">
      <stop offset="0" style={{ stopColor: col("cabin-dark") }} />
      <stop offset="0.75" style={{ stopColor: col("cabin") }} />
      <stop offset="1" style={{ stopColor: col("rim", 0.6) }} />
    </linearGradient>
    <linearGradient id="post" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" style={{ stopColor: col("cabin") }} />
      <stop offset="0.5" style={{ stopColor: col("cabin-dark") }} />
      <stop offset="1" style={{ stopColor: col("cabin") }} />
    </linearGradient>
    <radialGradient id="corner-ao" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0.55" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.55" />
    </radialGradient>
    <linearGradient id="glass-front" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.09" />
      <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.12" />
    </linearGradient>
    <linearGradient id="glass-side-l" x1="1" x2="0" y1="0" y2="0">
      <stop offset="0" stopColor="#000" stopOpacity="0.05" />
      <stop offset="1" stopColor="#000" stopOpacity="0.4" />
    </linearGradient>
    <linearGradient id="glass-side-r" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#000" stopOpacity="0.05" />
      <stop offset="1" stopColor="#000" stopOpacity="0.4" />
    </linearGradient>
    <filter id="hud-glow" x="-10%" y="-40%" width="120%" height="180%">
      <feGaussianBlur stdDeviation="1.6" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

/**
 * Head-up display combiner, after an Airbus HUD: a wide rounded glass hanging from a dark
 * bracket in front of the captain's windscreen, facing straight at the viewer. Symbology is
 * drawn on the glass and moves with the take-off.
 */
const CW = 172;
const CH = 112;
const CX = 278; // left edge, so the glass is centred on the captain's front pane
const CY = 150; // top edge; the horizon outside (y 205) crosses the glass near its middle

const Hud = ({ call, kt, alt, horizon, climb, dx }: { call: string; kt: number; alt: number; horizon: number; climb: number; dx: number }) => {
  // The glass is drawn at full size and scaled to 80% about its centre; the horizon on it follows the real one.
  const hy = r1((205 + horizon - (CY + CH * 0.1)) / 0.8);
  const fpm = r1(hy - climb * 4.2);
  const g = "rgb(var(--hud))";
  const txt = { fill: g, stroke: "rgba(0,0,0,0.22)", strokeWidth: 1.4, paintOrder: "stroke" } as const;
  const speeds = [-20, -10, 0, 10, 20].map((o) => Math.round(kt / 10) * 10 + o);
  return (
    <g pointerEvents="none" transform={`translate(${CX + dx + CW * 0.1} ${CY + CH * 0.1}) scale(0.8)`}>
      <defs>
        <linearGradient id="combiner" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c8d4dc" stopOpacity="0.07" />
          <stop offset="0.55" stopColor="#b4c0c8" stopOpacity="0.05" />
          <stop offset="1" stopColor="#6c7880" stopOpacity="0.09" />
        </linearGradient>
        <linearGradient id="combiner-sheen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.28" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
        <clipPath id="combiner-clip">
          <rect width={CW} height={CH} rx="34" />
        </clipPath>
      </defs>
      {/* Bracket: a dark curved arm from the ceiling to a clamp on top of the glass. */}
      <path d={`M${CW * 0.62} ${-34} C ${CW * 0.62} ${-14}, ${CW * 0.5} ${-16}, ${CW * 0.5} 0`} fill="none" stroke="#141519" strokeWidth="9" strokeLinecap="round" />
      <path d={`M${CW * 0.62} ${-34} C ${CW * 0.62} ${-14}, ${CW * 0.5} ${-16}, ${CW * 0.5} 0`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" transform="translate(-2.5 0)" />
      <rect x={CW * 0.5 - 26} y="-5" width="52" height="9" rx="4.5" fill="#141519" />

      {/* The glass: faint violet tint, a reflection and a thin edge. */}
      <rect width={CW} height={CH} rx="34" fill="url(#combiner)" />
      <rect width={CW} height={CH} rx="34" fill="url(#combiner-sheen)" />
      <rect width={CW} height={CH} rx="34" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="0.9" />

      <g clipPath="url(#combiner-clip)" filter="url(#hud-glow)" fontFamily="var(--font-mono), monospace" textAnchor="middle">
        {/* Flight mode annunciations. */}
        {[
          [34, "MAN FLX"],
          [72, "SRS"],
          [104, "RWY"],
          [140, "A/THR"],
        ].map(([x, t]) => (
          <text key={t as string} x={x as number} y="13" fontSize="5.6" style={txt}>
            {t}
          </text>
        ))}
        {/* Roll scale and pointer. */}
        <path d={`M${CW / 2 - 22} 25 L${CW / 2 - 15} 22 M${CW / 2 - 9} 20.5 L${CW / 2 - 6} 19.5 M${CW / 2 + 6} 19.5 L${CW / 2 + 9} 20.5 M${CW / 2 + 15} 22 L${CW / 2 + 22} 25`} stroke={g} strokeWidth="0.7" fill="none" />
        <path d={`M${CW / 2} 21 l-3 5 h6 z`} fill="none" stroke={g} strokeWidth="0.7" />
        {/* Callout and IAS / ALT line. */}
        <text x={CW / 2} y="38" fontSize="9" letterSpacing="1.5" style={txt}>
          {call}
        </text>
        <text x={CW / 2} y="47" fontSize="5" letterSpacing="0.4" style={txt}>
          IAS {kt} KT · ALT {alt.toLocaleString("en-CA")} FT
        </text>
        {/* Horizon with heading ticks along it. */}
        <path d={`M6 ${hy} H${CW - 6}`} stroke={g} strokeWidth="0.75" />
        {[-40, -20, 0, 20, 40].map((o) => (
          <path key={o} d={`M${CW / 2 + o} ${hy} v-3`} stroke={g} strokeWidth="0.6" />
        ))}
        {/* Flight path marker with wings. */}
        <g transform={`translate(${CW / 2} ${fpm})`}>
          <circle r="3" fill="none" stroke={g} strokeWidth="0.8" />
          <path d="M-3 0 H-12 M3 0 H12 M0 -3 V-6.5" stroke={g} strokeWidth="0.8" />
        </g>
        {/* Speed scale on the left, altitude scale on the right. */}
        <path d={`M22 34 V82`} stroke={g} strokeWidth="0.6" />
        {speeds.map((v, i) => (
          <g key={i}>
            <path d={`M22 ${38 + i * 10} h4`} stroke={g} strokeWidth="0.6" />
          </g>
        ))}
        <text x="13" y="60.5" fontSize="6" style={txt}>
          {kt}
        </text>
        <path d={`M${CW - 22} 34 V82`} stroke={g} strokeWidth="0.6" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${CW - 22} ${38 + i * 10} h-4`} stroke={g} strokeWidth="0.6" />
        ))}
        <rect x={CW - 20} y="53" width="18" height="10" fill="none" stroke={g} strokeWidth="0.6" />
        <text x={CW - 11} y="60.5" fontSize="5.6" style={txt}>
          {alt}
        </text>
      </g>
    </g>
  );
};

export const Shell = ({ compact, call, kt, alt, horizon, climb }: { compact: boolean; call: string; kt: number; alt: number; horizon: number; climb: number }) => (
  <>
    <ShellDefs />
    <Frame />
    <Overhead compact={compact} />
    <Glass />
    <Hud call={call} kt={kt} alt={alt} horizon={horizon} climb={climb} dx={compact ? 64 : 0} />
  </>
);

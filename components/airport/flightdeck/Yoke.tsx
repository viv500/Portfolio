import React, { memo } from "react";
import { P, r1 } from "./geometry";

// Boeing-style control yoke: a column rising from below, a metal hub with a "777" nameplate and a
// clipped checklist card, and two matte black horns with trim, autopilot-disconnect and PTT
// switches. Drawn once at its native size and moved with a single transform, so animating it
// is cheap.

/** Static artwork, centred on the hub. Units are screen pixels at the yoke's resting depth. */
const YokeArt = memo(function YokeArt({ id, side, detail }: { id: string; side: "left" | "right"; detail: boolean }) {
  // Horn: from the hub out along the crossbar, then up and slightly back in at the tip. The tube is
  // 1.3× thicker than before; the path sits 3 units further in, so its outer edge (over the PFD)
  // stays where it was.
  const horn = (dir: 1 | -1) => `M${dir * 22} -8 C ${dir * 50} -4, ${dir * 75} -8, ${dir * 81} -34 L ${dir * 79} -86`;
  const outboard = side === "left" ? -1 : 1; // the trim housing sits on the outboard horn
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-col`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#25282d" />
          <stop offset="0.45" stopColor="#4f545c" />
          <stop offset="1" stopColor="#25282d" />
        </linearGradient>
        <linearGradient id={`${id}-hub`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5a5f68" />
          <stop offset="0.5" stopColor="#4a4e56" />
          <stop offset="1" stopColor="#30333a" />
        </linearGradient>
        {/* Dark metallic grey tube, shaded top to bottom for roundness. */}
        <linearGradient id={`${id}-tube`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#6a7078" />
          <stop offset="0.45" stopColor="#3d4148" />
          <stop offset="1" stopColor="#25282d" />
        </linearGradient>
        <linearGradient id={`${id}-lip`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7a8089" />
          <stop offset="1" stopColor="#3d4148" />
        </linearGradient>
        <linearGradient id={`${id}-rocker`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8e9298" />
          <stop offset="0.5" stopColor="#e6e8eb" />
          <stop offset="1" stopColor="#8e9298" />
        </linearGradient>
      </defs>

      {/* Column, disappearing below the frame. */}
      <rect x="-10" y="0" width="20" height="240" rx="5" fill={`url(#${id}-col)`} />
      <rect x="-10" y="30" width="20" height="5" fill="rgba(0,0,0,0.45)" />

      {/* Soft contact shadow of the horns on the panel behind. */}
      {detail && (
        <g opacity="0.35" transform="translate(5 9)">
          {([-1, 1] as const).map((d) => (
            <path key={d} d={horn(d)} fill="none" stroke="#000" strokeWidth="26" strokeLinecap="round" />
          ))}
        </g>
      )}

      {/* Horns: dark edge, rounded metallic body, a lit top edge. */}
      {([-1, 1] as const).map((d) => (
        <g key={d}>
          <path d={horn(d)} fill="none" stroke="#16181b" strokeWidth="25" strokeLinecap="round" strokeLinejoin="round" />
          <path d={horn(d)} fill="none" stroke={`url(#${id}-tube)`} strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" />
          <path d={horn(d)} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" transform={`translate(${d * -3} -6.5)`} />
          {/* Highlight along the outer curve: warm at golden hour, neutral by day. */}
          <path d={horn(d)} fill="none" stroke="rgb(var(--sunlit))" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" transform={`translate(${d * 6.5} 1)`} />
        </g>
      ))}
      {/* Outboard horn top: a round dark housing with two tiny silver rockers; a small black button below on the inner side. */}
      <g>
        <circle cx={outboard * 79} cy="-86.5" r="9.5" fill="#141518" stroke="#000" strokeWidth="0.8" />
        <rect x={outboard * 79 - 4.8} y="-92" width="3.4" height="11" rx="1.6" fill={`url(#${id}-rocker)`} />
        <rect x={outboard * 79 + 1.4} y="-92" width="3.4" height="11" rx="1.7" fill={`url(#${id}-rocker)`} />
        <circle cx={outboard * 70} cy="-70" r="2.8" fill="#0b0c0e" stroke="#3d4148" strokeWidth="0.7" />
      </g>
      {/* Inboard horn: plain, with a slightly rounded top. */}
      <ellipse cx={-outboard * 79} cy="-87" rx="10.5" ry="5" fill={`url(#${id}-lip)`} stroke="#16181b" strokeWidth="1" />

      {/* Hub: same width, about 30% taller, rounded bottom corners, a slim rounded lip on top. */}
      <path d="M-34 -28 H34 V12 Q34 24 22 24 H-22 Q-34 24 -34 12 Z" fill={`url(#${id}-hub)`} stroke="#1d1f23" strokeWidth="1.2" />
      <rect x="-36" y="-32" width="72" height="7" rx="3.5" fill={`url(#${id}-lip)`} stroke="#1d1f23" strokeWidth="0.8" />
      <path d="M-31 -30.2 H31" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" strokeLinecap="round" />

      {/* Checklist clipped under the lip, hanging over the hub's upper half, with a soft shadow. */}
      <g transform={`rotate(${side === "left" ? -2 : 2} 0 -26)`}>
        <rect x="-18" y="-24" width="38" height="25" rx="1.4" fill="rgba(0,0,0,0.28)" />
        <rect x="-19" y="-26" width="38" height="25" rx="1.4" fill="#f4f1ea" stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" />
        <text x="0" y="-20" fontSize="3.4" fontWeight="700" fill="#222" textAnchor="middle" fontFamily="var(--font-mono), monospace">
          NORMAL CHECKLIST
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="-15" y={-16 + i * 3.6} width={i % 2 ? 12 : 15} height="1.1" fill="rgba(0,0,0,0.45)" />
            <rect x="3" y={-16 + i * 3.6} width="12" height="1.1" fill="rgba(0,0,0,0.3)" />
          </g>
        ))}
      </g>

      {/* "777" debossed into the plate below the card: plate colour, dark edge above, light edge below. */}
      <g fontSize="10" fontWeight="800" fontStyle="italic" textAnchor="middle" fontFamily="var(--font-sign), Arial, sans-serif" letterSpacing="0.6">
        <text x="0" y="13.5">777</text>
        <text x="0" y="12.5" fill="rgba(0,0,0,0.55)">777</text>
        <text x="0" y="14.5" fill="rgba(255,255,255,0.22)">777</text>
        <text x="0" y="13.5" fill="#484c54">777</text>
      </g>
    </g>
  );
});

/**
 * A yoke in front of one pilot's displays. `pull` is 0 at rest, 1 fully back at rotation;
 * `jitter` adds the take-off roll vibration.
 */
export const Yoke = ({ side, pull, jitter, detail }: { side: "left" | "right"; pull: number; jitter: number; detail: boolean }) => {
  const X = side === "left" ? -0.5 : 0.5;
  const z = 0.82;
  const [hx, hy] = P(X, -0.63, z);
  // Pulling back brings the yoke towards you: it grows and drops slightly, and its top tilts
  // in (shown as a little vertical foreshortening). It never moves up.
  const k = 1 + 0.05 * pull;
  return (
    <g transform={`translate(${r1(hx + jitter)} ${r1(hy + 9 * pull + jitter * 0.5)}) scale(${k.toFixed(3)} ${(k * (1 - 0.05 * pull)).toFixed(3)})`}>
      <YokeArt id={`yoke-${side}`} side={side} detail={detail} />
    </g>
  );
};

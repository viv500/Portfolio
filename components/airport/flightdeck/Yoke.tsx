import React, { memo } from "react";
import { P, r1 } from "./geometry";

// Boeing 777 control yoke, after a close-up of the real one: a thick, low U crossbar curving up
// into two chunky horns that flare at the top, in worn warm grey-bronze metal. The outboard horn
// carries a round housing with two stab-trim rockers and a small button; the inboard horn ends in
// a smooth sculpted curl. A tall shield-shaped centre plate with a rounded clip bar, "777"
// debossed below it and the NORMAL CHECKLIST clipped under the bar. Gradients only.
// The metal and horns are one drawing (the captain's, switches on the left horn), defined once
// and mirrored for the first officer; the plate's lettering and checklist are drawn unmirrored.

const HORN = "M-46 -6 C -70 -6, -84 -14, -86 -40 L -90 -94"; // left half: crossbar out and up the horn
const BAR = "M-46 -6 L 46 -6";

/** The metal: crossbar, horns, switches and the curl. Captain's side (switches on the left). */
const YokeMetal = memo(function YokeMetal() {
  const both = `${HORN} M46 -6 C 70 -6, 84 -14, 86 -40 L 90 -94`;
  return (
    <g id="yoke-metal">
      <defs>
        <linearGradient id="yk-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3a3632" />
          <stop offset="0.3" stopColor="#7a736a" />
          <stop offset="0.6" stopColor="#5a544c" />
          <stop offset="1" stopColor="#3a3632" />
        </linearGradient>
        <linearGradient id="yk-bar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#7a736a" />
          <stop offset="0.5" stopColor="#5a544c" />
          <stop offset="1" stopColor="#3a3632" />
        </linearGradient>
        <radialGradient id="yk-housing" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#4a4642" />
          <stop offset="1" stopColor="#141312" />
        </radialGradient>
        <linearGradient id="yk-rocker" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8e9096" />
          <stop offset="0.5" stopColor="#e6e7ea" />
          <stop offset="1" stopColor="#8e9096" />
        </linearGradient>
      </defs>
      {/* Column, down through the frame. */}
      <rect x="-12" y="0" width="24" height="240" rx="5" fill="url(#yk-metal)" />
      {/* Crossbar and horns: dark edge, rounded body, flared horn tops. */}
      <path d={`${both} ${BAR}`} fill="none" stroke="#2a2724" strokeWidth="35" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`${both} ${BAR}`} fill="none" stroke="url(#yk-bar)" strokeWidth="31" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-98 -100 Q -90 -108 -80 -100 L -78 -80 L -100 -82 Z M98 -100 Q 90 -108 80 -100 L 78 -80 L 100 -82 Z" fill="#5a544c" stroke="#2a2724" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Highlight along each horn's outer curve (warm at golden hour, neutral by day). */}
      <path d="M-50 -20 C -72 -20, -98 -30, -100 -60 L -103 -96 M50 -20 C 72 -20, 98 -30, 100 -60 L 103 -96" fill="none" stroke="rgb(var(--sunlit))" strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-40 -19.5 H40" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" />
      {/* Outboard horn top: round housing with two stab-trim rockers, a small button below. */}
      <circle cx="-90" cy="-100" r="13" fill="url(#yk-housing)" stroke="#1a1816" strokeWidth="1.2" />
      <rect x="-96" y="-109" width="5" height="17" rx="2.4" fill="url(#yk-rocker)" transform="rotate(-18 -93 -100)" />
      <rect x="-89" y="-109" width="5" height="17" rx="2.4" fill="url(#yk-rocker)" transform="rotate(-18 -86 -100)" />
      <circle cx="-74" cy="-82" r="3.2" fill="#0f0e0d" stroke="#3a3632" strokeWidth="0.8" />
      {/* Inboard horn top: a smooth curl bending slightly towards the viewer. */}
      <path d="M80 -100 C 82 -116, 104 -118, 104 -102 C 104 -94, 96 -92, 92 -96" fill="none" stroke="#2a2724" strokeWidth="13" strokeLinecap="round" />
      <path d="M80 -100 C 82 -116, 104 -118, 104 -102 C 104 -94, 96 -92, 92 -96" fill="none" stroke="url(#yk-bar)" strokeWidth="10" strokeLinecap="round" />
      <path d="M84 -108 C 88 -114, 100 -114, 101 -104" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
});

/** Centre plate: a tall shield with a clip bar, debossed "777" and the checklist (never mirrored). */
const Plate = memo(function Plate({ side }: { side: "left" | "right" }) {
  const id = `yk-plate-${side}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#4a453f" />
          <stop offset="0.35" stopColor="#6a645b" />
          <stop offset="0.7" stopColor="#5a544c" />
          <stop offset="1" stopColor="#3a3632" />
        </linearGradient>
        <linearGradient id={`${id}-brush`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      {/* Shield: nearly vertical sides, rounded bottom corners, down to just above the frame edge. */}
      <path d="M-40 -44 L 40 -44 L 39 52 Q 38 70 20 70 L -20 70 Q -38 70 -39 52 Z" fill={`url(#${id})`} stroke="#2a2724" strokeWidth="1.4" />
      <path d="M-40 -44 L 40 -44 L 39 52 Q 38 70 20 70 L -20 70 Q -38 70 -39 52 Z" fill={`url(#${id}-brush)`} />
      {/* Clip bar: a rounded lip across the top, slightly proud of the plate. */}
      <rect x="-42" y="-52" width="84" height="12" rx="6" fill="url(#yk-bar)" stroke="#2a2724" strokeWidth="1.2" />
      <path d="M-36 -49.5 H36" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
      {/* Checklist clipped under the bar, hanging over the plate's upper half. */}
      <g transform={`rotate(${side === "left" ? -2 : 2} 0 -40)`}>
        <rect x="-21" y="-39" width="44" height="40" rx="1.5" fill="rgba(0,0,0,0.3)" />
        <rect x="-22" y="-41" width="44" height="40" rx="1.5" fill="#f2efe8" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
        <text x="0" y="-33" fontSize="3.6" fontWeight="700" fill="#222" textAnchor="middle" fontFamily="var(--font-mono), monospace">
          NORMAL CHECKLIST
        </text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x="-18" y={-28 + i * 4.4} width={i % 2 ? 14 : 18} height="1.2" fill="rgba(0,0,0,0.45)" />
            <rect x="4" y={-28 + i * 4.4} width="13" height="1.2" fill="rgba(0,0,0,0.3)" />
          </g>
        ))}
      </g>
      {/* "777" debossed into the plate: plate colour, a dark edge above and a light edge below. */}
      <g fontSize="17" fontWeight="800" fontStyle="italic" textAnchor="middle" fontFamily="var(--font-sign), Arial, sans-serif" letterSpacing="1">
        <text x="0" y="17" fill="rgba(0,0,0,0.5)">777</text>
        <text x="0" y="19" fill="rgba(255,255,255,0.22)">777</text>
        <text x="0" y="18" fill="#5c564e">777</text>
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
      {/* The metal is drawn once (captain's) and mirrored for the first officer. */}
      {side === "left" ? <YokeMetal /> : <use href="#yoke-metal" transform="scale(-1 1)" />}
      <Plate side={side} />
    </g>
  );
};

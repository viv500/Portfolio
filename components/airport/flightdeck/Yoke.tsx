import React, { memo } from "react";
import { P, r1 } from "./geometry";

// Boeing-style control yoke: a column rising from below, a metal hub with a "777" nameplate and a
// clipped checklist card, and two matte black horns with trim, autopilot-disconnect and PTT
// switches. Drawn once at its native size and moved with a single transform, so animating it
// is cheap.

/** Static artwork, centred on the hub. Units are screen pixels at the yoke's resting depth. */
const YokeArt = memo(function YokeArt({ id, side, detail }: { id: string; side: "left" | "right"; detail: boolean }) {
  // Horn: from the hub out along the crossbar, then up and slightly back in at the tip.
  const horn = (dir: 1 | -1) => `M${dir * 22} -8 C ${dir * 52} -4, ${dir * 78} -8, ${dir * 84} -34 L ${dir * 82} -86`;
  const ptt = side === "left" ? -1 : 1; // push-to-talk sits on the outboard horn
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-col`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0d0e10" />
          <stop offset="0.45" stopColor="#3a3d43" />
          <stop offset="1" stopColor="#111214" />
        </linearGradient>
        <linearGradient id={`${id}-hub`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c9ccd1" />
          <stop offset="0.45" stopColor="#8b9098" />
          <stop offset="1" stopColor="#3e4248" />
        </linearGradient>
        <linearGradient id={`${id}-grip`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3a3c40" />
          <stop offset="0.35" stopColor="#1a1b1e" />
          <stop offset="1" stopColor="#060607" />
        </linearGradient>
        <pattern id={`${id}-grain`} width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.08)" />
          <circle cx="3" cy="3" r="0.4" fill="rgba(0,0,0,0.35)" />
        </pattern>
      </defs>

      {/* Column, disappearing below the frame. */}
      <rect x="-10" y="0" width="20" height="240" rx="5" fill={`url(#${id}-col)`} />
      <rect x="-10" y="18" width="20" height="5" fill="rgba(0,0,0,0.5)" />

      {/* Soft contact shadow of the horns on the panel behind. */}
      {detail && (
        <g opacity="0.35" transform="translate(5 9)">
          {([-1, 1] as const).map((d) => (
            <path key={d} d={horn(d)} fill="none" stroke="#000" strokeWidth="20" strokeLinecap="round" />
          ))}
        </g>
      )}

      {/* Horns: matte black grips, a lit top edge, a darker underside and worn edges. */}
      {([-1, 1] as const).map((d) => (
        <g key={d}>
          <path d={horn(d)} fill="none" stroke="#050506" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
          <path d={horn(d)} fill="none" stroke={`url(#${id}-grip)`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          {detail && <path d={horn(d)} fill="none" stroke={`url(#${id}-grain)`} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />}
          <path d={horn(d)} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeLinecap="round" transform={`translate(${d * -2.5} -5)`} />
          {/* Sun catching the top of the grip. */}
          <path d={horn(d)} fill="none" stroke="rgb(var(--sunlit))" strokeWidth="1.6" strokeLinecap="round" transform={`translate(${d * -3} -6)`} style={{ opacity: "calc(var(--sunlight) * 0.5)" }} />
          {/* Switches on the horn tops: trim (grey rocker) and autopilot disconnect (red). */}
          <rect x={d * 82 - 4} y="-96" width="8" height="7" rx="2" fill="#5d6168" stroke="#000" strokeWidth="0.8" />
          <circle cx={d * 75} cy="-62" r="3.2" fill="#b3261e" stroke="#000" strokeWidth="0.8" />
          {d === ptt && <rect x={d * 88 - 3} y="-50" width="6" height="9" rx="1.5" fill="#2a2c30" stroke="#000" strokeWidth="0.6" />}
        </g>
      ))}

      {/* Hub with the nameplate. */}
      <rect x="-34" y="-28" width="68" height="40" rx="9" fill={`url(#${id}-hub)`} stroke="#1d1f23" strokeWidth="1.2" />
      <rect x="-34" y="-28" width="68" height="40" rx="9" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" transform="translate(0 -0.6)" />
      <rect x="-12" y="-1" width="24" height="9" rx="1.5" fill="#1a1c20" />
      <text x="0" y="6" fontSize="7" fontWeight="700" fill="#e8ebef" textAnchor="middle" fontFamily="var(--font-sign), sans-serif" letterSpacing="0.5">
        777
      </text>

      {/* Checklist card clipped to the centre. */}
      <g transform={`rotate(${side === "left" ? -2 : 2})`}>
        <rect x="-21" y="-58" width="42" height="36" rx="1.5" fill="#f4f1ea" stroke="rgba(0,0,0,0.35)" strokeWidth="0.6" />
        <rect x="-5" y="-61" width="10" height="6" rx="1" fill="#6b7078" />
        <text x="0" y="-50" fontSize="3.6" fontWeight="700" fill="#222" textAnchor="middle" fontFamily="var(--font-mono), monospace">
          NORMAL CHECKLIST
        </text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x="-17" y={-46 + i * 4} width={i % 2 ? 14 : 18} height="1.2" fill="rgba(0,0,0,0.45)" />
            <rect x="4" y={-46 + i * 4} width="13" height="1.2" fill="rgba(0,0,0,0.3)" />
          </g>
        ))}
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

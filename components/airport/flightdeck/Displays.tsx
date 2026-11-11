import React from "react";
import { r1 } from "./geometry";

// Stylised Airbus-style glass cockpit displays. Each is drawn in its own w×h box and mapped
// onto the panel by the caller. Values come in as props so they move with the take-off.

export const SCREEN_W = 120;
export const SCREEN_H = 100;

const GREEN = "#3dd68c";
const CYAN = "#5fd4e8";
const AMBER = "#ffb000";
const MAGENTA = "#e05cc8";
const WHITE = "#e8edf2";
const font = { fontFamily: "var(--font-mono), monospace" } as const;

/** Primary flight display: FMA, attitude with pitch ladder and bank arc, speed and altitude tapes, heading. */
export const Pfd = ({ ias, alt, pitch, fma }: { ias: number; alt: number; pitch: number; fma: [string, string, string] }) => {
  const id = React.useId().replace(/:/g, "");
  const cx = 60;
  const cy = 52;
  const pp = 1.5; // pixels per degree of pitch
  const speeds: number[] = [];
  for (let v = Math.floor((ias - 50) / 10) * 10; v <= ias + 50; v += 10) if (v >= 0) speeds.push(v);
  const alts: number[] = [];
  for (let a = Math.floor((alt - 1000) / 100) * 100; a <= alt + 1000; a += 100) if (a >= 0) alts.push(a);
  return (
    <g style={font}>
      <defs>
        <clipPath id={`att${id}`}>
          <rect x="26" y="16" width="68" height="70" />
        </clipPath>
        <clipPath id={`spd${id}`}>
          <rect x="3" y="16" width="20" height="70" />
        </clipPath>
        <clipPath id={`alt${id}`}>
          <rect x="97" y="16" width="20" height="70" />
        </clipPath>
      </defs>
      {/* Flight mode annunciator. */}
      {fma.map((m, i) => (
        <g key={i}>
          <text x={20 + i * 40} y="10" fontSize="6.5" fill={i === 0 ? WHITE : GREEN} textAnchor="middle">
            {m}
          </text>
          {i < 2 && <line x1={40 + i * 40} x2={40 + i * 40} y1="2" y2="13" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />}
        </g>
      ))}
      {/* Attitude. */}
      <g clipPath={`url(#att${id})`}>
        <g transform={`translate(0 ${r1(pitch * pp)})`}>
          <rect x="0" y="-200" width="120" height={200 + cy} fill="#2a7ad2" />
          <rect x="0" y={cy} width="120" height="200" fill="#8a5a2b" />
          <line x1="0" x2="120" y1={cy} y2={cy} stroke={WHITE} strokeWidth="0.8" />
          {[-10, -5, 5, 10, 15, 20].map((d) => {
            const y = r1(cy - d * pp);
            const half = d % 10 === 0 ? 11 : 5;
            return (
              <g key={d}>
                <line x1={cx - half} x2={cx + half} y1={y} y2={y} stroke={WHITE} strokeWidth="0.7" />
                {d % 10 === 0 && (
                  <text x={cx - half - 5} y={y + 2} fontSize="5" fill={WHITE} textAnchor="middle">
                    {Math.abs(d)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        {/* Bank arc. */}
        <path d={`M${cx - 26} 30 A 30 30 0 0 1 ${cx + 26} 30`} fill="none" stroke={WHITE} strokeWidth="0.7" />
        {[-30, -20, -10, 0, 10, 20, 30].map((a) => {
          const rad = (a * Math.PI) / 180;
          return <line key={a} x1={r1(cx + Math.sin(rad) * 31)} y1={r1(52 - Math.cos(rad) * 31)} x2={r1(cx + Math.sin(rad) * (a % 30 === 0 ? 35 : 33))} y2={r1(52 - Math.cos(rad) * (a % 30 === 0 ? 35 : 33))} stroke={WHITE} strokeWidth="0.7" />;
        })}
        <path d={`M${cx} 21 l-2.5 -4 h5 z`} fill="#ffcc33" />
      </g>
      {/* Aircraft symbol. */}
      <path d={`M${cx - 22} ${cy} h12 v4 M${cx + 22} ${cy} h-12 v4`} stroke="#000" strokeWidth="3.2" fill="none" />
      <path d={`M${cx - 22} ${cy} h12 v4 M${cx + 22} ${cy} h-12 v4`} stroke="#ffcc33" strokeWidth="1.8" fill="none" />
      <rect x={cx - 1.5} y={cy - 1.5} width="3" height="3" fill="#ffcc33" stroke="#000" strokeWidth="0.6" />
      {/* Speed tape. */}
      <rect x="3" y="16" width="20" height="70" fill="#3a4250" />
      <g clipPath={`url(#spd${id})`}>
        {speeds.map((v) => {
          const y = r1(cy + (ias - v) * 0.7);
          return (
            <g key={v}>
              <line x1="18" x2="23" y1={y} y2={y} stroke={WHITE} strokeWidth="0.6" />
              {v % 20 === 0 && (
                <text x="15" y={y + 2} fontSize="5.5" fill={WHITE} textAnchor="end">
                  {v}
                </text>
              )}
            </g>
          );
        })}
      </g>
      <path d={`M16 ${cy} h9`} stroke="#ffcc33" strokeWidth="1.2" />
      {/* Altitude tape. */}
      <rect x="97" y="16" width="20" height="70" fill="#3a4250" />
      <g clipPath={`url(#alt${id})`}>
        {alts.map((a) => {
          const y = r1(cy + (alt - a) * 0.05);
          return (
            <g key={a}>
              <line x1="97" x2="100" y1={y} y2={y} stroke={WHITE} strokeWidth="0.5" />
              {a % 500 === 0 && (
                <text x="102" y={y + 2} fontSize="5" fill={WHITE}>
                  {a / 100}
                </text>
              )}
            </g>
          );
        })}
      </g>
      <rect x="99" y={cy - 4.5} width="18" height="9" fill="#000" stroke="#ffcc33" strokeWidth="0.6" />
      <text x="108" y={cy + 2.2} fontSize="6" fill={GREEN} textAnchor="middle">
        {Math.round(alt)}
      </text>
      {/* Heading strip. */}
      <rect x="26" y="88" width="68" height="11" fill="#3a4250" />
      {[0, 5, 10, 15, 20, 25, 30, 35, 40].map((h) => {
        const x = r1(60 + (h - 20) * 1.6);
        return (
          <g key={h}>
            <line x1={x} x2={x} y1="88" y2={h % 10 === 0 ? 92 : 90} stroke={WHITE} strokeWidth="0.5" />
            {h % 10 === 0 && (
              <text x={x} y="98" fontSize="5" fill={WHITE} textAnchor="middle">
                {h / 10}
              </text>
            )}
          </g>
        );
      })}
      <line x1="60" x2="60" y1="86" y2="94" stroke="#ffcc33" strokeWidth="1" />
    </g>
  );
};

/** Navigation display: arc rose, range rings, heading bug and the route to Waterloo. */
export const Nd = ({ gs, nm }: { gs: number; nm: number }) => {
  const cx = 60;
  const cy = 92;
  const ticks = Array.from({ length: 21 }, (_, i) => -50 + i * 5);
  return (
    <g style={font}>
      <text x="4" y="8" fontSize="5.5" fill={WHITE}>
        GS <tspan fill={GREEN}>{gs}</tspan> TAS <tspan fill={GREEN}>{Math.max(0, gs - 4)}</tspan>
      </text>
      <text x="116" y="8" fontSize="5.5" fill={WHITE} textAnchor="end">
        YKF <tspan fill={GREEN}>{nm}NM</tspan>
      </text>
      {/* Range rings. */}
      {[38, 76].map((r) => (
        <path key={r} d={`M${r1(cx - r * Math.sin(0.87))} ${r1(cy - r * Math.cos(0.87))} A ${r} ${r} 0 0 1 ${r1(cx + r * Math.sin(0.87))} ${r1(cy - r * Math.cos(0.87))}`} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" strokeDasharray={r === 38 ? "2 2" : undefined} />
      ))}
      {ticks.map((a) => {
        const rad = (a * Math.PI) / 180;
        const long = a % 10 === 0;
        return <line key={a} x1={r1(cx + Math.sin(rad) * 76)} y1={r1(cy - Math.cos(rad) * 76)} x2={r1(cx + Math.sin(rad) * (long ? 71 : 73.5))} y2={r1(cy - Math.cos(rad) * (long ? 71 : 73.5))} stroke={WHITE} strokeWidth="0.6" />;
      })}
      {[-30, 0, 30].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <text key={a} x={r1(cx + Math.sin(rad) * 66)} y={r1(cy - Math.cos(rad) * 66 + 2)} fontSize="5.5" fill={WHITE} textAnchor="middle">
            {(2 + a / 10 + 36) % 36}
          </text>
        );
      })}
      {/* Heading bug and lubber line. */}
      <path d={`M${cx} 14 l-2.5 -4 h5 z`} fill={CYAN} />
      <line x1={cx} x2={cx} y1="16" y2="20" stroke="#ffcc33" strokeWidth="1" />
      {/* Route: dashed magenta from the runway out towards Waterloo. */}
      <path d={`M${cx} ${cy - 6} L${cx + 2} 68 L${cx + 9} 44 L${cx + 19} 22`} fill="none" stroke={MAGENTA} strokeWidth="1" strokeDasharray="3 2" />
      {[
        [cx + 2, 68, "DXB"],
        [cx + 9, 44, "PASOV"],
        [cx + 19, 22, "YKF"],
      ].map(([x, y, n]) => (
        <g key={n as string}>
          <path d={`M${x} ${(y as number) - 2.5} l2.5 2.5 l-2.5 2.5 l-2.5 -2.5 z`} fill="none" stroke={n === "YKF" ? MAGENTA : WHITE} strokeWidth="0.6" />
          <text x={(x as number) + 4} y={(y as number) + 2} fontSize="5" fill={n === "YKF" ? MAGENTA : WHITE}>
            {n}
          </text>
        </g>
      ))}
      {/* Own aircraft. */}
      <path d={`M${cx} ${cy - 6} l-4 7 h8 z`} fill="none" stroke="#ffcc33" strokeWidth="1" />
    </g>
  );
};

/** Boeing EICAS: N1 and EGT dials for both engines, total fuel, and short status messages. */
export const Eicas = ({ n1, egt, ff, airborne }: { n1: number; egt: number; ff: number; airborne: boolean }) => {
  const dial = (cx: number, cy: number, r: number, frac: number, value: string, big: boolean) => {
    const a0 = -215;
    const a1 = 35;
    const pt = (deg: number, rr: number) => [r1(cx + Math.cos((deg * Math.PI) / 180) * rr), r1(cy + Math.sin((deg * Math.PI) / 180) * rr)];
    const [sx, sy] = pt(a0, r);
    const [ex, ey] = pt(a1, r);
    const ang = a0 + (a1 - a0) * Math.min(1, Math.max(0, frac));
    const [nx, ny] = pt(ang, r - 1);
    const [rx, ry] = pt(a0 + (a1 - a0) * 0.92, r);
    // Filled sector up to the needle, as on Boeing engine dials.
    const [fx, fy] = pt(ang, r);
    const large = ang - a0 > 180 ? 1 : 0;
    return (
      <g>
        <path d={`M${cx} ${cy} L${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${fx} ${fy} Z`} fill="rgba(255,255,255,0.14)" />
        <path d={`M${sx} ${sy} A ${r} ${r} 0 1 1 ${ex} ${ey}`} fill="none" stroke={WHITE} strokeWidth={big ? 1 : 0.8} />
        <path d={`M${rx} ${ry} A ${r} ${r} 0 0 1 ${ex} ${ey}`} fill="none" stroke="#ff4d4d" strokeWidth={big ? 1.6 : 1.2} />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={WHITE} strokeWidth={big ? 1.4 : 1} strokeLinecap="round" />
        <rect x={cx + 1} y={cy - (big ? 10 : 8)} width={big ? 18 : 14} height={big ? 7.5 : 6} fill="#000" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
        <text x={cx + (big ? 18 : 14) - 0.5} y={cy - (big ? 4.2 : 3.4)} fontSize={big ? 5.8 : 4.6} fill={WHITE} textAnchor="end">
          {value}
        </text>
      </g>
    );
  };
  const memo = airborne ? ["GEAR UP", "FLAPS 5", "A/T ARM"] : ["AUTOBRAKE RTO", "SEATBELTS ON", "PARK BRAKE OFF"];
  return (
    <g style={font}>
      {dial(18, 26, 13, n1 / 104, n1.toFixed(1), true)}
      {dial(52, 26, 13, n1 / 104, n1.toFixed(1), true)}
      <text x="35" y="47" fontSize="5" fill={CYAN} textAnchor="middle">
        N1
      </text>
      {dial(18, 66, 9, (egt - 300) / 700, String(Math.round(egt)), false)}
      {dial(52, 66, 9, (egt - 300) / 700, String(Math.round(egt)), false)}
      <text x="35" y="82" fontSize="5" fill={CYAN} textAnchor="middle">
        EGT
      </text>
      <line x1="72" x2="72" y1="6" y2="94" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
      <text x="76" y="10" fontSize="4.2" fill={CYAN}>
        TOTAL FUEL
      </text>
      <text x="76" y="18" fontSize="6.5" fill={WHITE}>
        18.4
      </text>
      <text x="96" y="18" fontSize="4" fill={CYAN}>
        KGS X 1000
      </text>
      <text x="76" y="28" fontSize="4.2" fill={CYAN}>
        FF
      </text>
      <text x="86" y="28" fontSize="4.6" fill={WHITE}>
        {(ff / 1000).toFixed(1)}
      </text>
      {memo.map((m, i) => (
        <text key={m} x="76" y={46 + i * 9} fontSize="4.4" fill={WHITE}>
          {m}
        </text>
      ))}
    </g>
  );
};

/** Integrated standby flight display: a small attitude ball with speed and altitude. */
export const Isfd = ({ ias, alt, pitch }: { ias: number; alt: number; pitch: number }) => {
  const id = React.useId().replace(/:/g, "");
  return (
    <g style={font}>
      <defs>
        <clipPath id={`isfd${id}`}>
          <circle cx="60" cy="52" r="34" />
        </clipPath>
      </defs>
      <rect width="120" height="100" fill="#000" />
      <g clipPath={`url(#isfd${id})`}>
        <g transform={`translate(0 ${r1(pitch * 1.2)})`}>
          <rect x="0" y="-60" width="120" height="112" fill="#2a7ad2" />
          <rect x="0" y="52" width="120" height="110" fill="#8a5a2b" />
          <line x1="0" x2="120" y1="52" y2="52" stroke={WHITE} strokeWidth="0.8" />
        </g>
      </g>
      <circle cx="60" cy="52" r="34" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      <path d="M44 52 h10 v4 M76 52 h-10 v4" stroke="#ffcc33" strokeWidth="2" fill="none" />
      <text x="13" y="56" fontSize="11" fill={WHITE} textAnchor="middle">
        {Math.round(ias)}
      </text>
      <text x="107" y="56" fontSize="9" fill={WHITE} textAnchor="middle">
        {Math.round(alt / 10) * 10}
      </text>
      <text x="60" y="96" fontSize="7" fill={CYAN} textAnchor="middle">
        STBY
      </text>
    </g>
  );
};

// One camera for the whole flight deck scene. The eye is at the origin looking down +z;
// X is to the right, Y is up. Every layer (outside, cockpit shell, panel) projects with the
// same function and shares the 1000×600 viewBox, so they always line up.

export const VIEW_W = 1000;
export const VIEW_H = 600;
export const VP = 500; // vanishing point, straight ahead
export const HZ = 205; // eye level (the horizon)
export const F = 440; // focal length: wide enough to see into the side windows

export type V3 = [number, number, number];

export const r1 = (n: number) => Math.round(n * 10) / 10;

/** Screen position of a point in camera space. */
export const P = (X: number, Y: number, z: number): [number, number] => [r1(VP + (F * X) / z), r1(HZ - (F * Y) / z)];
export const ps = (v: V3) => P(v[0], v[1], v[2]).join(" ");

/** Closed SVG path through 3D points. */
export const poly = (pts: V3[]) => `M${pts.map(ps).join(" L")} Z`;

/** Mirror a point to the other side of the cockpit. */
export const mirror = (v: V3): V3 => [-v[0], v[1], v[2]];

/**
 * SVG matrix mapping a flat w×h drawing onto a quad given by its top-left, top-right and
 * bottom-left corners in 3D. Affine, which is close enough for small screens on a panel.
 */
export const affine = (tl: V3, tr: V3, bl: V3, w: number, h: number) => {
  const [x0, y0] = P(...tl);
  const [x1, y1] = P(...tr);
  const [x2, y2] = P(...bl);
  const f = (n: number) => Math.round(n * 1000) / 1000;
  return `matrix(${f((x1 - x0) / w)} ${f((y1 - y0) / w)} ${f((x2 - x0) / h)} ${f((y2 - y0) / h)} ${x0} ${y0})`;
};

export const col = (name: string, a = 1) => `rgb(var(--${name}) / ${a})`;

// ── Cockpit structure (camera space) ──────────────────────────────────
// Front windscreen panes (left side; the right is mirrored).
export const FRONT_L: V3[] = [
  [-0.03, 0.3, 1.95],
  [-0.32, 0.31, 1.85],
  [-0.6, 0.27, 1.72],
  [-0.58, -0.24, 1.4],
  [-0.03, -0.24, 1.55],
];
// Side windows sit in the side wall (X = -0.78) and wrap back towards the viewer.
export const SIDE_X = -0.78;
export const SIDE1_L: V3[] = [
  [SIDE_X, 0.25, 1.3],
  [SIDE_X, 0.26, 1.0],
  [SIDE_X, -0.23, 1.0],
  [SIDE_X, -0.22, 1.24],
];
export const SIDE2_L: V3[] = [
  [SIDE_X, 0.26, 0.92],
  [SIDE_X, 0.27, 0.62],
  [SIDE_X, -0.27, 0.62],
  [SIDE_X, -0.23, 0.92],
];
export const CEILING_Y = 0.37;

// ── Windscreen outline, in screen space ─────────────────────────────────
// Proportioned after an A320: two wide, short front panes on a thin centre post, slim diagonal
// A-pillars, and wide side windows. Drawn directly in viewBox units; x is mirrored for the right.
export type V2 = [number, number];
export const sp = (pts: V2[]) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;
export const mx = (pts: V2[]): V2[] => pts.map(([x, y]) => [1000 - x, y]);
// Front pane: the top rises slightly towards the outside, the bottom drops away.
// Side windows: the top starts level with the front pane's outer corner and runs flat to
// slightly down; the bottom keeps dropping.
// Boeing 777, after a straight-on flight deck photo: two wide, short front panes (about 2.5:1)
// either side of a thin vertical post, thick A-pillars raked in at the top, and side windows
// whose tops line up with the front panes while their bottoms drop away towards the outside.
// Every window ends at the sill, so nothing outside shows below the glareshield.
export const WS_FRONT_L: V2[] = [[492, 128], [380, 129], [264, 133], [244, 236], [492, 250]];
export const WS_SIDE1_L: V2[] = [[232, 134], [58, 141], [40, 312], [222, 242]];
export const WS_SIDE2_L: V2[] = [[34, 142], [-150, 150], [-166, 336], [16, 318]];
export const WS_APILLAR_L: V2[] = [[264, 133], [232, 134], [222, 242], [244, 236]];
export const WS_MIDPILLAR_L: V2[] = [[58, 141], [34, 142], [16, 318], [40, 312]];
export const WS_POST: V2[] = [[492, 128], [508, 128], [508, 250], [492, 250]];
/** The sill: the bottom edge of every window, left to right, which the glareshield sits on. */
export const SILL: V2[] = [[-220, 338], [-166, 336], [16, 318], [40, 312], [222, 242], [244, 236], [492, 250], [508, 250], [756, 236], [778, 242], [960, 312], [984, 318], [1166, 336], [1220, 338]];

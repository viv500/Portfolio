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
export type V2 = [number, number];
export const sp = (pts: V2[]) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;
export const mx = (pts: V2[]): V2[] => pts.map(([x, y]) => [1000 - x, y]);

// Boeing 777, after a straight-on flight deck photo. Every window sits directly on the
// glareshield: its bottom edge follows the glareshield's back edge (the same arch across the
// front panes, then down the sloping wings under the side windows), a thin even hood-top strip
// (HOOD units) behind its front edge. The tops rise gently from the centre post towards the outer
// pillars (about 5°), and the pillars lean slightly outward at the top.

/** The glareshield's front top edge, left half (matches the shape drawn in Panel.tsx). */
const GS_EDGE_L: V2[] = (() => {
  const bez = (a: V2, b: V2, c: V2, d: V2, n: number): V2[] =>
    Array.from({ length: n }, (_, i) => {
      const t = (i + 1) / n;
      const u = 1 - t;
      return [u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]];
    });
  return [[500, 268], [335, 268], ...bez([335, 268], [312, 268], [296, 270], [282, 276], 8), [70, 314], ...bez([70, 314], [48, 318], [30, 324], [28, 330], 6)];
})();
/** Height of the hood-top strip between the glareshield's front edge and the glass. */
export const HOOD = 20;
/** The window sill (the glareshield's back edge) at x. Outboard of the glareshield's tips it runs
 *  on along the side wall under the rear side windows. */
export const sillAt = (x: number): number => {
  const xl = x > 500 ? 1000 - x : x;
  if (xl <= 28) return 330 - HOOD + (28 - xl) * 0.15;
  for (let i = 1; i < GS_EDGE_L.length; i++) {
    const [x0, y0] = GS_EDGE_L[i - 1];
    const [x1, y1] = GS_EDGE_L[i];
    if (xl <= x0 && xl >= x1) return y0 + ((y1 - y0) * (xl - x0)) / (x1 - x0) - HOOD;
  }
  return 268 - HOOD;
};
const r = (n: number) => Math.round(n * 10) / 10;
const at = (x: number): V2 => [x, r(sillAt(x))];
/** Window tops: rising about 5° from the centre post outward. */
const TOP_SLOPE = 0.0875;
const top = (x: number): V2 => [x, r(128 - TOP_SLOPE * (492 - x))];
const bottom = (from: number, to: number, step = 12): V2[] => {
  const out: V2[] = [];
  for (let x = from; from < to ? x < to : x > to; x += from < to ? step : -step) out.push(at(x));
  return out;
};
// Pane outlines, left side (the right is mirrored). Order: top inner, top outer, bottom outer, … bottom inner.
export const WS_FRONT_L: V2[] = [top(492), top(380), top(250), at(258), ...bottom(270, 496), at(496)];
export const WS_SIDE1_L: V2[] = [top(224), top(62), at(48), at(70), at(150), at(234)];
export const WS_SIDE2_L: V2[] = [top(38), top(-150), at(-166), at(26)];
export const WS_APILLAR_L: V2[] = [top(250), top(224), at(234), at(258)];
export const WS_MIDPILLAR_L: V2[] = [top(62), top(38), at(26), at(48)];
// The post tapers towards its base, so the near centreline dashes peek out either side.
export const WS_POST: V2[] = [[492, 128], [508, 128], [504, sillAt(500)], [496, sillAt(500)]];
/** The sill: the bottom edge of every window, left to right, which the glareshield sits on. */
export const SILL: V2[] = Array.from({ length: 145 }, (_, i) => at(-220 + i * 10));

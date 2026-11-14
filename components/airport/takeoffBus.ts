import { motionValue } from "framer-motion";

/** Climb progress of the intro take-off (0 → 1), shared with the flight strip at the bottom. */
export const takeoffClimb = motionValue(0);

/** sessionStorage key: the intro has played this session. */
export const TAKEOFF_SEEN_KEY = "takeoff-seen";

/** Is the intro overlay showing right now? (Set before first paint by the script in app/layout.tsx.) */
export const takeoffPlaying = () => typeof document !== "undefined" && !!document.documentElement.dataset.takeoff;

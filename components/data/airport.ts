// Airport-theme metadata layered over the content in ./index.ts. Wording lives there;
// this file only says how each item appears on the boards, passes and stamps.

export type FlightStatus = "BOARDING" | "LANDED";

export type Flight = {
  /** Shown in the TIME column. */
  time: string;
  flight: string;
  /** VIA column: the role's two main technologies, in split-flap characters. */
  via: string;
  /** Logbook REMARKS: the same, in plain text. */
  remarks: string;
  /** Short destination for the split-flap board (max ~15 characters). */
  dest: string;
  /** Airport code of the city the role was in. */
  gate: string;
  status: FlightStatus;
};

export const flights: Record<string, Flight> = {
  shopify: { time: "JAN '27", via: "INFRA", remarks: "Backend · Infra", flight: "VJ 127", dest: "SHOPIFY", gate: "YYZ", status: "BOARDING" },
  "arctic-wolf": { time: "JAN '26", via: "GO·AWS", remarks: "Go · AWS", flight: "VJ 126", dest: "ARCTIC WOLF", gate: "YKF", status: "LANDED" },
  rocket: { time: "MAY '25", via: "GO·MCP", remarks: "Go · MCP", flight: "VJ 525", dest: "ROCKET MORTGAGE", gate: "DTW", status: "LANDED" },
  csc: { time: "SEP '24", via: "NEXT·PG", remarks: "Next.js · Postgres", flight: "VJ 924", dest: "UW CS CLUB", gate: "YKF", status: "LANDED" },
  assistnow: { time: "MAY '24", via: "JAVA·K8S", remarks: "Java · Kubernetes", flight: "VJ 524", dest: "ASSISTNOW", gate: "RMT", status: "LANDED" },
};

/** Ink colour and placement for each hackathon stamp. */
export type Stamp = { ink: "blue" | "red" | "green" | "violet" | "teal"; shape: "round" | "rect" | "oval"; rotate: number };

export const stamps: Record<string, Stamp> = {
  canify: { ink: "red", shape: "round", rotate: -2 },
  datafest: { ink: "blue", shape: "rect", rotate: 1.5 },
  watchdog: { ink: "green", shape: "oval", rotate: -1 },
  sofia: { ink: "violet", shape: "rect", rotate: 7 },
  "finance-cats": { ink: "teal", shape: "round", rotate: -11 },
  pixelperfect: { ink: "blue", shape: "oval", rotate: 9 },
  leaselinker: { ink: "red", shape: "rect", rotate: -6 },
};

// Three-letter "airport codes" for the boarding passes.
/** Each boarding pass's "route": the problem it starts from and the result it lands on. */
export const passCodes: Record<string, { from: string; fromCap: string; to: string; toCap: string; seat: string }> = {
  allocator: { from: "MANUAL", fromCap: "retrying by hand", to: "AUTO", toCap: "host allocated", seat: "1A" },
  "internship-bot": { from: "6 LISTS", fromCap: "checked by hand", to: "1 FEED", toCap: "alerts on Telegram", seat: "2C" },
  ecg: { from: "BLACK BOX", fromCap: "opaque model", to: "XAI", toCap: "explained predictions", seat: "3F" },
  wat2eat: { from: "HUNGRY", fromCap: "can't decide", to: "MATCHED", toCap: "where to eat", seat: "4D" },
};

// Project images: shown through the window on each boarding pass, and as the polaroid
// tucked behind each hackathon stamp. Items without one show sky instead.
export const previews: Record<string, string> = {
  "internship-bot": "/media/internship-bot/window.jpg",
  ecg: "/media/ecg/window.jpg",
  wat2eat: "/media/wat2eat/window.jpg",
  canify: "/media/thumbs/canify.jpg",
  datafest: "/media/thumbs/datafest.jpg",
  watchdog: "/media/thumbs/watchdog.jpg",
  sofia: "/media/sofia/dashboard.jpg",
  "finance-cats": "/media/finance-cats/home.png",
  leaselinker: "/media/leaselinker/home.jpg",
};

/**
 * Short lines for the EICAS "also shipped" screen, keyed by story title: the key number first,
 * then a few plain words. Only results that aren't already in the impact stat grid are listed.
 */
export const shipped: Record<string, { n: string; text: string }> = {
  "macOS CI build nodes": { n: "5+", text: "macOS CI build nodes" },
  "Class Profile 2024": { n: "2,500+", text: "users on Class Profile 2024" },
  "Kubernetes deployments": { n: "2 hrs → 10 min", text: "deploys across 12+ services" },
  "C++ gRPC service": { n: "35%", text: "less gRPC serialization overhead" },
};

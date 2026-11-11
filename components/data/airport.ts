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
export const passCodes: Record<string, { from: string; to: string; seat: string }> = {
  allocator: { from: "SSO", to: "EC2", seat: "1A" },
  "internship-bot": { from: "GHA", to: "TLG", seat: "2C" },
  ecg: { from: "ECG", to: "XAI", seat: "3F" },
  wat2eat: { from: "UWO", to: "EAT", seat: "4D" },
};

// Project images: shown through the window on each boarding pass, and as the polaroid
// tucked behind each hackathon stamp. Items without one show sky instead.
export const previews: Record<string, string> = {
  "internship-bot": "/media/internship-bot/telegram-alert.jpg",
  ecg: "/media/ecg/capacity-vs-interpretability.png",
  wat2eat: "/media/wat2eat/match.png",
  canify: "/media/thumbs/canify.jpg",
  datafest: "/media/thumbs/datafest.jpg",
  watchdog: "/media/thumbs/watchdog.jpg",
  sofia: "/media/sofia/dashboard.jpg",
  "finance-cats": "/media/finance-cats/home.png",
  leaselinker: "/media/leaselinker/home.jpg",
};

/**
 * Short lines for the EICAS "shipped" screen, keyed by story title: the key number first, then
 * a few plain words. Stories without an entry here aren't listed.
 */
export const shipped: Record<string, { n: string; text: string }> = {
  "AWS Dedicated Host Allocator": { n: "~5 hrs", text: "saved per AWS host allocation" },
  "macOS CI build nodes": { n: "5+", text: "macOS CI build nodes" },
  "Bazel caching for ARM64 builds": { n: "~40%", text: "faster ARM64 builds" },
  "CI security hardening": { n: "20+", text: "pipelines hardened, zero downtime" },
  "MCP DevOps agent": { n: "~20 hrs/wk", text: "saved with an MCP agent (est.)" },
  "API performance and Rocket Homes features": { n: "35%", text: "lower API latency" },
  "Class Profile 2024": { n: "2,500+", text: "users on Class Profile 2024" },
  "Kubernetes deployments": { n: "2 hrs → 10 min", text: "deploys across 12+ services" },
  "C++ gRPC service": { n: "35%", text: "less gRPC serialization overhead" },
};

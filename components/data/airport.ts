// Airport-theme metadata layered over the content in ./index.ts. Wording lives there;
// this file only says how each item appears on the boards, passes and stamps.

export type FlightStatus = "BOARDING" | "LANDED";

export type Flight = {
  /** Shown in the TIME column. */
  time: string;
  flight: string;
  /** Short destination for the split-flap board (max ~15 characters). */
  dest: string;
  /** Airport code of the city the role was in. */
  gate: string;
  status: FlightStatus;
};

export const flights: Record<string, Flight> = {
  shopify: { time: "JAN '27", flight: "VJ 127", dest: "SHOPIFY", gate: "YYZ", status: "BOARDING" },
  "arctic-wolf": { time: "JAN '26", flight: "VJ 126", dest: "ARCTIC WOLF", gate: "YKF", status: "LANDED" },
  rocket: { time: "MAY '25", flight: "VJ 525", dest: "ROCKET MORTGAGE", gate: "DTW", status: "LANDED" },
  csc: { time: "SEP '24", flight: "VJ 924", dest: "UW CS CLUB", gate: "YKF", status: "LANDED" },
  assistnow: { time: "MAY '24", flight: "VJ 524", dest: "ASSISTNOW", gate: "RMT", status: "LANDED" },
};

/** Ink colour and placement for each hackathon stamp. */
export type Stamp = { ink: "blue" | "red" | "green" | "violet" | "teal"; shape: "round" | "rect" | "oval"; rotate: number };

export const stamps: Record<string, Stamp> = {
  canify: { ink: "red", shape: "round", rotate: -8 },
  datafest: { ink: "blue", shape: "rect", rotate: 5 },
  watchdog: { ink: "green", shape: "oval", rotate: -4 },
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

import posthog from "posthog-js";
import { hackathons, projects, roles } from "@/components/data";

// Every custom PostHog event the site sends, in one place. Names are snake_case object_action.
// Each event also carries `summary`: a short sentence for the PostHog activity feed and session
// timelines, so the log reads at a glance. ANALYTICS.md documents these for pasting into PostHog.

export const EVENTS = {
  takeoff_completed: "The intro take-off played to the end and handed off to the page.",
  takeoff_skipped: "The intro take-off was skipped (Skip button, a deliberate scroll, or a navigation key).",
  takeoff_replayed: "The visitor clicked Replay take-off on the check-in board.",
  first_scroll: "The visitor's first scroll after the page appeared; after_s is how long they looked first.",
  section_viewed: "A section of the page sat in the middle of the screen for a second (once per section per visit).",
  scroll_depth_reached: "The visitor scrolled 25 / 50 / 75 / 100% of the way down the page (once each).",
  panel_opened: "A detail panel opened: an experience entry, a project, a hackathon, or the résumé.",
  panel_closed: "A detail panel closed; seconds_open is how long it was open.",
  resume_opened: "The résumé PDF was viewed or downloaded.",
  link_clicked: "An outbound link (GitHub, LinkedIn, Devpost, email, …) was clicked.",
  palette_changed: "The visitor switched between golden hour and day.",
  passport_page_turned: "The visitor opened, closed or paged through the About passport.",
  media_played: "A project video was played or unmuted.",
  tracked_link_opened: "The visitor arrived through a tagged link (e.g. /portfolio) that's used in one place only; via names it.",
} as const;

export type EventName = keyof typeof EVENTS;
type Props = Record<string, string | number | boolean | null | undefined>;

/** Sends a named event with a readable summary. No-op when tracking is off (?notrack) or not loaded. */
export const track = (event: EventName, summary: string, props: Props = {}) => {
  if (typeof window === "undefined" || !(posthog as unknown as { __loaded?: boolean }).__loaded) return;
  posthog.capture(event, { summary, ...props });
  // Dev-only test hook: a record of what was sent.
  if (process.env.NODE_ENV !== "production") ((window as unknown as { __events?: unknown[] }).__events ??= []).push({ event, summary, ...props });
};

/** Sets properties sent with every later event (PostHog super properties). */
export const setContext = (props: Props) => {
  if (typeof window === "undefined" || !(posthog as unknown as { __loaded?: boolean }).__loaded) return;
  posthog.register(props);
};

/** Readable names for the page's sections, by element id. */
export const SECTION_NAMES: Record<string, string> = {
  top: "Check-in",
  experience: "Experience",
  ops: "Impact",
  projects: "Projects",
  hackathons: "Hackathons",
  about: "About",
  contact: "Contact",
};

/** The section an element sits in, by name ("Check-in" above the first section). */
export const sectionOf = (el: Element | null) => {
  const s = el?.closest("section[id]");
  return s ? SECTION_NAMES[s.id] ?? s.id : el?.closest('[role="dialog"]') ? "Panel" : "Check-in";
};

/** What a hash route opens, in words: { kind, slug, title }; null for plain section anchors. */
export const panelOf = (route: string) => {
  const [top, slug] = route.split("/");
  if (top === "resume") return { kind: "resume", slug: "resume", title: "Résumé" };
  if (!slug) return null;
  if (top === "experience") {
    const r = roles.find((x) => x.slug === slug);
    return { kind: "experience", slug, title: r ? `${r.company} · ${r.shortTitle ?? r.title}` : slug };
  }
  if (top === "projects") return { kind: "project", slug, title: projects.find((x) => x.slug === slug)?.title ?? (slug === "allocator" ? "AWS Dedicated Host Allocator" : slug) };
  if (top === "hackathons") return { kind: "hackathon", slug, title: hackathons.find((x) => x.slug === slug)?.title ?? slug };
  return null;
};

/** Where an outbound link goes, as a name. */
export const destinationOf = (url: string) => {
  if (url.startsWith("mailto:")) return "Email";
  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();
  const known: [RegExp, string][] = [
    [/github\.com$/, "GitHub"],
    [/gitlab\.com$/, "GitLab"],
    [/linkedin\.com$/, "LinkedIn"],
    [/devpost\.com$/, "Devpost"],
    [/youtube\.com$|youtu\.be$/, "YouTube"],
  ];
  return known.find(([re]) => re.test(host))?.[1] ?? (host || "Other");
};

export const deviceClass = () => (window.innerWidth < 640 ? "phone" : window.innerWidth < 1024 ? "tablet" : "desktop");

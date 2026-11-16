"use client";
import { useEffect } from "react";
import posthog from "posthog-js";
import { SECTION_NAMES, destinationOf, deviceClass, panelOf, sectionOf, setContext, track } from "@/lib/analytics";

// Project API key from PostHog (Settings → Project). It's a public, write-only key, safe in client code.
const POSTHOG_KEY = "phc_A7JaAEPSy7Pi7bcPeF4Qa2cbMHpEr9zXMXzypv4yUpsK";
const POSTHOG_HOST = "https://us.i.posthog.com";

// Visiting any page with ?notrack stops this browser from being counted (your own visits);
// ?track turns it back on.
const OPT_OUT_KEY = "ph-notrack";

// The custom events are listed and described in lib/analytics.ts and ANALYTICS.md.

const labelOf = (a: HTMLAnchorElement) =>
  (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
const route = () => decodeURIComponent(window.location.hash.slice(1));
// The landing route is reported once per page load (dev mode mounts effects twice).
let landingReported = false;

export const PostHogAnalytics = () => {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    const params = new URLSearchParams(window.location.search);
    try {
      if (params.has("notrack")) localStorage.setItem(OPT_OUT_KEY, "1");
      if (params.has("track")) localStorage.removeItem(OPT_OUT_KEY);
      if (localStorage.getItem(OPT_OUT_KEY)) return;
    } catch {
      // Storage blocked: track as normal.
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      defaults: "2026-08-30",
      // Panels open as #routes, so count each one as a pageview, with time spent via pageleave.
      capture_pageview: { path: true, hash: true },
      person_profiles: "identified_only",
      session_recording: { maskAllInputs: true },
    });

    // Sent with every event, for filtering and breakdowns.
    const landing = route();
    setContext({
      site: window.location.pathname.startsWith("/plain") ? "plain" : "airport",
      palette: document.documentElement.dataset.palette ?? null,
      device_class: deviceClass(),
      entry_section: landing ? panelOf(landing)?.title ?? SECTION_NAMES[landing.split("/")[0]] ?? landing : "Check-in",
    });

    // ── Links and the résumé ───────────────────────────────────────────
    let lastClickAt = 0;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const section = sectionOf(a);
      const panel = panelOf(route())?.title ?? null;
      if (href.startsWith("#")) lastClickAt = performance.now();
      if (href === "#resume" || href.endsWith("resume.pdf")) {
        const action = a.hasAttribute("download") ? "download" : "view";
        const from = labelOf(a).replace(/^Stub.*$/, "Résumé stub");
        track("resume_opened", `${action === "download" ? "Downloaded" : "Opened"} the résumé from ${section}${from ? ` ("${from}")` : ""}`, { action, from, section, panel });
      } else if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) {
        const destination = destinationOf(href);
        const label = labelOf(a);
        // Never send an email address: mailto links are reported as "Email" only.
        const url = href.startsWith("mailto:") ? "mailto:" : href;
        track("link_clicked", `Clicked ${destination}${label && label !== destination ? ` ("${label}")` : ""} in ${panel ?? section}`, { destination, label, url, section, panel });
      }
    };
    document.addEventListener("click", onClick, true);

    // ── Detail panels (hash routes) ────────────────────────────────────
    let open: { kind: string; slug: string; title: string; at: number } | null = null;
    let viaHistory = false;
    const KIND_WORD: Record<string, string> = { experience: "experience", project: "project", hackathon: "hackathon", resume: "résumé" };
    const onRoute = (first = false) => {
      const next = panelOf(route());
      if (open && open.slug !== next?.slug) {
        const seconds_open = Math.round((performance.now() - open.at) / 100) / 10;
        track("panel_closed", `Closed ${KIND_WORD[open.kind]}: ${open.title} after ${seconds_open} s`, { kind: open.kind, slug: open.slug, title: open.title, seconds_open });
        open = null;
      }
      if (next && !open) {
        const source = first ? "direct link" : performance.now() - lastClickAt < 1500 ? "click" : viaHistory ? "back/forward" : "other";
        open = { ...next, at: performance.now() };
        track("panel_opened", `Opened ${KIND_WORD[next.kind]}: ${next.title}${source === "click" ? "" : ` (via ${source})`}`, { ...next, source });
      }
      viaHistory = false;
    };
    const onPop = () => {
      viaHistory = true;
    };
    const onChange = () => onRoute();
    window.addEventListener("popstate", onPop, true);
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    window.addEventListener("portfolio:route-cleared", onChange);
    if (!landingReported) {
      landingReported = true;
      onRoute(true);
    }

    // ── Sections reached ───────────────────────────────────────────────
    const loadedAt = performance.now();
    const seen = new Set<string>();
    const timers = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (seen.has(id)) continue;
          if (e.isIntersecting) {
            if (!timers.has(id))
              timers.set(
                id,
                window.setTimeout(() => {
                  seen.add(id);
                  const section = SECTION_NAMES[id] ?? id;
                  track("section_viewed", `Reached ${section} (section ${seen.size})`, { section, order: seen.size, seconds_since_load: Math.round((performance.now() - loadedAt) / 1000) });
                }, 1000)
              );
          } else {
            window.clearTimeout(timers.get(id));
            timers.delete(id);
          }
        }
      },
      // Counts once the section is in the middle 40% of the screen.
      { rootMargin: "-30% 0px -30% 0px" }
    );
    // Wait for the page to render its sections.
    const observeTimer = window.setTimeout(() => {
      for (const id of Object.keys(SECTION_NAMES)) {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      }
    }, 500);

    // ── Scroll depth ───────────────────────────────────────────────────
    const marks = [25, 50, 75, 100];
    let depth = 0;
    const onScroll = () => {
      if (document.documentElement.dataset.takeoff) return; // the page sits at the top under the intro
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = ((window.scrollY + 1) / max) * 100;
      while (depth < marks.length && pct >= marks[depth]) {
        track("scroll_depth_reached", `Scrolled ${marks[depth]}% of the page`, { percent: marks[depth] });
        depth++;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop, true);
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("portfolio:route-cleared", onChange);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(observeTimer);
      timers.forEach((t) => window.clearTimeout(t));
      io.disconnect();
    };
  }, []);

  return null;
};

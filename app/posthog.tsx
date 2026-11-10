"use client";
import { useEffect } from "react";
import posthog from "posthog-js";

// Project API key from PostHog (Settings → Project). It's a public, write-only key, safe in client code.
const POSTHOG_KEY = "phc_A7JaAEPSy7Pi7bcPeF4Qa2cbMHpEr9zXMXzypv4yUpsK";
const POSTHOG_HOST = "https://us.i.posthog.com";

// Visiting any page with ?notrack stops this browser from being counted (your own visits);
// ?track turns it back on.
const OPT_OUT_KEY = "ph-notrack";

const labelOf = (a: HTMLAnchorElement) =>
  (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);

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

    // Named events for the clicks that matter most, so they're easy to chart.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href === "#resume" || href.endsWith("resume.pdf")) {
        posthog.capture("resume opened", { from: labelOf(a) });
      } else if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) {
        posthog.capture("outbound link clicked", { label: labelOf(a), url: href, route: window.location.hash || "#" });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
};

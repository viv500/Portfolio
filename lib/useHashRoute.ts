"use client";

import { useSyncExternalStore } from "react";

const CLOSE_EVENT = "portfolio:route-cleared";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(CLOSE_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CLOSE_EVENT, onChange);
  };
}

/** The current panel route, e.g. "experience/arctic-wolf". Empty when no panel is open. */
export function useHashRoute() {
  return useSyncExternalStore(
    subscribe,
    () => decodeURIComponent(window.location.hash.slice(1)),
    () => ""
  );
}

/** Clears the hash without the page jump that assigning location.hash = "" causes. */
export function clearRoute() {
  window.history.pushState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new Event(CLOSE_EVENT));
}

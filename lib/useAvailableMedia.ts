"use client";

import { useEffect, useState } from "react";

/** Which of these image URLs actually load. `checked` is false until every one has answered. */
export function useAvailableImages(srcs: string[]) {
  const [state, setState] = useState<{ checked: boolean; available: string[] }>({ checked: false, available: [] });
  const key = srcs.join("|");
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      srcs.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (!cancelled) setState({ checked: true, available: results.filter((r): r is string => r !== null) });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}

/** Whether public/resume.pdf exists. */
export function useResumeAvailable(path: string) {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    fetch(path, { method: "HEAD" })
      .then((res) => setAvailable(res.ok))
      .catch(() => setAvailable(false));
  }, [path]);
  return available;
}

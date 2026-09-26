"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a media query. `serverValue` is what the server render (and
 *  the hydration pass) assumes; choose the value whose UI is safe to show
 *  before JS knows better. */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Reduced motion is assumed on the server so nothing motion-only renders
 *  before the client can check the real preference. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

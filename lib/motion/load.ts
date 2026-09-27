export type Motion = typeof import("@/lib/gsap");

let pending: Promise<Motion> | null = null;

/** GSAP and its plugins, loaded once after the page's load event and an idle
 *  moment, so the motion library never shares the critical path with the
 *  largest paint. Marks <html data-motion="ready"> for tests. */
export function loadMotion(): Promise<Motion> {
  pending ??= afterLoad()
    .then(() => import("@/lib/gsap"))
    .then((motion) => {
      document.documentElement.dataset.motion = "ready";
      return motion;
    });
  return pending;
}

/** Resolves after the load event and an idle moment. Anything that must stay
 *  off the first paint's critical path (GSAP, the hero field) waits on it. */
export function afterLoad(): Promise<void> {
  return new Promise((resolve) => {
    // Safari has no requestIdleCallback; a short timeout stands in.
    const idle = () =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => resolve(), { timeout: 1000 })
        : setTimeout(resolve, 100);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

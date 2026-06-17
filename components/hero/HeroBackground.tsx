"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// three.js + r3f is heavy and DOM-bound. Load it client-only AND only on a
// capable desktop, deferred until the main thread is idle — so the chunk never
// sits on the critical path and is never even requested on the devices where it
// tanks performance (mobile / touch / reduced-motion / thin hardware).
const HeroNetwork = dynamic(
  () => import("./HeroNetwork").then((m) => m.HeroNetwork),
  { ssr: false, loading: () => null },
);

export function HeroBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Desktop-only enhancement; the static hero (dark canvas + grid + headline)
    // is the universal baseline. Bail before the import is ever triggered.
    const eligible =
      window.matchMedia("(min-width: 769px)").matches &&
      window.matchMedia("(pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
      navigator.hardwareConcurrency >= 4;
    if (!eligible) return;

    // Defer off the critical path: import only once the static hero has painted
    // and the browser is idle. The network fades in a beat later.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setEnabled(true), {
        timeout: 2000,
      });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(() => setEnabled(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  if (!enabled) return null;
  return <HeroNetwork />;
}

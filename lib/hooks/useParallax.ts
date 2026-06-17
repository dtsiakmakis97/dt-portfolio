"use client";

import { useEffect, useRef, useState } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Subtle vertical parallax based on the element's offset from viewport center.
 *  Disabled entirely under prefers-reduced-motion. */
export function useParallax<T extends HTMLElement>(strength = 0.06) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (prefersReduced()) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const dist = elCenter - window.innerHeight / 2;
        setOffset(-dist * strength);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return { ref, style: { transform: `translate3d(0, ${offset}px, 0)` } };
}

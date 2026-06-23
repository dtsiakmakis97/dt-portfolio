"use client";

import { useEffect, useRef } from "react";

/** Fine pointer + motion-OK only. No-op otherwise (touch has no cursor to pull
 *  toward; reduced-motion opts out of the effect). Mirrors useParallax's gate. */
const eligible = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

interface MagneticOptions {
  /** Pull-engagement reach in px beyond the element's half-extent. */
  radius?: number;
  /** Maximum displacement in px. */
  max?: number;
}

const LERP = 0.18; // ease toward target each frame (no overshoot)

/**
 * Magnetic pull: while the pointer is within `radius` of the element, the
 * element leans toward the cursor (capped at `max` px) and springs back when
 * the pointer leaves. Transform is written straight to the node via rAF — no
 * React re-render per frame. Attach the returned ref to the target.
 */
export function useMagnetic<T extends HTMLElement>({
  radius = 90,
  max = 6,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!eligible()) return;
    const el = ref.current;
    if (!el) return;

    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;
    let running = false;

    const computeTarget = () => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = pointerX - cx;
      const dy = pointerY - cy;
      const reach = Math.max(rect.width, rect.height) / 2 + radius;
      const dist = Math.hypot(dx, dy);
      if (dist < reach) {
        const pull = 1 - dist / reach; // 1 at center, 0 at the edge of reach
        targetX = Math.max(-max, Math.min(max, (dx / reach) * max * 2 * pull));
        targetY = Math.max(-max, Math.min(max, (dy / reach) * max * 2 * pull));
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const draw = () => {
      computeTarget();
      curX += (targetX - curX) * LERP;
      curY += (targetY - curY) * LERP;
      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      const settled =
        Math.abs(targetX - curX) < 0.05 &&
        Math.abs(targetY - curY) < 0.05 &&
        targetX === 0 &&
        targetY === 0;
      if (settled) {
        el.style.transform = "";
        running = false;
      } else {
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [radius, max]);

  return ref;
}

"use client";

import { useEffect, useRef, useState } from "react";

/** Desktop-only, motion-OK: a cursor cue is meaningless without a precise
 *  pointer, so touch and reduced-motion users get nothing (same discipline as
 *  HeroBackground). */
const eligible = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

const LERP = 0.22; // pool inertia toward the pointer (no overshoot)
const IDLE_MS = 1200; // recede this long after the pointer goes still

/**
 * A precision-instrument overlay: a soft amber "focus-pool" that follows the
 * pointer and locally lifts the background grid, as if the instrument
 * illuminates the grid where you point. It sits *behind* the page content
 * (z below <main>) so text stays pristine, and reveals on pointer movement /
 * recedes when the pointer is still, so it never competes with reading.
 */
export function InstrumentLayer() {
  const [enabled, setEnabled] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eligible()) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const layer = layerRef.current;
    if (!layer) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let raf = 0;
    let running = false;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const draw = () => {
      curX += (targetX - curX) * LERP;
      curY += (targetY - curY) * LERP;
      // --mx/--my are read by the glow + pool children (custom props inherit).
      layer.style.setProperty("--mx", `${curX.toFixed(1)}px`);
      layer.style.setProperty("--my", `${curY.toFixed(1)}px`);
      if (Math.abs(targetX - curX) > 0.4 || Math.abs(targetY - curY) > 0.4) {
        raf = requestAnimationFrame(draw);
      } else {
        running = false; // settled — stop the loop until the next move
      }
    };

    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      layer.dataset.active = "true";
      kick();
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => {
        layer.dataset.active = "false";
      }, IDLE_MS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      if (idle) clearTimeout(idle);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={layerRef} className="instrument-layer" aria-hidden="true" data-active="false">
      <div className="instrument-glow" />
      <div className="instrument-pool" />
    </div>
  );
}

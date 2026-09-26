"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { loadMotion, type Motion } from "@/lib/motion/load";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";

/** Root Lenis instance. It runs on its own frame loop until GSAP loads (after
 *  the page's load event), then moves onto gsap.ticker so smooth scroll and
 *  ScrollTrigger share one frame. Under reduced motion it renders nothing and
 *  the page scrolls natively. Access the instance anywhere with useLenis(). */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const ref = useRef<LenisRef>(null);
  const scrollTrigger = useRef<Motion["ScrollTrigger"] | null>(null);
  const pathname = usePathname();

  // Keep ScrollTrigger in lockstep with Lenis' interpolated scroll.
  useLenis(() => scrollTrigger.current?.update());

  useEffect(() => {
    if (reduced) return;
    let frame = requestAnimationFrame(function loop(time) {
      ref.current?.lenis?.raf(time);
      frame = requestAnimationFrame(loop);
    });
    // Back and Forward bypass TransitionLink, so stop any glide here: mid-glide,
    // Lenis ignores the browser's restored position and eases on to its old target.
    const onPopState = () => ref.current?.lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
    window.addEventListener("popstate", onPopState);
    let cancelled = false;
    let detach: (() => void) | undefined;
    loadMotion().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      cancelAnimationFrame(frame);
      scrollTrigger.current = ScrollTrigger;
      const tick = (time: number) => ref.current?.lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      detach = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
      };
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("popstate", onPopState);
      detach?.();
    };
  }, [reduced]);

  // After every route change, adopt the scroll position Next or the browser
  // chose (top, a #hash, or the restored position on Back), then re-measure.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const lenis = ref.current?.lenis;
      lenis?.resize();
      lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
      scrollTrigger.current?.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  if (reduced) return null;
  return <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.08, syncTouch: false }} />;
}

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";

/** Root Lenis instance on GSAP's ticker, so smooth scroll and ScrollTrigger
 *  share one frame loop. Under reduced motion it renders nothing and the page
 *  scrolls natively. Access the instance anywhere with useLenis(). */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  const ref = useRef<LenisRef>(null);
  const pathname = usePathname();

  // Keep ScrollTrigger in lockstep with Lenis' interpolated scroll.
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    if (reduced) return;
    const tick = (time: number) => ref.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [reduced]);

  // After every route change, adopt the scroll position Next or the browser
  // chose (top, a #hash, or the restored position on Back), then re-measure
  // triggers for the new page.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const lenis = ref.current?.lenis;
      lenis?.resize();
      lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  if (reduced) return null;
  return <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.08, syncTouch: false }} />;
}

"use client";

import { useRef, type ReactNode } from "react";
import { useMotion } from "@/lib/motion/useMotion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** A block that rises in once when scrolled into view. The server markup is
 *  never hidden: gsap.from sets the start state once motion has loaded (after
 *  the page's load event), so no-JS and reduced-motion users see the content
 *  as-is and blocks the reader has already reached stay put. It fades on
 *  opacity only, so the text stays findable in page search. */
export function Reveal({ children, className, delay = 0, y = 48 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    ({ gsap }) => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Motion arrives after load: what the reader has already reached stays put.
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) return;
        gsap.from(el, { y, opacity: 0, delay, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { createElement, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cssVar } from "@/lib/tokens";

interface ScrollFillTextProps {
  text: string;
  as?: "h2" | "p";
  className?: string;
}

/** A statement whose words fill from dim to ink as it scrolls through the
 *  viewport. It renders fully inked without JS or under reduced motion. The
 *  dim start state (3.6:1) is allowed only because this text is 24px and up. */
export function ScrollFillText({ text, as = "h2", className }: ScrollFillTextProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, { type: "words", aria: "auto" });
        gsap.fromTo(
          split.words,
          { color: cssVar("--color-ink-dim") },
          {
            color: cssVar("--color-ink"),
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 40%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [text], revertOnUpdate: true },
  );

  return createElement(as, { ref: root, className }, text);
}

"use client";

import { createElement, useRef } from "react";
import { useMotion } from "@/lib/motion/useMotion";
import { cssVar } from "@/lib/tokens";

interface ScrollFillTextProps {
  text: string;
  /** A closing run of `text` that fills to blue instead of ink. */
  accent?: string;
  as?: "h2" | "p";
  className?: string;
}

/** A statement whose words fill from dim to ink as it scrolls through the
 *  viewport, with an optional closing accent that fills to blue. It renders
 *  fully colored without JS or under reduced motion. The dim start state
 *  (3.6:1) is allowed only because this text is 24px and up. */
export function ScrollFillText({ text, accent, as = "h2", className }: ScrollFillTextProps) {
  const root = useRef<HTMLElement>(null);

  if (accent && !text.endsWith(accent)) {
    throw new Error("ScrollFillText: accent must be the closing run of text");
  }
  const lead = accent ? text.slice(0, text.length - accent.length) : text;

  useMotion(
    ({ gsap, SplitText }) => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, { type: "words", aria: "auto" });
        const accented = (word: Element) => word.closest(".text-blue") !== null;
        const trigger = { trigger: el, start: "top 80%", end: "bottom 40%", scrub: true };
        const tl = gsap.timeline({ scrollTrigger: trigger, defaults: { ease: "none" } });
        const ink = cssVar("--color-ink");
        const blue = cssVar("--color-blue");
        split.words.forEach((word, i) => {
          tl.fromTo(word, { color: cssVar("--color-ink-dim") }, { color: accented(word) ? blue : ink }, i * 0.1);
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [text, accent] },
  );

  return createElement(
    as,
    { ref: root, className },
    lead,
    accent ? createElement("span", { className: "text-blue" }, accent) : null,
  );
}

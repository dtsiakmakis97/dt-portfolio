"use client";

import { createElement, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

interface SplitRevealProps {
  text: string;
  as?: "h2" | "h3" | "p";
  className?: string;
  /** "load" plays on mount and opts into CSS pre-hiding (data-reveal="load"). */
  trigger?: "scroll" | "load";
  delay?: number;
}

/** Masked line reveal. Headings split with aria "auto" (aria-label on the
 *  heading). Paragraphs keep an sr-only copy and split an aria-hidden visual
 *  copy, because aria-label is prohibited on the paragraph role. Replays are
 *  guarded, so autoSplit re-splits on resize just re-lay out the lines. */
export function SplitReveal({ text, as = "p", className, trigger = "scroll", delay = 0 }: SplitRevealProps) {
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLSpanElement>(null);
  const isHeading = as !== "p";

  useGSAP(
    () => {
      const target = isHeading ? root.current : visual.current;
      if (!target) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let played = false;
        SplitText.create(target, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          aria: isHeading ? "auto" : "none",
          onSplit(self) {
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              stagger: 0.08,
              delay,
              onStart: () => {
                played = true;
                if (root.current) root.current.style.visibility = "visible";
              },
              scrollTrigger:
                trigger === "scroll" ? { trigger: root.current, start: "top 85%", once: true } : undefined,
            });
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [text], revertOnUpdate: true },
  );

  const content = isHeading ? (
    text
  ) : (
    <>
      <span className="sr-only">{text}</span>
      <span ref={visual} aria-hidden="true" className="block">
        {text}
      </span>
    </>
  );

  return createElement(
    as,
    { ref: root, className, "data-reveal": trigger === "load" ? "load" : undefined },
    content,
  );
}

"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Oversized word band that travels with the scroll and leans with scroll
 *  velocity. It never moves on its own (WCAG 2.2.2). Decorative only: hidden
 *  from assistive tech, because the list beside it carries the content. */
export function VelocityMarquee({ items }: { items: readonly string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lean = gsap.quickTo(track.current, "skewX", { duration: 0.5, ease: "power3" });
        gsap.fromTo(
          track.current,
          { xPercent: 0 },
          {
            xPercent: -50,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              onUpdate: (self) => lean(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
              onScrubComplete: () => lean(0),
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const doubled = [...items, ...items];
  return (
    <div ref={root} data-marquee="" aria-hidden="true" className="overflow-hidden">
      <div ref={track} className="flex w-max whitespace-nowrap font-display text-statement font-extrabold">
        {doubled.map((item, i) => (
          <span key={i} className="pr-[0.35em]">
            {item}
            <span className="pl-[0.35em]">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

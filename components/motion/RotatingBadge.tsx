"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionLink } from "./SectionLink";
import { ArrowDownRight } from "@/components/ui/icons";

const R = 50; // text-ring radius in the 120-unit viewBox
const RING = `M60,60 m-${R},0 a${R},${R} 0 1,1 ${2 * R},0 a${R},${R} 0 1,1 -${2 * R},0`;

/** Circular text badge that turns with the page, never on its own (WCAG
 *  2.2.2: scroll-linked motion needs no pause control). */
export function RotatingBadge({ label, href }: { label: string; href: `/#${string}` }) {
  const ring = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(ring.current, {
        rotation: 360,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.6 },
      });
    });
    return () => mm.revert();
  });

  return (
    <SectionLink
      href={href}
      aria-label={label}
      data-badge=""
      className="group relative grid size-32 place-items-center rounded-pill text-ink"
    >
      <svg ref={ring} viewBox="0 0 120 120" aria-hidden="true" className="absolute inset-0 size-full">
        <defs>
          <path id="badge-ring" d={RING} />
        </defs>
        <text className="fill-current font-mono text-[9px] uppercase tracking-[0.18em]">
          <textPath href="#badge-ring" textLength={Math.floor(2 * Math.PI * R)} lengthAdjust="spacing">
            {`${label} · ${label} · `}
          </textPath>
        </text>
      </svg>
      <ArrowDownRight size={26} className="text-blue transition-transform duration-500 ease-glide group-hover:translate-y-1" />
    </SectionLink>
  );
}

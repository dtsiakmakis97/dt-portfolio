import { ViewTransition } from "react";
import type { Figure } from "@/lib/work/types";
import { SHARE_ON_NAV, vtMedia } from "@/lib/vt";
import { optimizedSrcSet } from "@/lib/image";
import { pill } from "@/components/ui/pill";
import { SectionLink } from "@/components/motion/SectionLink";

/** The 16:10 hero. With a cover it is the second shared element (the cursor
 *  preview morphs into it). Without one, a blue typographic band stands in:
 *  the status set large, and a way to ask for a walkthrough. */
export function CaseMedia({ slug, figure, status }: { slug: string; figure?: Figure; status: string }) {
  if (!figure) {
    return (
      <div
        data-case-hero-note=""
        className="band-blue flex flex-col justify-between gap-10 px-gutter py-10 sm:aspect-[16/10] sm:py-[clamp(2.5rem,5vw,4.5rem)]"
      >
        <p className="max-w-[14ch] font-display text-statement font-extrabold">{status}</p>
        <SectionLink href="/#contact" className={`self-start ${pill("ink")}`}>
          Walkthrough on request
        </SectionLink>
      </div>
    );
  }
  // A plain <img> on the optimizer's srcset: no next/image client component.
  const { src, srcSet } = optimizedSrcSet(figure.src, figure.width);
  return (
    <figure>
      <ViewTransition name={vtMedia(slug)} share={SHARE_ON_NAV} enter="none" exit="none" default="none">
        <div className="relative aspect-[16/10] overflow-hidden bg-raised">
          <img
            src={src}
            srcSet={srcSet}
            sizes="(min-width: 1440px) 1328px, 100vw"
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </ViewTransition>
      {figure.caption || figure.credit ? (
        <figcaption className="mt-3 font-mono text-label uppercase text-ink-3">
          {[figure.caption, figure.credit].filter(Boolean).join(" · ")}
        </figcaption>
      ) : null}
    </figure>
  );
}

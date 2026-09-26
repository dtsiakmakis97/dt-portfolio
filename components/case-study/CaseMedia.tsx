import Image from "next/image";
import { ViewTransition } from "react";
import type { Figure } from "@/lib/work/types";
import { SHARE_ON_NAV, vtMedia } from "@/lib/vt";

/** The 16:10 hero. With a cover it is the second shared element (the cursor
 *  preview morphs into it). Without one, a blue typographic band stands in. */
export function CaseMedia({ slug, figure, status }: { slug: string; figure?: Figure; status: string }) {
  if (!figure) {
    return (
      <div data-case-hero-note="" className="band-blue grid aspect-[16/10] place-items-center px-gutter">
        <p className="font-mono text-label uppercase">{status} · Walkthrough on request</p>
      </div>
    );
  }
  return (
    <figure>
      <ViewTransition name={vtMedia(slug)} share={SHARE_ON_NAV} enter="none" exit="none" default="none">
        <div className="relative aspect-[16/10] overflow-hidden bg-raised">
          <Image
            src={figure.src}
            alt={figure.alt}
            fill
            sizes="(min-width: 1440px) 1328px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
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

import type { Figure } from "@/lib/work/types";
import { optimizedSrcSet } from "@/lib/image";

export function CaseFigure({ figure }: { figure: Figure }) {
  // A plain <img> on the optimizer's srcset, like the hero: no next/image client component.
  const { src, srcSet } = optimizedSrcSet(figure.src, figure.width);
  return (
    <figure className="px-gutter py-[clamp(3rem,2rem+4vw,7rem)]">
      <img
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1440px) 1328px, 100vw"
        alt={figure.alt}
        width={figure.width}
        height={figure.height}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
      />
      {figure.caption || figure.credit ? (
        <figcaption className="mt-3 font-mono text-label uppercase text-ink-3">
          {[figure.caption, figure.credit].filter(Boolean).join(" · ")}
        </figcaption>
      ) : null}
    </figure>
  );
}

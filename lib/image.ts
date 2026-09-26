/** The image optimizer's default widths (next.config sets none) and the one
 *  quality Next 16 allows by default. A hand-written srcset lets the case
 *  pages skip next/image's client component, which Lighthouse bills to the
 *  hero, an image LCP (docs/redesign/baseline.json, phase4Checkpoint). */
const WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;
const QUALITY = 75;

const optimizedUrl = (src: string, width: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${QUALITY}`;

/** src and srcSet through the optimizer, never wider than the source. */
export function optimizedSrcSet(src: string, intrinsicWidth: number): { src: string; srcSet: string } {
  const fitting = WIDTHS.filter((width) => width <= intrinsicWidth);
  const widths = fitting.length ? fitting : [WIDTHS[0]];
  return {
    src: optimizedUrl(src, widths[widths.length - 1]),
    srcSet: widths.map((width) => `${optimizedUrl(src, width)} ${width}w`).join(", "),
  };
}

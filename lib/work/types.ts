/** Every project slug, in home-page order. /work/[slug] is generated from
 *  this list (Phase 4), so a new project starts here. */
export const PROJECT_SLUGS = [
  "pawguard",
  "lead-finder",
  "aegeon",
  "ego-distillers",
  "career-ops",
  "te-learning-center",
  "kryora",
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

/** An image with its intrinsic size, for aspect-ratio boxes. */
export interface Figure {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption?: string;
  /** Required whenever the imagery is not the owner's (Kryora). */
  readonly credit?: string;
}

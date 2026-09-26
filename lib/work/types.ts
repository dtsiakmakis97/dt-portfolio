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

/** Prose section labels, in reading order (Approach is the decisions block). */
export type CaseLabel = "Context" | "Problem" | "Challenges" | "Outcome";

export interface Decision {
  /** One line, set as the decision's h3. */
  readonly summary: string;
  readonly body: string;
}

export type CaseBlock =
  | { readonly kind: "prose"; readonly label: CaseLabel; readonly paragraphs: readonly string[] }
  | { readonly kind: "decisions"; readonly intro?: string; readonly items: readonly Decision[] }
  /** A verified fact set huge on a full-bleed band; tones alternate blue, paper. */
  | { readonly kind: "statement"; readonly text: string }
  | { readonly kind: "figure"; readonly figure: Figure };

export interface CaseStudy {
  /** The lead paragraph under the hero. Empty only while the study is interim. */
  readonly lead: string;
  /** Overrides the project's cover as the hero media. */
  readonly hero?: Figure;
  readonly blocks: readonly CaseBlock[];
}

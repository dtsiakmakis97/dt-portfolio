import type { CSSProperties } from "react";
import type { ProjectSlug } from "./types";

/** Measured average advance per character (em) of each project name in
 *  Cabinet 800 at -0.045em tracking, divided by 0.99 so the title fills 99%
 *  of its row. A per-name constant, because one average for every name
 *  leaves narrow-letter names like "Ego Distillers" a third short. Re-measure
 *  when a name changes; e2e/work-index.spec.ts fails if a title drifts. */
const FIT_K: Record<ProjectSlug, number> = {
  pawguard: 0.551,
  "lead-finder": 0.436,
  aegeon: 0.52,
  "ego-distillers": 0.376,
  "career-ops": 0.463,
  "te-learning-center": 0.407,
  kryora: 0.489,
};

/** Measured average advance per character of the footer wordmark (Cabinet 800). */
export const WORDMARK_FIT_K = 0.43;

/** Caps six-letter names on very wide screens; at 1440 every title fits under it. */
const TITLE_FIT_MAX = "30rem";

/** Descenders overflow the 0.82 line box by up to ~0.06em (Aegeon's g), which
 *  grows with the title; clearance in em keeps them off the next line. */
const DESCENDER_CLEARANCE = "0.08em";

/** The fit rule for a project title. The work-index row and the case-study h1
 *  both use it, so the shared-element morph between them is a near-pure
 *  translate. */
export function titleFit(slug: ProjectSlug, name: string): CSSProperties {
  return {
    "--chars": name.length,
    "--fit-k": FIT_K[slug],
    "--fit-max": TITLE_FIT_MAX,
    paddingBottom: DESCENDER_CLEARANCE,
  } as CSSProperties;
}

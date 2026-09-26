import { projects, type Project } from "@/lib/content";
import { PROJECT_SLUGS, type CaseStudy, type ProjectSlug } from "./types";
import { pawguard } from "./pawguard";
import { leadFinder } from "./lead-finder";
import { aegeon } from "./aegeon";
import { egoDistillers } from "./ego-distillers";
import { careerOps } from "./career-ops";
import { teLearningCenter } from "./te-learning-center";
import { kryora } from "./kryora";

/** Every project's case study. `satisfies` makes a missing one a compile error. */
export const caseStudies = {
  pawguard,
  "lead-finder": leadFinder,
  aegeon,
  "ego-distillers": egoDistillers,
  "career-ops": careerOps,
  "te-learning-center": teLearningCenter,
  kryora,
} satisfies Record<ProjectSlug, CaseStudy>;

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getCaseStudy(slug: ProjectSlug): CaseStudy {
  return caseStudies[slug];
}

/** The project after `slug` in home-page order, wrapping from the last to the first. */
export function getNextProject(slug: ProjectSlug): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

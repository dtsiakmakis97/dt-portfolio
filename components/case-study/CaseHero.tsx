import { ViewTransition } from "react";
import type { Project } from "@/lib/content";
import type { Figure } from "@/lib/work/types";
import { Label } from "@/components/ui/Label";
import { SectionLink } from "@/components/motion/SectionLink";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { titleFit } from "@/lib/work/fit";
import { SHARE_ON_NAV, vtTitle } from "@/lib/vt";
import { CaseMedia } from "./CaseMedia";

interface CaseHeroProps {
  project: Project;
  /** "01/07" */
  number: string;
  lead: string;
  hero?: Figure;
}

/** Crumb, the width-fitted h1 (the title morph lands here, so no GSAP
 *  entrance), tagline, hero media and the lead, which rises under the
 *  lifting curtain. */
export function CaseHero({ project, number, lead, hero }: CaseHeroProps) {
  return (
    <header className="px-gutter pt-32">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <Label>
          Case study {number} · {project.period}
        </Label>
        <SectionLink
          href="/#work"
          className="font-mono text-label uppercase text-ink-2 transition-colors duration-300 hover:text-blue"
        >
          <span aria-hidden="true">← </span>All work
        </SectionLink>
      </div>
      <div className="fit mt-10">
        <ViewTransition name={vtTitle(project.slug)} share={SHARE_ON_NAV} enter="none" exit="none" default="none">
          <h1 className="fit-text font-display font-extrabold text-ink" style={titleFit(project.slug, project.name)}>
            {project.name}
          </h1>
        </ViewTransition>
      </div>
      <p className="mt-6 max-w-[40ch] font-display text-lead font-light text-ink">{project.tagline}</p>
      <div className="mt-12">
        <CaseMedia slug={project.slug} figure={hero} status={project.status} />
      </div>
      {lead ? (
        <SplitReveal as="p" trigger="load" delay={0.5} text={lead} className="mt-16 max-w-[48ch] text-lead text-ink" />
      ) : null}
    </header>
  );
}

import { ViewTransition } from "react";
import type { Project } from "@/lib/content";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { NAV_FORWARD, SHARE_ON_NAV, vtTitle } from "@/lib/vt";
import { titleFit } from "@/lib/work/fit";

/** One project as a giant, width-fitted title link. The title carries the
 *  shared view-transition name that morphs into the case-study h1 (Phase 4). */
export function WorkRow({ project, index }: { project: Project; index: number }) {
  return (
    <li className="border-t border-line last:border-b">
      <TransitionLink
        href={`/work/${project.slug}`}
        transitionTypes={[NAV_FORWARD]}
        data-slug={project.slug}
        className="group block py-6 md:py-9"
      >
        <span className="flex justify-between font-mono text-label uppercase text-ink-3">
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span>{project.period}</span>
        </span>
        <span className="fit mt-3 block">
          <ViewTransition name={vtTitle(project.slug)} share={SHARE_ON_NAV} enter="none" exit="none" default="none">
            <span
              className="fit-text font-extrabold text-ink transition-colors duration-500 ease-glide group-hover:text-blue group-focus-visible:text-blue"
              style={titleFit(project.slug, project.name)}
            >
              {project.name}
            </span>
          </ViewTransition>
        </span>
        <span className="mt-4 block text-body text-ink-2">
          {project.tagline}
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          {project.status}
        </span>
      </TransitionLink>
    </li>
  );
}

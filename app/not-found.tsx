import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { projects } from "@/lib/content";
import { pill } from "@/components/ui/pill";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { CURTAIN_ENTER, CURTAIN_EXIT, NAV_FORWARD } from "@/lib/vt";

// Collected by Next's metadata resolver for not-found (undocumented for the
// non-global file); noindex is added automatically.
export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    // Its own curtain boundary, like every page, so leaving for a case study lifts it.
    <ViewTransition enter={CURTAIN_ENTER} exit={CURTAIN_EXIT} default="none">
      {/* Opaque, so the incoming snapshot reveals a dark page over the curtain's blue. */}
      <section className="bg-canvas px-gutter pb-section pt-32">
        <h1 className="font-display text-mega font-extrabold text-ink">
          <span aria-hidden="true">404</span>
          <span className="sr-only">Page not found</span>
        </h1>
        <p className="mt-6 max-w-[40ch] text-lead text-ink-2">This page doesn’t exist. The work does:</p>
        <ul className="mt-10 border-t border-line">
          {projects.map((project) => (
            <li key={project.slug} className="border-b border-line">
              <TransitionLink
                href={`/work/${project.slug}`}
                transitionTypes={[NAV_FORWARD]}
                className="block py-4 font-display text-lead font-extrabold text-ink transition-colors duration-300 hover:text-blue"
              >
                {project.name}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <Link href="/" className={`mt-12 ${pill("blue")}`}>
          Back to the home page
        </Link>
      </section>
    </ViewTransition>
  );
}

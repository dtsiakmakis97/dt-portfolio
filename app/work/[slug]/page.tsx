import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { profile, projects } from "@/lib/content";
import { baseOpenGraph } from "@/lib/metadata";
import { caseNumber, findProject } from "@/lib/work";
import { titleFit } from "@/lib/work/fit";
import { CURTAIN_ENTER, CURTAIN_EXIT, SHARE_ON_NAV, vtTitle } from "@/lib/vt";

// Unknown slugs 404 in production; dev renders anyway, hence notFound() below.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  const url = `/work/${project.slug}`;
  const title = `${project.name} · ${profile.name}`;
  // Metadata merges shallowly: restate canonical, openGraph and twitter in full,
  // or the home page's canonical and twitter:title leak in. No `images`: the
  // file-based OG images fill them.
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: { ...baseOpenGraph, type: "article", url, title, description: project.summary },
    twitter: { card: "summary_large_image", title, description: project.summary },
    ...(project.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  return (
    // The page's own transition boundary: the curtain (lib/vt.ts CURTAIN_*).
    <ViewTransition enter={CURTAIN_ENTER} exit={CURTAIN_EXIT} default="none">
      <article className="px-gutter pb-section pt-32">
        <p className="font-mono text-label uppercase text-ink-3">
          Case study {caseNumber(project.slug)} · {project.period}
        </p>
        <div className="fit mt-10">
          <ViewTransition name={vtTitle(project.slug)} share={SHARE_ON_NAV} enter="none" exit="none" default="none">
            <h1 className="fit-text font-display font-extrabold text-ink" style={titleFit(project.slug, project.name)}>
              {project.name}
            </h1>
          </ViewTransition>
        </div>
      </article>
    </ViewTransition>
  );
}

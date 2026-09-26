import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { profile, projects } from "@/lib/content";
import { baseOpenGraph } from "@/lib/metadata";
import { caseNumber, findProject, getCaseStudy, getNextProject } from "@/lib/work";
import { CURTAIN_ENTER, CURTAIN_EXIT } from "@/lib/vt";
import { CaseHero } from "@/components/case-study/CaseHero";
import { MetaStrip } from "@/components/case-study/MetaStrip";
import { NextProject } from "@/components/case-study/NextProject";

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
  const study = getCaseStudy(project.slug);
  return (
    // The page's own transition boundary: the curtain (lib/vt.ts CURTAIN_*).
    <ViewTransition enter={CURTAIN_ENTER} exit={CURTAIN_EXIT} default="none">
      <article>
        <CaseHero project={project} number={caseNumber(project.slug)} lead={study.lead} hero={study.hero ?? project.cover} />
        <div className="mt-16 px-gutter">
          <MetaStrip project={project} />
        </div>
        <NextProject next={getNextProject(project.slug)} />
      </article>
    </ViewTransition>
  );
}

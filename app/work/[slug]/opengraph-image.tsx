import { projects } from "@/lib/content";
import { findProject } from "@/lib/work";
import { OG_SIZE, renderCard } from "@/lib/og/render";

// Static alt only (Next 16); the card's own text carries the project's name.
export const alt = "Case study card: the project name and its one-line summary on the portfolio's dark canvas";
export const size = OG_SIZE;
export const contentType = "image/png";

// Image routes do not inherit the page's params; list them here so the cards prerender.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return new Response("Not found", { status: 404 });
  return renderCard({
    kicker: `Case study · ${project.period}`,
    title: project.name,
    subtitle: project.tagline,
    titleSize: Math.min(150, Math.floor(1056 / (project.name.length * 0.52))),
  });
}

import { projects } from "@/lib/content";
import { WorkRow } from "./WorkRow";
import { WorkIndexInteractive } from "./WorkIndexInteractive";

export function WorkIndex() {
  const previews = projects.flatMap((p) => (p.cover ? [{ slug: p.slug, src: p.cover.src }] : []));
  return (
    <section id="work" className="px-gutter py-section">
      <h2 className="font-mono text-label uppercase text-ink-3">
        Selected work <span className="text-ink">({String(projects.length).padStart(2, "0")})</span>
      </h2>
      <WorkIndexInteractive previews={previews}>
        <ol className="mt-10">
          {projects.map((project, i) => (
            <WorkRow key={project.slug} project={project} index={i} />
          ))}
        </ol>
      </WorkIndexInteractive>
    </section>
  );
}

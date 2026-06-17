import { projects } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WorkEntry } from "./WorkEntry";

export function SelectedWork() {
  return (
    <section id="work" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32 lg:px-24 lg:py-40">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 border-b border-line pb-8 md:mb-16 md:flex-row md:items-end">
            <div>
              <Eyebrow>Selected work</Eyebrow>
              <h2 className="mt-6 font-display text-h2 font-bold text-fg">
                What I&apos;ve been working on.
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-fg-muted">
              Full-stack web and AI systems, built end to end. Live ones are
              linked; the rest I&apos;m happy to walk through.
            </p>
          </div>
        </Reveal>

        <div>
          {projects.map((project, i) => (
            <Reveal key={project.id}>
              <WorkEntry project={project} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

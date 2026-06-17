import { projects } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { WorkEntry } from "./WorkEntry";

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 md:py-28 lg:px-12">
        <Reveal>
          <Eyebrow>Selected work</Eyebrow>
          <h2 className="mt-5 max-w-2xl text-h2 font-semibold">
            What I&apos;ve been working on.
          </h2>
        </Reveal>
        <div className="mt-10 md:mt-14">
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

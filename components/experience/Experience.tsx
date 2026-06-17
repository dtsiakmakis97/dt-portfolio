import { experience } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 md:py-28 lg:px-12">
        <Reveal>
          <Eyebrow>Experience</Eyebrow>
          <h2 className="mt-5 text-h2 font-semibold">Where I&apos;ve worked.</h2>
        </Reveal>

        <div className="mt-10 md:mt-14">
          {experience.map((job) => (
            <Reveal key={job.company}>
              <article className="grid grid-cols-1 gap-y-6 border-t border-line py-10 md:grid-cols-12 md:gap-x-8 md:py-12">
                <div className="md:col-span-4">
                  <h3 className="text-xl font-medium tracking-tight">{job.company}</h3>
                  <p className="mt-1 text-fg-secondary">{job.role}</p>
                  <p className="mt-3 font-mono text-xs text-fg-muted">{job.period}</p>
                  <p className="font-mono text-xs text-fg-muted">{job.location}</p>
                </div>
                <div className="md:col-span-8">
                  <p className="max-w-2xl leading-relaxed text-fg-secondary">
                    {job.summary}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {job.highlights.map((highlight, i) => (
                      <li key={i} className="flex gap-3 text-fg-secondary">
                        <span
                          aria-hidden
                          className="mt-3 h-px w-4 shrink-0 bg-accent/70"
                        />
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

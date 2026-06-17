import { experience } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Experience() {
  return (
    <section id="experience" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32 lg:px-24 lg:py-40">
        <Reveal>
          <Eyebrow>Experience</Eyebrow>
          <h2 className="mt-6 font-display text-h2 font-bold text-fg">
            Where I&apos;ve worked.
          </h2>
        </Reveal>

        <div className="mt-12 md:mt-16">
          {experience.map((job, i) => (
            <Reveal key={job.company} delay={i * 80}>
              <article className="grid grid-cols-1 gap-4 border-t border-line py-8 last:border-b md:grid-cols-12 md:gap-8 md:py-10">
                <div className="md:col-span-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-fg-muted">
                    {job.period}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-fg-muted">
                    {job.location}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-display text-subtitle font-medium text-fg">
                    {job.role}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
                    {job.company}
                  </p>
                </div>
                <div className="md:col-span-5">
                  <p className="max-w-[60ch] leading-relaxed text-fg-secondary">
                    {job.summary}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {job.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="flex gap-3 leading-relaxed text-fg-secondary"
                      >
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 bg-accent"
                        />
                        <span>{h}</span>
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

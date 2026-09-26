import { experience, experienceStatement } from "@/lib/content";
import { Label } from "@/components/ui/Label";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";

export function Experience() {
  return (
    <section id="experience" className="px-gutter py-section">
      <Label>Experience</Label>
      <SplitReveal as="h2" text={experienceStatement} className="mt-8 font-display text-statement font-extrabold text-ink" />

      {experience.map((job) => (
        <article key={job.company} className="mt-16">
          <div className="grid gap-6 lg:grid-cols-12">
            <p className="font-mono text-label uppercase text-ink-3 lg:col-span-4">
              {job.role} · {job.period} · {job.location}
            </p>
            <p className="max-w-[62ch] text-body text-ink-2 lg:col-span-7 lg:col-start-6">{job.summary}</p>
          </div>
          <ul className="mt-12">
            {job.highlights.map((h) => (
              <li key={h.client} className="grid gap-4 border-t border-line py-8 last:border-b lg:grid-cols-12">
                <h3 className="font-display text-h2 font-extrabold text-ink lg:col-span-5">{h.client}</h3>
                <Reveal className="lg:col-span-7">
                  <p className="max-w-[62ch] text-body text-ink-2">{h.detail}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

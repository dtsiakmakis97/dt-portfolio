import { skills } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Skills() {
  return (
    <section id="stack" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32 lg:px-24 lg:py-40">
        <Reveal>
          <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div>
              <Eyebrow>Stack</Eyebrow>
              <h2 className="mt-6 font-display text-h2 font-bold text-fg">
                The tools, plainly.
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-fg-muted">
              No proficiency bars. What I reach for, grouped by where it lives.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.label} className="h-full bg-canvas p-6 md:p-8">
                <h3 className="font-mono text-xs uppercase tracking-widest text-accent">
                  {group.label}
                </h3>
                <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-sm leading-relaxed text-fg-secondary"
                    >
                      {item}
                      <span aria-hidden className="ml-3 text-fg-faint">
                        /
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

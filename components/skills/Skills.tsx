import { skills } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 md:py-28 lg:px-12">
        <Reveal>
          <Eyebrow>Stack</Eyebrow>
          <h2 className="mt-5 text-h2 font-semibold">Tools I reach for.</h2>
        </Reveal>

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {skills.map((group) => (
            <Reveal key={group.label}>
              <div className="border-t border-line pt-5">
                <h3 className="font-mono text-xs uppercase tracking-wider text-accent">
                  {group.label}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm leading-relaxed text-fg-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { skills, stackMarquee } from "@/lib/content";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

/** Blue band: canvas-colored text only (ink on blue fails contrast). */
export function Skills() {
  return (
    <section id="stack" className="band-blue py-section">
      <p className="px-gutter font-mono text-label uppercase">Stack</p>
      <div className="mt-8">
        <VelocityMarquee items={stackMarquee} />
      </div>
      <div className="px-gutter">
        <h2 className="mt-16 font-display text-h2 font-extrabold">The tools, plainly.</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.label} className="border-t border-canvas pt-5">
              <h3 className="font-mono text-label uppercase">{group.label}</h3>
              <ul className="mt-4 space-y-1.5 text-body">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

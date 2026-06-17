import { about, profile } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 md:py-28 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>About</Eyebrow>
              <h2 className="mt-5 text-h2 font-semibold text-balance">
                A frontend engineer moving into AI.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={80}>
              <div className="space-y-5 text-lg leading-relaxed text-fg-secondary">
                {about.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-line pt-8 font-mono text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-fg-muted">Languages</dt>
                  <dd className="mt-1.5 text-fg-secondary">{profile.languages}</dd>
                </div>
                <div>
                  <dt className="text-fg-muted">Availability</dt>
                  <dd className="mt-1.5 text-fg-secondary">{profile.availability}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

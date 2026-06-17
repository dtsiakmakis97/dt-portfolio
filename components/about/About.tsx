import { about, profile } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function About() {
  return (
    <section id="about" className="border-b border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32 lg:px-24 lg:py-40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow index="01">About</Eyebrow>
              <h2 className="mt-6 font-display text-h2 font-medium leading-tight text-fg">
                I own both halves of the product.
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-fg-muted">
                Frontend depth plus AI systems — shipped, not theorized.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-6 border-l border-line pl-6 md:pl-10">
              {about.map((para, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p className="text-base leading-relaxed text-fg-secondary md:text-lg">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={160}>
              <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-line pt-8 font-mono text-sm sm:grid-cols-2 md:ml-6 lg:ml-10">
                <div>
                  <dt className="text-fg-muted">Languages</dt>
                  <dd className="mt-1.5 text-fg-secondary">{profile.languages}</dd>
                </div>
                <div>
                  <dt className="text-fg-muted">Availability</dt>
                  <dd className="mt-1.5 text-fg-secondary">
                    {profile.availability}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

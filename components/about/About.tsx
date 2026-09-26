import { about, manifesto, profile } from "@/lib/content";
import { Label } from "@/components/ui/Label";
import { ScrollFillText } from "@/components/motion/ScrollFillText";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section id="about" className="px-gutter py-section">
      <Label>About</Label>
      <ScrollFillText text={manifesto} className="mt-8 font-display text-statement font-extrabold text-ink" />

      <div className="mt-20 grid gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6 lg:col-start-7">
          {about.map((paragraph, i) => (
            <Reveal key={i}>
              <p className="max-w-[62ch] text-body text-ink-2">{paragraph}</p>
            </Reveal>
          ))}
          <Reveal>
            <dl className="grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt>
                  <Label>Languages</Label>
                </dt>
                <dd className="mt-2 text-body text-ink">{profile.languages}</dd>
              </div>
              <div>
                <dt>
                  <Label>Availability</Label>
                </dt>
                <dd className="mt-2 text-body text-ink">{profile.availability}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

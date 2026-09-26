import { about, manifesto, manifestoAccent, profile } from "@/lib/content";
import { Label } from "@/components/ui/Label";
import { ScrollFillText } from "@/components/motion/ScrollFillText";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section id="about" className="px-gutter pb-[clamp(4rem,3rem+4vw,8rem)] pt-[clamp(3.5rem,1rem+5vw,8rem)]">
      <Label>About</Label>
      <ScrollFillText
        text={manifesto}
        accent={manifestoAccent}
        className="mt-8 font-display text-statement font-extrabold text-ink"
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <dl className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-1">
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
        <div className="space-y-6 lg:col-span-7 lg:col-start-6">
          {about.map((paragraph, i) => (
            <Reveal key={i}>
              <p className="max-w-[62ch] text-body text-ink-2">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { hero, profile } from "@/lib/content";
import { HeroHeadline } from "./HeroHeadline";
import { HeroField } from "./HeroField";
import { RotatingBadge } from "@/components/motion/RotatingBadge";
import { SectionLink } from "@/components/motion/SectionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Label } from "@/components/ui/Label";
import { pill } from "@/components/ui/pill";
import { ArrowUpRight } from "@/components/ui/icons";

export function Hero() {
  return (
    // Everything marked data-shelter (each headline word too) caps the lens
    // field's luminance behind it, so every word keeps 4.5:1.
    <section id="top" className="relative isolate flex min-h-svh flex-col justify-end px-gutter pb-8 pt-28">
      <HeroField />
      <div data-shelter="" className="w-fit">
        <Label className="hero-fade block">{hero.available}</Label>
      </div>

      <div className="mt-8">
        <HeroHeadline />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <p data-shelter="" className="hero-fade max-w-[46ch] text-body text-ink-2 lg:col-span-5" style={{ animationDelay: "700ms" }}>
          {hero.subhead}
        </p>
        <div data-shelter="" className="hero-fade flex flex-wrap gap-3 lg:col-span-4 lg:col-start-7" style={{ animationDelay: "800ms" }}>
          <Magnetic>
            <SectionLink href="/#contact" className={pill("blue")}>
              Get in touch
            </SectionLink>
          </Magnetic>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={pill("ghost")}>
            Résumé (PDF) <ArrowUpRight size={14} />
          </a>
        </div>
        <div data-shelter="" className="hidden lg:col-span-2 lg:col-start-11 lg:flex lg:justify-end">
          <RotatingBadge label="Selected work" href="/#work" />
        </div>
      </div>
    </section>
  );
}

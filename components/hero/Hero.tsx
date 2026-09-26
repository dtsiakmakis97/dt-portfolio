import { facts, hero, profile } from "@/lib/content";
import { HeroHeadline } from "./HeroHeadline";
import { RotatingBadge } from "@/components/motion/RotatingBadge";
import { SectionLink } from "@/components/motion/SectionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Label } from "@/components/ui/Label";
import { pill } from "@/components/ui/pill";
import { ArrowUpRight } from "@/components/ui/icons";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-end px-gutter pb-8 pt-28">
      <Label className="hero-fade block">{hero.available}</Label>

      <div className="mt-8">
        <HeroHeadline />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <p className="hero-fade max-w-[46ch] text-body text-ink-2 lg:col-span-5" style={{ animationDelay: "700ms" }}>
          {hero.subhead}
        </p>
        <div className="hero-fade flex flex-wrap gap-3 lg:col-span-4 lg:col-start-7" style={{ animationDelay: "800ms" }}>
          <Magnetic>
            <SectionLink href="/#contact" className={pill("blue")}>
              Get in touch
            </SectionLink>
          </Magnetic>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={pill("ghost")}>
            Résumé (PDF) <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="hidden lg:col-span-2 lg:col-start-11 lg:flex lg:justify-end">
          <RotatingBadge label="Selected work" href="/#work" />
        </div>
      </div>

      <ul aria-label="At a glance" className="mt-12 grid border-t border-line md:grid-cols-[repeat(3,auto)]">
        {facts.map((fact) => (
          <li key={fact} className="border-b border-line py-4 pr-6 font-mono text-label uppercase text-ink-3 md:border-b-0">
            {fact}
          </li>
        ))}
      </ul>
    </section>
  );
}

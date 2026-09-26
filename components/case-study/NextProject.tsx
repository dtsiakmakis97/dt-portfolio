import type { Project } from "@/lib/content";
import { Label } from "@/components/ui/Label";
import { pill } from "@/components/ui/pill";
import { SectionLink } from "@/components/motion/SectionLink";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { NAV_FORWARD } from "@/lib/vt";

/** The giant "Next" link (curtain only; no shared name, so no title morph)
 *  and the way back to the index. */
export function NextProject({ next }: { next: Project }) {
  return (
    <nav aria-label="More work" className="px-gutter py-section">
      <TransitionLink href={`/work/${next.slug}`} transitionTypes={[NAV_FORWARD]} className="group block">
        <Label>Next</Label>{" "}
        <span className="mt-4 block font-display text-statement font-extrabold text-ink transition-colors duration-500 ease-glide group-hover:text-blue group-focus-visible:text-blue">
          {next.name}
        </span>
      </TransitionLink>
      <SectionLink href="/#work" className={`mt-12 ${pill("ghost")}`}>
        All work
      </SectionLink>
    </nav>
  );
}

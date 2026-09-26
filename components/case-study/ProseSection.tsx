import type { CaseLabel } from "@/lib/work/types";
import { Reveal } from "@/components/motion/Reveal";

/** A labelled prose section: the mono label (the h2) in columns 1–3, the body
 *  in columns 4–10 at 62ch at most. */
export function ProseSection({ label, paragraphs }: { label: CaseLabel; paragraphs: readonly string[] }) {
  const id = `case-${label.toLowerCase()}`;
  return (
    <section aria-labelledby={id} className="grid gap-6 px-gutter py-[clamp(3rem,2rem+4vw,7rem)] lg:grid-cols-12">
      <h2 id={id} className="font-mono text-label uppercase text-ink-3 lg:col-span-3 lg:sticky lg:top-[5.5rem] lg:self-start">
        {label}
      </h2>
      <div className="space-y-6 lg:col-span-7 lg:col-start-4">
        {paragraphs.map((paragraph) => (
          <Reveal key={paragraph}>
            <p className="max-w-[62ch] text-body text-ink-2">{paragraph}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

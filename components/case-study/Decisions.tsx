import type { Decision } from "@/lib/work/types";
import { Reveal } from "@/components/motion/Reveal";

/** Approach: a numbered list of decisions, each a bold one-line h3 and its why. */
export function Decisions({ intro, items }: { intro?: string; items: readonly Decision[] }) {
  return (
    <section aria-labelledby="case-approach" className="grid gap-6 px-gutter py-[clamp(3rem,2rem+4vw,7rem)] lg:grid-cols-12">
      <h2 id="case-approach" className="font-mono text-label uppercase text-ink-3 lg:col-span-3 lg:sticky lg:top-[5.5rem] lg:self-start">
        Approach
      </h2>
      <div className="lg:col-span-8 lg:col-start-4">
        {intro ? <p className="mb-8 max-w-[62ch] text-body text-ink-2">{intro}</p> : null}
        <ol className="border-t border-line">
          {items.map((decision, i) => (
            <li key={decision.summary} className="grid gap-4 border-b border-line py-8 md:grid-cols-[4rem_1fr]">
              <span aria-hidden="true" className="font-mono text-label text-ink-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Reveal>
                <h3 className="font-display text-lead font-extrabold text-ink">{decision.summary}</h3>
                <p className="mt-4 max-w-[62ch] text-body text-ink-2">{decision.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

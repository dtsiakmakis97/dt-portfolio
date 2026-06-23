import { hero } from "@/lib/content";
import { HeroBackground } from "./HeroBackground";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowDownRight } from "@/components/ui/icons";

const WORD_STAGGER = 70; // ms between words
const WORD_LEAD = 120; // ms before the first word

/** Renders words for the clip-reveal, each with an incremental animation-delay.
 *  Pure CSS animation — no JS, so it is safe above the fold. */
function Words({
  text,
  start,
  accent = false,
}: {
  text: string;
  start: number;
  accent?: boolean;
}) {
  const words = text.trim() ? text.trim().split(/\s+/) : [];
  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${start}-${i}`}
          className="word-mask"
          style={{ marginRight: "0.22em" }}
        >
          <span
            className={`word-inner${accent ? " text-accent" : ""}`}
            style={{ animationDelay: `${WORD_LEAD + (start + i) * WORD_STAGGER}ms` }}
          >
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  // Split the headline around the accent run so it gets the amber + drawn underline.
  const idx = hero.headline.indexOf(hero.accent);
  const before = idx === -1 ? hero.headline : hero.headline.slice(0, idx);
  const after = idx === -1 ? "" : hero.headline.slice(idx + hero.accent.length);
  const beforeCount = before.trim() ? before.trim().split(/\s+/).length : 0;
  const accentCount = hero.accent.trim().split(/\s+/).length;
  const underlineDelay = WORD_LEAD + (beforeCount + accentCount) * WORD_STAGGER + 120;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-line"
    >
      <div className="pointer-events-none absolute inset-0">
        <HeroBackground />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-36 md:px-12 md:pt-44 lg:px-24 lg:pb-28 lg:pt-52">
        <div className="max-w-4xl">
          <div className="mb-8">
            <Eyebrow>{hero.available}</Eyebrow>
          </div>

          <h1
            aria-label={hero.headline}
            className="font-display text-display font-bold text-fg"
          >
            <span aria-hidden="true">
              <Words text={before} start={0} />
              <span className="relative inline-block">
                <Words text={hero.accent} start={beforeCount} accent />
                <span
                  className="underline-draw absolute -bottom-1 left-0 h-1 bg-accent"
                  style={{
                    animationDelay: `${underlineDelay}ms`,
                    width: "calc(100% - 0.22em)",
                  }}
                  aria-hidden="true"
                />
              </span>
              <Words text={after} start={beforeCount + accentCount} />
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-lead text-fg-secondary">
            {hero.subhead}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 bg-fg px-6 py-3 text-sm font-medium uppercase tracking-widest text-canvas transition-colors duration-150 hover:bg-accent"
              >
                Selected work
                <ArrowDownRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-line-strong px-6 py-3 text-sm font-medium uppercase tracking-widest text-fg-secondary transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}

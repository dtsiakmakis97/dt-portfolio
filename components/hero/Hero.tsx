import { hero, profile } from "@/lib/content";
import { HeroBackground } from "./HeroBackground";
import { ArrowDownRight, MapPin } from "@/components/ui/icons";

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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="mb-8 flex items-center gap-3 font-mono text-eyebrow uppercase text-fg-muted">
              <span aria-hidden className="inline-block h-2 w-2 bg-accent" />
              <span>{hero.available}</span>
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

            <p className="mt-10 max-w-2xl text-base leading-relaxed text-fg-secondary md:text-lg">
              {hero.subhead}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
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
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border border-line-strong px-6 py-3 text-sm font-medium uppercase tracking-widest text-fg-secondary transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                Get in touch
              </a>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:border-l lg:border-line lg:pl-8">
            <dl className="grid grid-cols-2 gap-y-8 lg:grid-cols-1">
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-widest text-fg-muted">
                  Based in
                </dt>
                <dd className="mt-2 flex items-center gap-2 text-sm text-fg">
                  <MapPin size={14} className="text-accent" />
                  {profile.location}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-widest text-fg-muted">
                  Focus
                </dt>
                <dd className="mt-2 text-sm text-fg">Frontend depth · AI systems</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-widest text-fg-muted">
                  Experience
                </dt>
                <dd className="mt-2 text-sm text-fg">Enterprise e-commerce → solo AI</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-widest text-fg-muted">
                  Standard
                </dt>
                <dd className="mt-2 text-sm text-fg">WCAG 2.2 AA, by default</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

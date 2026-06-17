import { hero } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { CtaCluster } from "@/components/ui/CtaCluster";
import { Eyebrow } from "@/components/ui/Eyebrow";

function Terminal({ lines }: { lines: readonly string[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span aria-hidden className="size-2.5 rounded-full bg-fg-muted/40" />
        <span aria-hidden className="size-2.5 rounded-full bg-fg-muted/40" />
        <span aria-hidden className="size-2.5 rounded-full bg-fg-muted/40" />
        <span className="ml-2 font-mono text-xs text-fg-muted">~/dimitrios</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-loose">
        <code>
          {lines.map((line, i) => {
            const isPrompt = line.startsWith("$");
            return (
              <span
                key={i}
                className={`block ${isPrompt ? "text-fg-muted" : "text-fg-secondary"}`}
              >
                {!isPrompt && line.startsWith("→") && (
                  <span className="text-accent">→ </span>
                )}
                {isPrompt ? line : line.replace(/^→\s*/, "")}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-24 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-balance text-display font-semibold">
                {hero.headline}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-secondary">
                {hero.subhead}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <CtaCluster variant="button" className="mt-8" />
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={220}>
              <Terminal lines={hero.terminal} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

import { facts } from "@/lib/content";

/** Static credibility strip directly under the hero — specific honest facts,
 *  no logos, no motion. */
export function FactLedger() {
  return (
    <section aria-label="Credentials" className="border-b border-line bg-panel">
      <ul className="mx-auto flex max-w-[1400px] flex-col divide-y divide-line px-6 md:flex-row md:divide-y-0 md:px-12 lg:px-24">
        {facts.map((fact) => (
          <li
            key={fact}
            className="group flex items-center gap-3 py-4 md:flex-1 md:justify-center md:border-l md:border-line md:px-5 md:py-5 md:first:border-l-0"
          >
            <span
              aria-hidden
              className="font-mono text-xs text-accent transition-transform duration-200 group-hover:translate-x-0.5"
            >
              /
            </span>
            <span className="font-mono text-xs uppercase tracking-wide text-fg-muted transition-colors duration-200 group-hover:text-fg md:text-center">
              {fact}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { nav, profile } from "@/lib/content";
import { CtaCluster } from "@/components/ui/CtaCluster";

/** Persistent top bar — wordmark + section nav + recruiter CTA cluster, reachable from any scroll position. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <a
            href="#main"
            className="text-sm font-medium tracking-tight text-fg transition-colors duration-150 hover:text-accent"
          >
            {profile.name}
          </a>
          <span className="hidden rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-fg-muted sm:inline-block">
            Berlin
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <nav aria-label="Page sections" className="hidden md:block">
            <ul className="flex items-center gap-6">
              {nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hairline-link text-sm text-fg-secondary transition-colors duration-150 hover:text-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden className="hidden h-5 w-px bg-line md:block" />
          <CtaCluster variant="icon" />
        </div>
      </div>
    </header>
  );
}

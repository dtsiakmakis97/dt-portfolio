import { profile } from "@/lib/content";
import { CtaCluster } from "@/components/ui/CtaCluster";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 px-6 py-10 sm:flex-row sm:items-center sm:px-8 lg:px-12">
        <p className="font-mono text-xs leading-relaxed text-fg-muted">
          © 2026 {profile.name}
          <span className="mx-2 text-line">/</span>
          Built with Next.js &amp; Tailwind.
        </p>
        <CtaCluster variant="icon" />
      </div>
    </footer>
  );
}

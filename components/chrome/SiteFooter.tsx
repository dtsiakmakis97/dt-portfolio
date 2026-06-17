import { profile } from "@/lib/content";
import { Github, Linkedin, Mail, ArrowUpRight } from "@/components/ui/icons";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-panel">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-title font-bold text-fg">
              Let&apos;s build
              <br />
              something real<span className="text-accent">.</span>
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-6 inline-flex items-center gap-2 border-b border-line-strong font-mono text-sm text-fg-secondary transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              {profile.email}
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <h2 className="font-mono text-xs uppercase tracking-widest text-fg-muted">
              Elsewhere
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors duration-150 hover:text-accent"
                >
                  <Github size={16} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors duration-150 hover:text-accent"
                >
                  <Linkedin size={16} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors duration-150 hover:text-accent"
                >
                  <Mail size={16} /> Email
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-mono text-xs uppercase tracking-widest text-fg-muted">
              Résumé
            </h2>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 border border-line-strong px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-fg-secondary transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              Download
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-fg-muted">
            © 2026 {profile.name}
            <span className="mx-2 text-fg-faint">/</span>
            Built to the standard it claims.
          </p>
          <p className="font-mono text-xs text-fg-muted">
            {profile.location} · WCAG 2.2 AA
          </p>
        </div>
      </div>
    </footer>
  );
}

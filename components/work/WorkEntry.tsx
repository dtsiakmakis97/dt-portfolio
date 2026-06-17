import type { Project } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/icons";
import { WorkMedia } from "./WorkMedia";

function media(project: Project): { href: string; label: string } {
  const live = project.links?.find((l) => /^https?:/.test(l.href))?.href;
  return live
    ? { href: live, label: "Visit" }
    : { href: "#contact", label: "Discuss" };
}

/** Spec-panel media for projects without a public screenshot: a faint technical
 *  grid with an amber prompt and a request-a-walkthrough note, honest about
 *  there being no live demo. */
function SpecPanel() {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border border-line bg-panel">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span aria-hidden className="h-px w-8 bg-accent" />
        <span className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          Walkthrough on request
        </span>
      </div>
    </div>
  );
}

export function WorkEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article
      className={`group grid grid-cols-1 gap-8 py-12 md:py-16 lg:grid-cols-12 lg:gap-10 ${
        index === 1 ? "" : "border-t border-line"
      }`}
    >
      {/* Meta column */}
      <div className="lg:col-span-5">
        <div className="font-mono text-xs uppercase tracking-widest text-fg-muted">
          {project.period}
        </div>
        <h3 className="mt-4 font-display text-title font-bold text-fg transition-colors duration-200 group-hover:text-accent">
          {project.name}
        </h3>
        <p className="mt-2 text-fg-secondary">{project.tagline}</p>
        <p className="mt-4 max-w-md leading-relaxed text-fg-secondary">
          {project.description}
        </p>

        <dl className="mt-5 space-y-1 font-mono text-xs">
          <div className="flex gap-3">
            <dt className="shrink-0 text-fg-muted">Role</dt>
            <dd className="text-fg-secondary">{project.role}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="shrink-0 text-fg-muted">Status</dt>
            <dd className="text-fg-secondary">{project.status}</dd>
          </div>
        </dl>

        <ul
          className="mt-5 flex flex-wrap gap-2"
          aria-label={`${project.name} stack`}
        >
          {project.stack.map((s) => (
            <li
              key={s}
              className="border border-line px-2.5 py-1 font-mono text-xs uppercase tracking-widest text-fg-muted"
            >
              {s}
            </li>
          ))}
        </ul>

        {project.links && (
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hairline-link inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-accent"
              >
                {link.label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Media column */}
      <div className="lg:col-span-7">
        {project.image ? (
          <WorkMedia
            image={project.image}
            alt={project.imageAlt ?? project.name}
            title={project.name}
            {...media(project)}
          />
        ) : (
          <SpecPanel />
        )}
      </div>
    </article>
  );
}

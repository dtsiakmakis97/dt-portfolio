import type { Project } from "@/lib/content";
import { ArrowUpRight } from "@/components/ui/icons";

export function WorkEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="group grid grid-cols-1 gap-y-5 border-t border-line py-10 md:grid-cols-12 md:gap-x-8 md:py-14">
      <div className="md:col-span-1">
        <span className="font-mono text-sm text-fg-muted">
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <div className="md:col-span-7">
        <h3 className="text-2xl font-medium tracking-tight text-fg transition-colors duration-200 group-hover:text-accent md:text-3xl">
          {project.name}
        </h3>
        <p className="mt-1.5 text-fg-secondary">{project.tagline}</p>
        <p className="mt-4 max-w-xl leading-relaxed text-fg-secondary">
          {project.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted"
            >
              {tag}
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
                className="hairline-link inline-flex items-center gap-1 text-sm font-medium text-accent"
              >
                {link.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-4 md:text-right">
        <dl className="space-y-1.5 font-mono text-xs leading-relaxed text-fg-muted">
          <dd>{project.role}</dd>
          <dd>{project.period}</dd>
          <dd className="text-fg-secondary">{project.status}</dd>
        </dl>
      </div>
    </article>
  );
}

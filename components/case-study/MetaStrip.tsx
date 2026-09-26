import type { Project } from "@/lib/content";
import { Label } from "@/components/ui/Label";

/** Role / Year / Status / Stack, plus public links only. */
export function MetaStrip({ project }: { project: Project }) {
  const rows: readonly (readonly [string, string])[] = [
    ["Role", project.role],
    ["Year", project.period],
    ["Status", project.status],
    ["Stack", project.stack.join(" · ")],
  ];
  return (
    <dl data-meta="" className="grid gap-x-8 gap-y-6 border-y border-line py-8 sm:grid-cols-2 lg:grid-cols-5">
      {rows.map(([term, value]) => (
        <div key={term}>
          <dt>
            <Label>{term}</Label>
          </dt>
          <dd className="mt-2 text-body text-ink">{value}</dd>
        </div>
      ))}
      {project.links?.length ? (
        <div>
          <dt>
            <Label>Links</Label>
          </dt>
          <dd className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body text-ink underline decoration-line-strong underline-offset-4 transition-colors duration-300 hover:text-blue"
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

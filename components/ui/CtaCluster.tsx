import { ctas, type CtaKind } from "@/lib/content";
import { Mail, Github, Linkedin, FileText } from "./icons";

const iconFor: Record<CtaKind, typeof Mail> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  resume: FileText,
};

/** External links open in a new tab; mailto stays in place. */
function isExternal(kind: CtaKind) {
  return kind !== "email";
}

interface CtaClusterProps {
  variant?: "icon" | "button";
  className?: string;
}

export function CtaCluster({ variant = "icon", className }: CtaClusterProps) {
  if (variant === "button") {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>
        {ctas.map((c, i) => {
          const Icon = iconFor[c.kind];
          const primary = i === 0;
          return (
            <a
              key={c.kind}
              href={c.href}
              {...(isExternal(c.kind)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={
                primary
                  ? "inline-flex items-center gap-2 bg-fg px-6 py-3 text-sm font-medium uppercase tracking-widest text-canvas transition-colors duration-150 hover:bg-accent"
                  : "inline-flex items-center gap-2 border border-line-strong px-6 py-3 text-sm font-medium uppercase tracking-widest text-fg-secondary transition-colors duration-150 hover:border-accent hover:text-accent"
              }
            >
              <Icon size={16} />
              {c.label}
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <ul className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {ctas.map((c) => {
        const Icon = iconFor[c.kind];
        return (
          <li key={c.kind}>
            <a
              href={c.href}
              aria-label={c.label}
              title={c.label}
              {...(isExternal(c.kind)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="grid size-9 place-items-center text-fg-secondary transition-colors duration-150 hover:bg-surface hover:text-accent"
            >
              <Icon size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

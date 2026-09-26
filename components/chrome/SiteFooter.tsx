import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import { Label } from "@/components/ui/Label";
import { pill } from "@/components/ui/pill";
import { ArrowUpRight } from "@/components/ui/icons";
import { WORDMARK_FIT_K } from "@/lib/work/fit";

const linkClass = "text-body text-ink transition-colors duration-300 hover:text-blue";

export function SiteFooter() {
  return (
    <footer className="border-t border-line px-gutter pb-10 pt-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Label>Elsewhere</Label>
          <ul className="mt-5 space-y-2">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div className="md:col-span-5">
          <Label>Email</Label>
          <a href={`mailto:${profile.email}`} className={`mt-5 block ${linkClass}`}>
            {profile.email}
          </a>
        </div>
        <div className="md:col-span-3 md:justify-self-end">
          <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={pill("ghost")}>
            Résumé (PDF) <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* The name set to the full width; decorative, since the line below names it. */}
      <p aria-hidden="true" className="fit mt-24">
        <span
          className="fit-text font-extrabold text-ink"
          style={{ "--chars": profile.name.length, "--fit-k": WORDMARK_FIT_K } as CSSProperties}
        >
          {profile.name}
        </span>
      </p>

      <p className="mt-8 border-t border-line pt-6 font-mono text-label uppercase text-ink-3">© 2026 {profile.name}</p>
    </footer>
  );
}

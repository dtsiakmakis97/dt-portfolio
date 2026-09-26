import type { ReactNode } from "react";

/** Small mono caps label: section kickers, metadata keys, row indices. */
export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-label uppercase text-ink-3 ${className}`}>{children}</span>;
}

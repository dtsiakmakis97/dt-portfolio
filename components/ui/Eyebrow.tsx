interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** Mono, uppercase, wide-tracked section label, preceded by a short amber
 * hairline that acts as the section's visual prompt. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-eyebrow uppercase text-fg-muted ${className ?? ""}`}
    >
      <span aria-hidden className="inline-block h-px w-6 bg-accent" />
      <span>{children}</span>
    </p>
  );
}

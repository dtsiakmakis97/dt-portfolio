interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** Section label as an instrument badge: a mono, uppercase, wide-tracked label
 * inside a thin sharp-cornered hairline box, led by a small filled amber square
 * that reads as a functional marker rather than decoration. The box shrink-wraps
 * the label (inline-flex), so it hugs the text instead of spanning the column. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={`inline-flex items-center gap-2.5 border border-line-strong px-2.5 py-1.5 font-mono text-eyebrow uppercase text-fg-secondary ${className ?? ""}`}
    >
      <span aria-hidden className="inline-block size-1.5 bg-accent" />
      <span>{children}</span>
    </p>
  );
}

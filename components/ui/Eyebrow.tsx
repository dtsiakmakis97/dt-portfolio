interface EyebrowProps {
  children: React.ReactNode;
  /** Optional section index, e.g. "02" → renders [02] in amber. */
  index?: string;
  className?: string;
}

/** Mono, uppercase, wide-tracked section label. With an `index` it reads as a
 * numbered log entry ([02] Selected work); without one it falls back to the
 * leading amber hairline. */
export function Eyebrow({ children, index, className }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-eyebrow uppercase text-fg-muted ${className ?? ""}`}
    >
      {index ? (
        <span aria-hidden className="text-accent">
          [{index}]
        </span>
      ) : (
        <span aria-hidden className="inline-block h-px w-6 bg-accent" />
      )}
      <span>{children}</span>
    </p>
  );
}

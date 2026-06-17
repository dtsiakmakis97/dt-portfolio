interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

/** Mono, uppercase, accent-tinted section label — the "terminal prompt" signal. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-2 font-mono text-eyebrow uppercase text-accent ${className ?? ""}`}
    >
      <span aria-hidden className="inline-block h-px w-6 bg-accent/60" />
      {children}
    </p>
  );
}

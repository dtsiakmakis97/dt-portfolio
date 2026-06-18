"use client";

import { useMagnetic } from "@/lib/hooks/useMagnetic";

interface MagneticProps {
  children: React.ReactNode;
  /** Extra class on the inline wrapper (e.g. layout helpers). */
  className?: string;
  radius?: number;
  max?: number;
}

/** Inline wrapper that applies the magnetic pull to its children. Lets
 *  server-rendered targets (the Hero CTAs) get the effect without becoming
 *  client components themselves. */
export function Magnetic({ children, className, radius, max }: MagneticProps) {
  const ref = useMagnetic<HTMLSpanElement>({ radius, max });
  return (
    <span
      ref={ref}
      className={`inline-flex will-change-transform${className ? ` ${className}` : ""}`}
    >
      {children}
    </span>
  );
}

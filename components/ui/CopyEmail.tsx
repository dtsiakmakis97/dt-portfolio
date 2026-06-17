"use client";

import { useState } from "react";
import { Copy, Check } from "./icons";

/** Click-to-copy email — small interactive flourish in the contact section. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — no-op; the address is still visible.
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Email address copied" : `Copy email address ${email}`}
      className="group inline-flex items-center gap-2.5 font-mono text-sm text-fg-secondary transition-colors duration-150 hover:text-fg"
    >
      <span>{email}</span>
      <span
        aria-hidden
        className="text-fg-muted transition-colors duration-150 group-hover:text-accent"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

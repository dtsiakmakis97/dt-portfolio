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
      className="group inline-flex items-center gap-2.5 font-mono text-body text-ink-2 transition-colors duration-300 hover:text-ink"
    >
      <span>{email}</span>
      <span
        aria-hidden
        className="text-ink-3 transition-colors duration-300 group-hover:text-blue"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

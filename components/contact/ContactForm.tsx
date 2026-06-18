"use client";

import { useActionState, useEffect, useState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { AlertTriangle, ArrowRight, Check } from "@/components/ui/icons";
import { useMagnetic } from "@/lib/hooks/useMagnetic";

const INITIAL: ContactState = { status: "idle" };

function fieldClass(error?: string) {
  return `w-full border bg-transparent px-4 py-3 font-mono text-base text-fg placeholder:text-fg-faint transition-colors focus:border-accent focus:outline-none ${
    error ? "border-danger/70" : "border-line-strong"
  }`;
}

const labelClass =
  "mb-2 block font-mono text-xs uppercase tracking-widest text-fg-muted";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL);
  const [dismissed, setDismissed] = useState(false);
  const submitRef = useMagnetic<HTMLButtonElement>();

  // Re-arm the success panel whenever a new submission starts.
  useEffect(() => {
    if (pending) setDismissed(false);
  }, [pending]);

  if (state.status === "success" && !dismissed) {
    return (
      <div className="flex h-full flex-col items-start justify-center border border-line bg-panel p-10">
        <span className="flex size-12 items-center justify-center border border-accent text-accent">
          <Check size={22} />
        </span>
        <h3 className="mt-6 font-display text-subtitle font-medium text-fg">
          Message received.
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-fg-secondary">
          Thanks for reaching out. I read everything myself and will reply soon.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-8 border border-line-strong px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-fg-secondary transition-colors duration-150 hover:border-accent hover:text-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  const errors = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass(errors.name)}
            placeholder="Your name"
          />
          {errors.name && (
            <p
              id="name-error"
              className="mt-2 flex items-center gap-1.5 font-mono text-xs text-danger"
            >
              <AlertTriangle size={13} className="shrink-0" />
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass(errors.email)}
            placeholder="you@company.com"
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-2 flex items-center gap-1.5 font-mono text-xs text-danger"
            >
              <AlertTriangle size={13} className="shrink-0" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>
          Company <span className="text-fg-faint">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className={fieldClass(errors.company)}
          placeholder="Where you’re writing from"
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${fieldClass(errors.message)} resize-none`}
          placeholder="The role, the project, the timeline, whatever is useful."
        />
        {errors.message && (
          <p
            id="message-error"
            className="mt-2 flex items-center gap-1.5 font-mono text-xs text-danger"
          >
            <AlertTriangle size={13} className="shrink-0" />
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from users and assistive tech; bots fill it. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label htmlFor="company_url">Do not fill this in</label>
        <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="flex items-center gap-1.5 font-mono text-xs text-danger"
        >
          <AlertTriangle size={13} className="shrink-0" />
          {state.message}
        </p>
      )}

      <button
        ref={submitRef}
        type="submit"
        disabled={pending}
        className="group inline-flex items-center gap-3 bg-fg px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-canvas transition-colors duration-150 will-change-transform hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
        {!pending && (
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </button>
    </form>
  );
}

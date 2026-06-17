"use server";

import { Resend } from "resend";
import { profile } from "@/lib/content";
import { contactSchema } from "@/lib/schemas/contact";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "company" | "message", string>>;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — bots fill the hidden field; pretend success and drop silently.
  const trap = formData.get("company_url");
  if (typeof trap === "string" && trap.trim() !== "") {
    return { status: "success" };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        (key === "name" ||
          key === "email" ||
          key === "company" ||
          key === "message") &&
        !errors[key]
      ) {
        errors[key] = issue.message;
      }
    }
    return {
      status: "error",
      errors,
      message: "Please fix the highlighted fields.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "error",
      message: "Email isn’t wired up yet — please reach me at " + profile.email + ".",
    };
  }

  const data = parsed.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // onboarding@resend.dev works without a verified domain when sending to the account owner.
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_TO ?? profile.email,
      replyTo: data.email,
      subject: `Portfolio enquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`,
      text: `From: ${data.name} <${data.email}>\nCompany: ${data.company || "—"}\n\n${data.message}`,
    });
    if (error) {
      return {
        status: "error",
        message: "Couldn’t send just now — please email me directly.",
      };
    }
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Couldn’t send just now — please email me directly.",
    };
  }
}

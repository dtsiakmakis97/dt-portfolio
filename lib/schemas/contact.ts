import { z } from "zod";

/** Server-side validation for the contact form. zod v4 top-level format APIs. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(100),
  email: z.email("That email does not look right.").max(200),
  // Optional — empty string is allowed through.
  company: z.string().trim().max(120),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail helps.")
    .max(4000, "That is a bit long — trim it down."),
});

export type ContactInput = z.infer<typeof contactSchema>;

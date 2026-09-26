import { contact, profile } from "@/lib/content";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" className="px-gutter py-section">
      <Label>{contact.eyebrow}</Label>
      <SplitReveal as="h2" text={contact.headline} className="mt-6 font-display text-mega font-extrabold text-ink" />

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="max-w-[40ch] text-lead text-ink">{contact.body}</p>
          <div className="mt-10">
            <Magnetic max={10}>
              <a
                href={`mailto:${profile.email}`}
                className="grid size-40 place-items-center rounded-pill bg-blue text-center font-mono text-label uppercase text-canvas transition-colors duration-500 ease-glide hover:bg-ink"
              >
                Email me
              </a>
            </Magnetic>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

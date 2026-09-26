import { contact, profile } from "@/lib/content";
import { Label } from "@/components/ui/Label";
import { Magnetic } from "@/components/ui/Magnetic";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ContactForm } from "./ContactForm";

const linkClass = "text-body text-ink transition-colors duration-300 hover:text-blue";

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
          <dl className="mt-12 space-y-6 border-t border-line pt-8">
            <div>
              <dt>
                <Label>Email</Label>
              </dt>
              <dd className="mt-2">
                <CopyEmail email={profile.email} />
              </dd>
            </div>
            <div>
              <dt>
                <Label>Based in</Label>
              </dt>
              <dd className="mt-2 text-body text-ink">{profile.location}</dd>
            </div>
            <div>
              <dt>
                <Label>Elsewhere</Label>
              </dt>
              <dd className="mt-2 flex gap-6">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  LinkedIn
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

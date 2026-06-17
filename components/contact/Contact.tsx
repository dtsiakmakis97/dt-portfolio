import { contact, profile } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ContactForm } from "./ContactForm";
import { Github, Linkedin } from "@/components/ui/icons";

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Pitch */}
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow index="05">{contact.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-display text-display font-bold leading-[0.95] text-fg">
                {contact.headline}
              </h2>
              <p className="mt-8 max-w-md leading-relaxed text-fg-secondary">
                {contact.body}
              </p>

              <div className="mt-10 space-y-5 border-t border-line pt-8">
                <div>
                  <span className="block font-mono text-[0.7rem] uppercase tracking-widest text-fg-muted">
                    Email
                  </span>
                  <div className="mt-1.5">
                    <CopyEmail email={profile.email} />
                  </div>
                </div>
                <div>
                  <span className="block font-mono text-[0.7rem] uppercase tracking-widest text-fg-muted">
                    Based in
                  </span>
                  <span className="mt-1.5 inline-block font-mono text-sm text-fg-secondary">
                    {profile.location}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[0.7rem] uppercase tracking-widest text-fg-muted">
                    Elsewhere
                  </span>
                  <div className="mt-2 flex flex-wrap gap-5">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-fg-secondary transition-colors duration-150 hover:text-accent"
                    >
                      <Github size={15} /> GitHub
                    </a>
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-fg-secondary transition-colors duration-150 hover:text-accent"
                    >
                      <Linkedin size={15} /> LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

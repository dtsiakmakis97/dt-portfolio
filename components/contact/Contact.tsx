import { contact, profile } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaCluster } from "@/components/ui/CtaCluster";
import { CopyEmail } from "@/components/ui/CopyEmail";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:px-8 md:py-36 lg:px-12">
        <Reveal>
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <h2 className="mt-6 text-display font-semibold">{contact.headline}</h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-secondary">
            {contact.body}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-8">
            <CtaCluster variant="button" />
            <div className="flex flex-col gap-4 border-t border-line pt-8 font-mono text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
              <CopyEmail email={profile.email} />
              <span>{profile.availability}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { Hero } from "@/components/hero/Hero";
import { FactLedger } from "@/components/credibility/FactLedger";
import { About } from "@/components/about/About";
import { SelectedWork } from "@/components/work/SelectedWork";
import { Experience } from "@/components/experience/Experience";
import { Skills } from "@/components/skills/Skills";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <FactLedger />
      <About />
      <SelectedWork />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}

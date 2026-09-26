import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { WorkIndex } from "@/components/work/WorkIndex";
import { Experience } from "@/components/experience/Experience";
import { Skills } from "@/components/skills/Skills";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <WorkIndex />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}

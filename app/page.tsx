import { ViewTransition } from "react";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { WorkIndex } from "@/components/work/WorkIndex";
import { Experience } from "@/components/experience/Experience";
import { Skills } from "@/components/skills/Skills";
import { Contact } from "@/components/contact/Contact";
import { CURTAIN_ENTER, CURTAIN_EXIT } from "@/lib/vt";

export default function Home() {
  return (
    // The page's own transition boundary: the curtain (lib/vt.ts CURTAIN_*).
    <ViewTransition enter={CURTAIN_ENTER} exit={CURTAIN_EXIT} default="none">
      <div>
        <Hero />
        <About />
        <WorkIndex />
        <Experience />
        <Skills />
        <Contact />
      </div>
    </ViewTransition>
  );
}

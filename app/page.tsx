import { ViewTransition } from "react";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { WorkIndex } from "@/components/work/WorkIndex";
import { Experience } from "@/components/experience/Experience";
import { Skills } from "@/components/skills/Skills";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    // Mounting this boundary makes React run a view transition when the page
    // changes; it captures nothing itself. The curtain runs on the root
    // snapshot, which is viewport-sized (app/styles/view-transitions.css).
    <ViewTransition default="none">
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

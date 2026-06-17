"use client";

import { useParallax } from "@/lib/hooks/useParallax";
import { ArrowUpRight } from "@/components/ui/icons";

interface WorkMediaProps {
  image: string;
  alt: string;
  title: string;
  href: string;
  label: string;
}

/** Live-project media block: grayscale screenshot that warms to color on hover,
 *  with a subtle scroll parallax. Links to the live site (or contact). */
export function WorkMedia({ image, alt, title, href, label }: WorkMediaProps) {
  const parallax = useParallax<HTMLImageElement>(0.05);
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      aria-label={`${label}: ${title}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="relative block overflow-hidden border border-line bg-panel"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={parallax.ref}
          style={parallax.style}
          src={image}
          alt={alt}
          loading="lazy"
          className="absolute left-0 top-[-10%] h-[120%] w-full object-cover opacity-70 grayscale transition-[opacity,filter] duration-500 will-change-transform group-hover:opacity-90 group-hover:grayscale-0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent"
        />
        <div className="absolute bottom-0 left-0 flex w-full items-center justify-between p-5">
          <span className="font-mono text-xs uppercase tracking-widest text-fg-secondary">
            {title}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {label}
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </a>
  );
}

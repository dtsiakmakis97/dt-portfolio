import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { siteUrl } from "@/lib/site";

// Home plus every case study search may index. Kryora (noindex) stays out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((project) => !project.noindex)
      .map((project) => ({
        url: `${siteUrl}/work/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ];
}

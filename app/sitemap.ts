import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { siteUrl } from "@/lib/site";

// Home plus every case study search may index; a noindexed one stays out.
// No lastModified: a build-time date on every URL teaches crawlers to ignore it.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((project) => !project.noindex)
      .map((project) => ({
        url: `${siteUrl}/work/${project.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
  ];
}

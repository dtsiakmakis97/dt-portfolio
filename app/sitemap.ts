import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Single-page portfolio: one canonical URL. The section anchors (#about, #work,
// …) are not separate documents, so they don't belong in the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

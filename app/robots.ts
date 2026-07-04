import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ameen-esim.co.uk";

// Keeps admin, API, and the transactional checkout flow out of the index —
// none of that is content a search result should ever land someone on.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/checkout", "/orders"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

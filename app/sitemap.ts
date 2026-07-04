import type { MetadataRoute } from "next";

import { listPublicPlans } from "@/lib/plans/store";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ameen-esim.co.uk";

const STATIC_ROUTES = [
  { path: "", priority: 1, frequency: "weekly" as const },
  { path: "/plans", priority: 0.9, frequency: "daily" as const },
  { path: "/how-it-works", priority: 0.7, frequency: "monthly" as const },
  { path: "/coverage", priority: 0.7, frequency: "monthly" as const },
  { path: "/compatibility", priority: 0.6, frequency: "monthly" as const },
  { path: "/faq", priority: 0.6, frequency: "monthly" as const },
  { path: "/about", priority: 0.5, frequency: "monthly" as const },
  { path: "/contact", priority: 0.4, frequency: "yearly" as const },
  { path: "/terms", priority: 0.2, frequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, frequency: "yearly" as const },
  { path: "/refund-policy", priority: 0.2, frequency: "yearly" as const },
  { path: "/cookies", priority: 0.2, frequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.frequency,
    priority: route.priority,
  }));

  // One entry per sellable plan, so individual Saudi/Gulf/country pages get
  // indexed and can rank for their own searches (e.g. "Saudi Arabia eSIM").
  let planEntries: MetadataRoute.Sitemap = [];
  try {
    const plans = await listPublicPlans();
    planEntries = plans.map((plan) => ({
      url: `${siteUrl}/plans/${plan.slug}`,
      lastModified: plan.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // No DB configured (e.g. local build without DATABASE_URL) — ship the
    // static routes only rather than failing the whole sitemap.
  }

  return [...staticEntries, ...planEntries];
}

import { config } from "dotenv";
// Prefer .env.local (where the Neon URL lives), fall back to .env.
config({ path: ".env.local" });
config({ path: ".env" });

import { createPlan, deletePlan, listPlans } from "../lib/plans/store";

/*
  One-off: add a real UK eSIM Access test plan so the full
  checkout -> webhook -> provision flow can be verified on a UK phone.

  Mapped to live package CKH253 ("United Kingdom 1GB 7Days", ~$0.57 wholesale).
  Idempotent: removes any existing plan with the same slug first.

  Run: npx tsx scripts/add-uk-test-plan.ts
  Remove later: set active=false in /admin/plans, or delete by slug.
*/

const SLUG = "uk-1gb-7day-test";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set — add the Neon URL to .env.local.");
  }

  const existing = (await listPlans({ includeInactive: true })).find(
    (p) => p.slug === SLUG,
  );
  if (existing) {
    await deletePlan(existing.id);
    console.log(`Removed existing "${SLUG}".`);
  }

  const plan = await createPlan({
    slug: SLUG,
    title: "United Kingdom 1GB · 7 Days",
    subtitle: "Internal test plan",
    country: "GB",
    dataAmountMb: 1024,
    validityDays: 7,
    description:
      "1GB of UK data valid for 7 days. Internal test plan, mapped to eSIM Access package CKH253.",
    featureList: ["1GB data", "7 days validity", "United Kingdom coverage"],
    costPence: 45, // ~$0.57 wholesale
    markupType: "none",
    retailPricePence: 199, // £1.99 (Stripe is in test mode, so not charged for real)
    providerRefs: { esimaccess: "CKH253", mock: "CKH253" },
    badge: "Test",
    active: true,
    sortOrder: 1,
  });

  console.log(`Added test plan "${plan.slug}" (id ${plan.id}).`);
  console.log("Open: /plans/" + plan.slug);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

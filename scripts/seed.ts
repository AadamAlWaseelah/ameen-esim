import { config } from "dotenv";
// Prefer .env.local (where the Neon URL lives), fall back to .env.
config({ path: ".env.local" });
config({ path: ".env" });

import { getDb } from "../lib/db";
import { plans } from "../lib/db/schema";
import { seedPlans } from "../lib/plans/seed";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL is not set. Skipping database seed.");
    return;
  }

  const db = getDb();
  for (const plan of seedPlans) {
    await db
      .insert(plans)
      .values(plan)
      .onConflictDoUpdate({
        target: plans.slug,
        set: {
          title: plan.title,
          subtitle: plan.subtitle,
          country: plan.country,
          dataAmountMb: plan.dataAmountMb,
          validityDays: plan.validityDays,
          network: plan.network,
          description: plan.description,
          featureList: plan.featureList,
          costPence: plan.costPence,
          markupType: plan.markupType,
          markupValue: plan.markupValue,
          retailPricePence: plan.retailPricePence,
          providerRefs: plan.providerRefs,
          badge: plan.badge,
          active: plan.active,
          sortOrder: plan.sortOrder,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`Seeded ${seedPlans.length} Ameen eSIM plans.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

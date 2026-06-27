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
  // Non-destructive: only insert plans that don't exist yet. Existing plans are
  // managed live via /admin (prices, mappings, badges, active state), so a
  // re-seed must never clobber them. To intentionally reset a plan, delete it
  // first or edit it in the admin.
  let inserted = 0;
  for (const plan of seedPlans) {
    const rows = await db
      .insert(plans)
      .values(plan)
      .onConflictDoNothing({ target: plans.slug })
      .returning({ id: plans.id });
    inserted += rows.length;
  }

  console.log(
    `Seed complete: ${inserted} new plan(s) inserted, ${
      seedPlans.length - inserted
    } existing left untouched.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

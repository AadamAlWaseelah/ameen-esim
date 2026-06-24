/**
 * Auto-map our seed plans to live eSIM Access package codes.
 *
 *   npm run esim:map            # match + print, then write the refs file
 *   npm run esim:map -- --dry   # match + print only (no write)
 *
 * Reads ESIMACCESS_ACCESS_CODE / ESIMACCESS_SECRET_KEY from .env.local (or .env),
 * pulls the live Saudi catalogue, matches each plan by data + duration + fair-use
 * variant, and writes lib/plans/esimaccess-refs.json ({ planSlug: packageCode }).
 * Review the printed matches before trusting them — anything unmatched or
 * ambiguous is flagged, and you can always fine-tune refs in /admin/plans.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { esimAccessProvider } from "../lib/esim/providers/esimaccess";
import { seedPlans } from "../lib/plans/seed";
import type { ProviderPlan } from "../lib/esim/types";

// A normalised signature: data tier + duration + fair-use flag.
function signature(title: string, dataMb: number | null, days: number): string {
  const t = title.toLowerCase();
  const fup = /fup|1\s*mbps/.test(t) ? "fup" : "std";
  const daily = /\/\s*day|daily|per[-\s]?day/.test(t);
  const data =
    dataMb == null ? "unlimited" : `${Math.round((dataMb / 1024) * 2) / 2}gb`;
  const duration = daily ? "daily" : `${days}d`;
  return `${data}|${duration}|${fup}`;
}

async function main() {
  const dryRun = process.argv.includes("--dry");

  let catalogue: ProviderPlan[];
  try {
    catalogue = await esimAccessProvider.listCatalogue("SA");
  } catch (error) {
    console.error(
      "\nCould not pull the eSIM Access catalogue. Check ESIMACCESS_ACCESS_CODE / " +
        "ESIMACCESS_SECRET_KEY in .env.local.\n",
    );
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  console.log(`\nPulled ${catalogue.length} eSIM Access packages.\n`);

  // Build signature -> packages (track collisions).
  const bySignature = new Map<string, ProviderPlan[]>();
  for (const pkg of catalogue) {
    const sig = signature(pkg.title, pkg.dataAmountMb, pkg.validityDays);
    bySignature.set(sig, [...(bySignature.get(sig) ?? []), pkg]);
  }

  const refs: Record<string, string> = {};
  let matched = 0;

  for (const plan of seedPlans) {
    const sig = signature(plan.title, plan.dataAmountMb, plan.validityDays);
    const candidates = bySignature.get(sig) ?? [];

    if (candidates.length === 0) {
      console.log(`✗  ${plan.title.padEnd(26)}  no match  [${sig}]`);
      continue;
    }

    // Prefer the cheapest candidate when several share a signature.
    const chosen = [...candidates].sort(
      (a, b) => (a.wholesalePricePence ?? 0) - (b.wholesalePricePence ?? 0),
    )[0];
    refs[plan.slug] = chosen.providerRef;
    matched += 1;

    const flag = candidates.length > 1 ? `  ⚠ ${candidates.length} candidates` : "";
    console.log(
      `✓  ${plan.title.padEnd(26)} -> ${chosen.providerRef}  (${chosen.title})${flag}`,
    );
  }

  console.log(`\nMatched ${matched}/${seedPlans.length} plans.`);

  if (dryRun) {
    console.log("\n--dry: no file written.\n");
    return;
  }

  const outPath = join(process.cwd(), "lib/plans/esimaccess-refs.json");
  writeFileSync(outPath, `${JSON.stringify(refs, null, 2)}\n`);
  console.log(`\nWrote ${outPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

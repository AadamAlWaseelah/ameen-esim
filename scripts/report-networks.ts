/*
  Reports which partner network(s) each destination's SOLD packages fulfil
  on, straight from the eSIM Access catalogue. Run: npx tsx scripts/report-networks.ts [CC,CC]
  Used to decide which operator names/logos we can honestly show per plan.
*/
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

const BASE = process.env.ESIMACCESS_BASE_URL ?? "https://api.esimaccess.com";

type ApiPackage = {
  packageCode?: string;
  locationNetworkList?: {
    locationName?: string;
    operatorList?: { operatorName?: string; networkType?: string }[];
  }[];
};

async function api(body: Record<string, unknown>): Promise<ApiPackage[]> {
  const res = await fetch(`${BASE}/api/v1/open/package/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "RT-AccessCode": process.env.ESIMACCESS_ACCESS_CODE!,
      "RT-SecretKey": process.env.ESIMACCESS_SECRET_KEY!,
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { success?: boolean; obj?: { packageList?: ApiPackage[] } };
  if (!res.ok || json.success === false) throw new Error(`API failed (${res.status})`);
  return json.obj?.packageList ?? [];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const limitTo = process.argv[2]?.split(",");
  const sql = neon(process.env.DATABASE_URL!);
  const plans = (await sql`
    SELECT country, slug, provider_refs FROM plans WHERE active = true
  `) as { country: string; slug: string; provider_refs: Record<string, string> }[];

  // Group our sold esimaccess refs by country.
  const byCountry = new Map<string, Set<string>>();
  for (const p of plans) {
    const ref = p.provider_refs?.esimaccess;
    if (!ref || ref.startsWith("TODO")) continue;
    if (!byCountry.has(p.country)) byCountry.set(p.country, new Set());
    byCountry.get(p.country)!.add(ref);
  }

  const report: Record<string, { plans: number; operators: Record<string, Set<string>>; missing: number }> = {};

  for (const [country, refs] of Array.from(byCountry.entries()).sort()) {
    if (limitTo && !limitTo.includes(country)) continue;
    const isIso = /^[A-Z]{2}$/.test(country);
    let packages: ApiPackage[] = [];
    try {
      if (isIso) {
        packages = await api({ locationCode: country });
      } else {
        // Regional (GCC/Gulf): fetch each of our packages individually.
        for (const ref of Array.from(refs)) {
          packages.push(...(await api({ packageCode: ref })));
          await sleep(120);
        }
      }
    } catch (e) {
      console.error(`${country}: catalogue fetch failed — ${e}`);
      continue;
    }

    const catalogueByCode = new Map(packages.map((p) => [p.packageCode, p]));
    const ops: Record<string, Set<string>> = {};
    let missing = 0;
    for (const ref of Array.from(refs)) {
      const pkg = catalogueByCode.get(ref);
      if (!pkg) { missing++; continue; }
      for (const loc of pkg.locationNetworkList ?? []) {
        for (const op of loc.operatorList ?? []) {
          if (!op.operatorName) continue;
          ops[op.operatorName] ??= new Set();
          if (op.networkType) ops[op.operatorName].add(op.networkType);
        }
      }
    }
    report[country] = { plans: refs.size, operators: ops, missing };
    await sleep(150);
  }

  for (const [c, r] of Object.entries(report)) {
    const opsText = Object.entries(r.operators)
      .map(([name, types]) => `${name} (${Array.from(types).join("/")})`)
      .join(", ") || "NONE FOUND";
    console.log(`${c}\t${r.plans} plans\t${opsText}${r.missing ? `\t[${r.missing} refs not in catalogue]` : ""}`);
  }
}

main();

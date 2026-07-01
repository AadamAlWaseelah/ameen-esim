/**
 * Build the committed international eSIM catalogue from the eSIM Access price
 * list CSV. Re-run this when adding more countries to the international section.
 *
 *   npx tsx scripts/build-intl-catalogue.ts GB,FR,ES ["path/to/eSim Pricing.csv"]
 *
 * Country codes come from the CSV "Code" column. Output is written to
 * lib/plans/international-catalogue.json (source of truth for the seed).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_CSV =
  "C:/Users/aadam/OneDrive/Ameen Esim/eSim Pricing.csv";
const OUT = resolve("lib/plans/international-catalogue.json");

const codesArg = process.argv[2] ?? "GB,FR,ES";
const csvPath = process.argv[3] ?? DEFAULT_CSV;
const wanted = new Set(codesArg.split(",").map((c) => c.trim().toUpperCase()));

type Row = {
  country: string;
  name: string;
  dataType: string;
  dataMb: number | null;
  validityDays: number;
  speed: string;
  costUsdCents: number;
  variantUsdCents: number;
  code: string;
  slug: string;
};

function usdToCents(value: string): number {
  return Math.round(parseFloat(value.replace(/[$,]/g, "")) * 100);
}

function parseDataMb(name: string): number | null {
  const m = name.match(/(\d+(?:\.\d+)?)\s*(MB|GB)/i);
  if (!m) return null;
  const value = parseFloat(m[1]);
  return m[2].toUpperCase() === "GB" ? Math.round(value * 1024) : Math.round(value);
}

function slugify(csvSlug: string): string {
  return csvSlug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const lines = readFileSync(csvPath, "utf8").split(/\r?\n/).filter(Boolean);
const rows: Row[] = [];

for (let i = 1; i < lines.length; i++) {
  const f = lines[i].split(",");
  const code = (f[6] ?? "").trim();
  if (!wanted.has(code)) continue;
  rows.push({
    country: code,
    name: f[2].trim(),
    dataType: f[3].trim(),
    dataMb: parseDataMb(f[2]),
    validityDays: Number(f[8]) || 1,
    speed: (f[14] ?? "").trim(),
    costUsdCents: usdToCents(f[4]),
    variantUsdCents: usdToCents(f[5]),
    code: (f[11] ?? "").trim(),
    slug: slugify(f[9]),
  });
}

// Stable, sensible order: by country (as requested), then data size, then days.
const order = Array.from(wanted);
rows.sort(
  (a, b) =>
    order.indexOf(a.country) - order.indexOf(b.country) ||
    (a.dataMb ?? 0) - (b.dataMb ?? 0) ||
    a.validityDays - b.validityDays,
);

writeFileSync(OUT, JSON.stringify(rows, null, 2) + "\n");
const byCountry = order
  .map((c) => `${c}:${rows.filter((r) => r.country === c).length}`)
  .join(" ");
console.log(`Wrote ${rows.length} rows to ${OUT} (${byCountry})`);

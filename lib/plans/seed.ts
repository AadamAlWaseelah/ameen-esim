import type { PlanRecord } from "./types";
import esimaccessRefs from "./esimaccess-refs.json";

// Real eSIM Access package codes, keyed by plan slug. Populated by
// `npm run esim:map`; unmatched plans fall back to a TODO placeholder.
const ESIMACCESS_REFS = esimaccessRefs as Record<string, string>;

const now = new Date();

type SeedInput = {
  slug: string;
  title: string;
  subtitle: string;
  dataAmountMb: number;
  validityDays: number;
  csvSlug: string;
  costPence: number;
  retailPricePence: number;
  badge?: string;
  fairUse?: string;
};

const csvPlans: SeedInput[] = [
  {
    slug: "saudi-500mb-per-day",
    title: "Saudi 500MB/day",
    subtitle: "Entry daily data plan",
    dataAmountMb: 500,
    validityDays: 1,
    csvSlug: "SA_0.5_Daily",
    costPence: 72,
    retailPricePence: 149,
    fairUse: "500MB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-1gb-per-day",
    title: "Saudi 1GB/day",
    subtitle: "Daily plan for light browsing",
    dataAmountMb: 1024,
    validityDays: 1,
    csvSlug: "SA_1_Daily",
    costPence: 123,
    retailPricePence: 249,
    fairUse: "1GB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-1gb-per-day-fup-1mbps",
    title: "Saudi 1GB/day FUP 1Mbps",
    subtitle: "Daily fair-use plan",
    dataAmountMb: 1024,
    validityDays: 1,
    csvSlug: "SA_1_Daily_1Mbps",
    costPence: 137,
    retailPricePence: 299,
    fairUse: "1GB daily high-speed allowance, then throttled to 1Mbps under fair use.",
  },
  {
    slug: "saudi-1gb-7-days",
    title: "Saudi 1GB",
    subtitle: "Light data for short stays",
    dataAmountMb: 1024,
    validityDays: 7,
    csvSlug: "SA_1_7",
    costPence: 123,
    retailPricePence: 249,
  },
  {
    slug: "saudi-2gb-per-day",
    title: "Saudi 2GB/day",
    subtitle: "Daily plan for regular use",
    dataAmountMb: 2048,
    validityDays: 1,
    csvSlug: "SA_2_Daily",
    costPence: 219,
    retailPricePence: 449,
    fairUse: "2GB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-2gb-per-day-fup-1mbps",
    title: "Saudi 2GB/day FUP 1Mbps",
    subtitle: "Daily fair-use plan",
    dataAmountMb: 2048,
    validityDays: 1,
    csvSlug: "SA_2_Daily_1Mbps",
    costPence: 253,
    retailPricePence: 549,
    fairUse: "2GB daily high-speed allowance, then throttled to 1Mbps under fair use.",
  },
  {
    slug: "saudi-3gb-per-day-fup-1mbps",
    title: "Saudi 3GB/day FUP 1Mbps",
    subtitle: "Higher daily fair-use plan",
    dataAmountMb: 3072,
    validityDays: 1,
    csvSlug: "SA_3_Daily_1Mbps",
    costPence: 368,
    retailPricePence: 749,
    fairUse: "3GB daily high-speed allowance, then throttled to 1Mbps under fair use.",
  },
  {
    slug: "saudi-3gb-15-days",
    title: "Saudi 3GB",
    subtitle: "Balanced short Umrah plan",
    dataAmountMb: 3072,
    validityDays: 15,
    csvSlug: "SA_3_15",
    costPence: 328,
    retailPricePence: 699,
    badge: "Good short trip",
  },
  {
    slug: "saudi-3gb-30-days",
    title: "Saudi 3GB",
    subtitle: "Low-use monthly plan",
    dataAmountMb: 3072,
    validityDays: 30,
    csvSlug: "SA_3_30",
    costPence: 349,
    retailPricePence: 699,
  },
  {
    slug: "saudi-5gb-30-days",
    title: "Saudi 5GB",
    subtitle: "Balanced monthly plan",
    dataAmountMb: 5120,
    validityDays: 30,
    csvSlug: "SA_5_30",
    costPence: 547,
    retailPricePence: 1099,
    badge: "Popular",
  },
  {
    slug: "saudi-10gb-per-day",
    title: "Saudi 10GB/day",
    subtitle: "High daily allowance",
    dataAmountMb: 10240,
    validityDays: 1,
    csvSlug: "SA_10_Daily",
    costPence: 813,
    retailPricePence: 1649,
    fairUse: "10GB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-10gb-30-days",
    title: "Saudi 10GB",
    subtitle: "Longer trips and heavier use",
    dataAmountMb: 10240,
    validityDays: 30,
    csvSlug: "SA_10_30",
    costPence: 871,
    retailPricePence: 1749,
    badge: "Best value",
  },
  {
    slug: "saudi-20gb-30-days",
    title: "Saudi 20GB",
    subtitle: "For sharing, maps and frequent browsing",
    dataAmountMb: 20480,
    validityDays: 30,
    csvSlug: "SA_20_30",
    costPence: 1477,
    retailPricePence: 2999,
  },
  {
    slug: "saudi-50gb-30-days",
    title: "Saudi 50GB",
    subtitle: "Large monthly allowance",
    dataAmountMb: 51200,
    validityDays: 30,
    csvSlug: "SA_50_30",
    costPence: 4536,
    retailPricePence: 9099,
  },
];

const saudiSeed: PlanRecord[] = csvPlans.map((plan, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  slug: plan.slug,
  title: plan.title,
  subtitle: plan.subtitle,
  country: "SA",
  dataAmountMb: plan.dataAmountMb,
  validityDays: plan.validityDays,
  network: "Saudi Arabia network - provider confirmation required",
  description: plan.fairUse
    ? `${plan.title} Saudi data eSIM from the supplier price list. ${plan.fairUse} Data-only eSIM; no phone number is included.`
    : `${plan.title} Saudi data eSIM from the supplier price list. Data-only eSIM; no phone number is included.`,
  featureList: [
    `${plan.title} mobile data`,
    `${plan.validityDays} day${plan.validityDays === 1 ? "" : "s"} validity`,
    "Data-only eSIM, no phone number",
    "Install before travel, activate on arrival",
  ],
  costPence: plan.costPence,
  markupType: "none",
  markupValue: null,
  retailPricePence: plan.retailPricePence,
  providerRefs: {
    mock: plan.csvSlug,
    airalo: `TODO_AIRALO_${plan.csvSlug}`,
    maya: `TODO_MAYA_${plan.csvSlug}`,
    esimaccess: ESIMACCESS_REFS[plan.slug] ?? `TODO_ESIMACCESS_${plan.csvSlug}`,
  },
  badge: plan.badge ?? null,
  active: true,
  sortOrder: (index + 1) * 10,
  createdAt: now,
  updatedAt: now,
}));

// Regional (Multi-Area) eSIM Access plans that cover Saudi Arabia + Gulf
// neighbours (Israel deliberately excluded). esimaccess refs are the live
// package codes; mock mirrors them so the flow works without credentials.
type RegionalInput = {
  slug: string;
  title: string;
  region: "GCC" | "Gulf";
  code: string;
  dataMb: number;
  days: number;
  daily: boolean;
  fup: boolean;
  cost: number;
  retail: number;
};

const REGION_COUNTRIES: Record<RegionalInput["region"], string[]> = {
  GCC: ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Bahrain", "Oman"],
  Gulf: ["Saudi Arabia", "UAE", "Qatar", "Kuwait", "Bahrain", "Iraq"],
};

const regionalInputs: RegionalInput[] = [
  { slug: "gcc-1gb-7-days", title: "GCC 1GB", region: "GCC", code: "PPWBUY807", dataMb: 1024, days: 7, daily: false, fup: false, cost: 302, retail: 649 },
  { slug: "gcc-2gb-per-day-fup-1mbps", title: "GCC 2GB/day", region: "GCC", code: "PMRXJQDH7", dataMb: 2048, days: 1, daily: true, fup: true, cost: 583, retail: 1199 },
  { slug: "gcc-3gb-30-days", title: "GCC 3GB", region: "GCC", code: "P1CYRUDIH", dataMb: 3072, days: 30, daily: false, fup: false, cost: 875, retail: 1749 },
  { slug: "gcc-5gb-30-days", title: "GCC 5GB", region: "GCC", code: "POQV6OEH1", dataMb: 5120, days: 30, daily: false, fup: false, cost: 1372, retail: 2749 },
  { slug: "gcc-10gb-30-days", title: "GCC 10GB", region: "GCC", code: "PDMPCRCNJ", dataMb: 10240, days: 30, daily: false, fup: false, cost: 2504, retail: 5049 },
  { slug: "gulf-500mb-per-day", title: "Gulf 500MB/day", region: "Gulf", code: "PW9U86NGE", dataMb: 512, days: 1, daily: true, fup: false, cost: 136, retail: 299 },
  { slug: "gulf-1gb-7-days", title: "Gulf 1GB", region: "Gulf", code: "PTJX062PT", dataMb: 1024, days: 7, daily: false, fup: false, cost: 174, retail: 349 },
  { slug: "gulf-1gb-per-day", title: "Gulf 1GB/day", region: "Gulf", code: "P40YDJ9WA", dataMb: 1024, days: 1, daily: true, fup: false, cost: 220, retail: 449 },
  { slug: "gulf-3gb-30-days", title: "Gulf 3GB", region: "Gulf", code: "P8D7Q1CZY", dataMb: 3072, days: 30, daily: false, fup: false, cost: 515, retail: 1049 },
  { slug: "gulf-5gb-30-days", title: "Gulf 5GB", region: "Gulf", code: "PK2BXX9B4", dataMb: 5120, days: 30, daily: false, fup: false, cost: 818, retail: 1649 },
  { slug: "gulf-5gb-per-day", title: "Gulf 5GB/day", region: "Gulf", code: "PLK713DWL", dataMb: 5120, days: 1, daily: true, fup: false, cost: 818, retail: 1649 },
  { slug: "gulf-10gb-30-days", title: "Gulf 10GB", region: "Gulf", code: "P9DH2MUN5", dataMb: 10240, days: 30, daily: false, fup: false, cost: 1666, retail: 3349 },
  { slug: "gulf-10gb-per-day", title: "Gulf 10GB/day", region: "Gulf", code: "PLR26GSE7", dataMb: 10240, days: 1, daily: true, fup: false, cost: 1666, retail: 3349 },
];

const regionalSeed: PlanRecord[] = regionalInputs.map((p, i) => {
  const countries = REGION_COUNTRIES[p.region];
  const dataLabel = p.daily
    ? `${p.dataMb >= 1024 ? `${Math.round(p.dataMb / 1024)}GB` : `${p.dataMb}MB`} per day`
    : `${Math.round(p.dataMb / 1024)}GB total`;
  return {
    id: `00000000-0000-4000-8001-${String(i + 1).padStart(12, "0")}`,
    slug: p.slug,
    title: p.title,
    subtitle: "Covers 6 Gulf countries incl. Saudi Arabia",
    country: p.region,
    dataAmountMb: p.dataMb,
    validityDays: p.days,
    network: "Roaming across the Gulf (4G/5G)",
    description: `${p.title} multi-country data eSIM covering ${countries.join(", ")}. ${p.fup ? "High-speed allowance then 1Mbps fair-use. " : ""}Data-only eSIM; no phone number.`,
    featureList: [
      `Works in ${countries.join(", ")}`,
      dataLabel,
      `${p.days} day${p.days === 1 ? "" : "s"} validity`,
      "Data-only eSIM, no phone number",
    ],
    costPence: p.cost,
    markupType: "none",
    markupValue: null,
    retailPricePence: p.retail,
    providerRefs: {
      mock: p.code,
      airalo: `TODO_AIRALO_${p.code}`,
      maya: `TODO_MAYA_${p.code}`,
      esimaccess: p.code,
    },
    badge: null,
    active: true,
    sortOrder: 200 + i,
    createdAt: now,
    updatedAt: now,
  };
});

export const seedPlans: PlanRecord[] = [...saudiSeed, ...regionalSeed];

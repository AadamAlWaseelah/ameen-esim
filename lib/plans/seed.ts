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
    costPence: 71,
    retailPricePence: 150,
    fairUse: "500MB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-1gb-per-day",
    title: "Saudi 1GB/day",
    subtitle: "Daily plan for light browsing",
    dataAmountMb: 1024,
    validityDays: 1,
    csvSlug: "SA_1_Daily",
    costPence: 122,
    retailPricePence: 250,
    fairUse: "1GB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-1gb-per-day-fup-1mbps",
    title: "Saudi 1GB/day FUP 1Mbps",
    subtitle: "Daily fair-use plan",
    dataAmountMb: 1024,
    validityDays: 1,
    csvSlug: "SA_1_Daily_1Mbps",
    costPence: 136,
    retailPricePence: 250,
    fairUse: "1GB daily high-speed allowance, then throttled to 1Mbps under fair use.",
  },
  {
    slug: "saudi-1gb-7-days",
    title: "Saudi 1GB",
    subtitle: "Light data for short stays",
    dataAmountMb: 1024,
    validityDays: 7,
    csvSlug: "SA_1_7",
    costPence: 122,
    retailPricePence: 250,
  },
  {
    slug: "saudi-2gb-per-day",
    title: "Saudi 2GB/day",
    subtitle: "Daily plan for regular use",
    dataAmountMb: 2048,
    validityDays: 1,
    csvSlug: "SA_2_Daily",
    costPence: 217,
    retailPricePence: 450,
    fairUse: "2GB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-2gb-per-day-fup-1mbps",
    title: "Saudi 2GB/day FUP 1Mbps",
    subtitle: "Daily fair-use plan",
    dataAmountMb: 2048,
    validityDays: 1,
    csvSlug: "SA_2_Daily_1Mbps",
    costPence: 250,
    retailPricePence: 500,
    fairUse: "2GB daily high-speed allowance, then throttled to 1Mbps under fair use.",
  },
  {
    slug: "saudi-3gb-per-day-fup-1mbps",
    title: "Saudi 3GB/day FUP 1Mbps",
    subtitle: "Higher daily fair-use plan",
    dataAmountMb: 3072,
    validityDays: 1,
    csvSlug: "SA_3_Daily_1Mbps",
    costPence: 365,
    retailPricePence: 750,
    fairUse: "3GB daily high-speed allowance, then throttled to 1Mbps under fair use.",
  },
  {
    slug: "saudi-3gb-15-days",
    title: "Saudi 3GB",
    subtitle: "Balanced short Umrah plan",
    dataAmountMb: 3072,
    validityDays: 15,
    csvSlug: "SA_3_15",
    costPence: 325,
    retailPricePence: 650,
    badge: "Good short trip",
  },
  {
    slug: "saudi-3gb-30-days",
    title: "Saudi 3GB",
    subtitle: "Low-use monthly plan",
    dataAmountMb: 3072,
    validityDays: 30,
    csvSlug: "SA_3_30",
    costPence: 346,
    retailPricePence: 700,
  },
  {
    slug: "saudi-5gb-30-days",
    title: "Saudi 5GB",
    subtitle: "Balanced monthly plan",
    dataAmountMb: 5120,
    validityDays: 30,
    csvSlug: "SA_5_30",
    costPence: 542,
    retailPricePence: 1100,
    badge: "Popular placeholder",
  },
  {
    slug: "saudi-10gb-per-day",
    title: "Saudi 10GB/day",
    subtitle: "High daily allowance",
    dataAmountMb: 10240,
    validityDays: 1,
    csvSlug: "SA_10_Daily",
    costPence: 806,
    retailPricePence: 1600,
    fairUse: "10GB daily high-speed allowance, then provider fair-use controls may apply.",
  },
  {
    slug: "saudi-10gb-30-days",
    title: "Saudi 10GB",
    subtitle: "Longer trips and heavier use",
    dataAmountMb: 10240,
    validityDays: 30,
    csvSlug: "SA_10_30",
    costPence: 862,
    retailPricePence: 1700,
    badge: "Best value placeholder",
  },
  {
    slug: "saudi-20gb-30-days",
    title: "Saudi 20GB",
    subtitle: "For sharing, maps and frequent browsing",
    dataAmountMb: 20480,
    validityDays: 30,
    csvSlug: "SA_20_30",
    costPence: 1462,
    retailPricePence: 2900,
  },
  {
    slug: "saudi-50gb-30-days",
    title: "Saudi 50GB",
    subtitle: "Large monthly allowance",
    dataAmountMb: 51200,
    validityDays: 30,
    csvSlug: "SA_50_30",
    costPence: 4492,
    retailPricePence: 9000,
  },
];

export const seedPlans: PlanRecord[] = csvPlans.map((plan, index) => ({
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

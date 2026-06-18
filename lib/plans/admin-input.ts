import type { NewPlanRecord } from "./types";

export function planInputFromJson(value: unknown): NewPlanRecord {
  const raw = value as Record<string, unknown>;
  const providerRefs = (raw.providerRefs ?? {}) as Record<string, string>;

  return {
    slug: String(raw.slug ?? "").trim(),
    title: String(raw.title ?? "").trim(),
    subtitle: stringOrNull(raw.subtitle),
    country: String(raw.country ?? "SA").trim() || "SA",
    dataAmountMb: numberOrNull(raw.dataAmountMb),
    validityDays: Number(raw.validityDays ?? 0),
    network: stringOrNull(raw.network),
    description: String(raw.description ?? "").trim(),
    featureList: Array.isArray(raw.featureList)
      ? raw.featureList.map(String).filter(Boolean)
      : String(raw.featureList ?? "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
    costPence: numberOrNull(raw.costPence),
    markupType:
      raw.markupType === "percent" || raw.markupType === "fixed"
        ? raw.markupType
        : "none",
    markupValue: numberOrNull(raw.markupValue),
    retailPricePence: numberOrNull(raw.retailPricePence),
    providerRefs,
    badge: stringOrNull(raw.badge),
    active: Boolean(raw.active),
    sortOrder: Number(raw.sortOrder ?? 999),
  };
}

function stringOrNull(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function numberOrNull(value: unknown): number | null {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

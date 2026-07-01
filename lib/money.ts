export function formatMoney(pence: number | null | undefined): string {
  if (pence == null) return "PRICE TBD";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
  }).format(pence / 100);
}

// Source pricing for plans priced from a USD supplier (e.g. eSIM Access).
// Stored alongside the plan so the admin can show the full conversion trail:
// USD cost + variant → exchange rate → converted GBP → rounded retail.
export type PlanPricing = {
  costUsdCents: number; // eSIM Access wholesale price, in USD cents
  variantUsdCents: number; // eSIM Access variant (retail reference), in USD cents
  fxRate: number; // USD→GBP rate used for the conversion
};

// House FX rate for converting USD supplier prices to GBP. Deliberately a
// single, transparent constant (not a live feed) so pricing is reproducible;
// bump it here if the rate moves materially.
export const USD_TO_GBP = 0.79;

// USD cents → GBP pence at the given rate. (USD cents × rate = GBP pence.)
export function usdCentsToPence(usdCents: number, fxRate = USD_TO_GBP): number {
  return Math.round(usdCents * fxRate);
}

// Round a price up to the next "charm" value ending in 49 or 99 pence, matching
// the house pricing style (£1.49, £2.99 …). Always rounds up to protect margin.
export function charmRoundPence(pence: number): number {
  return Math.ceil((pence + 1) / 50) * 50 - 1;
}

export function formatUsdCents(usdCents: number | null | undefined): string {
  if (usdCents == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(usdCents / 100);
}

export function formatDataAmount(dataAmountMb: number | null): string {
  if (dataAmountMb == null) return "Unlimited*";
  if (dataAmountMb >= 1024) {
    const gb = dataAmountMb / 1024;
    return `${Number.isInteger(gb) ? gb : gb.toFixed(1)}GB`;
  }
  return `${dataAmountMb}MB`;
}

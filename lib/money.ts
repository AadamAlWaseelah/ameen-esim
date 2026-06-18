export function formatMoney(pence: number | null | undefined): string {
  if (pence == null) return "PRICE TBD";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
  }).format(pence / 100);
}

export function formatDataAmount(dataAmountMb: number | null): string {
  if (dataAmountMb == null) return "Unlimited*";
  if (dataAmountMb >= 1024) {
    const gb = dataAmountMb / 1024;
    return `${Number.isInteger(gb) ? gb : gb.toFixed(1)}GB`;
  }
  return `${dataAmountMb}MB`;
}

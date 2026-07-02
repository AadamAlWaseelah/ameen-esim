// Country code → display name. Single source of truth for the international
// plans selector and the flag tag shown on plan cards. The flag artwork comes
// from the flag-icons package keyed on `code` (see components/ui/flag.tsx), so
// adding a country is just a new row here — no image to add.
export type Continent = "Europe" | "America" | "Africa" | "Asia" | "Oceania";

export type FlagCountry = {
  code: string;
  name: string;
  continent: Continent;
};

export const CONTINENTS: Continent[] = [
  "Europe",
  "America",
  "Africa",
  "Asia",
  "Oceania",
];

// Countries pinned to the featured row of the international section.
export const FEATURED_INTL_CODES = ["GB", "FR", "ES", "US", "NL", "BD", "PK"];

export const INTL_COUNTRIES: FlagCountry[] = [
  // Europe
  { code: "GB", name: "United Kingdom", continent: "Europe" },
  { code: "FR", name: "France", continent: "Europe" },
  { code: "ES", name: "Spain", continent: "Europe" },
  { code: "NL", name: "Netherlands", continent: "Europe" },
  { code: "AL", name: "Albania", continent: "Europe" },
  { code: "PT", name: "Portugal", continent: "Europe" },
  { code: "TR", name: "Türkiye", continent: "Europe" },
  // America
  { code: "US", name: "United States", continent: "America" },
  { code: "BR", name: "Brazil", continent: "America" },
  // Asia
  { code: "PK", name: "Pakistan", continent: "Asia" },
  { code: "BD", name: "Bangladesh", continent: "Asia" },
  { code: "AF", name: "Afghanistan", continent: "Asia" },
  { code: "AE", name: "United Arab Emirates", continent: "Asia" },
  // Africa — curated to the most-visited / highest-diaspora destinations.
  { code: "DZ", name: "Algeria", continent: "Africa" },
  { code: "BW", name: "Botswana", continent: "Africa" },
  { code: "EG", name: "Egypt", continent: "Africa" },
  { code: "GM", name: "Gambia", continent: "Africa" },
  { code: "GH", name: "Ghana", continent: "Africa" },
  { code: "KE", name: "Kenya", continent: "Africa" },
  { code: "MU", name: "Mauritius", continent: "Africa" },
  { code: "MA", name: "Morocco", continent: "Africa" },
  { code: "NG", name: "Nigeria", continent: "Africa" },
  { code: "RW", name: "Rwanda", continent: "Africa" },
  { code: "SN", name: "Senegal", continent: "Africa" },
  { code: "ZA", name: "South Africa", continent: "Africa" },
  { code: "TZ", name: "Tanzania", continent: "Africa" },
  { code: "TN", name: "Tunisia", continent: "Africa" },
  { code: "UG", name: "Uganda", continent: "Africa" },
  { code: "ZM", name: "Zambia", continent: "Africa" },
];

const FLAG_BY_CODE: Record<string, FlagCountry> = Object.fromEntries(
  INTL_COUNTRIES.map((c) => [c.code, c]),
);

export function flagForCountry(code: string): FlagCountry | null {
  return FLAG_BY_CODE[code] ?? null;
}

export function countryName(code: string): string {
  return FLAG_BY_CODE[code]?.name ?? code;
}

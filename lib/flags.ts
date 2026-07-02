// Country code → display name + mini flag asset. Single source of truth for the
// international plans selector and the flag tag shown on plan cards. Add a
// country here (and drop its flag in public/brand) to surface it everywhere.
export type Continent = "Europe" | "America" | "Africa" | "Asia" | "Oceania";

export type FlagCountry = {
  code: string;
  name: string;
  flag: string;
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
  { code: "GB", name: "United Kingdom", flag: "/brand/flag-gb.svg", continent: "Europe" },
  { code: "FR", name: "France", flag: "/brand/flag-fr.svg", continent: "Europe" },
  { code: "ES", name: "Spain", flag: "/brand/flag-es.svg", continent: "Europe" },
  { code: "US", name: "United States", flag: "/brand/flag-us.svg", continent: "America" },
  { code: "NL", name: "Netherlands", flag: "/brand/flag-nl.svg", continent: "Europe" },
  { code: "PK", name: "Pakistan", flag: "/brand/flag-pk.svg", continent: "Asia" },
  { code: "BD", name: "Bangladesh", flag: "/brand/flag-bd.svg", continent: "Asia" },
  { code: "AF", name: "Afghanistan", flag: "/brand/flag-af.svg", continent: "Asia" },
  { code: "AL", name: "Albania", flag: "/brand/flag-al.svg", continent: "Europe" },
  { code: "DZ", name: "Algeria", flag: "/brand/flag-dz.svg", continent: "Africa" },
  { code: "BR", name: "Brazil", flag: "/brand/flag-br.svg", continent: "America" },
  { code: "PT", name: "Portugal", flag: "/brand/flag-pt.svg", continent: "Europe" },
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

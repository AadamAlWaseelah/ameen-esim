// Country code → display name + mini flag asset. Single source of truth for the
// international plans selector and the flag tag shown on plan cards. Add a
// country here (and drop its flag in public/brand) to surface it everywhere.
export type FlagCountry = {
  code: string;
  name: string;
  flag: string;
};

export const INTL_COUNTRIES: FlagCountry[] = [
  { code: "GB", name: "United Kingdom", flag: "/brand/flag-gb.svg" },
  { code: "FR", name: "France", flag: "/brand/flag-fr.svg" },
  { code: "ES", name: "Spain", flag: "/brand/flag-es.svg" },
  { code: "US", name: "United States", flag: "/brand/flag-us.svg" },
  { code: "NL", name: "Netherlands", flag: "/brand/flag-nl.svg" },
  { code: "PK", name: "Pakistan", flag: "/brand/flag-pk.svg" },
  { code: "BD", name: "Bangladesh", flag: "/brand/flag-bd.svg" },
  { code: "AF", name: "Afghanistan", flag: "/brand/flag-af.svg" },
  { code: "AL", name: "Albania", flag: "/brand/flag-al.svg" },
  { code: "DZ", name: "Algeria", flag: "/brand/flag-dz.svg" },
  { code: "BR", name: "Brazil", flag: "/brand/flag-br.svg" },
  { code: "PT", name: "Portugal", flag: "/brand/flag-pt.svg" },
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

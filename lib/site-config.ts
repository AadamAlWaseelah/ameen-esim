/*
  Single source of truth for company + contact details used across the
  marketing, legal and content pages. Update here, not in each page.
*/
export const SITE = {
  brand: "Ameen eSIM",
  legalName: "Al-Waseelah Tours Ltd",
  companyNumber: "16268888",
  address: "65 Berkeley Road, Yardley, Birmingham, West Midlands, B25 8NW",
  supportEmail: "alwaseelahtours@gmail.com",
  // TODO(ameen): replace with the real ICO registration reference.
  icoNumber: "{{ICO_NUMBER}}",
  country: "England & Wales",
  governingLaw: "England and Wales",
} as const;

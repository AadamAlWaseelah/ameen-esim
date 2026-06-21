/**
 * eSIM-compatible device list.
 *
 * Source: Ubigi published device-compatibility list (a representative wholesale
 * eSIM provider). This is factual compatibility data used to power the device
 * checker at /compatibility. It is a guide, not a guarantee — eSIM support can
 * still depend on the phone being carrier-unlocked and on the regional model
 * variant (e.g. some mainland-China and certain Hong Kong variants ship without
 * eSIM). Users should always confirm in their phone's settings.
 *
 * TODO(ameen): re-verify against the chosen provider's own list once a supplier
 * is selected (Airalo / Maya / eSIM Access), and refresh as new models launch.
 */

export type DeviceBrand = {
  brand: string;
  devices: string[];
};

export const ESIM_COMPATIBLE_DEVICES: DeviceBrand[] = [
  {
    brand: "Apple iPhone",
    devices: [
      "iPhone 17",
      "iPhone 17 Pro",
      "iPhone 17 Pro Max",
      "iPhone 17e",
      "iPhone 16",
      "iPhone 16 Plus",
      "iPhone 16 Pro",
      "iPhone 16 Pro Max",
      "iPhone 16e",
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max",
      "iPhone 14",
      "iPhone 14 Plus",
      "iPhone 14 Pro",
      "iPhone 14 Pro Max",
      "iPhone 13",
      "iPhone 13 mini",
      "iPhone 13 Pro",
      "iPhone 13 Pro Max",
      "iPhone 12",
      "iPhone 12 mini",
      "iPhone 12 Pro",
      "iPhone 12 Pro Max",
      "iPhone 11",
      "iPhone 11 Pro",
      "iPhone 11 Pro Max",
      "iPhone SE (3rd gen, 2022)",
      "iPhone SE (2nd gen, 2020)",
      "iPhone XR",
      "iPhone XS",
      "iPhone XS Max",
    ],
  },
  {
    brand: "Apple iPad",
    devices: [
      "iPad Pro 12.9\"",
      "iPad Pro 11\"",
      "iPad (7th gen or later)",
      "iPad mini (5th gen or later)",
      "iPad Air (3rd gen or later)",
    ],
  },
  {
    brand: "Samsung Galaxy",
    devices: [
      "Galaxy S25",
      "Galaxy S25 Edge",
      "Galaxy S25 Ultra",
      "Galaxy S24",
      "Galaxy S24 FE",
      "Galaxy S24 Ultra",
      "Galaxy S23",
      "Galaxy S23 FE",
      "Galaxy S23 Ultra",
      "Galaxy S22",
      "Galaxy S22 Ultra",
      "Galaxy S21 5G",
      "Galaxy S21 Ultra 5G",
      "Galaxy Note20",
      "Galaxy Note20 Ultra",
      "Galaxy S20",
      "Galaxy S20 Ultra",
      "Galaxy A56",
      "Galaxy A55",
      "Galaxy A54 5G",
      "Galaxy A36",
      "Galaxy A35",
      "Galaxy Z Flip7",
      "Galaxy Z Fold7",
      "Galaxy Z Flip6",
      "Galaxy Z Fold6",
      "Galaxy Z Flip5",
      "Galaxy Z Fold5",
      "Galaxy Z Flip4",
      "Galaxy Z Fold4",
      "Galaxy Z Flip3 5G",
      "Galaxy Z Fold3 5G",
      "Galaxy Z Fold2",
      "Galaxy Z Flip",
      "Galaxy Tab S10 FE",
      "Galaxy Tab S10 Ultra",
      "Galaxy Tab S9",
      "Galaxy Tab S9 FE",
      "Galaxy Tab S9 Ultra",
    ],
  },
  {
    brand: "Google Pixel",
    devices: [
      "Pixel 10",
      "Pixel 10 Pro",
      "Pixel 10 Pro Fold",
      "Pixel 10 Pro XL",
      "Pixel 9",
      "Pixel 9 Pro",
      "Pixel 9 Pro Fold",
      "Pixel 9 Pro XL",
      "Pixel 9a",
      "Pixel 8",
      "Pixel 8 Pro",
      "Pixel 8a",
      "Pixel 7",
      "Pixel 7 Pro",
      "Pixel 7a",
      "Pixel 6",
      "Pixel 6 Pro",
      "Pixel 6a",
      "Pixel 5",
      "Pixel 5a",
      "Pixel 4",
      "Pixel 4 XL",
      "Pixel 4a",
      "Pixel Fold",
    ],
  },
  {
    brand: "Xiaomi",
    devices: [
      "Xiaomi 15",
      "Xiaomi 15 Pro",
      "Xiaomi 15 Ultra",
      "Xiaomi 15T Pro",
      "Xiaomi 14",
      "Xiaomi 14 Pro",
      "Xiaomi 14T",
      "Xiaomi 14T Pro",
      "Redmi Note 14 Pro+",
      "Xiaomi 13",
      "Xiaomi 13 Lite",
      "Xiaomi 13 Pro",
      "Xiaomi 13T",
      "Xiaomi 13T Pro",
      "Redmi Note 13 Pro+",
      "Xiaomi 12T Pro",
    ],
  },
  {
    brand: "Oppo",
    devices: [
      "Find X9",
      "Find X9 Pro",
      "Find X8",
      "Find X8 Pro",
      "Reno13",
      "Reno13 Pro",
      "Find X5",
      "Find X5 Pro",
      "Find N3",
      "Find N3 Flip",
      "Find N2 Flip",
      "Reno6 Pro 5G",
      "Reno 9A",
      "Reno 5A",
      "A55s 5G",
      "Find X3",
      "Find X3 Pro",
    ],
  },
  {
    brand: "OnePlus",
    devices: [
      "OnePlus 15",
      "OnePlus 13",
      "OnePlus 13R",
      "OnePlus 13T",
      "OnePlus 12 5G",
      "OnePlus 12R",
      "OnePlus 11 5G",
      "OnePlus Open 2",
      "OnePlus Open",
    ],
  },
  {
    brand: "HONOR",
    devices: [
      "Magic7",
      "Magic7 Pro",
      "Magic7 Lite",
      "Magic6 Pro",
      "Magic5 Pro",
      "Magic4 Pro",
      "Magic V3",
      "Magic V2",
      "HONOR 200",
      "HONOR 200 Pro",
      "HONOR 90",
      "HONOR 400 Lite",
    ],
  },
  {
    brand: "Huawei",
    devices: ["Pura 70 Pro", "Mate 40 Pro", "P40", "P40 Pro"],
  },
  {
    brand: "Motorola",
    devices: [
      "Razr Ultra 2025",
      "Razr 60",
      "Razr 60 Ultra",
      "Edge 60",
      "Edge 60 Fusion",
      "Edge 60 Pro",
      "Moto G (2025)",
      "Moto G Power (2025)",
      "Razr 50 Ultra",
      "Edge 50",
      "Edge 50 Fusion",
      "Edge 50 Neo",
      "Edge 50 Pro",
      "Edge 50 Ultra",
      "Razr 40",
      "Razr 40 Ultra",
      "Edge 40 Neo",
      "Edge 40 Pro",
      "Razr 5G",
    ],
  },
  {
    brand: "Sony Xperia",
    devices: [
      "Xperia 1 VI",
      "Xperia 1 V",
      "Xperia 1 IV",
      "Xperia 5 V",
      "Xperia 5 IV",
      "Xperia 10 VI",
      "Xperia 10 V",
      "Xperia 10 IV",
      "Xperia 10 III Lite",
      "Xperia Ace III",
    ],
  },
  {
    brand: "Vivo",
    devices: [
      "Vivo X200",
      "Vivo X200 Pro",
      "Vivo X100 Pro",
      "Vivo X90 Pro",
      "Vivo X80 Pro",
      "Vivo V40",
      "Vivo V29",
    ],
  },
  {
    brand: "Asus",
    devices: ["Zenfone 12 Ultra", "ROG Phone 9", "ROG Phone 9 Pro"],
  },
  {
    brand: "Nokia",
    devices: ["Nokia G60 5G", "Nokia X30 5G", "Nokia XR21"],
  },
  {
    brand: "TCL",
    devices: ["TCL 60", "TCL 50 5G", "TCL 50 NxtPaper", "TCL 50 Pro NxtPaper", "TCL 40 XL"],
  },
  {
    brand: "Fairphone",
    devices: ["Fairphone 6", "Fairphone 5", "Fairphone 4"],
  },
  {
    brand: "Microsoft Surface",
    devices: [
      "Surface Duo",
      "Surface Pro 9",
      "Surface Pro 8",
      "Surface Pro 7+",
      "Surface Go 2",
      "Surface Pro X",
    ],
  },
];

/** Normalise a model string for fuzzy matching (case/space/punctuation-insensitive). */
export function normaliseDevice(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ") // drop parenthetical notes
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export type DeviceMatch = { brand: string; device: string };

const FLAT_INDEX: DeviceMatch[] = ESIM_COMPATIBLE_DEVICES.flatMap((group) =>
  group.devices.map((device) => ({ brand: group.brand, device }))
);

/**
 * Search compatible devices. Returns up to `limit` matches whose normalised
 * model contains every whitespace-separated token of the query.
 */
export function searchCompatibleDevices(query: string, limit = 12): DeviceMatch[] {
  const tokens = normaliseDevice(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];

  return FLAT_INDEX.filter((entry) => {
    const haystack = normaliseDevice(`${entry.brand} ${entry.device}`);
    return tokens.every((token) => haystack.includes(token));
  }).slice(0, limit);
}

export const TOTAL_COMPATIBLE_DEVICES = FLAT_INDEX.length;

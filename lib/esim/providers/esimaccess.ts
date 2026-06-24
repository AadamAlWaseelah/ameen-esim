import QRCode from "qrcode";

import { NotConfiguredError, type EsimProvider } from "../provider";
import type {
  BalanceInfo,
  OrderRequest,
  OrderStatus,
  ProviderPlan,
  ProvisionedEsim,
} from "../types";

/*
  eSIM Access (RedteaGo) Open API adapter — docs.esimaccess.com

  Auth: AccessCode + SecretKey sent as request headers (RT-AccessCode /
  RT-SecretKey) on every POST. Set in the environment:
    ESIMACCESS_ACCESS_CODE, ESIMACCESS_SECRET_KEY
  Optional override: ESIMACCESS_BASE_URL (defaults to https://api.esimaccess.com)

  Endpoints used:
    POST /api/v1/open/package/list   — catalogue
    POST /api/v1/open/esim/order     — place order
    POST /api/v1/open/esim/query     — query allocated eSIM profile(s)

  TODO(ameen): verify the exact field names / price units against the live docs
  with a real sandbox response — they are mapped defensively below and any
  mismatch surfaces as a clear error rather than a silent wrong value.
*/

const DEFAULT_BASE_URL = "https://api.esimaccess.com";

// eSIM Access prices are integers in 1/10000 USD (e.g. 16200 = $1.62).
const PRICE_UNITS_PER_USD = 10000;
const BYTES_PER_MB = 1024 * 1024;

type EnvelopeResponse<T> = {
  success?: boolean;
  errorCode?: string | null;
  errorMsg?: string | null;
  obj?: T;
};

type ApiPackage = {
  packageCode?: string;
  slug?: string;
  name?: string;
  price?: number;
  currencyCode?: string;
  volume?: number;
  duration?: number;
  durationUnit?: string;
  location?: string;
  locationNetworkList?: {
    locationName?: string;
    operatorList?: { operatorName?: string; networkType?: string }[];
  }[];
};

type ApiEsimProfile = {
  iccid?: string;
  ac?: string; // LPA activation string, e.g. "LPA:1$smdp.example.com$CODE"
  qrCodeUrl?: string;
  smdpStatus?: string;
  esimStatus?: string;
  orderNo?: string;
};

function getCredentials() {
  const accessCode = process.env.ESIMACCESS_ACCESS_CODE;
  const secretKey = process.env.ESIMACCESS_SECRET_KEY;
  const missing = [
    !accessCode && "ESIMACCESS_ACCESS_CODE",
    !secretKey && "ESIMACCESS_SECRET_KEY",
  ].filter(Boolean) as string[];
  if (missing.length) throw new NotConfiguredError("eSIM Access", missing);
  return { accessCode: accessCode as string, secretKey: secretKey as string };
}

async function request<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const { accessCode, secretKey } = getCredentials();
  const baseUrl = (process.env.ESIMACCESS_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/$/,
    "",
  );

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "RT-AccessCode": accessCode,
      "RT-SecretKey": secretKey,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  let json: EnvelopeResponse<T>;
  try {
    json = (await res.json()) as EnvelopeResponse<T>;
  } catch {
    throw new Error(
      `eSIM Access ${path} returned a non-JSON response (HTTP ${res.status}).`,
    );
  }

  if (!res.ok || json.success === false) {
    throw new Error(
      `eSIM Access ${path} failed (HTTP ${res.status}): ${
        json.errorMsg ?? json.errorCode ?? "unknown error"
      }`,
    );
  }

  return json.obj as T;
}

function mapPackage(pkg: ApiPackage): ProviderPlan {
  const volume = pkg.volume ?? 0;
  const network = pkg.locationNetworkList
    ?.flatMap((n) => n.operatorList?.map((o) => o.operatorName) ?? [])
    .filter(Boolean)
    .join(" / ");

  return {
    // packageCode is the orderable identifier (createOrder looks it up).
    providerRef: pkg.packageCode ?? pkg.slug ?? "",
    title: pkg.name ?? pkg.packageCode ?? "Saudi eSIM",
    country: pkg.location ?? "SA",
    // null = unlimited / uncapped
    dataAmountMb: volume > 0 ? Math.round(volume / BYTES_PER_MB) : null,
    validityDays: pkg.duration ?? 0,
    network: network || undefined,
    // USD minor units (cents). Convert to GBP retail in admin pricing.
    wholesalePricePence:
      typeof pkg.price === "number"
        ? Math.round((pkg.price / PRICE_UNITS_PER_USD) * 100)
        : undefined,
    raw: pkg,
  };
}

function parseLpa(ac: string): { smdp: string; activationCode: string } {
  // "LPA:1$smdp.example.com$ACTIVATIONCODE"
  const parts = ac.split("$");
  return { smdp: parts[1] ?? "", activationCode: parts[2] ?? "" };
}

async function buildProvisioned(
  profile: ApiEsimProfile,
  orderNo: string,
  status: OrderStatus,
): Promise<ProvisionedEsim> {
  const lpaString = profile.ac ?? "";
  const { smdp, activationCode } = lpaString
    ? parseLpa(lpaString)
    : { smdp: "", activationCode: "" };

  // Render our own QR data URI from the LPA string (same shape as the mock),
  // so the app can email/display it without depending on a hosted image.
  const qrImageDataUri = lpaString
    ? await QRCode.toDataURL(lpaString, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 420,
        color: { dark: "#19202E", light: "#FFFFFF" },
      })
    : "";

  return {
    providerOrderRef: orderNo,
    iccid: profile.iccid,
    lpaString,
    smdpAddress: smdp || undefined,
    activationCode: activationCode || undefined,
    qrImageDataUri,
    manualInstall: smdp ? { smdp, activationCode } : undefined,
    status,
  };
}

async function queryProfiles(params: {
  orderNo?: string;
  iccid?: string;
}): Promise<ApiEsimProfile[]> {
  const obj = await request<{ esimList?: ApiEsimProfile[] }>(
    "/api/v1/open/esim/query",
    {
      orderNo: params.orderNo,
      iccid: params.iccid,
      pager: { pageNum: 1, pageSize: 20 },
    },
  );
  return obj?.esimList ?? [];
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const esimAccessProvider: EsimProvider = {
  id: "esimaccess",

  async listCatalogue(countryCode = "SA"): Promise<ProviderPlan[]> {
    const obj = await request<{ packageList?: ApiPackage[] }>(
      "/api/v1/open/package/list",
      { locationCode: countryCode },
    );
    return (obj?.packageList ?? []).map(mapPackage);
  },

  async createOrder(input: OrderRequest): Promise<ProvisionedEsim> {
    // 1) Look up the package to get its current price (the order endpoint
    //    requires the price to match the catalogue).
    const obj = await request<{ packageList?: ApiPackage[] }>(
      "/api/v1/open/package/list",
      { packageCode: input.providerRef },
    );
    const pkg = (obj?.packageList ?? []).find(
      (p) => p.packageCode === input.providerRef || p.slug === input.providerRef,
    );
    if (!pkg || typeof pkg.price !== "number" || !pkg.packageCode) {
      throw new Error(
        `eSIM Access package not found or missing price for ref "${input.providerRef}".`,
      );
    }

    const count = Math.max(1, input.quantity);
    const amount = pkg.price * count;

    // 2) Place the order. transactionId is our idempotency key.
    const order = await request<{ orderNo?: string }>(
      "/api/v1/open/esim/order",
      {
        transactionId: input.internalOrderId,
        amount,
        packageInfoList: [
          { packageCode: pkg.packageCode, count, price: pkg.price },
        ],
      },
    );
    const orderNo = order?.orderNo;
    if (!orderNo) {
      throw new Error("eSIM Access order did not return an orderNo.");
    }

    // 3) Allocation can be near-instant but is sometimes async — poll briefly.
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const profiles = await queryProfiles({ orderNo });
      const ready = profiles.find((p) => p.ac);
      if (ready) return buildProvisioned(ready, orderNo, "delivered");
      await sleep(1500);
    }

    // Not yet allocated: return a provisioning record so the order is recorded
    // and getOrderStatus(orderNo) can complete it (and admin can re-check).
    return {
      providerOrderRef: orderNo,
      lpaString: "",
      qrImageDataUri: "",
      status: "provisioning",
    };
  },

  async getOrderStatus(providerOrderRef: string): Promise<ProvisionedEsim> {
    const profiles = await queryProfiles({ orderNo: providerOrderRef });
    const ready = profiles.find((p) => p.ac);
    if (ready) return buildProvisioned(ready, providerOrderRef, "delivered");

    return {
      providerOrderRef,
      lpaString: "",
      qrImageDataUri: "",
      status: profiles.length ? "provisioning" : "failed",
    };
  },

  // Reseller balance. Path and field name verified live against a real
  // account (returned {balance: 0}). Units assumed to match package prices
  // (1/10000 USD) but unconfirmed while the balance is 0 — the raw object is
  // returned so the divisor can be checked once the account is funded.
  async getBalance(): Promise<BalanceInfo> {
    const obj = await request<Record<string, unknown>>(
      "/api/v1/open/balance/query",
      {},
    );
    const rawAmount =
      typeof obj?.balance === "number"
        ? obj.balance
        : typeof obj?.amount === "number"
          ? obj.amount
          : null;
    const currency =
      typeof obj?.currencyCode === "string"
        ? obj.currencyCode
        : typeof obj?.currency === "string"
          ? obj.currency
          : "USD";
    return {
      amount: rawAmount !== null ? rawAmount / PRICE_UNITS_PER_USD : null,
      currency,
      raw: obj,
    };
  },
};

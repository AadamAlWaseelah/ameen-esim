export type ProviderId = "mock" | "airalo" | "maya" | "esimaccess";

export interface ProviderPlan {
  providerRef: string;
  title: string;
  country: string;
  dataAmountMb: number | null;
  validityDays: number;
  network?: string;
  wholesalePricePence?: number;
  raw?: unknown;
}

export interface OrderRequest {
  internalOrderId: string;
  providerRef: string;
  customerEmail: string;
  quantity: number;
}

export interface ProvisionedEsim {
  providerOrderRef: string;
  iccid?: string;
  lpaString: string;
  smdpAddress?: string;
  activationCode?: string;
  qrImageDataUri: string;
  manualInstall?: { smdp: string; activationCode: string };
  status: OrderStatus;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "provisioning"
  | "delivered"
  | "failed"
  | "refunded";

export interface UsageInfo {
  usedMb: number;
  totalMb: number | null;
  expiresAt?: string;
}

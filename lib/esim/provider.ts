import type {
  BalanceInfo,
  OrderRequest,
  ProviderPlan,
  ProvisionedEsim,
  UsageInfo,
} from "./types";

export interface EsimProvider {
  readonly id: string;
  listCatalogue(countryCode?: string): Promise<ProviderPlan[]>;
  createOrder(input: OrderRequest): Promise<ProvisionedEsim>;
  getOrderStatus(providerOrderRef: string): Promise<ProvisionedEsim>;
  getUsage?(iccid: string): Promise<UsageInfo | null>;
  // Reseller/account balance — used by the /api/esim/health auth sanity check.
  getBalance?(): Promise<BalanceInfo>;
}

export class NotConfiguredError extends Error {
  constructor(provider: string, missing: string[]) {
    super(
      `${provider} eSIM provider is not configured. Missing environment variables: ${missing.join(
        ", "
      )}. Set ESIM_PROVIDER=mock until credentials are available.`
    );
    this.name = "NotConfiguredError";
  }
}

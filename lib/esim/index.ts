import type { EsimProvider } from "./provider";
import type { ProviderId } from "./types";
import { airaloProvider } from "./providers/airalo";
import { esimAccessProvider } from "./providers/esimaccess";
import { mayaProvider } from "./providers/maya";
import { mockProvider } from "./providers/mock";

export function getActiveProviderId(): ProviderId {
  const value = process.env.ESIM_PROVIDER ?? "mock";
  if (
    value === "mock" ||
    value === "airalo" ||
    value === "maya" ||
    value === "esimaccess"
  ) {
    return value;
  }
  return "mock";
}

export function getProvider(): EsimProvider {
  switch (getActiveProviderId()) {
    case "airalo":
      return airaloProvider;
    case "maya":
      return mayaProvider;
    case "esimaccess":
      return esimAccessProvider;
    case "mock":
    default:
      return mockProvider;
  }
}

export type { EsimProvider } from "./provider";
export type {
  OrderRequest,
  OrderStatus,
  ProviderId,
  ProviderPlan,
  ProvisionedEsim,
  UsageInfo,
} from "./types";

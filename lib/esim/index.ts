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

const PROVIDERS: Record<ProviderId, EsimProvider> = {
  mock: mockProvider,
  airalo: airaloProvider,
  maya: mayaProvider,
  esimaccess: esimAccessProvider,
};

/** The default provider from ESIM_PROVIDER (admin catalogue, health check). */
export function getProvider(): EsimProvider {
  return getProviderById(getActiveProviderId());
}

/** Provider for an already-routed order (orders store their providerId). */
export function getProviderById(id: ProviderId): EsimProvider {
  return PROVIDERS[id] ?? mockProvider;
}

/**
 * Per-plan routing order: the default (env) provider first, then every other
 * real provider, so a plan mapped only to e.g. Maya still sells while the
 * default stays eSIM Access. Mock never acts as a fallback — it provisions
 * fake eSIMs, so it only participates when explicitly active.
 */
export function providerPriority(): ProviderId[] {
  const active = getActiveProviderId();
  if (active === "mock") return ["mock"];
  const rest = (["esimaccess", "maya", "airalo"] as ProviderId[]).filter(
    (id) => id !== active
  );
  return [active, ...rest];
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

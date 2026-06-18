import { NotConfiguredError, type EsimProvider } from "../provider";

/*
  TODO(ameen): Airalo adapter checklist
  - Confirm reseller account and OAuth client-credentials flow.
  - Endpoints needed: token, package catalogue, submit order, order/eSIM status.
  - Map Saudi packages under the Red Sand operator, usually Zain.
  - Confirm balance/prefund operational process before live sales.
  - Map Airalo package slug to plans.providerRefs.airalo.
*/

function assertConfigured() {
  const missing = [
    !process.env.AIRALO_CLIENT_ID && "AIRALO_CLIENT_ID",
    !process.env.AIRALO_CLIENT_SECRET && "AIRALO_CLIENT_SECRET",
  ].filter(Boolean) as string[];

  if (missing.length) throw new NotConfiguredError("Airalo", missing);
}

export const airaloProvider: EsimProvider = {
  id: "airalo",
  async listCatalogue() {
    assertConfigured();
    throw new Error("TODO(ameen): Airalo catalogue adapter is not implemented.");
  },
  async createOrder() {
    assertConfigured();
    throw new Error("TODO(ameen): Airalo order adapter is not implemented.");
  },
  async getOrderStatus() {
    assertConfigured();
    throw new Error("TODO(ameen): Airalo status adapter is not implemented.");
  },
};

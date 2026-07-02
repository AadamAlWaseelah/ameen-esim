import { NotConfiguredError, type EsimProvider } from "../provider";

/*
  TODO(ameen): Maya Mobile adapter checklist (chosen for UNLIMITED Saudi
  plans — Maya's FUP is 3GB/day full speed then 10 Mbps, far better than
  Airalo's 1 Mbps; Airalo route dropped 2026-07-02).

  Onboarding (owner):
  1. Apply at api.maya.net/business/esim-reseller (Connect+ API access).
  2. API docs are NDA-gated: request them with the legal company name
     (Al-Waseelah Tours Ltd, England & Wales) and country of incorporation.
  3. Once approved: obtain API credentials from the Connect+ dashboard, fund
     the account, and confirm the Saudi unlimited SKUs + wholesale prices.

  Implementation (once docs/creds are in hand):
  - Confirm auth scheme (API key header vs basic vs OAuth) and base URL,
    then update assertConfigured() with the real env var names.
  - Endpoints needed: plans/catalogue, create eSIM/order, eSIM status + LPA/
    activation details (for QR rendering, mirror esimaccess.ts: render the
    QR data-URI from the LPA string with the `qrcode` package).
  - Check whether order allocation is async like eSIM Access (success:false
    while allocating); if so mirror the `provisioning` + refreshProvisioning
    flow rather than treating it as failure.
  - Confirm Saudi network + exact FUP wording per plan and surface it
    verbatim in the plan description (honesty rule).
  - Map Maya plan ids into plans.providerRefs.maya (admin or a map script);
    per-plan provider routing (lib/esim providerPriority) then sells these
    alongside eSIM Access plans automatically.
*/

function assertConfigured() {
  if (!process.env.MAYA_API_KEY) {
    throw new NotConfiguredError("Maya Mobile", ["MAYA_API_KEY"]);
  }
}

export const mayaProvider: EsimProvider = {
  id: "maya",
  async listCatalogue() {
    assertConfigured();
    throw new Error("TODO(ameen): Maya catalogue adapter is not implemented.");
  },
  async createOrder() {
    assertConfigured();
    throw new Error("TODO(ameen): Maya order adapter is not implemented.");
  },
  async getOrderStatus() {
    assertConfigured();
    throw new Error("TODO(ameen): Maya status adapter is not implemented.");
  },
  async getUsage() {
    assertConfigured();
    throw new Error("TODO(ameen): Maya usage adapter is not implemented.");
  },
};

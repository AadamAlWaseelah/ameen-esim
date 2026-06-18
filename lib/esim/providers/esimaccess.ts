import { NotConfiguredError, type EsimProvider } from "../provider";

/*
  TODO(ameen): eSIM Access adapter checklist
  - Confirm API key and reseller account permissions.
  - Endpoints needed: package catalogue, submit order, order/eSIM status, usage if supported.
  - Confirm Saudi network shown on the package before mapping it to public plans.
  - Confirm response fields for ICCID, SMDP address, activation code and QR asset.
  - Map packageCode/slug to plans.providerRefs.esimaccess.
*/

function assertConfigured() {
  if (!process.env.ESIMACCESS_API_KEY) {
    throw new NotConfiguredError("eSIM Access", ["ESIMACCESS_API_KEY"]);
  }
}

export const esimAccessProvider: EsimProvider = {
  id: "esimaccess",
  async listCatalogue() {
    assertConfigured();
    throw new Error(
      "TODO(ameen): eSIM Access catalogue adapter is not implemented."
    );
  },
  async createOrder() {
    assertConfigured();
    throw new Error(
      "TODO(ameen): eSIM Access order adapter is not implemented."
    );
  },
  async getOrderStatus() {
    assertConfigured();
    throw new Error(
      "TODO(ameen): eSIM Access status adapter is not implemented."
    );
  },
};

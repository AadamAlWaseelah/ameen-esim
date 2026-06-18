import { NotConfiguredError, type EsimProvider } from "../provider";

/*
  TODO(ameen): Maya Mobile adapter checklist
  - Complete reseller onboarding and confirm API key scope.
  - Endpoints needed: plans/catalogue, create eSIM/order, status, usage.
  - Confirm usage-based billing rules and branding options.
  - Confirm Saudi network and fair-use throttling notes for each plan.
  - Map Maya plan/package id to plans.providerRefs.maya.
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

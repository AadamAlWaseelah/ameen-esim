import QRCode from "qrcode";

import type { EsimProvider } from "../provider";
import type { OrderRequest, ProviderPlan, ProvisionedEsim } from "../types";
import { seedPlans } from "@/lib/plans/seed";

const catalogue: ProviderPlan[] = seedPlans.map((plan) => ({
  providerRef: plan.providerRefs.mock,
  title: plan.title,
  country: plan.country,
  dataAmountMb: plan.dataAmountMb,
  validityDays: plan.validityDays,
  network: plan.network ?? undefined,
  wholesalePricePence: plan.costPence ?? undefined,
}));

const orders = new Map<string, ProvisionedEsim>();

function makeActivationCode(): string {
  return `AMEEN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export const mockProvider: EsimProvider = {
  id: "mock",

  async listCatalogue(countryCode = "SA") {
    return catalogue.filter((plan) => plan.country === countryCode);
  },

  async createOrder(input: OrderRequest) {
    const activationCode = makeActivationCode();
    const smdp = "mock-smdp.ameenesim.dev";
    const lpaString = `LPA:1$${smdp}$${activationCode}`;
    const providerOrderRef = `mock-${input.internalOrderId}`;
    const qrImageDataUri = await QRCode.toDataURL(lpaString, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 420,
      color: {
        dark: "#19202E",
        light: "#FFFFFF",
      },
    });

    const esim: ProvisionedEsim = {
      providerOrderRef,
      iccid: `890000${Date.now()}`,
      lpaString,
      smdpAddress: smdp,
      activationCode,
      qrImageDataUri,
      manualInstall: { smdp, activationCode },
      status: "delivered",
    };

    orders.set(providerOrderRef, esim);
    return esim;
  },

  async getOrderStatus(providerOrderRef: string) {
    const order = orders.get(providerOrderRef);
    if (!order) {
      throw new Error(`Mock eSIM order not found: ${providerOrderRef}`);
    }
    return order;
  },

  async getUsage() {
    return null;
  },

  async getBalance() {
    return { amount: 1000, currency: "USD", raw: { mock: true } };
  },
};

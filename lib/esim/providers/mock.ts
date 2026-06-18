import QRCode from "qrcode";

import type { EsimProvider } from "../provider";
import type { OrderRequest, ProviderPlan, ProvisionedEsim } from "../types";

const catalogue: ProviderPlan[] = [
  {
    providerRef: "mock-sa-1gb-7d",
    title: "Saudi Arabia 1GB",
    country: "SA",
    dataAmountMb: 1024,
    validityDays: 7,
    network: "Zain / STC placeholder",
    wholesalePricePence: 250,
  },
  {
    providerRef: "mock-sa-5gb-15d",
    title: "Saudi Arabia 5GB",
    country: "SA",
    dataAmountMb: 5120,
    validityDays: 15,
    network: "Zain / STC placeholder",
    wholesalePricePence: 650,
  },
  {
    providerRef: "mock-sa-10gb-30d",
    title: "Saudi Arabia 10GB",
    country: "SA",
    dataAmountMb: 10240,
    validityDays: 30,
    network: "Zain / STC placeholder",
    wholesalePricePence: 1100,
  },
  {
    providerRef: "mock-sa-20gb-30d",
    title: "Saudi Arabia 20GB",
    country: "SA",
    dataAmountMb: 20480,
    validityDays: 30,
    network: "Zain / STC placeholder",
    wholesalePricePence: 1800,
  },
  {
    providerRef: "mock-sa-unlimited-15d",
    title: "Saudi Arabia Unlimited",
    country: "SA",
    dataAmountMb: null,
    validityDays: 15,
    network: "Zain / STC placeholder",
    wholesalePricePence: 2200,
  },
];

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
};

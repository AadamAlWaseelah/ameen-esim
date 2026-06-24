import { eq } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";
import type { NewOrder, Order } from "@/lib/db/schema";

/*
  Order persistence. Mirrors the plans store: backed by Neon/Drizzle when
  DATABASE_URL is set, and an in-memory list otherwise so the full checkout →
  webhook → provision flow works locally (e.g. with ESIM_PROVIDER=mock and
  Stripe CLI forwarding) without a database.
*/

declare global {
  // eslint-disable-next-line no-var
  var __ameenOrders: Order[] | undefined;
}

function getLocalOrders() {
  globalThis.__ameenOrders ??= [];
  return globalThis.__ameenOrders;
}

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function createOrder(input: NewOrder): Promise<Order> {
  if (hasDatabase()) {
    const [created] = await getDb()
      .insert(schema.orders)
      .values(input)
      .returning();
    return created;
  }

  const now = new Date();
  const order: Order = {
    id: input.id ?? crypto.randomUUID(),
    email: input.email,
    planId: input.planId ?? null,
    planSlug: input.planSlug,
    planTitle: input.planTitle,
    quantity: input.quantity ?? 1,
    amountPence: input.amountPence,
    currency: input.currency ?? "GBP",
    providerId: input.providerId,
    providerRef: input.providerRef,
    stripeSessionId: input.stripeSessionId ?? null,
    stripePaymentIntentId: input.stripePaymentIntentId ?? null,
    providerOrderRef: input.providerOrderRef ?? null,
    iccid: input.iccid ?? null,
    lpaString: input.lpaString ?? null,
    smdpAddress: input.smdpAddress ?? null,
    activationCode: input.activationCode ?? null,
    qrImageDataUri: input.qrImageDataUri ?? null,
    status: input.status ?? "pending",
    errorMessage: input.errorMessage ?? null,
    emailSentAt: input.emailSentAt ?? null,
    createdAt: now,
    updatedAt: now,
  };
  getLocalOrders().push(order);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (hasDatabase()) {
    const [row] = await getDb()
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, id));
    return row ?? null;
  }
  return getLocalOrders().find((o) => o.id === id) ?? null;
}

export async function getOrderByStripeSession(
  sessionId: string,
): Promise<Order | null> {
  if (hasDatabase()) {
    const [row] = await getDb()
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.stripeSessionId, sessionId));
    return row ?? null;
  }
  return getLocalOrders().find((o) => o.stripeSessionId === sessionId) ?? null;
}

export async function updateOrder(
  id: string,
  patch: Partial<NewOrder>,
): Promise<Order | null> {
  if (hasDatabase()) {
    const [updated] = await getDb()
      .update(schema.orders)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    return updated ?? null;
  }

  const orders = getLocalOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...patch, updatedAt: new Date() };
  return orders[index];
}

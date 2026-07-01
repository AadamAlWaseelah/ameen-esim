import { desc, eq } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";
import { getActiveProviderId, type ProviderId } from "@/lib/esim";

import { seedPlans } from "./seed";
import type { NewPlanRecord, PlanRecord } from "./types";

declare global {
  // Shared by Next dev route modules when DATABASE_URL is not configured.
  // eslint-disable-next-line no-var
  var __ameenPlans: PlanRecord[] | undefined;
}

function getLocalPlans() {
  globalThis.__ameenPlans ??= seedPlans.map((plan) => ({ ...plan }));
  return globalThis.__ameenPlans;
}

function setLocalPlans(plans: PlanRecord[]) {
  globalThis.__ameenPlans = plans;
}

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function sortPlans(plans: PlanRecord[]) {
  return [...plans].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPlanProviderRef(
  plan: PlanRecord,
  providerId: ProviderId = getActiveProviderId()
) {
  return plan.providerRefs?.[providerId];
}

export function isMappedForActiveProvider(plan: PlanRecord) {
  return Boolean(getPlanProviderRef(plan));
}

export async function listPlans(options?: { includeInactive?: boolean }) {
  if (hasDatabase()) {
    const rows = await getDb()
      .select()
      .from(schema.plans)
      .orderBy(schema.plans.sortOrder, desc(schema.plans.createdAt));
    return rows.filter((plan) => options?.includeInactive || plan.active);
  }

  return sortPlans(getLocalPlans()).filter(
    (plan) => options?.includeInactive || plan.active
  );
}

export async function listPublicPlans() {
  const plans = await listPlans();
  return plans.filter(isMappedForActiveProvider);
}

export async function getPlanBySlug(slug: string) {
  const plans = await listPlans({ includeInactive: true });
  return plans.find((plan) => plan.slug === slug) ?? null;
}

export async function createPlan(input: NewPlanRecord) {
  const now = new Date();
  const plan: PlanRecord = {
    id: crypto.randomUUID(),
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle ?? null,
    country: input.country ?? "SA",
    dataAmountMb: input.dataAmountMb ?? null,
    validityDays: input.validityDays,
    network: input.network ?? null,
    description: input.description,
    featureList: input.featureList ?? [],
    costPence: input.costPence ?? null,
    markupType: input.markupType ?? "none",
    markupValue: input.markupValue ?? null,
    retailPricePence: input.retailPricePence ?? null,
    pricing: input.pricing ?? null,
    providerRefs: input.providerRefs ?? {},
    badge: input.badge ?? null,
    active: input.active ?? true,
    sortOrder: input.sortOrder ?? 999,
    createdAt: now,
    updatedAt: now,
  };

  if (hasDatabase()) {
    const [created] = await getDb().insert(schema.plans).values(plan).returning();
    return created;
  }

  setLocalPlans(sortPlans([...getLocalPlans(), plan]));
  return plan;
}

export async function updatePlan(id: string, input: Partial<NewPlanRecord>) {
  if (hasDatabase()) {
    const [updated] = await getDb()
      .update(schema.plans)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(schema.plans.id, id))
      .returning();
    return updated ?? null;
  }

  const localPlans = getLocalPlans();
  const index = localPlans.findIndex((plan) => plan.id === id);
  if (index === -1) return null;

  const current = localPlans[index];
  const next: PlanRecord = {
    ...current,
    ...input,
    providerRefs: input.providerRefs ?? current.providerRefs,
    featureList: input.featureList ?? current.featureList,
    updatedAt: new Date(),
  };
  localPlans[index] = next;
  setLocalPlans(sortPlans(localPlans));
  return next;
}

export async function deletePlan(id: string) {
  if (hasDatabase()) {
    const [deleted] = await getDb()
      .delete(schema.plans)
      .where(eq(schema.plans.id, id))
      .returning();
    return Boolean(deleted);
  }

  const localPlans = getLocalPlans();
  const before = localPlans.length;
  const next = localPlans.filter((plan) => plan.id !== id);
  setLocalPlans(next);
  return next.length !== before;
}

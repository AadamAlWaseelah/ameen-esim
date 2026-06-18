import type { NewPlan, Plan } from "@/lib/db/schema";
import type { ProviderId } from "@/lib/esim";

export type PlanRecord = Plan;
export type NewPlanRecord = NewPlan;

export type PlanFormInput = Omit<
  NewPlan,
  "id" | "createdAt" | "updatedAt" | "featureList" | "providerRefs"
> & {
  featureList: string[];
  providerRefs: Partial<Record<ProviderId, string>>;
};

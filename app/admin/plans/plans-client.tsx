"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { RefreshCw, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDataAmount, formatMoney } from "@/lib/money";
import type { ProviderPlan } from "@/lib/esim";
import type { PlanRecord } from "@/lib/plans/types";

type DraftPlan = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  dataAmountMb: string;
  validityDays: string;
  network: string;
  description: string;
  featureList: string;
  retailPricePence: string;
  costPence: string;
  markupType: "none" | "percent" | "fixed";
  markupValue: string;
  badge: string;
  active: boolean;
  sortOrder: string;
  mockRef: string;
  airaloRef: string;
  mayaRef: string;
  esimaccessRef: string;
};

const blankDraft: DraftPlan = {
  slug: "",
  title: "",
  subtitle: "",
  dataAmountMb: "",
  validityDays: "15",
  network: "Zain / STC placeholder",
  description: "",
  featureList: "",
  retailPricePence: "",
  costPence: "",
  markupType: "none",
  markupValue: "",
  badge: "PRICE TBD",
  active: true,
  sortOrder: "999",
  mockRef: "",
  airaloRef: "",
  mayaRef: "",
  esimaccessRef: "",
};

export function AdminPlansClient() {
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPlan>(blankDraft);
  const [catalogue, setCatalogue] = useState<ProviderPlan[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const selected = useMemo(
    () => plans.find((plan) => plan.id === selectedId) ?? null,
    [plans, selectedId]
  );

  useEffect(() => {
    void loadPlans();
  }, []);

  useEffect(() => {
    setDraft(selected ? draftFromPlan(selected) : blankDraft);
  }, [selected]);

  async function loadPlans() {
    setLoading(true);
    const response = await fetch("/api/admin/plans", { cache: "no-store" });
    const data = (await response.json()) as { plans: PlanRecord[] };
    setPlans(data.plans);
    setLoading(false);
  }

  async function pullCatalogue() {
    setMessage("Pulling catalogue...");
    const response = await fetch("/api/admin/plans?catalogue=1");
    const data = (await response.json()) as {
      providerId: string;
      catalogue: ProviderPlan[];
    };
    setCatalogue(data.catalogue);
    setMessage(`Pulled ${data.catalogue.length} ${data.providerId} plans.`);
  }

  async function savePlan(event: FormEvent) {
    event.preventDefault();
    const payload = payloadFromDraft(draft);
    const response = await fetch(
      selectedId ? `/api/admin/plans/${selectedId}` : "/api/admin/plans",
      {
        method: selectedId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setMessage(data.error ?? "Plan save failed.");
      return;
    }

    setMessage(selectedId ? "Plan updated." : "Plan created.");
    await loadPlans();
  }

  async function removePlan() {
    if (!selectedId) return;
    const response = await fetch(`/api/admin/plans/${selectedId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setSelectedId(null);
      setMessage("Plan deleted.");
      await loadPlans();
    }
  }

  return (
    <main className="container py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gold-deep">Phase 1 admin</p>
          <h1 className="mt-2 text-4xl text-navy">Plans</h1>
          <p className="mt-3 max-w-2xl text-slate">
            Basic CRUD and provider reference mapping. This page is intentionally
            unprotected until Clerk lands in Phase 3.
          </p>
        </div>
        <Button onClick={pullCatalogue} variant="outline">
          <RefreshCw className="size-4" aria-hidden />
          Pull catalogue
        </Button>
      </div>

      {message ? (
        <p className="mt-6 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-navy">
          {message}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl border border-line bg-paper p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl text-navy">Current plans</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedId(null)}
            >
              New plan
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {loading ? <p className="text-sm text-slate">Loading...</p> : null}
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedId(plan.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  selectedId === plan.id
                    ? "border-gold bg-gold/10"
                    : "border-line bg-cream/60 hover:border-gold/40"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-medium text-navy">
                      {plan.title}
                    </span>
                    <span className="mt-1 block text-sm text-slate">
                      {formatDataAmount(plan.dataAmountMb)} /{" "}
                      {plan.validityDays} days
                    </span>
                  </span>
                  <span className="tnum text-sm font-medium text-navy">
                    {formatMoney(plan.retailPricePence)}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {catalogue.length ? (
            <div className="mt-6 border-t border-line pt-5">
              <h3 className="font-medium text-navy">Provider catalogue</h3>
              <div className="mt-3 space-y-2">
                {catalogue.map((item) => (
                  <div
                    key={item.providerRef}
                    className="rounded-xl border border-line bg-cream/70 p-3 text-sm"
                  >
                    <p className="font-medium text-navy">{item.title}</p>
                    <p className="text-slate">
                      {item.providerRef} | {formatDataAmount(item.dataAmountMb)} |{" "}
                      {item.validityDays} days
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <form
          onSubmit={savePlan}
          className="rounded-2xl border border-line bg-paper p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl text-navy">
              {selectedId ? "Edit plan" : "Create plan"}
            </h2>
            <div className="flex gap-2">
              {selectedId ? (
                <Button type="button" variant="outline" onClick={removePlan}>
                  <Trash2 className="size-4" aria-hidden />
                  Delete
                </Button>
              ) : null}
              <Button type="submit">
                <Save className="size-4" aria-hidden />
                Save
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
            <Field label="Slug" value={draft.slug} onChange={(slug) => setDraft({ ...draft, slug })} />
            <Field label="Subtitle" value={draft.subtitle} onChange={(subtitle) => setDraft({ ...draft, subtitle })} />
            <Field label="Network" value={draft.network} onChange={(network) => setDraft({ ...draft, network })} />
            <Field label="Data MB (blank = unlimited)" value={draft.dataAmountMb} onChange={(dataAmountMb) => setDraft({ ...draft, dataAmountMb })} />
            <Field label="Validity days" value={draft.validityDays} onChange={(validityDays) => setDraft({ ...draft, validityDays })} />
            <Field label="Retail price pence" value={draft.retailPricePence} onChange={(retailPricePence) => setDraft({ ...draft, retailPricePence })} />
            <Field label="Cost pence" value={draft.costPence} onChange={(costPence) => setDraft({ ...draft, costPence })} />
            <Field label="Markup value" value={draft.markupValue} onChange={(markupValue) => setDraft({ ...draft, markupValue })} />
            <Field label="Badge" value={draft.badge} onChange={(badge) => setDraft({ ...draft, badge })} />
            <Field label="Sort order" value={draft.sortOrder} onChange={(sortOrder) => setDraft({ ...draft, sortOrder })} />
            <label className="flex items-center gap-2 rounded-xl border border-line bg-cream/50 px-3 py-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) =>
                  setDraft({ ...draft, active: event.currentTarget.checked })
                }
              />
              Active
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-navy">Description</span>
            <textarea
              value={draft.description}
              onChange={(event) =>
                setDraft({ ...draft, description: event.currentTarget.value })
              }
              rows={4}
              className="mt-1 w-full rounded-xl border border-line bg-cream/50 p-3 text-sm text-navy"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-navy">
              Feature list (one per line)
            </span>
            <textarea
              value={draft.featureList}
              onChange={(event) =>
                setDraft({ ...draft, featureList: event.currentTarget.value })
              }
              rows={4}
              className="mt-1 w-full rounded-xl border border-line bg-cream/50 p-3 text-sm text-navy"
            />
          </label>

          <div className="mt-6 rounded-2xl border border-line bg-cream/50 p-4">
            <h3 className="font-medium text-navy">Provider refs</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Mock" value={draft.mockRef} onChange={(mockRef) => setDraft({ ...draft, mockRef })} />
              <Field label="Airalo" value={draft.airaloRef} onChange={(airaloRef) => setDraft({ ...draft, airaloRef })} />
              <Field label="Maya" value={draft.mayaRef} onChange={(mayaRef) => setDraft({ ...draft, mayaRef })} />
              <Field label="eSIM Access" value={draft.esimaccessRef} onChange={(esimaccessRef) => setDraft({ ...draft, esimaccessRef })} />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="mt-1 w-full rounded-xl border border-line bg-cream/50 px-3 py-2 text-sm text-navy"
      />
    </label>
  );
}

function draftFromPlan(plan: PlanRecord): DraftPlan {
  return {
    id: plan.id,
    slug: plan.slug,
    title: plan.title,
    subtitle: plan.subtitle ?? "",
    dataAmountMb: plan.dataAmountMb?.toString() ?? "",
    validityDays: plan.validityDays.toString(),
    network: plan.network ?? "",
    description: plan.description,
    featureList: plan.featureList.join("\n"),
    retailPricePence: plan.retailPricePence?.toString() ?? "",
    costPence: plan.costPence?.toString() ?? "",
    markupType: plan.markupType,
    markupValue: plan.markupValue?.toString() ?? "",
    badge: plan.badge ?? "",
    active: plan.active,
    sortOrder: plan.sortOrder.toString(),
    mockRef: plan.providerRefs.mock ?? "",
    airaloRef: plan.providerRefs.airalo ?? "",
    mayaRef: plan.providerRefs.maya ?? "",
    esimaccessRef: plan.providerRefs.esimaccess ?? "",
  };
}

function payloadFromDraft(draft: DraftPlan) {
  return {
    slug: draft.slug,
    title: draft.title,
    subtitle: draft.subtitle,
    country: "SA",
    dataAmountMb: draft.dataAmountMb,
    validityDays: draft.validityDays,
    network: draft.network,
    description: draft.description,
    featureList: draft.featureList,
    retailPricePence: draft.retailPricePence,
    costPence: draft.costPence,
    markupType: draft.markupType,
    markupValue: draft.markupValue,
    badge: draft.badge,
    active: draft.active,
    sortOrder: draft.sortOrder,
    providerRefs: {
      mock: draft.mockRef,
      airalo: draft.airaloRef,
      maya: draft.mayaRef,
      esimaccess: draft.esimaccessRef,
    },
  };
}

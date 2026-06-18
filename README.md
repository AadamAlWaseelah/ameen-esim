# Ameen eSIM

Online store selling Saudi Arabia data eSIMs to Muslim pilgrims (Umrah & Hajj).
A trading name of **Al-Waseelah Tours Ltd**.

> **Core architectural rule:** the eSIM supplier is not yet chosen. The app is
> **provider-agnostic**: Airalo, Maya Mobile, or eSIM Access can be activated
> later by setting the `ESIM_PROVIDER` env var, with no other code changes. A
> built-in **Mock** provider makes the development flow work with zero
> credentials. Nothing outside `lib/esim/` may import a provider SDK.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Neon Postgres,
Drizzle ORM, Clerk (admin auth), Stripe (GBP), Resend and Vercel.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Local development defaults to `ESIM_PROVIDER=mock`. Without `DATABASE_URL`, the
catalogue uses the Phase 1 seeded in-memory fallback. Add `DATABASE_URL`, then
run:

```bash
npm run db:push
npm run db:seed
```

## Phase 1 Routes

- `/plans` - public catalogue, reading active mapped plans.
- `/plans/[slug]` - public plan detail with honest data-only, throttling and
  WhatsApp-calling notes.
- `/admin/plans` - basic unprotected CRUD for Phase 1 only. Clerk protection
  comes in Phase 3.
- `/api/admin/plans?catalogue=1` - pulls `getProvider().listCatalogue()`, which
  works immediately with Mock.

## Design System

- **Colours:** navy ink, gold accent, cream/paper surfaces. Tokens live in
  `app/globals.css` and are mapped in `tailwind.config.ts`.
- **Type:** Fraunces (display) + Hanken Grotesk (body/UI), via `next/font`.
- **Motion:** custom ease-out curves, press feedback, staggered entrances and
  full `prefers-reduced-motion` support.

## Build Phases

- **Phase 0 - Scaffold:** complete.
- **Phase 1 - Catalogue:** provider abstraction + Mock, plans schema + seed,
  `/plans` + `/plans/[slug]`, basic admin Plans CRUD.
- **Phase 2 - Commerce:** Stripe checkout + webhook + provisioning + Resend +
  order lookup.
- **Phase 3 - Admin:** Clerk auth, dashboard, full CRUD, orders, enquiries.
- **Phase 4 - Content & trust:** home, how-it-works, coverage, FAQ, about,
  contact, legal drafts, WhatsApp button, cookie banner, SEO.
- **Phase 5 - Real providers & polish:** fill Airalo/Maya/eSIM Access adapters,
  motion polish, accessibility + Lighthouse audit.

See `PLACEHOLDERS.md` for the outstanding owner punch-list and `DEPLOY.md` for
Neon + Vercel setup.

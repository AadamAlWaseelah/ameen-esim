# Ameen eSIM

Online store selling Saudi Arabia data eSIMs to Muslim pilgrims (Umrah & Hajj).
A trading name of **Al-Waseelah Tours Ltd**.

> **Core architectural rule:** the eSIM supplier is not yet chosen. The app is
> **provider-agnostic** — Airalo, Maya Mobile, or eSIM Access can be activated
> later by setting the `ESIM_PROVIDER` env var, with no other code changes. A
> built-in **Mock** provider makes the whole purchase flow work in development
> with zero credentials. Nothing outside `lib/esim/` may import a provider SDK.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Neon Postgres ·
Drizzle ORM · Clerk (admin auth) · Stripe (GBP) · Resend · Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill what you need; defaults run with mock provider
npm run dev                  # http://localhost:3000
```

The marketing site runs **without a database** in development (the DB client
connects lazily). Add `DATABASE_URL` when you reach the data-backed phases.

## Design system

- **Colours:** navy ink, gold accent, cream/paper surfaces — tokens in
  `app/globals.css`, mapped in `tailwind.config.ts`.
- **Type:** Fraunces (display) + Hanken Grotesk (body/UI), via `next/font`.
- **Motion:** custom ease-out curve, sub-300ms UI, `:active` press feedback,
  staggered entrances, full `prefers-reduced-motion` support.

## Build phases

This repo is built in reviewable phases (see the build brief):

- **Phase 0 — Scaffold** ✅ (this commit): Next.js + Tailwind + shadcn, design
  tokens & fonts, navbar/footer shell, logo, Drizzle connection (local-first).
- **Phase 1 — Catalogue:** provider abstraction + Mock, plans schema + seed,
  `/plans` + `/plans/[slug]`, basic admin Plans CRUD.
- **Phase 2 — Commerce:** Stripe checkout + webhook + provisioning + Resend +
  order lookup.
- **Phase 3 — Admin:** Clerk auth, dashboard, full CRUD, orders, enquiries.
- **Phase 4 — Content & trust:** home, how-it-works, coverage, FAQ, about,
  contact, legal drafts, WhatsApp button, cookie banner, SEO.
- **Phase 5 — Real providers & polish:** fill Airalo/Maya/eSIM Access adapters,
  motion polish, accessibility + Lighthouse audit.

See `PLACEHOLDERS.md` for the outstanding owner punch-list and `DEPLOY.md` for
Neon + Vercel setup.

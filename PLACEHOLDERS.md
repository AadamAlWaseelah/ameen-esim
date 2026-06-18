# Placeholders - Ameen eSIM punch-list

Everything not yet decided is stubbed and listed here for the owner to refine.
Tokens in code/content use `{{UPPER_SNAKE}}`; code stubs use `// TODO(ameen):`.

Status legend: outstanding / resolved

---

## Company & Legal

| Token | Where it's used | Status |
| --- | --- | --- |
| `{{COMPANY_NUMBER}}` | Footer; legal pages (Phase 4) | outstanding |
| `{{REGISTERED_ADDRESS}}` | Footer; legal pages (Phase 4) | outstanding |
| `{{ICO_NUMBER}}` | Footer; Privacy Policy (Phase 4) | outstanding |
| Legal page drafts (Privacy, Terms, Refund, Cookies) | `/privacy`, `/terms`, `/refund-policy`, `/cookies` | Phase 4 draft only; solicitor review required |

## Brand & Assets

| Item | Where it's used | Status |
| --- | --- | --- |
| Full logo lockup `ameen-logo.svg` | Navbar, footer | resolved in `/public/brand/` |
| Icon-only mark ("A" + gold diamond) | Favicon, app icon, OG image | outstanding; default `favicon.ico` still in place |
| OpenGraph / social share image | `app` metadata | outstanding |

## Prices & Markup

| Item | Where | Status |
| --- | --- | --- |
| Wholesale cost per plan | `plans.costPence` | outstanding; Phase 1 seed uses `null` |
| Markup type/value & retail price | `plans`, `/admin/plans` | outstanding; basic admin fields exist, owner must set final values |
| Final public prices | `/plans`, `/plans/[slug]` | outstanding; render as `PRICE TBD` until supplier/margin are confirmed |

## eSIM Provider

| Item | Where | Status |
| --- | --- | --- |
| Active provider choice | `ESIM_PROVIDER` env | outstanding; defaults to `mock` |
| Provider credentials | `.env.local` | outstanding; fill only the active provider |
| Mock provider | `lib/esim/providers/mock.ts` | resolved for Phase 1; catalogue + QR provisioning work |
| Provider plan refs (`providerRefs`) | `plans` table; `/admin/plans` | Mock refs seeded; real provider refs are TODO placeholders |
| Airalo adapter implementation | `lib/esim/providers/airalo.ts` | stub throws `NotConfiguredError` until credentials/endpoints are confirmed |
| Maya Mobile adapter implementation | `lib/esim/providers/maya.ts` | stub throws `NotConfiguredError` until credentials/endpoints are confirmed |
| eSIM Access adapter implementation | `lib/esim/providers/esimaccess.ts` | stub throws `NotConfiguredError` until credentials/endpoints are confirmed |

## Infrastructure (Deferred - Local-First Build)

| Item | Where | Status |
| --- | --- | --- |
| `DATABASE_URL` (Neon) | `.env.local` | outstanding; see `DEPLOY.md` |
| Vercel project + domain | hosting | outstanding; see `DEPLOY.md` |
| `NEXT_PUBLIC_SITE_URL` | metadata / canonical | outstanding; set to live domain on deploy |
| GitHub remote | `git remote -v` | outstanding; `gh` CLI is not installed |

## Keys & Accounts

| Item | Where | Status |
| --- | --- | --- |
| Stripe keys + webhook secret | `.env.local` | Phase 2 |
| Resend API key + `SUPPORT_EMAIL` | `.env.local` | Phase 2 |
| Clerk keys | `.env.local` | Phase 3 |
| `WHATSAPP_NUMBER` | floating WhatsApp button (Phase 4) | outstanding |
| `OWNER_EMAIL` | failure alerts (Phase 2) | outstanding |

## Copy

| Item | Where | Status |
| --- | --- | --- |
| Hero headline / sub-promise | Home (`app/page.tsx`) | placeholder copy in place |
| Footer one-line promise | `components/site/footer.tsx` | placeholder copy in place |
| FAQ, install guides, content blocks | DB seed (Phase 4) | placeholders |
| Plan descriptions and network text | `lib/plans/seed.ts`, `/plans/[slug]` | provider/network confirmation required |

---

_Last updated: Phase 1 catalogue._

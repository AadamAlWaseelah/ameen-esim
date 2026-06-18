# Placeholders — Ameen eSIM punch-list

Everything not yet decided is stubbed and listed here for the owner to refine.
Tokens in code/content use `{{UPPER_SNAKE}}`; code stubs use `// TODO(ameen):`.

Status legend: ⬜ outstanding · ✅ resolved

---

## Company & legal

| Token | Where it's used | Status |
| --- | --- | --- |
| `{{COMPANY_NUMBER}}` | Footer; legal pages (Phase 4) | ⬜ |
| `{{REGISTERED_ADDRESS}}` | Footer; legal pages (Phase 4) | ⬜ |
| `{{ICO_NUMBER}}` | Footer; Privacy Policy (Phase 4) | ⬜ |
| Legal page drafts (Privacy, Terms, Refund, Cookies) | `/privacy`, `/terms`, `/refund-policy`, `/cookies` | ⬜ Phase 4 — drafts only, need solicitor review |

## Brand & assets

| Item | Where it's used | Status |
| --- | --- | --- |
| Full logo lockup `ameen-logo.svg` | Navbar, footer | ✅ in `/public/brand/` |
| Icon-only mark ("A" + gold diamond) | Favicon, app icon, OG image | ⬜ owner to supply; default `favicon.ico` still in place |
| OpenGraph / social share image | `app` metadata | ⬜ |

## Prices & markup

| Item | Where | Status |
| --- | --- | --- |
| Wholesale cost per plan | `plans.costPence` | ⬜ Phase 1 seed uses `null` + "PRICE TBD" |
| Markup type/value & retail price | `plans` | ⬜ owner sets in admin (Phase 3) |

## eSIM provider

| Item | Where | Status |
| --- | --- | --- |
| Active provider choice | `ESIM_PROVIDER` env | ⬜ defaults to `mock`; pick airalo / maya / esimaccess later |
| Provider credentials | `.env.local` | ⬜ fill only the active provider |
| Provider plan refs (`providerRefs`) | `plans` table | ⬜ map in admin (Phase 3) |

## Infrastructure (deferred — local-first build)

| Item | Where | Status |
| --- | --- | --- |
| `DATABASE_URL` (Neon) | `.env.local` | ⬜ see DEPLOY.md |
| Vercel project + domain | hosting | ⬜ see DEPLOY.md |
| `NEXT_PUBLIC_SITE_URL` | metadata / canonical | ⬜ set to live domain on deploy |

## Keys & accounts

| Item | Where | Status |
| --- | --- | --- |
| Stripe keys + webhook secret | `.env.local` | ⬜ Phase 2 |
| Resend API key + `SUPPORT_EMAIL` | `.env.local` | ⬜ Phase 2 |
| Clerk keys | `.env.local` | ⬜ Phase 3 |
| `WHATSAPP_NUMBER` | floating WhatsApp button (Phase 4) | ⬜ |
| `OWNER_EMAIL` | failure alerts (Phase 2) | ⬜ |

## Copy

| Item | Where | Status |
| --- | --- | --- |
| Hero headline / sub-promise | Home (`app/page.tsx`) | ⬜ placeholder copy in place |
| Footer one-line promise | `components/site/footer.tsx` | ⬜ |
| FAQ, install guides, content blocks | DB seed (Phase 1) | ⬜ placeholders |

---

_Last updated: Phase 0 scaffold._

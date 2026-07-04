# Deploy guide — Neon + Vercel

The app is built **local-first**: it runs on `localhost` with no database and the
`mock` eSIM provider. Follow this when you're ready to put it online. None of
this blocks development.

## 1. Neon Postgres (database)

1. Create a free project at <https://neon.tech> (region: London / `eu-west-2`
   is closest to UK pilgrims and the business).
2. Copy the **pooled** connection string (it contains `-pooler`).
3. Locally: paste it into `.env.local` as `DATABASE_URL=...`.
4. Once Phase 1 schema exists, push it:
   ```bash
   npx drizzle-kit push      # or: generate + migrate
   ```

## 2. GitHub

```bash
# from the repo root
gh repo create ameen-esim --private --source . --push
```
(Mirrors the al-waseelah-app setup. Make it public only if you intend to.)

## 3. Vercel (hosting)

1. At <https://vercel.com> → **Add New → Project** → import the GitHub repo.
2. Framework preset auto-detects **Next.js**. No build overrides needed.
3. Add environment variables (Project → Settings → Environment Variables) —
   mirror `.env.example`. At minimum to go live:
   - `DATABASE_URL` (Neon pooled string)
   - `NEXT_PUBLIC_SITE_URL` (your live domain: `https://www.ameen-esim.co.uk`)
   - `ESIM_PROVIDER=mock` (until a real provider is chosen)
   - Add Stripe / Resend / Clerk keys as you reach Phases 2–3.
4. Deploy. Add your custom domain under Project → Domains.

## 4. After a provider is chosen (Phase 5)

Set `ESIM_PROVIDER` to `airalo` | `maya` | `esimaccess` and add that provider's
credentials. No other code changes are required.

---

_Owner action items live in `PLACEHOLDERS.md`._

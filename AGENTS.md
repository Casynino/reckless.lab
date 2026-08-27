<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reckless Laboratory — project brief

Premium, cinematic fashion storefront for a Banjul/Gambia streetwear brand (EST 2026). This is a **standalone project** — nothing to do with any other folder/repo on this machine.

## Stack & hosting
- **Next.js 16** (App Router, RSC, Server Actions), React 19, TypeScript, Tailwind v4, Framer Motion, Zustand (cart/wishlist in localStorage), jose (JWT cookie sessions), scrypt passwords.
- **Prisma 6 + Neon Postgres.** Datasource uses `DATABASE_URL` (pooled) + `DIRECT_URL` (unpooled).
- **Live at `https://recklesslab.shop`** (+ www) and `reckless-lab.vercel.app`. Repo: `Casynino/reckless.lab`.
- **Vercel** auto-deploys on every push to `main`. Local Postgres is usually down — run schema changes against Neon directly (`prisma db push` / `migrate deploy` with the Neon URLs) **before** deploying, or prod breaks.

## Secrets (NEVER commit)
All secrets live in **Vercel env vars + a local gitignored `.env`** only: `DATABASE_URL`, `DIRECT_URL` (Neon), `AUTH_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER/LABEL`, `NEXT_PUBLIC_SITE_URL`, etc. `AUTH_SECRET` **hard-fails in production if unset** (must be present in Vercel). Public contact email is `labreckless@gmail.com`.

## Key architecture rules
- **Display user identity from the DB, never the JWT.** Use `getCurrentUser()` (`src/lib/auth/session-cookies.ts`) for name/email; the session token is only trusted for `sub` + `role` (it can go stale).
- **Shipping** is one admin-editable rate card: `src/lib/shop/shipping.ts` `quoteShipping(regions, country, subtotal)`; live rates from the DB via `getShippingRegions()`; edit in HQ → Shipping.
- **Catalog** is DB-backed; product/collection pages are ISR (`revalidate`) and admin writes call `revalidatePath("/", "layout")` so the storefront refreshes.
- **Admin accounts:** there are two — the client's admin and the owner's own login. There is deliberately **no admin-management UI**; the Customers list is CUSTOMER-role-only. **Never build anything that lists, exposes, or resets other admin accounts.**

## What's built (live)
Storefront: catalog + collections + product pages, search, cart, wishlist, reviews (ratings/fit/verified/helpful), country-based shipping + promo codes + WhatsApp checkout, order tracking, **Drops** (`/drops` — animated launch countdown + notify list), newsletter, legal (`/privacy`, `/terms`), support, about. Accounts: dashboard, orders, wishlist, address book, profile/password, support chat, WhatsApp password reset. Admin (HQ): overview, orders (+courier/packing slip/CSV), **product editor** (create/edit/delete), inventory, promotions, shipping rates, drops, reviews moderation, analytics, customers (+admin-assisted password reset), messages, settings.

## Roadmap / NOT built yet
Online payments (mobile money / card), transactional email (order confirmations + sending to the notify/newsletter lists), SEO `sitemap`/`robots`, loyalty/rewards, product **image upload** (URLs only today — needs a Vercel Blob store), editable homepage (HomepageBlock model exists, unwired), abandoned-cart, staff roles.

## Working style
Commit + push to `main` directly (auto-deploys). No AI/Claude attribution in commits. Premium, distinctive design — no generic templates. After deploying something visible, verify it on the live site.

# Reckless Lab

An experimental, cinematic fashion storefront — WebGL hero, editorial motion, and a
WhatsApp-based checkout built on an architecture that scales to full ecommerce.

> _Fearless by design._ A laboratory where fashion rules are broken to make something alive.

## Stack

- **Next.js 16** (App Router, RSC) + **TypeScript**
- **Tailwind CSS v4** design system (monochrome + one acid signal)
- **Framer Motion** — reveals, split-text, page motion, magnetic UI
- **Lenis** — inertial smooth scroll
- **three.js / @react-three/fiber / drei** — the WebGL hero specimen
- **Zustand** — persisted cart
- **shadcn-style** structure (`components/ui`)

## Getting started

```bash
npm install
cp .env.example .env.local   # WhatsApp number, currency, socials, AUTH_SECRET, admin seed
npm run dev                  # http://localhost:3000
```

Then sign in at **`/login`** with the seed admin (from `.env`, default
`admin@recklesslab.com` / `reckless2026` — **change these**).

## Accounts & roles

One login for everyone (`/login`), routed by role:

- **Admins** → the operational HQ at **`/admin`** (overview, products, orders, customers, settings).
- **Customers** → their account at **`/account`** (profile, saved address, wishlist, sign out).

How it works:
- Sessions are signed **JWTs** (`jose`) in an httpOnly cookie; passwords are hashed with **scrypt**.
- `src/middleware.ts` guards `/admin` (admins only) and `/account` (any signed-in user).
- Users live in a **file-based store** (`.data/users.json`, git-ignored) that seeds the admin on
  first run. This is the ONLY storage module (`src/lib/auth/store.ts`) — swap it for
  Postgres/Prisma later without touching the UI. **Note:** serverless hosts have a read-only
  filesystem, so move this store to a database before deploying customer sign-ups to Vercel.

Set `AUTH_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`.

## Architecture (why it scales)

Everything the UI renders comes through a thin **data-access layer** (`src/lib/data/index.ts`).
Today it reads typed local files (`src/lib/data/products.ts`, `collections.ts`). Swap those
function bodies for Postgres/Prisma or a headless CMS and **no UI changes are needed** — the
`Product` / `Collection` contracts (`src/lib/types.ts`) stay the same.

```
src/
  app/                     routes (home, collections, products, checkout, about, support, …)
  components/
    ui/                    primitives (SmartImage, ButtonLink) + provided 3d-animation
    layout/                header, footer, menu, cursor, preloader, smooth-scroll
    motion/                Reveal, SplitText, Marquee, Magnetic, Parallax
    home/                  homepage sections
    product/               gallery, card, grid, purchase, accordion, collection view
    three/                 WebGL hero scene
    cart / checkout/       drawer + checkout flow
  lib/
    types.ts               domain model (the contract)
    data/                  data-access layer + typed seed data
    shop/                  config, cart store, currency, shipping zones, whatsapp order builder
```

## Checkout → WhatsApp (payment-gateway ready)

Checkout collects shipping details, calculates zone-based shipping, and builds a formatted
order summary that opens in WhatsApp addressed to the business line
(`src/lib/shop/whatsapp.ts`). To add card / mobile-money payments later, replace the
`buildWhatsAppUrl` call in the checkout with a `createPaymentSession` — the `OrderDraft`
shape is already the right seam.

## Swapping in real assets

- **Product photos / campaign imagery** → edit the `img(...)` / `u(...)` URLs in
  `src/lib/data/*` and the home/about section components. `SmartImage` falls back to an
  on-brand gradient if any image fails, so nothing ever looks broken.
- **Add image hosts** in `next.config.ts → images.remotePatterns`.
- **Brand, WhatsApp, currency, socials** → `.env.local` (see `.env.example`) or
  `src/lib/shop/config.ts`.

## Built

Cinematic storefront (intro sequence, campaign hero, collections, product pages with
colorway switcher + size guide, cart, WhatsApp checkout), **wishlist**, **auth with
role-based routing**, **customer accounts**, and the **admin HQ** (live overview, products,
orders, customers, settings) — all on the real brand assets.

## On the roadmap

Full product/media CRUD from the admin (needs the DB migration), online payments, order
capture, multi-warehouse inventory, analytics dashboards, and a CMS — the domain model,
data-access layer and auth are structured to absorb them without a rewrite.

/**
 * Storefront maintenance mode — the single switch that takes the shop dark.
 *
 * `enabled: true`  → middleware bounces every public route to /maintenance.
 * `enabled: false` → normal storefront, and /maintenance redirects to home.
 *
 * HQ stays reachable either way: /admin, /login and /api are never gated. The
 * storefront itself is dark for everyone, admins included — so what you see is
 * what a customer sees.
 *
 * Flipping this is a one-line commit + push (Vercel redeploys in ~1 min).
 */
export const maintenance = {
  enabled: false,

  /** Big line. Keep it short. */
  headline: "We'll be right back",

  /** The why — two sentences max. This is a shop window, not a changelog. */
  body:
    "Orders came in faster than the lab could move. The store is offline for a short upgrade so every order lands clean.",

  /** When we expect to be live again. Shown as written. */
  eta: "Back tonight — before midnight",
} as const;

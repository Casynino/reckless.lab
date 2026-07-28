/**
 * Central storefront configuration.
 *
 * Everything env-driven so brand assets, contact channels and commerce
 * settings can change without touching UI code. Swap the defaults or set
 * the matching NEXT_PUBLIC_* variables in `.env.local`.
 */

export const shopConfig = {
  brand: {
    name: "Reckless Laboratory",
    shortName: "Reckless",
    tagline: "I exist.",
    // The one line that greets a visitor. Kept deliberately quiet.
    manifesto: "A laboratory where fashion rules are broken to make something alive.",
    est: "MMXXVI",
    estYear: "2026",
    locationLabel: "Banjul → Worldwide",
  },

  /** Business WhatsApp used to complete orders. Digits only, incl. country code. */
  whatsapp: {
    // The Gambia country code is 220. Replace with the real business line.
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2207000000",
    label: process.env.NEXT_PUBLIC_WHATSAPP_LABEL ?? "+220 700 0000",
  },

  currency: {
    code: (process.env.NEXT_PUBLIC_CURRENCY_CODE ?? "USD") as string,
    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? "$",
    // Digits shown after the decimal point.
    fractionDigits: 0,
  },

  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/be_reck1ess",
    instagramHandle: "@be_reck1ess",
    tiktok: "https://tiktok.com",
  },

  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "studio@recklesslab.com",
    homeCountry: "GM", // ISO — The Gambia
  },
} as const;

export type ShopConfig = typeof shopConfig;

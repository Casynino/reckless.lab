/**
 * ============================================================================
 *  RECKLESS LABORATORY — CENTRALISED SHIPPING SERVICE
 * ============================================================================
 *  ONE source of truth. Checkout, order summary, WhatsApp hand-off, the
 *  customer dashboard, the admin order views and CSV export all read their
 *  shipping numbers from `quoteShipping()` here. To change a rate, a courier,
 *  an ETA, a free-shipping threshold, or to add a country, edit
 *  `SHIPPING_REGIONS` below — nothing in the UI or checkout flow changes.
 *
 *  The engine is deliberately shaped so future upgrades slot in behind the
 *  same `quoteShipping()` signature without rewriting any caller:
 *    • different couriers / region-based rates  → add regions / fields
 *    • variable & weight-based pricing          → extend `resolveRate()`
 *    • promotional / seasonal free shipping     → wrap the rate in a campaign
 *  Callers only ever see a `ShippingQuote`, so the surface stays stable.
 * ============================================================================
 */

export const SHIPPING_CURRENCY = "USD";

/**
 * Store-wide free-shipping threshold (store currency). A region may override
 * it (e.g. a home market that is always free). Kept as a named export because
 * the PDP and cart drawer show a generic "free over X" nudge.
 */
export const FREE_SHIPPING_THRESHOLD = 100;

export interface ShippingRegion {
  id: string;
  /** Human label shown to customers + admins. */
  label: string;
  /** ISO country codes routed to this region. */
  countries: string[];
  /** Courier / method displayed to the customer. */
  courier: string;
  /** Delivery-estimate copy. */
  eta: string;
  /** Flat fee charged when the order is below the free threshold. */
  flatRate: number;
  /** Subtotal at/above which shipping is free. `0` = always free (home market). */
  freeThreshold: number;
  /** Rest-of-world: fee is quoted by the team after checkout — never auto-charged. */
  requiresQuote?: boolean;
  /** Catch-all region for any country not explicitly listed. */
  isDefault?: boolean;
}

/**
 * The live rate card. Order matters only for the default (last) entry.
 * Everything a merchant would tune lives here — intentionally declarative.
 */
export const SHIPPING_REGIONS: ShippingRegion[] = [
  {
    id: "us",
    label: "United States",
    countries: ["US"],
    courier: "DHL Express",
    eta: "1–3 Business Days",
    flatRate: 15,
    freeThreshold: 100,
  },
  {
    id: "ca",
    label: "Canada",
    countries: ["CA"],
    courier: "DHL Express",
    eta: "1–3 Business Days",
    flatRate: 15,
    freeThreshold: 100,
  },
  {
    id: "tz",
    label: "Tanzania",
    countries: ["TZ"],
    courier: "DHL Express",
    eta: "Based on your destination within Tanzania",
    flatRate: 10,
    freeThreshold: 100,
  },
  {
    id: "gm",
    label: "The Gambia",
    countries: ["GM"],
    courier: "Local Delivery",
    eta: "Based on your destination within The Gambia",
    flatRate: 0,
    freeThreshold: 0, // home market — always free
  },
  {
    id: "cn",
    label: "China",
    countries: ["CN"],
    courier: "DHL Express",
    eta: "Based on your destination within China",
    flatRate: 10,
    freeThreshold: 100,
  },
  {
    id: "row",
    label: "Rest of World",
    countries: [],
    courier: "DHL Express",
    eta: "Confirmed after checkout",
    flatRate: 0,
    freeThreshold: 100,
    requiresQuote: true,
    isDefault: true,
  },
];

export function regionForCountry(countryCode: string): ShippingRegion {
  const direct = SHIPPING_REGIONS.find((r) => r.countries.includes(countryCode));
  return direct ?? SHIPPING_REGIONS.find((r) => r.isDefault)!;
}

/**
 * The single result every surface consumes. It answers all five customer
 * questions (how much, why, free?, which courier, when) plus everything the
 * admin/order record needs to snapshot immutably.
 */
export interface ShippingQuote {
  countryCode: string;
  countryName: string;
  regionId: string;
  regionLabel: string;
  /** Courier / method, e.g. "DHL Express". */
  courier: string;
  /** Delivery estimate copy. */
  eta: string;
  /** Fee charged now (0 when free, and 0 when TBC — see `tbc`). */
  fee: number;
  /** Order qualifies for free shipping (met threshold or always-free market). */
  freeShipping: boolean;
  /** Rest-of-world: fee to be confirmed by the team; never auto-charged. */
  tbc: boolean;
  /** Subtotal needed for free shipping (0 = already free / always free / n-a). */
  freeThreshold: number;
  /** Remaining spend to unlock free shipping (0 when free / tbc / not offered). */
  remainingForFree: number;
  /** A free-shipping progress bar is meaningful for this region. */
  progressEligible: boolean;
}

/**
 * Resolve the pre-discount shipping fee for a region + order. This is the one
 * place to extend for weight/region/promo pricing later — every caller stays
 * put.
 */
function resolveRate(region: ShippingRegion, subtotal: number): { fee: number; free: boolean } {
  const free = region.freeThreshold === 0 || subtotal >= region.freeThreshold;
  return { fee: free ? 0 : region.flatRate, free };
}

/** THE shipping calculator. Pure + synchronous so client and server agree. */
export function quoteShipping(countryCode: string, subtotal: number): ShippingQuote {
  const region = regionForCountry(countryCode);
  const base = {
    countryCode,
    countryName: countryName(countryCode),
    regionId: region.id,
    regionLabel: region.label,
    courier: region.courier,
    eta: region.eta,
    freeThreshold: region.freeThreshold,
  };

  // Rest of world — never auto-calculated; the customer can still check out.
  if (region.requiresQuote) {
    return { ...base, fee: 0, freeShipping: false, tbc: true, remainingForFree: 0, progressEligible: false };
  }

  const { fee, free } = resolveRate(region, subtotal);
  const remaining = region.freeThreshold > 0 && !free ? Math.max(0, region.freeThreshold - subtotal) : 0;
  return {
    ...base,
    fee,
    freeShipping: free,
    tbc: false,
    remainingForFree: remaining,
    // Always-free markets (threshold 0) show "always free", not a progress bar.
    progressEligible: region.freeThreshold > 0,
  };
}

/** The professional Rest-of-World note shown at checkout + on the record. */
export const TBC_SHIPPING_MESSAGE =
  "Shipping to your location is available. Shipping costs will be confirmed by our team after your order is submitted — we'll contact you on WhatsApp with the final quotation before payment.";

/** Countries offered in the checkout selector (home + key markets first). */
export const shippingCountries: { code: string; name: string }[] = [
  // Home / supported markets (auto-calculated)
  { code: "GM", name: "The Gambia" },
  { code: "TZ", name: "Tanzania" },
  { code: "CN", name: "China" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  // Africa
  { code: "SN", name: "Senegal" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "KE", name: "Kenya" },
  { code: "UG", name: "Uganda" },
  { code: "RW", name: "Rwanda" },
  { code: "ET", name: "Ethiopia" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "MA", name: "Morocco" },
  { code: "CI", name: "Côte d’Ivoire" },
  // Europe
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
  // Americas
  { code: "MX", name: "Mexico" },
  { code: "BR", name: "Brazil" },
  // Middle East & Asia-Pacific
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "TR", name: "Türkiye" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "HK", name: "Hong Kong" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "OTHER", name: "Other — worldwide" },
];

/** Human label for a country code (checkout selector + order displays). */
export function countryName(code: string): string {
  return shippingCountries.find((c) => c.code === code)?.name ?? code;
}

import type { ShippingZone } from "@/lib/types";

/**
 * Shipping is zone + flat-rate based, intentionally modular. Carrier
 * integrations (DHL, FedEx) plug in later by replacing `rateForCountry` with a
 * live-rate call — the checkout UI stays identical.
 */

export const shippingZones: ShippingZone[] = [
  {
    id: "gm",
    label: "The Gambia",
    countries: ["GM"],
    rate: 0,
    estimate: "1–3 days",
  },
  {
    id: "waf",
    label: "West Africa",
    countries: ["SN", "GN", "GW", "ML", "MR", "SL", "LR", "CI", "GH", "NG", "TG", "BJ", "BF"],
    rate: 18,
    estimate: "4–8 days",
  },
  {
    id: "eu-uk",
    label: "Europe & UK",
    countries: ["GB", "FR", "DE", "IT", "ES", "NL", "BE", "PT", "IE", "SE", "DK", "NO", "CH", "AT", "PL"],
    rate: 32,
    estimate: "5–9 days",
  },
  {
    id: "na",
    label: "North America",
    countries: ["US", "CA", "MX"],
    rate: 38,
    estimate: "6–10 days",
  },
  {
    id: "row",
    label: "Rest of World",
    countries: ["*"],
    rate: 46,
    estimate: "8–14 days",
  },
];

/** Countries offered in the checkout selector (home market first). */
export const shippingCountries: { code: string; name: string }[] = [
  // Home markets
  { code: "GM", name: "The Gambia" },
  { code: "TZ", name: "Tanzania" },
  { code: "CN", name: "China" },
  { code: "US", name: "United States" },
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
  { code: "CA", name: "Canada" },
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

export function getZoneForCountry(countryCode: string): ShippingZone {
  const direct = shippingZones.find((z) => z.countries.includes(countryCode));
  if (direct) return direct;
  return shippingZones.find((z) => z.countries.includes("*"))!;
}

export function rateForCountry(countryCode: string): number {
  return getZoneForCountry(countryCode).rate;
}

/** Free shipping over this subtotal (store currency). 0 = disabled. */
export const FREE_SHIPPING_THRESHOLD = 90;

export function shippingCost(countryCode: string, subtotal: number): number {
  if (FREE_SHIPPING_THRESHOLD > 0 && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return rateForCountry(countryCode);
}

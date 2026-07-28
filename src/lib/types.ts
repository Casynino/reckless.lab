/**
 * Domain model for the Reckless Lab commerce platform.
 *
 * These types are the contract between the storefront UI and the data layer.
 * Today the data layer is typed local files (see `lib/data/*`); tomorrow it
 * can be Postgres/Prisma or a headless CMS — the UI never has to change as
 * long as the data access functions keep returning these shapes.
 */

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type Gender = "men" | "women" | "unisex";

/** Top-level merchandising groupings surfaced in navigation. */
export type CollectionSlug =
  | "new-arrivals"
  | "i-exist"
  | "identity"
  | "reckless"
  | "essentials"
  | "limited-drops"
  | "men"
  | "women"
  | "future";

export interface MediaAsset {
  /** Public path or absolute URL. Swap placeholders here only. */
  src: string;
  alt: string;
  /** Optional video source; when present the card/gallery plays it. */
  video?: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  size: Size;
  /** Warehouse-ready: stock is tracked per variant. */
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Short line shown under the name. */
  subtitle: string;
  /** Base price in the store currency's major unit. */
  price: number;
  /** Optional strike-through original price. */
  compareAtPrice?: number;
  gender: Gender;
  collections: CollectionSlug[];
  /** First image is the primary; rest power the gallery. */
  media: MediaAsset[];
  variants: ProductVariant[];
  /** Editorial long-form story shown on the product page. */
  story: string;
  details: string[];
  materials: string[];
  care?: string[];
  /** Merchandising flags. */
  isNew?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
  /** Color name for the swatch/label. */
  colorway: string;
  /** Lower = earlier in listings. */
  order?: number;
}

export interface Collection {
  slug: CollectionSlug;
  title: string;
  /** One-line editorial descriptor. */
  tagline: string;
  description: string;
  cover: MediaAsset;
  /** Monospace lab code, e.g. "LAB//02". */
  code: string;
  accent?: string;
}

/** A line in the cart — product + chosen variant + qty. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: Size;
  sku: string;
  qty: number;
  image: string;
  colorway: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
}

export interface ShippingZone {
  id: string;
  label: string;
  /** ISO country codes in this zone; "*" = rest of world. */
  countries: string[];
  /** Flat rate in store currency. */
  rate: number;
  /** Human estimate, e.g. "5–9 days". */
  estimate: string;
}

import type { Collection, CollectionSlug, Product } from "@/lib/types";
import { products } from "./products";
import { collections } from "./collections";

/**
 * Data access layer. Every UI surface reads catalog data through these
 * functions, never by importing the raw arrays. Replace the bodies with DB or
 * CMS calls later and the entire storefront keeps working unchanged.
 *
 * (Async signatures on purpose — so swapping in a real datasource is a no-op
 * for callers.)
 */

export async function getAllProducts(): Promise<Product[]> {
  return [...products].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCollection(slug: CollectionSlug): Promise<Product[]> {
  const list = products.filter((p) => p.collections.includes(slug));
  return list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getNewArrivals(limit?: number): Promise<Product[]> {
  const list = products.filter((p) => p.isNew);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getBestSellers(limit?: number): Promise<Product[]> {
  const list = products.filter((p) => p.isBestSeller);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getLimitedDrops(limit?: number): Promise<Product[]> {
  const list = products.filter((p) => p.isLimited);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

/** Simple "you may also like" — same collection, excluding the current item. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const primary = product.collections[0];
  return products
    .filter((p) => p.id !== product.id && p.collections.includes(primary))
    .slice(0, limit);
}

export async function getAllCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  return collections.find((c) => c.slug === slug);
}

export function getProductStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

/**
 * All colorways of the same design (grouped by product name), current one
 * included, in catalog order. Powers the PDP colorway switcher.
 */
export async function getColorwaysOf(product: Product): Promise<Product[]> {
  return products
    .filter((p) => p.name === product.name)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

import "server-only";
import { db } from "@/lib/db";
import type { Product } from "@/lib/types";

/**
 * Inventory helpers. Stock now lives on the DB variant, and the catalog loads
 * live stock — so the read helpers stay synchronous (they operate on the
 * already-loaded product). Writes go to Postgres and record a StockMovement.
 */

/** Total effective stock across a product's variants (from loaded data). */
export function productStock(product: Product): number {
  return product.variants.reduce((n, v) => n + v.stock, 0);
}

/** Per-size stock map for a product (from loaded data). */
export function variantStockMap(product: Product): Record<string, number> {
  const map: Record<string, number> = {};
  for (const v of product.variants) map[v.size] = v.stock;
  return map;
}

/** Set a variant's stock and log the adjustment as a StockMovement. */
export async function setVariantStock(sku: string, qty: number): Promise<void> {
  const q = Math.max(0, Math.floor(qty));
  const v = await db.productVariant.findUnique({ where: { sku } });
  if (!v) return;
  const delta = q - v.stock;
  if (delta === 0) return;
  await db.productVariant.update({ where: { sku }, data: { stock: q } });
  await db.stockMovement.create({
    data: { variantId: v.id, type: "ADJUSTMENT", qty: delta, note: "Manual stock adjustment" },
  });
}

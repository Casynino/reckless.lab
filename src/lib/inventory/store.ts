import "server-only";
import fs from "fs";
import path from "path";
import type { Product } from "@/lib/types";

/**
 * Stock overrides — keyed by variant SKU. Base stock lives in the typed
 * catalog; admin edits are stored here so they persist without mutating code.
 * When the catalog moves to a DB this merges back into the product table.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "stock.json");

function readOverrides(): Record<string, number> {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Record<string, number>;
  } catch {
    return {};
  }
}

function writeOverrides(o: Record<string, number>) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(o, null, 2), "utf8");
}

export function setVariantStock(sku: string, qty: number) {
  const o = readOverrides();
  o[sku] = Math.max(0, Math.floor(qty));
  writeOverrides(o);
}

/** Effective stock for one variant (override wins over base). */
export function variantStock(sku: string, base: number): number {
  const o = readOverrides();
  return sku in o ? o[sku] : base;
}

/** Effective total stock for a product across variants. */
export function productStock(product: Product): number {
  const o = readOverrides();
  return product.variants.reduce((n, v) => n + (v.sku in o ? o[v.sku] : v.stock), 0);
}

/** Per-size effective stock map for a product. */
export function variantStockMap(product: Product): Record<string, number> {
  const o = readOverrides();
  const map: Record<string, number> = {};
  for (const v of product.variants) map[v.size] = v.sku in o ? o[v.sku] : v.stock;
  return map;
}

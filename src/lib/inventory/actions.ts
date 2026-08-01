"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { setVariantStock } from "./store";

/** Admin: set the stock for a set of variants (by SKU). */
export async function setStockAction(updates: { sku: string; qty: number }[]) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Not authorised." };
  for (const u of updates) {
    if (Number.isFinite(u.qty)) await setVariantStock(u.sku, u.qty);
  }
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/admin/analytics");
  // Storefront reflects live stock too — product/collection/search/home pages
  // are statically generated, so without this a "set to 0" never shows as sold
  // out on the site. Revalidating the root layout refreshes every storefront route.
  revalidatePath("/", "layout");
  return { ok: true };
}

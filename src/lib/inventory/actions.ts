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
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { saveProduct, deleteProduct, type EditableProduct } from "./products";

async function requireAdmin() {
  const s = await getSession();
  return s?.role === "admin";
}

function revalidateAll() {
  // Storefront (product/collection/home/search are statically generated) + admin.
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
}

export async function saveProductAction(input: EditableProduct) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  if (!input.name.trim()) return { error: "Name is required." };
  if (!/^[a-z0-9-]+$/.test(input.slug.trim().toLowerCase())) return { error: "Slug must be lowercase letters, numbers and dashes only." };
  if (!input.variants.some((v) => v.sku.trim())) return { error: "Add at least one size with a SKU." };
  if (!input.images.some((i) => i.url.trim())) return { error: "Add at least one image URL." };

  try {
    const id = await saveProduct(input);
    revalidateAll();
    return { ok: true, id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (/Unique constraint|already exists/i.test(msg)) {
      return { error: "That slug or one of the SKUs is already used by another product." };
    }
    return { error: "Couldn't save the product. Check the fields and try again." };
  }
}

export async function deleteProductAction(id: string) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  try {
    await deleteProduct(id);
  } catch {
    return { error: "Couldn't delete the product." };
  }
  revalidateAll();
  return { ok: true };
}

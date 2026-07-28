"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { validateCoupon, createCoupon, toggleCoupon, deleteCoupon, type CouponType } from "./store";

/** Public — apply a promo code to the current cart. */
export async function applyCouponAction(input: {
  code: string;
  subtotal: number;
  shipping: number;
  email?: string;
}) {
  return validateCoupon(input.code, input.subtotal, input.shipping, input.email);
}

async function requireAdmin() {
  const s = await getSession();
  return s?.role === "admin";
}

export async function createCouponAction(input: {
  code: string;
  type: CouponType;
  value: number;
  description?: string;
  minSubtotal?: number;
  firstOrderOnly?: boolean;
  usageLimit?: number | null;
  expiresAt?: string | null;
}) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  if (!input.code?.trim()) return { error: "Code required." };
  if (input.type !== "FREE_SHIPPING" && (!input.value || input.value <= 0)) return { error: "Value required." };
  try {
    await createCoupon({
      code: input.code,
      type: input.type,
      value: input.type === "FREE_SHIPPING" ? 0 : input.value,
      description: input.description,
      minSubtotal: input.minSubtotal ?? 0,
      firstOrderOnly: input.firstOrderOnly ?? false,
      usageLimit: input.usageLimit ?? null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    });
  } catch {
    return { error: "That code already exists." };
  }
  revalidatePath("/admin/promotions");
  return { ok: true };
}

export async function toggleCouponAction(id: string) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  await toggleCoupon(id);
  revalidatePath("/admin/promotions");
  return { ok: true };
}

export async function deleteCouponAction(id: string) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  await deleteCoupon(id);
  revalidatePath("/admin/promotions");
  return { ok: true };
}

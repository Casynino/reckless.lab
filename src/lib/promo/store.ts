import "server-only";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/shop/format";

export type CouponType = "PERCENT" | "FIXED" | "FREE_SHIPPING";

export type PromoResult =
  | { ok: true; code: string; type: CouponType; discount: number; freeShipping: boolean; label: string }
  | { error: string };

/** Validate a code against a cart and (optionally) the customer's history. */
export async function validateCoupon(
  codeRaw: string,
  subtotal: number,
  shipping: number,
  email?: string,
): Promise<PromoResult> {
  const code = codeRaw.trim().toUpperCase();
  if (!code) return { error: "Enter a promo code." };

  const c = await db.coupon.findUnique({ where: { code } });
  if (!c || !c.active) return { error: "That code isn't valid." };

  const now = new Date();
  if (c.startsAt && c.startsAt > now) return { error: "This promo isn't active yet." };
  if (c.expiresAt && c.expiresAt < now) return { error: "This promo has expired." };
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return { error: "This promo is fully claimed." };
  if (subtotal < c.minSubtotal) return { error: `Spend ${formatPrice(c.minSubtotal)}+ to use this code.` };

  if (c.firstOrderOnly && email) {
    const prior = await db.order.count({ where: { customerEmail: { equals: email, mode: "insensitive" } } });
    if (prior > 0) return { error: "This code is for first orders only." };
  }

  let discount = 0;
  let freeShipping = false;
  let label = "";
  if (c.type === "PERCENT") {
    discount = Math.round((subtotal * c.value) / 100);
    label = `${c.value}% off`;
  } else if (c.type === "FIXED") {
    discount = Math.min(c.value, subtotal);
    label = `${formatPrice(c.value)} off`;
  } else {
    freeShipping = true;
    discount = shipping;
    label = "Free shipping";
  }

  return { ok: true, code: c.code, type: c.type as CouponType, discount, freeShipping, label };
}

export async function incrementCouponUsage(code: string) {
  await db.coupon.updateMany({ where: { code: code.toUpperCase() }, data: { usedCount: { increment: 1 } } });
}

// ── Admin ──────────────────────────────────────────────────────────────
export async function listCoupons() {
  return db.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createCoupon(data: {
  code: string;
  type: CouponType;
  value: number;
  description?: string;
  minSubtotal?: number;
  firstOrderOnly?: boolean;
  usageLimit?: number | null;
  expiresAt?: Date | null;
}) {
  return db.coupon.create({
    data: {
      code: data.code.trim().toUpperCase(),
      type: data.type,
      value: data.value,
      description: data.description || null,
      minSubtotal: data.minSubtotal ?? 0,
      firstOrderOnly: data.firstOrderOnly ?? false,
      usageLimit: data.usageLimit ?? null,
      expiresAt: data.expiresAt ?? null,
    },
  });
}

export async function toggleCoupon(id: string) {
  const c = await db.coupon.findUnique({ where: { id } });
  if (!c) return;
  return db.coupon.update({ where: { id }, data: { active: !c.active } });
}

export async function deleteCoupon(id: string) {
  return db.coupon.delete({ where: { id } });
}

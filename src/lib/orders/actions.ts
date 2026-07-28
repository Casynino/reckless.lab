"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { updateOrderState, createOrder } from "./store";
import { incrementCouponUsage } from "@/lib/promo/store";
import type { OrderLine, OrderState } from "./types";

/** Admin: advance/override an order's state. */
export async function updateOrderStateAction(orderId: string, state: OrderState) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Not authorised." };
  const order = await updateOrderState(orderId, state);
  if (!order) return { error: "Order not found." };
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/analytics");
  return { ok: true };
}

/**
 * Called from checkout when a customer completes an order — records it (state
 * "new") so it appears in the admin Order Monitor alongside the WhatsApp hand-off.
 */
export async function placeOrderAction(input: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  countryCode: string;
  address1: string;
  address2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
  total: number;
}) {
  if (!input.lines?.length) return { error: "Empty order." };
  const session = await getSession();
  const order = await createOrder(
    { ...input, discount: input.discount ?? 0, couponCode: input.couponCode },
    { userId: session?.sub },
  );
  if (input.couponCode) await incrementCouponUsage(input.couponCode);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/account");
  return { ok: true, reference: order.reference, tracking: order.tracking };
}

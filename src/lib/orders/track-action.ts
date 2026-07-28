"use server";

import { getOrderByReference } from "./store";
import type { Order } from "./types";

/**
 * Public order lookup for the Track page — works for guests and registered
 * customers. Requires the order number + tracking number to match; email is an
 * optional extra verification.
 */
export async function trackOrderAction(input: {
  reference: string;
  tracking: string;
  email?: string;
}): Promise<{ ok: true; order: Order } | { error: string }> {
  const reference = input.reference.trim().toUpperCase();
  const tracking = input.tracking.trim().toUpperCase();
  if (!reference || !tracking) return { error: "Enter your order number and tracking number." };

  const order = await getOrderByReference(reference);
  if (!order || order.tracking.toUpperCase() !== tracking) {
    return { error: "We couldn't find an order with those details. Check the numbers and try again." };
  }
  if (input.email && order.customerEmail.toLowerCase() !== input.email.trim().toLowerCase()) {
    return { error: "That email doesn't match this order." };
  }
  return { ok: true, order };
}

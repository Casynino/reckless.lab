"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import {
  createShippingRate,
  updateShippingRate,
  deleteShippingRate,
  toggleShippingRate,
  seedDefaultShippingRates,
  type ShippingRateInput,
} from "./shipping-store";

async function requireAdmin() {
  const s = await getSession();
  return s?.role === "admin";
}

/** Rate changes touch every surface that quotes shipping. */
function revalidateShipping() {
  revalidatePath("/admin/shipping");
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  revalidatePath("/support");
}

function validate(input: ShippingRateInput) {
  if (!input.label?.trim()) return "Label is required.";
  if (!input.requiresQuote && !input.courier?.trim()) return "Courier / method is required.";
  return null;
}

export async function createShippingRateAction(input: ShippingRateInput) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  const bad = validate(input);
  if (bad) return { error: bad };
  await createShippingRate(input);
  revalidateShipping();
  return { ok: true };
}

export async function updateShippingRateAction(id: string, input: ShippingRateInput) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  const bad = validate(input);
  if (bad) return { error: bad };
  await updateShippingRate(id, input);
  revalidateShipping();
  return { ok: true };
}

export async function toggleShippingRateAction(id: string) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  await toggleShippingRate(id);
  revalidateShipping();
  return { ok: true };
}

export async function deleteShippingRateAction(id: string) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  await deleteShippingRate(id);
  revalidateShipping();
  return { ok: true };
}

export async function seedShippingRatesAction() {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  const seeded = await seedDefaultShippingRates();
  revalidateShipping();
  return { ok: true, seeded };
}

"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { createAddress, updateAddress, deleteAddress, setDefaultAddress, type AddressInput } from "./addresses";

async function uid() {
  const s = await getSession();
  return s?.sub ?? null;
}

function valid(a: AddressInput) {
  return a.fullName?.trim() && a.line1?.trim() && a.city?.trim() && a.countryCode?.trim();
}

export async function saveAddressAction(input: AddressInput & { id?: string }) {
  const userId = await uid();
  if (!userId) return { error: "Please sign in." };
  if (!valid(input)) return { error: "Fill in name, street, city and country." };
  let id = input.id;
  if (input.id) await updateAddress(userId, input.id, input);
  else id = (await createAddress(userId, input)).id;
  revalidatePath("/account");
  revalidatePath("/checkout");
  return { ok: true, id };
}

export async function deleteAddressAction(id: string) {
  const userId = await uid();
  if (!userId) return { error: "Please sign in." };
  await deleteAddress(userId, id);
  revalidatePath("/account");
  return { ok: true };
}

export async function setDefaultAddressAction(id: string) {
  const userId = await uid();
  if (!userId) return { error: "Please sign in." };
  await setDefaultAddress(userId, id);
  revalidatePath("/account");
  return { ok: true };
}

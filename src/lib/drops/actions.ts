"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { notifyDrop, createDrop, updateDrop, deleteDrop, type DropAdminInput } from "./store";

/** Public — join the notify list for a drop. */
export async function notifyDropAction(dropId: string, email: string) {
  const clean = email.trim().toLowerCase();
  if (!clean.includes("@") || clean.length < 5) return { error: "Enter a valid email." };
  try {
    await notifyDrop(dropId, clean);
  } catch {
    return { error: "Couldn't add you — try again." };
  }
  return { ok: true };
}

async function requireAdmin() {
  const s = await getSession();
  return s?.role === "admin";
}
function revalidateDrops() {
  revalidatePath("/drops");
  revalidatePath("/");
  revalidatePath("/admin/drops");
}
function validate(input: DropAdminInput) {
  if (!input.name.trim()) return "Name is required.";
  if (!/^[a-z0-9-]+$/.test(input.slug.trim().toLowerCase())) return "Slug: lowercase letters, numbers, dashes.";
  if (!input.launchAt || isNaN(new Date(input.launchAt).getTime())) return "Pick a valid launch date & time.";
  return null;
}

export async function createDropAction(input: DropAdminInput) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  const bad = validate(input);
  if (bad) return { error: bad };
  try {
    await createDrop(input);
  } catch {
    return { error: "That slug is already used." };
  }
  revalidateDrops();
  return { ok: true };
}

export async function updateDropAction(id: string, input: DropAdminInput) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  const bad = validate(input);
  if (bad) return { error: bad };
  try {
    await updateDrop(id, input);
  } catch {
    return { error: "Couldn't save — is the slug unique?" };
  }
  revalidateDrops();
  return { ok: true };
}

export async function deleteDropAction(id: string) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  await deleteDrop(id);
  revalidateDrops();
  return { ok: true };
}

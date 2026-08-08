"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { findByEmail, createUser, updateUserAddress, updateUserProfile, updateUserPassword, setUserPassword, findById } from "./store";
import { verifyPassword } from "./password";
import { setSession, clearSession, getSession } from "./session-cookies";
import type { Address } from "./types";

export interface AuthState {
  error?: string;
  ok?: boolean;
}

function safeNext(next: FormDataEntryValue | null): string | null {
  const v = typeof next === "string" ? next : "";
  // Only allow internal paths.
  return v.startsWith("/") && !v.startsWith("//") ? v : null;
}

/** Log in, then route by role (admin → /admin, customer → /account). */
export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) return { error: "Enter your email and password." };

  const user = await findByEmail(email);
  if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
    return { error: "Wrong email or password." };
  }

  await setSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  // Admins always land in the HQ — a customer-area `next` (e.g. from tapping
  // "Account") must never route an admin to the customer dashboard.
  if (user.role === "admin") redirect(next && next.startsWith("/admin") ? next : "/admin");
  redirect(next ?? "/account");
}

/** Register a customer, then go to /account. */
export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!name || !email || !password) return { error: "Fill in every field." };
  if (!email.includes("@")) return { error: "Enter a valid email." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };

  let user;
  try {
    user = await createUser({ name, email, password, role: "customer" });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not create account." };
  }

  await setSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  redirect(next ?? "/account");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

/**
 * Create an account straight from checkout using details already entered —
 * the customer only sets a password. Signs them in on success.
 */
export async function createAccountFromCheckoutAction(input: { name: string; email: string; password: string }) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  if (!name || !email.includes("@")) return { error: "Missing details." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (await findByEmail(email)) return { error: "An account with this email already exists — sign in instead." };
  try {
    const user = await createUser({ name, email, password, role: "customer" });
    await setSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  } catch {
    return { error: "Could not create your account." };
  }
  return { ok: true };
}

/** Update the signed-in user's name / email (re-issues the session). */
export async function updateProfileAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await getSession();
  if (!session) return { error: "You're signed out." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!name || !email) return { error: "Name and email are required." };
  if (!email.includes("@")) return { error: "Enter a valid email." };

  let user;
  try {
    user = await updateUserProfile(session.sub, { name, email });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not update profile." };
  }
  // Refresh the session so the new name/email take effect immediately.
  await setSession({ sub: user.id, email: user.email, name: user.name, role: user.role });
  revalidatePath("/account");
  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Admin: reset a customer's password to a fresh temporary one. The temp
 * password is returned so the admin can relay it (e.g. over WhatsApp); the
 * customer changes it from their account afterward. Admin-guarded.
 */
export async function adminResetPasswordAction(userId: string) {
  const session = await getSession();
  if (session?.role !== "admin") return { error: "Not authorised." };
  const temp = "reckless-" + Math.floor(1000 + Math.random() * 9000);
  const u = await setUserPassword(userId, temp);
  if (!u) return { error: "Account not found." };
  return { ok: true, tempPassword: temp, email: u.email, name: u.name };
}

/** Change the signed-in user's password (requires current password). */
export async function changePasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await getSession();
  if (!session) return { error: "You're signed out." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 6) return { error: "New password must be at least 6 characters." };
  if (!(await findById(session.sub))) return { error: "Account not found." };

  try {
    await updateUserPassword(session.sub, current, next);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not change password." };
  }
  return { ok: true };
}

/** Save the signed-in customer's shipping address. */
export async function saveAddressAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const session = await getSession();
  if (!session) return { error: "You're signed out." };

  const address: Address = {
    fullName: String(formData.get("fullName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address1: String(formData.get("address1") ?? "").trim(),
    address2: String(formData.get("address2") ?? "").trim() || undefined,
    city: String(formData.get("city") ?? "").trim(),
    region: String(formData.get("region") ?? "").trim() || undefined,
    postalCode: String(formData.get("postalCode") ?? "").trim() || undefined,
    countryCode: String(formData.get("countryCode") ?? "GM").trim(),
  };
  if (!address.fullName || !address.address1 || !address.city) {
    return { error: "Name, address and city are required." };
  }
  await updateUserAddress(session.sub, address);
  return { ok: true };
}

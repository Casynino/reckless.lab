"use server";

import { db } from "@/lib/db";

/** Store a newsletter signup. Idempotent — re-subscribing is a no-op, not an error. */
export async function subscribeNewsletterAction(emailRaw: string) {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@") || email.length < 5) return { error: "Enter a valid email." };
  try {
    await db.newsletterSubscriber.upsert({ where: { email }, create: { email }, update: {} });
  } catch {
    return { error: "Couldn't subscribe just now — please try again." };
  }
  return { ok: true };
}

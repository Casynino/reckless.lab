"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { createReview, markHelpful, setReviewStatus, deleteReview } from "./store";

export async function submitReviewAction(input: {
  productId: string;
  productSlug: string;
  rating: number;
  title: string;
  body: string;
  fit: number;
  recommend: boolean;
  name?: string;
  email?: string;
}) {
  const session = await getSession();
  const authorName = (session?.name || input.name || "").trim();
  const authorEmail = (session?.email || input.email || "").trim();

  if (!authorName) return { error: "Please add your name." };
  if (!authorEmail.includes("@")) return { error: "Please add a valid email." };
  if (!input.rating || input.rating < 1) return { error: "Pick a star rating." };
  if (!input.title.trim()) return { error: "Add a short headline." };
  if (input.body.trim().length < 10) return { error: "Tell us a little more (10+ characters)." };

  await createReview({
    productId: input.productId,
    userId: session?.sub,
    authorName,
    authorEmail,
    rating: input.rating,
    title: input.title,
    body: input.body,
    fit: input.fit,
    recommend: input.recommend,
  });

  revalidatePath(`/products/${input.productSlug}`);
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function helpfulReviewAction(id: string) {
  await markHelpful(id);
  return { ok: true };
}

async function requireAdmin() {
  const s = await getSession();
  return s?.role === "admin";
}

export async function setReviewStatusAction(id: string, status: "PUBLISHED" | "HIDDEN") {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  await setReviewStatus(id, status);
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function deleteReviewAction(id: string) {
  if (!(await requireAdmin())) return { error: "Not authorised." };
  await deleteReview(id);
  revalidatePath("/admin/reviews");
  return { ok: true };
}

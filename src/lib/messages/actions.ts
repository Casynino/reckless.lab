"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session-cookies";
import { addMessage, getOrCreateForCustomer, getConversationById, markRead } from "./store";

/** Customer sends a message on their own support thread. */
export async function sendCustomerMessageAction(body: string) {
  const session = await getSession();
  if (!session) return { error: "You're signed out." };
  const text = body.trim();
  if (!text) return { error: "Type a message." };
  const convo = await getOrCreateForCustomer({ id: session.sub, name: session.name, email: session.email });
  await addMessage(convo.id, "customer", text);
  revalidatePath("/account/messages");
  revalidatePath("/admin/messages");
  return { ok: true };
}

/** Admin replies to a conversation. */
export async function sendAdminMessageAction(convId: string, body: string) {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Not authorised." };
  const text = body.trim();
  if (!text) return { error: "Type a message." };
  if (!(await getConversationById(convId))) return { error: "Conversation not found." };
  await addMessage(convId, "admin", text);
  revalidatePath("/admin/messages");
  revalidatePath("/account/messages");
  return { ok: true };
}

export async function markReadAction(convId: string, side: "customer" | "admin") {
  const session = await getSession();
  if (!session) return;
  if (side === "admin" && session.role !== "admin") return;
  await markRead(convId, side);
  revalidatePath(side === "admin" ? "/admin/messages" : "/account/messages");
}

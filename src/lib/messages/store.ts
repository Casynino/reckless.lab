import "server-only";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Conversation, Message, Sender } from "./types";

/**
 * File-backed support conversations (one thread per customer). Swap-point for a
 * DB / real-time backend later.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "messages.json");

function readAll(): Conversation[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Conversation[];
  } catch {
    return [];
  }
}
function writeAll(convos: Conversation[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(convos, null, 2), "utf8");
}

/** Admin inbox — newest activity first. */
export function listConversations(): Conversation[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getConversationById(id: string): Conversation | undefined {
  return readAll().find((c) => c.id === id);
}

/** The customer's own thread (created on first open). */
export function getOrCreateForCustomer(customer: { id: string; name: string; email: string }): Conversation {
  const convos = readAll();
  const existing = convos.find((c) => c.customerId === customer.id);
  if (existing) return existing;
  const now = new Date().toISOString();
  const convo: Conversation = {
    id: randomUUID(),
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    messages: [],
    createdAt: now,
    updatedAt: now,
    unreadAdmin: 0,
    unreadCustomer: 0,
  };
  writeAll([convo, ...convos]);
  return convo;
}

export function addMessage(convId: string, from: Sender, body: string): Conversation | undefined {
  const convos = readAll();
  const idx = convos.findIndex((c) => c.id === convId);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const msg: Message = { id: randomUUID(), from, body: body.trim(), at: now };
  const c = convos[idx];
  c.messages.push(msg);
  c.updatedAt = now;
  if (from === "customer") c.unreadAdmin += 1;
  else c.unreadCustomer += 1;
  convos[idx] = c;
  writeAll(convos);
  return c;
}

/** Mark a conversation read for one side. */
export function markRead(convId: string, side: Sender) {
  const convos = readAll();
  const idx = convos.findIndex((c) => c.id === convId);
  if (idx === -1) return;
  if (side === "admin") convos[idx].unreadAdmin = 0;
  else convos[idx].unreadCustomer = 0;
  writeAll(convos);
}

export function totalUnreadForAdmin(): number {
  return readAll().reduce((n, c) => n + c.unreadAdmin, 0);
}

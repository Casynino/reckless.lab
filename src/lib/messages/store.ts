import "server-only";
import { db } from "@/lib/db";
import type { Prisma, Sender as DbSender } from "@prisma/client";
import type { Conversation, Sender } from "./types";

/** Support conversations — Postgres (Prisma). One thread per customer. */

const convoInclude = { messages: { orderBy: { at: "asc" } } } satisfies Prisma.ConversationInclude;
type ConvoRow = Prisma.ConversationGetPayload<{ include: typeof convoInclude }>;

const toAppSender = (s: DbSender): Sender => s.toLowerCase() as Sender;
const toDbSender = (s: Sender): DbSender => s.toUpperCase() as DbSender;

function toConversation(c: ConvoRow): Conversation {
  return {
    id: c.id,
    customerId: c.userId ?? "",
    customerName: c.customerName,
    customerEmail: c.customerEmail,
    unreadAdmin: c.unreadAdmin,
    unreadCustomer: c.unreadCustomer,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    messages: c.messages.map((m) => ({ id: m.id, from: toAppSender(m.from), body: m.body, at: m.at.toISOString() })),
  };
}

export async function listConversations(): Promise<Conversation[]> {
  const rows = await db.conversation.findMany({ include: convoInclude, orderBy: { updatedAt: "desc" } });
  return rows.map(toConversation);
}

export async function getConversationById(id: string): Promise<Conversation | undefined> {
  const row = await db.conversation.findUnique({ where: { id }, include: convoInclude });
  return row ? toConversation(row) : undefined;
}

export async function getOrCreateForCustomer(customer: { id: string; name: string; email: string }): Promise<Conversation> {
  const existing = await db.conversation.findFirst({ where: { userId: customer.id }, include: convoInclude });
  if (existing) return toConversation(existing);
  const created = await db.conversation.create({
    data: { userId: customer.id, customerName: customer.name, customerEmail: customer.email },
    include: convoInclude,
  });
  return toConversation(created);
}

export async function addMessage(convId: string, from: Sender, body: string): Promise<Conversation | undefined> {
  const exists = await db.conversation.findUnique({ where: { id: convId } });
  if (!exists) return undefined;
  const row = await db.conversation.update({
    where: { id: convId },
    data: {
      messages: { create: [{ from: toDbSender(from), body: body.trim() }] },
      ...(from === "customer" ? { unreadAdmin: { increment: 1 } } : { unreadCustomer: { increment: 1 } }),
    },
    include: convoInclude,
  });
  return toConversation(row);
}

export async function markRead(convId: string, side: Sender): Promise<void> {
  await db.conversation.update({
    where: { id: convId },
    data: side === "admin" ? { unreadAdmin: 0 } : { unreadCustomer: 0 },
  });
}

export async function totalUnreadForAdmin(): Promise<number> {
  const agg = await db.conversation.aggregate({ _sum: { unreadAdmin: true } });
  return agg._sum.unreadAdmin ?? 0;
}

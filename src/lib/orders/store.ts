import "server-only";
import { db } from "@/lib/db";
import type { OrderState as DbOrderState, Prisma } from "@prisma/client";
import type { Order, OrderLine, OrderState } from "./types";

/** Orders store — Postgres (Prisma). App uses lowercase states; DB uses the enum. */

function toAppState(s: DbOrderState): OrderState {
  return s.toLowerCase() as OrderState;
}
function toDbState(s: OrderState): DbOrderState {
  return s.toUpperCase() as DbOrderState;
}

function code(len: number) {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}

const orderInclude = {
  items: true,
  events: { orderBy: { at: "asc" } },
} satisfies Prisma.OrderInclude;

type OrderRow = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

function toOrder(o: OrderRow): Order {
  return {
    id: o.id,
    reference: o.reference,
    tracking: o.tracking,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    countryCode: o.countryCode,
    address1: o.address1,
    address2: o.address2 ?? undefined,
    city: o.city,
    region: o.region ?? undefined,
    postalCode: o.postalCode ?? undefined,
    lines: o.items.map(
      (i): OrderLine => ({
        productId: i.productId ?? "",
        slug: "",
        name: i.name,
        colorway: i.colorway,
        size: i.size,
        price: i.price,
        qty: i.qty,
        image: i.image,
        sku: i.sku,
      }),
    ),
    subtotal: o.subtotal,
    shipping: o.shipping,
    discount: o.discount,
    couponCode: o.couponCode ?? undefined,
    total: o.total,
    state: toAppState(o.state),
    history: o.events.map((e) => ({ state: toAppState(e.state), at: e.at.toISOString() })),
    createdAt: o.createdAt.toISOString(),
  };
}

export async function listOrders(): Promise<Order[]> {
  const rows = await db.order.findMany({ include: orderInclude, orderBy: { createdAt: "desc" } });
  return rows.map(toOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const row = await db.order.findUnique({ where: { id }, include: orderInclude });
  return row ? toOrder(row) : undefined;
}

/** Public tracking lookup — by the order reference (RL-XXXXXX). */
export async function getOrderByReference(reference: string): Promise<Order | undefined> {
  const row = await db.order.findUnique({ where: { reference }, include: orderInclude });
  return row ? toOrder(row) : undefined;
}

/** Aggregate order stats per customer email — for LTV / admin customer view. */
export async function getCustomerOrderStats(): Promise<
  Record<string, { orders: number; spend: number; last: string }>
> {
  const rows = await db.order.groupBy({
    by: ["customerEmail"],
    _count: { _all: true },
    _sum: { total: true },
    _max: { createdAt: true },
  });
  const map: Record<string, { orders: number; spend: number; last: string }> = {};
  for (const r of rows) {
    map[r.customerEmail.toLowerCase()] = {
      orders: r._count._all,
      spend: r._sum.total ?? 0,
      last: r._max.createdAt ? r._max.createdAt.toISOString() : "",
    };
  }
  return map;
}

/** A customer's own orders, newest first — matched on the checkout email. */
export async function listOrdersForEmail(email: string): Promise<Order[]> {
  const rows = await db.order.findMany({
    where: { customerEmail: { equals: email, mode: "insensitive" } },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function createOrder(
  input: Omit<Order, "id" | "reference" | "tracking" | "state" | "history" | "createdAt">,
  opts?: { userId?: string },
): Promise<Order> {
  const row = await db.order.create({
    data: {
      reference: "RL-" + code(6),
      tracking: `RL-${code(4)}-${code(4)}`,
      userId: opts?.userId ?? null,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      countryCode: input.countryCode,
      address1: input.address1,
      address2: input.address2 ?? null,
      city: input.city,
      region: input.region ?? null,
      postalCode: input.postalCode ?? null,
      subtotal: input.subtotal,
      shipping: input.shipping,
      discount: input.discount,
      couponCode: input.couponCode ?? null,
      total: input.total,
      state: "NEW",
      items: {
        create: input.lines.map((l) => ({
          productId: l.productId || null,
          name: l.name,
          colorway: l.colorway,
          size: l.size,
          sku: l.sku,
          price: l.price,
          qty: l.qty,
          image: l.image,
        })),
      },
      events: { create: [{ state: "NEW" }] },
    },
    include: orderInclude,
  });
  return toOrder(row);
}

/** Advance / override an order's state and append a tracking event. */
export async function updateOrderState(id: string, state: OrderState): Promise<Order | undefined> {
  const exists = await db.order.findUnique({ where: { id } });
  if (!exists) return undefined;
  const row = await db.order.update({
    where: { id },
    data: { state: toDbState(state), events: { create: [{ state: toDbState(state) }] } },
    include: orderInclude,
  });
  return toOrder(row);
}

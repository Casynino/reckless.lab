import "server-only";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { products } from "@/lib/data/products";
import { ORDER_STAGES, stageIndex, type Order, type OrderLine, type OrderState } from "./types";

/**
 * File-backed orders store (mirrors the user store). Seeds a realistic set of
 * demo orders on first run so the admin has data to work with. Real orders are
 * appended when a customer completes checkout.
 *
 * Swap-point for a real DB — keep these exported signatures.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "orders.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");
}
function readAll(): Order[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}
function writeAll(orders: Order[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(orders, null, 2), "utf8");
}

function code(len: number): string {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}

function lineFrom(slug: string, size: string, qty: number): OrderLine | null {
  const p = products.find((x) => x.slug === slug);
  if (!p) return null;
  const v = p.variants.find((x) => x.size === size) ?? p.variants[0];
  return {
    productId: p.id,
    slug: p.slug,
    name: p.name,
    colorway: p.colorway,
    size: v.size,
    price: p.price,
    qty,
    image: p.media[0]?.src ?? "",
    sku: v.sku,
  };
}

/** Build the timeline history up to and including the current state. */
function buildHistory(state: OrderState, placedAt: Date): Order["history"] {
  const idx = stageIndex(state);
  if (idx < 0) {
    // issue / cancelled: show it happened partway
    return [
      { state: "new", at: placedAt.toISOString() },
      { state, at: new Date(placedAt.getTime() + 3600e3 * 6).toISOString() },
    ];
  }
  return ORDER_STAGES.slice(0, idx + 1).map((s, i) => ({
    state: s.key,
    at: new Date(placedAt.getTime() + i * 3600e3 * 8).toISOString(),
  }));
}

interface Seed {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: OrderState;
  daysAgo: number;
  items: { slug: string; size: string; qty: number }[];
}

const SEEDS: Seed[] = [
  { name: "Amie Njie", email: "amie.njie@example.com", phone: "+220 700 1121", country: "GM", state: "delivered", daysAgo: 12, items: [{ slug: "identity-tee-white", size: "M", qty: 1 }, { slug: "reckless-tee-washed-blue", size: "L", qty: 1 }] },
  { name: "Lamin Touray", email: "lamin.t@example.com", phone: "+220 700 4410", country: "GM", state: "in_transit", daysAgo: 4, items: [{ slug: "identity-tee-washed-black", size: "L", qty: 2 }] },
  { name: "Fatou Ceesay", email: "fatou.c@example.com", phone: "+220 700 8890", country: "GM", state: "packaging", daysAgo: 1, items: [{ slug: "reckless-tee-washed-grey", size: "S", qty: 1 }] },
  { name: "Omar Sané", email: "omar.sane@example.com", phone: "+221 77 555 2020", country: "SN", state: "new", daysAgo: 0, items: [{ slug: "identity-tee-washed-brown", size: "XL", qty: 1 }, { slug: "identity-tee-storm-grey", size: "M", qty: 1 }] },
  { name: "James Cole", email: "j.cole@example.com", phone: "+44 7700 900123", country: "GB", state: "delivered", daysAgo: 20, items: [{ slug: "reckless-tee-washed-blue", size: "M", qty: 1 }] },
  { name: "Aisha Bah", email: "aisha.bah@example.com", phone: "+220 700 3321", country: "GM", state: "delivered", daysAgo: 15, items: [{ slug: "identity-tee-white", size: "S", qty: 1 }, { slug: "identity-tee-storm-grey", size: "L", qty: 2 }] },
  { name: "Marcus Reid", email: "m.reid@example.com", phone: "+1 202 555 0147", country: "US", state: "in_transit", daysAgo: 6, items: [{ slug: "identity-tee-washed-black", size: "M", qty: 1 }] },
  { name: "Binta Jallow", email: "binta.j@example.com", phone: "+220 700 6655", country: "GM", state: "payment_confirmed", daysAgo: 0, items: [{ slug: "reckless-tee-washed-grey", size: "L", qty: 1 }] },
  { name: "Kebba Manneh", email: "kebba.m@example.com", phone: "+220 700 1198", country: "GM", state: "ready_to_ship", daysAgo: 2, items: [{ slug: "identity-tee-washed-brown", size: "M", qty: 1 }, { slug: "reckless-tee-washed-blue", size: "M", qty: 1 }] },
  { name: "Sophie Martin", email: "sophie.m@example.com", phone: "+33 6 12 34 56 78", country: "FR", state: "delivered", daysAgo: 25, items: [{ slug: "identity-tee-white", size: "L", qty: 1 }] },
  { name: "Isatou Drammeh", email: "isatou.d@example.com", phone: "+220 700 7742", country: "GM", state: "issue", daysAgo: 8, items: [{ slug: "identity-tee-storm-grey", size: "XL", qty: 1 }] },
  { name: "Modou Faye", email: "modou.f@example.com", phone: "+220 700 9903", country: "GM", state: "delivered", daysAgo: 18, items: [{ slug: "reckless-tee-washed-grey", size: "M", qty: 2 }] },
  { name: "Ebrima Sowe", email: "ebrima.s@example.com", phone: "+220 700 2214", country: "GM", state: "new", daysAgo: 0, items: [{ slug: "identity-tee-washed-black", size: "S", qty: 1 }] },
  { name: "Grace Owens", email: "grace.o@example.com", phone: "+1 416 555 0199", country: "CA", state: "packaging", daysAgo: 1, items: [{ slug: "identity-tee-white", size: "M", qty: 1 }, { slug: "identity-tee-washed-brown", size: "L", qty: 1 }] },
];

function shippingFor(country: string, subtotal: number): number {
  if (subtotal >= 90) return 0;
  if (country === "GM") return 0;
  if (["SN", "NG", "GH"].includes(country)) return 18;
  if (["GB", "FR", "DE", "IT", "ES", "NL"].includes(country)) return 32;
  if (["US", "CA"].includes(country)) return 38;
  return 46;
}

function ensureSeed(orders: Order[]): Order[] {
  if (orders.length > 0) return orders;
  const now = Date.now();
  const seeded: Order[] = SEEDS.map((s) => {
    const placedAt = new Date(now - s.daysAgo * 864e5 - Math.floor(Math.random() * 6) * 3600e3);
    const lines = s.items.map((it) => lineFrom(it.slug, it.size, it.qty)).filter(Boolean) as OrderLine[];
    const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
    const shipping = shippingFor(s.country, subtotal);
    return {
      id: randomUUID(),
      reference: "RL-" + code(6),
      tracking: `RL-${code(4)}-${code(4)}`,
      customerName: s.name,
      customerEmail: s.email,
      customerPhone: s.phone,
      countryCode: s.country,
      lines,
      subtotal,
      shipping,
      total: subtotal + shipping,
      state: s.state,
      history: buildHistory(s.state, placedAt),
      createdAt: placedAt.toISOString(),
    };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  writeAll(seeded);
  return seeded;
}

export function listOrders(): Order[] {
  return ensureSeed(readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(id: string): Order | undefined {
  return listOrders().find((o) => o.id === id);
}

export function createOrder(input: Omit<Order, "id" | "reference" | "tracking" | "state" | "history" | "createdAt">): Order {
  const orders = ensureSeed(readAll());
  const createdAt = new Date().toISOString();
  const order: Order = {
    ...input,
    id: randomUUID(),
    reference: "RL-" + code(6),
    tracking: `RL-${code(4)}-${code(4)}`,
    state: "new",
    history: [{ state: "new", at: createdAt }],
    createdAt,
  };
  writeAll([order, ...orders]);
  return order;
}

export function updateOrderState(id: string, state: OrderState): Order | undefined {
  const orders = ensureSeed(readAll());
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  const order = orders[idx];
  order.state = state;
  order.history = buildHistory(state, new Date(order.createdAt));
  order.history[order.history.length - 1] = { state, at: now };
  orders[idx] = order;
  writeAll(orders);
  return order;
}

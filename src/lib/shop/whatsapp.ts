import type { CartLine, ShippingAddress } from "@/lib/types";
import { shopConfig } from "./config";
import { formatPrice } from "./format";
import { quoteShipping } from "./shipping";

export interface OrderDraft {
  lines: CartLine[];
  address: ShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  shippingMethod: string;
  shippingEta: string;
  shippingTbc: boolean;
  reference: string;
}

/** Deterministic-ish order reference from the cart + a caller-supplied seed. */
export function buildReference(seed: number): string {
  return "RL-" + seed.toString(36).toUpperCase().slice(-6).padStart(6, "0");
}

export function buildOrderDraft(
  lines: CartLine[],
  address: ShippingAddress,
  seed: number,
): OrderDraft {
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const q = quoteShipping(address.countryCode, subtotal);
  return {
    lines,
    address,
    subtotal,
    shipping: q.fee,
    total: subtotal + q.fee,
    shippingMethod: q.courier,
    shippingEta: q.eta,
    shippingTbc: q.tbc,
    reference: buildReference(seed),
  };
}

/**
 * Render the order as a WhatsApp message. This is the current "checkout": the
 * customer confirms and the message opens in WhatsApp addressed to the
 * business line. Swapping in a payment gateway later means calling a
 * `createPaymentSession` here instead of `buildWhatsAppUrl` — the order draft
 * shape stays the same.
 */
export function buildOrderMessage(order: OrderDraft): string {
  const { brand } = shopConfig;
  const L: string[] = [];

  L.push(`*${brand.name.toUpperCase()} — NEW ORDER*`);
  L.push(`Ref: ${order.reference}`);
  L.push("");
  L.push("*Items*");
  for (const line of order.lines) {
    L.push(`• ${line.qty}× ${line.name} — ${line.colorway} / ${line.size}`);
    L.push(`   ${formatPrice(line.price)} each · ${line.sku}`);
  }
  L.push("");
  L.push("*Summary*");
  L.push(`Subtotal: ${formatPrice(order.subtotal)}`);
  L.push(`Courier: ${order.shippingMethod} — ${order.shippingEta}`);
  if (order.shippingTbc) {
    L.push("Shipping: TO BE CONFIRMED (our team will quote before payment)");
    L.push(`*Total (excl. shipping): ${formatPrice(order.total)}*`);
  } else {
    L.push(`Shipping: ${order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}`);
    L.push(`*Total: ${formatPrice(order.total)}*`);
  }
  L.push("");
  L.push("*Ship to*");
  L.push(order.address.fullName);
  L.push(order.address.address1);
  if (order.address.address2) L.push(order.address.address2);
  L.push([order.address.city, order.address.region, order.address.postalCode].filter(Boolean).join(", "));
  L.push(order.address.countryCode);
  L.push(`Phone: ${order.address.phone}`);
  L.push(`Email: ${order.address.email}`);
  L.push("");
  L.push("Please confirm availability and payment instructions. Thank you.");

  return L.join("\n");
}

export function buildWhatsAppUrl(order: OrderDraft): string {
  const text = encodeURIComponent(buildOrderMessage(order));
  return `https://wa.me/${shopConfig.whatsapp.number}?text=${text}`;
}

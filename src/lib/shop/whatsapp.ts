import type { CartLine, ShippingAddress } from "@/lib/types";
import { shopConfig } from "./config";
import { formatPrice } from "./format";
import { quoteShipping, countryName, type ShippingRegion } from "./shipping";

export interface OrderDraft {
  lines: CartLine[];
  address: ShippingAddress;
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
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
  regions: ShippingRegion[],
  lines: CartLine[],
  address: ShippingAddress,
  seed: number,
): OrderDraft {
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const q = quoteShipping(regions, address.countryCode, subtotal);
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
  const a = order.address;
  const L: string[] = [];

  L.push(`*${brand.name.toUpperCase()} — NEW ORDER*`);
  L.push("");
  L.push(`*Order Ref:* ${order.reference}`);
  L.push("");

  // Items — one clean labelled block per line
  L.push("*ITEMS*");
  order.lines.forEach((line, i) => {
    L.push(`• ${line.qty}× ${line.name}`);
    L.push(`  Color: ${line.colorway}`);
    L.push(`  Size: ${line.size}`);
    L.push(`  Price: ${formatPrice(line.price)}`);
    L.push(`  Code: ${line.sku}`);
    if (i < order.lines.length - 1) L.push("");
  });
  L.push("");

  // Order summary
  L.push("*ORDER SUMMARY*");
  L.push(`Subtotal: ${formatPrice(order.subtotal)}`);
  L.push(`Shipping: ${order.shippingTbc ? "To be confirmed" : order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}`);
  if (order.discount && order.discount > 0) {
    L.push(`Discount${order.couponCode ? ` (${order.couponCode})` : ""}: -${formatPrice(order.discount)}`);
  }
  L.push(`Delivery: ${order.shippingMethod} (${order.shippingEta})`);
  L.push("");
  L.push(
    order.shippingTbc
      ? `*TOTAL: ${formatPrice(order.total)} + shipping (to be confirmed)*`
      : `*TOTAL: ${formatPrice(order.total)}*`,
  );
  L.push("");

  // Delivery details — labelled, human country name
  L.push("*DELIVERY DETAILS*");
  L.push(`Name: ${a.fullName}`);
  L.push(`Address: ${a.address1}`);
  if (a.address2) L.push(`House No: ${a.address2}`);
  L.push(`City: ${a.city}`);
  if (a.region) L.push(`District: ${a.region}`);
  if (a.postalCode) L.push(`Postal Code: ${a.postalCode}`);
  L.push(`Country: ${countryName(a.countryCode)}`);
  L.push("");
  L.push(`Phone: ${a.phone}`);
  L.push(`Email: ${a.email}`);
  L.push("");

  L.push("Please confirm item availability and share payment instructions.");
  L.push("");
  L.push("Thank you.");

  return L.join("\n");
}

export function buildWhatsAppUrl(order: OrderDraft): string {
  const text = encodeURIComponent(buildOrderMessage(order));
  return `https://wa.me/${shopConfig.whatsapp.number}?text=${text}`;
}

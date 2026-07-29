/**
 * Orders domain — a staged order with a tracking timeline, modelled on the
 * Haodeals flow (New → Payment → Packaging → Ready → In Transit → Delivered).
 */

export type OrderStage =
  | "new"
  | "payment_confirmed"
  | "packaging"
  | "ready_to_ship"
  | "in_transit"
  | "delivered";

export type OrderState = OrderStage | "issue" | "cancelled";

/** Ordered pipeline stages (used to draw the tracking timeline). */
export const ORDER_STAGES: { key: OrderStage; label: string; short: string }[] = [
  { key: "new", label: "New Order", short: "Ordered" },
  { key: "payment_confirmed", label: "Payment Confirmed", short: "Paid" },
  { key: "packaging", label: "Packaging", short: "Packing" },
  { key: "ready_to_ship", label: "Ready to Ship", short: "Ready" },
  { key: "in_transit", label: "In Transit", short: "Shipped" },
  { key: "delivered", label: "Delivered", short: "Delivered" },
];

export function stageIndex(state: OrderState): number {
  const i = ORDER_STAGES.findIndex((s) => s.key === state);
  return i; // -1 for issue/cancelled
}

export interface OrderLine {
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  size: string;
  price: number;
  qty: number;
  image: string;
  sku: string;
}

export interface OrderEvent {
  state: OrderState;
  at: string; // ISO
}

export interface Order {
  id: string;
  reference: string;
  /** Short tracking code, e.g. RL-8FQ3-KD21. */
  tracking: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  countryCode: string;
  address1: string;
  address2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  total: number;
  courier?: string;
  courierTracking?: string;
  state: OrderState;
  history: OrderEvent[];
  createdAt: string;
}

export const STATE_META: Record<
  OrderState,
  { label: string; /** tailwind text + bg tint classes */ tone: string; dot: string }
> = {
  new: { label: "New Order", tone: "text-sky-300 bg-sky-500/10 border-sky-500/30", dot: "bg-sky-400" },
  payment_confirmed: {
    label: "Payment Confirmed",
    tone: "text-blue-300 bg-blue-500/10 border-blue-500/30",
    dot: "bg-blue-400",
  },
  packaging: { label: "Packaging", tone: "text-amber-300 bg-amber-500/10 border-amber-500/30", dot: "bg-amber-400" },
  ready_to_ship: {
    label: "Ready to Ship",
    tone: "text-yellow-300 bg-yellow-500/10 border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  in_transit: {
    label: "In Transit",
    tone: "text-violet-300 bg-violet-500/10 border-violet-500/30",
    dot: "bg-violet-400",
  },
  delivered: {
    label: "Delivered",
    tone: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  issue: { label: "Issue", tone: "text-acid bg-acid/10 border-acid/40", dot: "bg-acid" },
  cancelled: { label: "Cancelled", tone: "text-ash bg-smoke/40 border-smoke", dot: "bg-ash" },
};

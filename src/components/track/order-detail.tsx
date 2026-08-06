"use client";

import { motion } from "framer-motion";
import { SmartImage } from "@/components/ui/smart-image";
import { ORDER_STAGES, stageIndex, STATE_META, type Order } from "@/lib/orders/types";
import { formatPrice } from "@/lib/shop/format";
import { countryName } from "@/lib/shop/shipping";

/** Premium customer-facing order view: status, tracking timeline, items, totals. */
export function OrderDetail({ order }: { order: Order }) {
  const current = stageIndex(order.state);
  const exception = current < 0; // issue / cancelled
  const meta = STATE_META[order.state];
  // Snapshot captured at checkout; fall back gracefully for legacy orders.
  const isFree = order.freeShipping ?? order.shipping === 0;
  const eventAt = (key: string) => order.history.find((h) => h.state === key)?.at;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
      {/* Left: status + timeline */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.2em] ${meta.tone}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          {!exception && order.shippingEta && (
            <span className="text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
              Est. delivery — {order.shippingEta}
            </span>
          )}
        </div>

        <h3 className="mt-6 font-display text-3xl uppercase tracking-tight text-bone md:text-4xl">
          Order {order.reference}
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">
          <span>Tracking · {order.tracking}</span>
          <span>Placed · {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          {order.courier && <span className="text-bone-dim">Courier · {order.courier}{order.courierTracking ? ` (${order.courierTracking})` : ""}</span>}
        </div>

        {/* Vertical timeline */}
        {exception ? (
          <div className={`mt-8 rounded-sm border p-5 ${meta.tone}`}>
            <p className="text-sm">
              {order.state === "cancelled"
                ? "This order was cancelled. Contact us on WhatsApp if that's unexpected."
                : "There's an issue with this order — our team will reach out on WhatsApp."}
            </p>
          </div>
        ) : (
          <ol className="mt-9">
            {ORDER_STAGES.map((stage, i) => {
              const done = i < current;
              const active = i === current;
              const at = eventAt(stage.key);
              return (
                <li key={stage.key} className="relative flex gap-5 pb-8 last:pb-0">
                  {/* connector */}
                  {i < ORDER_STAGES.length - 1 && (
                    <span className={`absolute left-[7px] top-4 h-full w-px ${done ? "bg-acid" : "bg-smoke"}`} />
                  )}
                  <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                    {active ? (
                      <motion.span
                        className="h-4 w-4 rounded-full bg-acid"
                        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                    ) : (
                      <span className={`h-3.5 w-3.5 rounded-full border ${done ? "border-acid bg-acid" : "border-smoke bg-ink"}`} />
                    )}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${done || active ? "text-bone" : "text-ash"}`}>{stage.label}</p>
                    {at ? (
                      <p className="mt-0.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                        {new Date(at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-smoke">{active ? "In progress" : "Pending"}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Right: items + summary */}
      <div className="rounded-sm border border-smoke bg-ink-soft p-6 md:p-8">
        <h4 className="eyebrow mb-5">Your pieces</h4>
        <ul className="divide-y divide-smoke/60">
          {order.lines.map((l) => (
            <li key={l.sku} className="flex gap-4 py-4 first:pt-0">
              <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-sm bg-carbon">
                <SmartImage src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex flex-1 justify-between gap-3">
                <div>
                  <p className="text-sm text-bone">{l.name}</p>
                  <p className="mt-0.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                    {l.colorway} · {l.size} · Qty {l.qty}
                  </p>
                </div>
                <span className="text-sm text-bone-dim">{formatPrice(l.price * l.qty)}</span>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-smoke pt-5 text-sm">
          <div className="flex justify-between text-fog"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between text-fog">
            <dt>Shipping — {countryName(order.countryCode)}</dt>
            <dd className={isFree ? "text-acid" : ""}>
              {order.shippingTbc ? "To be confirmed" : isFree ? "Free" : formatPrice(order.shipping)}
            </dd>
          </div>
          {(order.shippingMethod || order.shippingEta) && (
            <p className="text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">
              {[order.shippingMethod, order.shippingEta].filter(Boolean).join(" · ")}
            </p>
          )}
          {order.discount > 0 && (
            <div className="flex justify-between text-acid"><dt>Promo{order.couponCode ? ` · ${order.couponCode}` : ""}</dt><dd>− {formatPrice(order.discount)}</dd></div>
          )}
          <div className="flex justify-between pt-2 text-base text-bone"><dt className="font-medium">Total</dt><dd className="font-medium">{formatPrice(order.total)}</dd></div>
          {order.shippingTbc && (
            <p className="text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">+ shipping · confirmed on WhatsApp</p>
          )}
        </dl>

        <div className="mt-6 border-t border-smoke pt-5 text-sm text-fog">
          <p className="text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">Shipping to</p>
          <p className="mt-2 text-bone">{order.customerName}</p>
          {order.address1 && <p className="mt-0.5">{order.address1}{order.address2 ? `, ${order.address2}` : ""}</p>}
          <p className="mt-0.5">
            {[order.city, order.region, order.postalCode].filter(Boolean).join(", ")}
          </p>
          <p className="mt-0.5">{countryName(order.countryCode)} · {order.customerPhone}</p>
        </div>
      </div>
    </div>
  );
}

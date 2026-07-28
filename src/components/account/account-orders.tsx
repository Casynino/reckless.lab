"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { OrderDetail } from "@/components/track/order-detail";
import { STATE_META, type Order } from "@/lib/orders/types";
import { formatPrice } from "@/lib/shop/format";

export function AccountOrders({ orders }: { orders: Order[] }) {
  const [open, setOpen] = useState<string | null>(orders[0]?.id ?? null);

  if (!orders.length) {
    return (
      <div className="rounded-sm border border-smoke bg-ink-soft p-8 text-center">
        <p className="text-mono text-xs uppercase tracking-[0.25em] text-ash">No orders yet</p>
        <p className="mt-3 text-sm text-fog">When you place an order it lands here — with live tracking.</p>
        <Link href="/collections/new-arrivals" className="mt-6 inline-block border border-bone px-8 py-3 text-mono text-xs uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink">
          Shop the drop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const meta = STATE_META[o.state];
        const isOpen = open === o.id;
        return (
          <div key={o.id} className="overflow-hidden rounded-sm border border-smoke bg-ink-soft">
            <button
              onClick={() => setOpen(isOpen ? null : o.id)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-carbon/30"
            >
              <div className="min-w-0">
                <p className="font-display text-lg tracking-tight text-bone">{o.reference}</p>
                <p className="mt-0.5 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                  {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {o.lines.reduce((n, l) => n + l.qty, 0)} item(s) · {formatPrice(o.total)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={`hidden items-center gap-2 rounded-full border px-3 py-1 text-mono text-[0.55rem] uppercase tracking-[0.15em] sm:inline-flex ${meta.tone}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                </span>
                <ChevronDown className={`h-4 w-4 text-ash transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="border-t border-smoke p-5 md:p-7">
                    <OrderDetail order={o} />
                    <Link
                      href={`/track?ref=${o.reference}&trk=${o.tracking}`}
                      className="link-underline mt-8 inline-block text-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim hover:text-bone"
                    >
                      Open full tracking page →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

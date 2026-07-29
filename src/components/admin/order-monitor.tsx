"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X, Phone, MapPin, AlertTriangle } from "lucide-react";
import type { Order, OrderState } from "@/lib/orders/types";
import { STATE_META, ORDER_STAGES, stageIndex } from "@/lib/orders/types";
import { formatPrice } from "@/lib/shop/format";
import { updateOrderStateAction } from "@/lib/orders/actions";
import { StageMini } from "@/components/admin/stage-mini";
import { OrderTracker } from "@/components/admin/order-tracker";
import { cn } from "@/lib/utils";

type Filter = "all" | "new" | "packaging" | "in_transit" | "delivered" | "issues";

function matchesFilter(o: Order, f: Filter): boolean {
  switch (f) {
    case "all":
      return true;
    case "new":
      return o.state === "new" || o.state === "payment_confirmed";
    case "packaging":
      return o.state === "packaging" || o.state === "ready_to_ship";
    case "in_transit":
      return o.state === "in_transit";
    case "delivered":
      return o.state === "delivered";
    case "issues":
      return o.state === "issue" || o.state === "cancelled";
  }
}

export function OrderMonitor({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { new: 0, packaging: 0, in_transit: 0, delivered: 0, issues: 0 };
    for (const o of orders) {
      if (o.state === "new" || o.state === "payment_confirmed") c.new++;
      else if (o.state === "packaging" || o.state === "ready_to_ship") c.packaging++;
      else if (o.state === "in_transit") c.in_transit++;
      else if (o.state === "delivered") c.delivered++;
      else c.issues++;
    }
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (!matchesFilter(o, filter)) return false;
      if (!q) return true;
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.reference.toLowerCase().includes(q) ||
        o.tracking.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, query]);

  const cards: { label: string; value: number; filter: Filter; color: string; ping?: boolean }[] = [
    { label: "New Orders", value: counts.new, filter: "new", color: "text-sky-400", ping: counts.new > 0 },
    { label: "Packaging", value: counts.packaging, filter: "packaging", color: "text-amber-400" },
    { label: "In Transit", value: counts.in_transit, filter: "in_transit", color: "text-violet-400" },
    { label: "Delivered", value: counts.delivered, filter: "delivered", color: "text-emerald-400" },
    { label: "Issues", value: counts.issues, filter: "issues", color: "text-acid", ping: counts.issues > 0 },
  ];

  return (
    <div>
      {/* Summary cards (also filters) */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {cards.map((c) => (
          <button
            key={c.filter}
            onClick={() => setFilter((f) => (f === c.filter ? "all" : c.filter))}
            className={cn(
              "relative border bg-ink-soft p-4 text-left transition-colors",
              filter === c.filter ? "border-bone/40 bg-carbon" : "border-smoke hover:border-ash/50",
            )}
          >
            {c.ping && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 animate-ping rounded-full bg-current opacity-70" />
            )}
            <p className={cn("figure text-2xl", c.color)}>{c.value}</p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.13em] text-ash">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3 border-b border-smoke pb-2">
        <Search className="h-4 w-4 text-ash" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders, customers, tracking…"
          className="flex-1 bg-transparent py-1 text-sm text-bone placeholder:text-ash focus:outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear">
            <X className="h-4 w-4 text-ash hover:text-bone" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {(["all", "new", "packaging", "in_transit", "delivered", "issues"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "border px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.15em] transition-colors",
              filter === f ? "border-bone/40 bg-carbon text-bone" : "border-smoke text-ash hover:text-bone",
            )}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="border border-smoke bg-ink-soft p-10 text-center text-sm text-fog">No orders match.</p>
        )}
        {filtered.map((o) => (
          <OrderRow key={o.id} order={o} open={openId === o.id} onToggle={() => setOpenId((id) => (id === o.id ? null : o.id))} />
        ))}
      </div>
    </div>
  );
}

function OrderRow({ order, open, onToggle }: { order: Order; open: boolean; onToggle: () => void }) {
  const meta = STATE_META[order.state];
  const date = new Date(order.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-smoke bg-ink-soft">
      <button onClick={onToggle} className="flex w-full items-start justify-between gap-4 p-4 text-left">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium uppercase tracking-wide text-bone">{order.customerName}</p>
          <p className="mt-0.5 truncate text-[0.7rem] uppercase tracking-[0.15em] text-ash">
            {order.reference} · {order.tracking} · {date}
          </p>
          <StageMini state={order.state} />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden flex-col items-end gap-1 sm:flex">
            <span className={cn("border px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.15em]", meta.tone)}>
              {meta.label}
            </span>
            <span className="text-sm text-emerald-400">{formatPrice(order.total)}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-ash transition-transform", open && "rotate-180")} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-smoke"
          >
            <div className="grid gap-5 p-4 lg:grid-cols-[1.1fr_1fr]">
              <OrderTracker state={order.state} history={order.history} tracking={order.tracking} />

              <div className="flex flex-col gap-5">
                {/* Customer + address */}
                <div className="border border-smoke bg-ink p-4 text-sm">
                  <p className="mb-2 text-[0.7rem] uppercase tracking-[0.15em] text-ash">Customer</p>
                  <p className="text-bone">{order.customerName}</p>
                  <p className="text-fog">{order.customerEmail}</p>
                  <p className="mt-1 flex items-center gap-2 text-fog">
                    <Phone className="h-3.5 w-3.5 text-ash" /> {order.customerPhone}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-fog">
                    <MapPin className="h-3.5 w-3.5 text-ash" /> {order.countryCode}
                  </p>
                </div>

                {/* Items */}
                <div className="border border-smoke bg-ink p-4">
                  <p className="mb-3 text-[0.7rem] uppercase tracking-[0.15em] text-ash">Items</p>
                  <ul className="space-y-2 text-sm">
                    {order.lines.map((l) => (
                      <li key={l.sku} className="flex items-center justify-between gap-2">
                        <span className="text-bone-dim">
                          {l.qty}× {l.name} <span className="text-ash">/ {l.colorway} / {l.size}</span>
                        </span>
                        <span className="text-bone">{formatPrice(l.price * l.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-smoke pt-3 text-sm">
                    <span className="text-ash">Total ({order.shipping === 0 ? "free ship" : formatPrice(order.shipping) + " ship"})</span>
                    <span className="figure text-lg text-bone">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block border border-smoke py-2.5 text-center text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-bone hover:text-bone"
                >
                  Manage · courier + packing slip →
                </Link>

                <QuickAction order={order} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Advance the order to its next stage, or flag an issue. */
function QuickAction({ order }: { order: Order }) {
  const [pending, start] = useTransition();
  const idx = stageIndex(order.state);
  const next = idx >= 0 && idx < ORDER_STAGES.length - 1 ? ORDER_STAGES[idx + 1] : null;
  const isEnd = order.state === "delivered";
  const isIssue = order.state === "issue" || order.state === "cancelled";

  function advance(state: OrderState) {
    start(async () => {
      await updateOrderStateAction(order.id, state);
    });
  }

  return (
    <div className="border border-smoke bg-ink p-4">
      <p className="mb-3 text-[0.7rem] uppercase tracking-[0.15em] text-ash">Actions</p>
      <div className="flex flex-wrap gap-2">
        {next && (
          <button
            disabled={pending}
            onClick={() => advance(next.key)}
            className="bg-bone px-4 py-2.5 text-mono text-[0.65rem] font-bold uppercase tracking-[0.13em] text-ink transition-colors hover:bg-acid hover:text-bone disabled:opacity-50"
          >
            {pending ? "…" : `→ ${next.label}`}
          </button>
        )}
        {isEnd && <span className="text-mono text-[0.65rem] uppercase tracking-[0.13em] text-emerald-400">✳ Completed</span>}
        {!isIssue && !isEnd && (
          <button
            disabled={pending}
            onClick={() => advance("issue")}
            className="flex items-center gap-1.5 border border-acid/40 px-4 py-2.5 text-mono text-[0.65rem] uppercase tracking-[0.13em] text-acid transition-colors hover:bg-acid/10 disabled:opacity-50"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Flag issue
          </button>
        )}
        {isIssue && (
          <button
            disabled={pending}
            onClick={() => advance("new")}
            className="border border-smoke px-4 py-2.5 text-mono text-[0.65rem] uppercase tracking-[0.13em] text-bone hover:border-bone disabled:opacity-50"
          >
            Reopen
          </button>
        )}
      </div>
    </div>
  );
}

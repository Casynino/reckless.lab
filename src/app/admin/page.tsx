import Link from "next/link";
import { computeAnalytics } from "@/lib/orders/analytics";
import { listOrders } from "@/lib/orders/store";
import { products } from "@/lib/data/products";
import { productStock } from "@/lib/inventory/store";
import { formatPrice } from "@/lib/shop/format";
import { STATE_META } from "@/lib/orders/types";
import { PageTitle, StatCard, Panel } from "@/components/admin/ui";
import { StageMini } from "@/components/admin/stage-mini";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminOverview() {
  const a = computeAnalytics();
  const orders = listOrders();
  const recent = orders.slice(0, 5);

  const lowStock = products
    .flatMap((p) => p.variants.map((v) => ({ p, v })))
    .filter(({ v }) => v.stock > 0 && v.stock <= 4)
    .slice(0, 6);

  return (
    <div>
      <PageTitle title="Overview" subtitle="Live snapshot of the lab — orders, revenue and stock in real time." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatPrice(a.revenue.total)} hint={`${a.revenue.growthPct >= 0 ? "+" : ""}${a.revenue.growthPct}% vs last month`} accent />
        <StatCard label="Orders" value={a.orders.total} hint={`${a.orders.today} today`} />
        <StatCard label="Customers" value={a.customers.total} hint={`+${a.customers.thisMonth} this month`} />
        <StatCard label="Products" value={products.length} hint={`${products.reduce((n, p) => n + productStock(p), 0)} units`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel
          title="Recent orders"
          action={
            <Link href="/admin/orders" className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-bone">
              Order monitor →
            </Link>
          }
        >
          <ul className="divide-y divide-smoke/60">
            {recent.map((o) => (
              <li key={o.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm uppercase tracking-wide text-bone">{o.customerName}</p>
                    <p className="text-[0.6rem] uppercase tracking-[0.15em] text-ash">{o.reference}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={cn("border px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.1em]", STATE_META[o.state].tone)}>
                      {STATE_META[o.state].label}
                    </span>
                    <span className="text-sm text-emerald-400">{formatPrice(o.total)}</span>
                  </div>
                </div>
                <StageMini state={o.state} />
              </li>
            ))}
          </ul>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel title="Order status">
            <ul className="space-y-2.5">
              {a.orders.byStatus.map((s) => (
                <li key={s.status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-fog">{s.status.replace(/_/g, " ")}</span>
                  <span className="text-mono text-bone">{s.count}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Low stock"
            action={
              <Link href="/admin/inventory" className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-bone">
                Inventory →
              </Link>
            }
          >
            {lowStock.length === 0 ? (
              <p className="text-sm text-fog">Everything&rsquo;s well stocked.</p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map(({ p, v }) => (
                  <li key={v.sku} className="flex items-center justify-between text-sm">
                    <span className="text-bone-dim">
                      {p.name} <span className="text-ash">/ {p.colorway} / {v.size}</span>
                    </span>
                    <span className="text-mono text-xs text-acid">{v.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

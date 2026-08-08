import Link from "next/link";
import { getSession } from "@/lib/auth/session-cookies";
import { computeAnalytics } from "@/lib/orders/analytics";
import { listOrders } from "@/lib/orders/store";
import { getAllProducts } from "@/lib/data";
import { productStock } from "@/lib/inventory/store";
import { formatPrice } from "@/lib/shop/format";
import { STATE_META } from "@/lib/orders/types";
import { Panel } from "@/components/admin/ui";
import { StageMini } from "@/components/admin/stage-mini";
import { DashboardHero } from "@/components/admin/dashboard-hero";
import { HealthCards, type HealthCard } from "@/components/admin/health-cards";
import { AttentionPanel, type AttnItem } from "@/components/admin/attention-panel";
import { QuickActions } from "@/components/admin/quick-actions";
import { RevenueSplit } from "@/components/admin/revenue-split";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [session, a, orders, products] = await Promise.all([
    getSession(),
    computeAnalytics(),
    listOrders(),
    getAllProducts(),
  ]);
  const recent = orders.slice(0, 5);

  const totalUnits = products.reduce((n, p) => n + productStock(p), 0);

  // Revenue split + money-in
  const paidOrders = orders.filter((o) => o.state !== "new" && o.state !== "cancelled");
  const avgOrderValue = paidOrders.length ? Math.round(paidOrders.reduce((n, o) => n + o.total, 0) / paidOrders.length) : 0;
  const revenueSplit = {
    series: a.categories,
    revenueThisMonth: a.revenue.thisMonth,
    revenueToday: a.revenue.today,
    ordersTotal: a.orders.total,
    avgOrderValue,
    paidCount: paidOrders.length,
    awaitingCount: orders.filter((o) => ["new", "payment_confirmed", "packaging", "ready_to_ship"].includes(o.state)).length,
    inTransitCount: orders.filter((o) => o.state === "in_transit").length,
    deliveredCount: orders.filter((o) => o.state === "delivered").length,
  };

  const health: HealthCard[] = [
    { key: "revenue", label: "Revenue this month", value: a.revenue.thisMonth, money: true, sub: `${a.revenue.growthPct >= 0 ? "+" : ""}${a.revenue.growthPct}% vs last month` },
    { key: "orders", label: "Orders", value: a.orders.total, sub: `${a.orders.today} placed today` },
    { key: "customers", label: "Customers", value: a.customers.total, sub: `+${a.customers.thisMonth} this month` },
    { key: "stock", label: "Units in stock", value: totalUnits, sub: `${a.products.outOfStock} out of stock` },
  ];

  // Needs-your-attention items
  const attn: AttnItem[] = [];
  const newOrders = orders.filter((o) => o.state === "new" || o.state === "payment_confirmed");
  if (newOrders.length) {
    attn.push({
      id: "new-orders",
      category: "orders",
      title: `${newOrders.length} order${newOrders.length > 1 ? "s" : ""} to fulfil`,
      sub: "New orders awaiting packing",
      value: formatPrice(newOrders.reduce((n, o) => n + o.total, 0)),
      href: "/admin/orders",
    });
  }
  const inTransit = orders.filter((o) => o.state === "in_transit");
  if (inTransit.length) {
    attn.push({ id: "in-transit", category: "orders", title: `${inTransit.length} in transit`, sub: "On the way to customers", href: "/admin/orders" });
  }
  const issues = orders.filter((o) => o.state === "issue" || o.state === "cancelled");
  if (issues.length) {
    attn.push({ id: "issues", category: "issues", title: `${issues.length} order issue${issues.length > 1 ? "s" : ""}`, sub: "Needs resolving", href: "/admin/orders" });
  }
  const lowVariants = products.flatMap((p) => p.variants.filter((v) => v.stock > 0 && v.stock <= 4).map((v) => ({ p, v })));
  if (lowVariants.length) {
    attn.push({ id: "low-stock", category: "stock", title: `${lowVariants.length} low-stock size${lowVariants.length > 1 ? "s" : ""}`, sub: "Restock before they sell out", href: "/admin/inventory" });
  }

  return (
    <div className="space-y-8">
      <DashboardHero name={session?.name ?? "Admin"} />

      <section>
        <p className="mb-4 text-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">Business health · right now</p>
        <HealthCards cards={health} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">Needs your attention</p>
            <Link href="/admin/orders" className="text-mono text-[0.7rem] uppercase tracking-[0.13em] text-acid">Review all →</Link>
          </div>
          <AttentionPanel items={attn} />
        </section>

        <section>
          <p className="mb-4 text-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">Order status</p>
          <Panel title="This drop">
            {a.orders.byStatus.length === 0 ? (
              <p className="text-sm text-fog">No orders yet — this fills in as orders come through.</p>
            ) : (
            <ul className="space-y-3">
              {a.orders.byStatus.map((s) => {
                const pct = Math.round((s.count / a.orders.total) * 100);
                return (
                  <li key={s.status}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="capitalize text-fog">{s.status.replace(/_/g, " ")}</span>
                      <span className="text-mono text-bone">{s.count}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-smoke">
                      <div className={cn("h-1 rounded-full", STATE_META[s.status as keyof typeof STATE_META]?.dot ?? "bg-ash")} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            )}
          </Panel>
        </section>
      </div>

      <section>
        <p className="mb-4 text-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">Quick actions</p>
        <QuickActions />
      </section>

      <section>
        <p className="mb-4 text-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">Revenue &amp; collections · this month</p>
        <RevenueSplit data={revenueSplit} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Panel
            title="Recent orders"
            action={<Link href="/admin/orders" className="text-mono text-[0.7rem] uppercase tracking-[0.13em] text-ash hover:text-bone">Order monitor →</Link>}
          >
            {recent.length === 0 ? (
              <p className="text-sm text-fog">No orders yet — your latest orders will appear here.</p>
            ) : (
            <ul className="divide-y divide-smoke/60">
              {recent.map((o) => (
                <li key={o.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm uppercase tracking-wide text-bone">{o.customerName}</p>
                      <p className="text-[0.7rem] uppercase tracking-[0.15em] text-ash">{o.reference}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className={cn("border px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.1em]", STATE_META[o.state].tone)}>{STATE_META[o.state].label}</span>
                      <span className="text-sm text-emerald-400">{formatPrice(o.total)}</span>
                    </div>
                  </div>
                  <StageMini state={o.state} />
                </li>
              ))}
            </ul>
            )}
          </Panel>
        </Reveal>

        <Reveal delay={0.1}>
          <Panel
            title="Top customers"
            action={<Link href="/admin/customers" className="text-mono text-[0.7rem] uppercase tracking-[0.13em] text-ash hover:text-bone">All →</Link>}
          >
            {a.customers.topSpenders.length === 0 ? (
              <p className="text-sm text-fog">No paid orders yet.</p>
            ) : (
              <ul className="space-y-3">
                {a.customers.topSpenders.map((c, i) => (
                  <li key={c.email} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-3">
                      <span className="text-ash">{i + 1}</span>
                      <span className="text-bone">{c.name}</span>
                      <span className="text-ash">· {c.orderCount} orders</span>
                    </span>
                    <span className="text-emerald-400">{formatPrice(c.totalSpent)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}

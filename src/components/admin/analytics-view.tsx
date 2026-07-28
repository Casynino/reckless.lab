"use client";

import { useState } from "react";
import {
  Activity,
  BarChart2,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import type { Analytics } from "@/lib/orders/analytics";
import { formatPrice } from "@/lib/shop/format";
import { Panel } from "@/components/admin/ui";
import { Spark, LineChart, Donut, CAT_COLORS } from "@/components/admin/charts";
import { cn } from "@/lib/utils";

type Tab = "overview" | "revenue" | "customers" | "products";
const TABS: { id: Tab; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "revenue", label: "Revenue", icon: BarChart2 },
  { id: "customers", label: "Customers", icon: Users },
  { id: "products", label: "Products", icon: Package },
];

const STATUS_BAR: Record<string, string> = {
  new: "bg-sky-500",
  payment_confirmed: "bg-blue-500",
  packaging: "bg-amber-500",
  ready_to_ship: "bg-yellow-500",
  in_transit: "bg-violet-500",
  delivered: "bg-emerald-500",
  issue: "bg-acid",
  cancelled: "bg-rose-500",
};

function KpiCard({
  label,
  value,
  sub,
  growth,
  icon: Icon,
  tint,
  spark,
}: {
  label: string;
  value: string;
  sub?: string;
  growth?: number;
  icon: typeof Activity;
  tint: string;
  spark?: number[];
}) {
  const up = (growth ?? 0) >= 0;
  return (
    <div className="space-y-3 border border-smoke bg-ink-soft p-5">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-9 w-9 items-center justify-center", tint)}>
          <Icon className="h-4 w-4" />
        </div>
        {spark && <Spark data={spark} color={up ? "#34d399" : "#fb7185"} />}
      </div>
      <p className="figure text-2xl text-bone">{value}</p>
      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] uppercase tracking-[0.13em] text-ash">{label}</p>
        {typeof growth === "number" && (
          <span className={cn("flex items-center gap-1 text-mono text-[0.65rem] font-semibold", up ? "text-emerald-400" : "text-rose-400")}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {growth > 0 ? "+" : ""}
            {growth}%
          </span>
        )}
      </div>
      {sub && <p className="text-mono text-[0.7rem] uppercase tracking-[0.15em] text-fog">{sub}</p>}
    </div>
  );
}

export function AnalyticsView({ data }: { data: Analytics }) {
  const [tab, setTab] = useState<Tab>("overview");
  const sparkData = data.revenue.daily.map((d) => d.amount);

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 flex gap-1 overflow-x-auto border-b border-smoke">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.13em] transition-colors",
              tab === t.id ? "border-acid text-acid" : "border-transparent text-ash hover:text-bone",
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Total Revenue" value={formatPrice(data.revenue.total)} sub={`Today: ${formatPrice(data.revenue.today)}`} growth={data.revenue.growthPct} icon={DollarSign} tint="bg-emerald-500/15 text-emerald-400" spark={sparkData} />
            <KpiCard label="Total Orders" value={String(data.orders.total)} sub={`Today: ${data.orders.today}`} growth={data.orders.growthPct} icon={ShoppingBag} tint="bg-blue-500/15 text-blue-400" />
            <KpiCard label="Customers" value={String(data.customers.total)} sub={`+${data.customers.thisMonth} this month`} icon={Users} tint="bg-violet-500/15 text-violet-400" />
            <KpiCard label="Products" value={String(data.products.total)} sub={`${data.products.outOfStock} out of stock`} icon={Package} tint="bg-amber-500/15 text-amber-400" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="border border-smoke bg-ink-soft p-5 lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.15em] text-ash">Revenue Trend</p>
                  <p className="mt-1 text-sm text-bone">Last 30 days</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.7rem] uppercase tracking-[0.15em] text-ash">This month</p>
                  <p className="mt-1 figure text-lg text-emerald-400">{formatPrice(data.revenue.thisMonth)}</p>
                </div>
              </div>
              <LineChart data={data.revenue.daily} />
            </div>

            <Panel title="By Series">
              {data.categories.length === 0 ? (
                <p className="text-sm text-fog">No sales yet.</p>
              ) : (
                <div className="flex items-center gap-5">
                  <Donut segments={data.categories.map((c, i) => ({ name: c.name, pct: c.pct, color: CAT_COLORS[i % CAT_COLORS.length] }))} />
                  <ul className="flex-1 space-y-2">
                    {data.categories.map((c, i) => (
                      <li key={c.name} className="flex items-center gap-2 text-xs">
                        <span className="h-2 w-2 rounded-full" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                        <span className="flex-1 text-bone-dim">{c.name}</span>
                        <span className="text-ash">{c.pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Top Selling Products">
              {data.products.topSelling.length === 0 ? (
                <p className="text-sm text-fog">No sales yet.</p>
              ) : (
                <ul className="space-y-4">
                  {data.products.topSelling.map((p, i) => {
                    const max = data.products.topSelling[0].sold || 1;
                    return (
                      <li key={p.id}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <span className="w-4 text-ash">{i + 1}</span>
                            <span className="text-bone">{p.name}</span>
                            <span className="text-ash">/ {p.colorway}</span>
                          </span>
                          <span className="text-ash">
                            {p.sold} sold · <span className="text-emerald-400">{formatPrice(p.revenue)}</span>
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-smoke">
                          <div className="h-1 rounded-full bg-gradient-to-r from-acid to-acid-dim" style={{ width: `${(p.sold / max) * 100}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            <Panel title="Order Status">
              <ul className="space-y-3">
                {data.orders.byStatus.map((s) => {
                  const pct = Math.round((s.count / data.orders.total) * 100);
                  return (
                    <li key={s.status}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="capitalize text-bone-dim">{s.status.replace(/_/g, " ")}</span>
                        <span className="text-ash">
                          {s.count} · {pct}%
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-smoke">
                        <div className={cn("h-1 rounded-full", STATUS_BAR[s.status] ?? "bg-ash")} style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>

          {data.insights.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <p className="text-mono text-xs uppercase tracking-[0.15em] text-bone">Recommended Actions</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.insights.map((ins, i) => (
                  <Insight key={i} {...ins} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Today" value={formatPrice(data.revenue.today)} icon={DollarSign} tint="bg-emerald-500/15 text-emerald-400" />
            <KpiCard label="This Week" value={formatPrice(data.revenue.thisWeek)} icon={DollarSign} tint="bg-emerald-500/15 text-emerald-400" />
            <KpiCard label="This Month" value={formatPrice(data.revenue.thisMonth)} growth={data.revenue.growthPct} icon={DollarSign} tint="bg-emerald-500/15 text-emerald-400" />
            <KpiCard label="All Time" value={formatPrice(data.revenue.total)} icon={DollarSign} tint="bg-emerald-500/15 text-emerald-400" />
          </div>
          <div className="border border-smoke bg-ink-soft p-5">
            <p className="mb-5 text-[0.7rem] uppercase tracking-[0.15em] text-ash">Revenue · last 30 days</p>
            <LineChart data={data.revenue.daily} />
          </div>
        </div>
      )}

      {tab === "customers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <KpiCard label="Total Customers" value={String(data.customers.total)} icon={Users} tint="bg-violet-500/15 text-violet-400" />
            <KpiCard label="New This Month" value={String(data.customers.thisMonth)} icon={Users} tint="bg-violet-500/15 text-violet-400" />
            <KpiCard label="Repeat Buyers" value={String(data.customers.topSpenders.filter((s) => s.orderCount > 1).length)} icon={Users} tint="bg-violet-500/15 text-violet-400" />
          </div>
          <Panel title="Top Customers by Spend">
            {data.customers.topSpenders.length === 0 ? (
              <p className="text-sm text-fog">No paid orders yet.</p>
            ) : (
              <ul className="space-y-4">
                {data.customers.topSpenders.map((c, i) => {
                  const max = data.customers.topSpenders[0].totalSpent || 1;
                  return (
                    <li key={c.email}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-4 text-ash">{i + 1}</span>
                          <span className="text-bone">{c.name}</span>
                          <span className="text-ash">· {c.orderCount} orders</span>
                        </span>
                        <span className="text-emerald-400">{formatPrice(c.totalSpent)}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-smoke">
                        <div className="h-1 rounded-full bg-gradient-to-r from-violet-500 to-violet-400" style={{ width: `${(c.totalSpent / max) * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <KpiCard label="Products" value={String(data.products.total)} icon={Package} tint="bg-amber-500/15 text-amber-400" />
            <KpiCard label="Out of Stock" value={String(data.products.outOfStock)} icon={AlertCircle} tint="bg-rose-500/15 text-rose-400" />
            <KpiCard label="Low Stock" value={String(data.products.lowStock)} icon={AlertTriangle} tint="bg-amber-500/15 text-amber-400" />
          </div>
          <Panel title="Best Sellers">
            {data.products.topSelling.length === 0 ? (
              <p className="text-sm text-fog">No sales yet.</p>
            ) : (
              <ul className="space-y-4">
                {data.products.topSelling.map((p, i) => {
                  const max = data.products.topSelling[0].sold || 1;
                  return (
                    <li key={p.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-bone">
                          {p.name} <span className="text-ash">/ {p.colorway}</span>
                        </span>
                        <span className="text-ash">{p.sold} sold</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-smoke">
                        <div className="h-1 rounded-full" style={{ width: `${(p.sold / max) * 100}%`, background: CAT_COLORS[i % CAT_COLORS.length] }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

const INSIGHT_CFG = {
  success: { icon: CheckCircle2, cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
  warning: { icon: AlertTriangle, cls: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
  danger: { icon: AlertCircle, cls: "text-acid bg-acid/10 border-acid/30" },
  info: { icon: Info, cls: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
} as const;

function Insight({ type, text, action }: { type: keyof typeof INSIGHT_CFG; text: string; action: string }) {
  const cfg = INSIGHT_CFG[type];
  return (
    <div className={cn("flex items-start gap-3 border p-3", cfg.cls)}>
      <cfg.icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="text-sm text-bone">{text}</p>
        <p className="mt-0.5 text-[0.7rem] uppercase tracking-[0.15em] opacity-80">→ {action}</p>
      </div>
    </div>
  );
}

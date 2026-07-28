import "server-only";
import { products } from "@/lib/data/products";
import { listOrders } from "./store";
import { listCustomers } from "@/lib/auth/store";
import { productStock } from "@/lib/inventory/store";
import type { Order } from "./types";

export interface Analytics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    today: number;
    thisWeek: number;
    growthPct: number;
    daily: { date: string; amount: number }[];
  };
  orders: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    today: number;
    growthPct: number;
    byStatus: { status: string; count: number }[];
  };
  customers: {
    total: number;
    thisMonth: number;
    topSpenders: { name: string; email: string; totalSpent: number; orderCount: number }[];
  };
  products: {
    total: number;
    outOfStock: number;
    lowStock: number;
    topSelling: { id: string; name: string; colorway: string; sold: number; revenue: number }[];
  };
  categories: { name: string; revenue: number; pct: number }[];
  insights: { type: "success" | "warning" | "danger" | "info"; text: string; action: string }[];
}

/** Orders that count as revenue (paid, not cancelled). */
function isPaid(o: Order) {
  return o.state !== "new" && o.state !== "cancelled";
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function computeAnalytics(): Analytics {
  const orders = listOrders();
  const customers = listCustomers();
  const now = new Date();
  const today = startOfDay(now).getTime();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const weekAgo = now.getTime() - 7 * 864e5;

  const paid = orders.filter(isPaid);

  const revTotal = paid.reduce((n, o) => n + o.total, 0);
  const revThisMonth = paid.filter((o) => new Date(o.createdAt).getTime() >= monthStart).reduce((n, o) => n + o.total, 0);
  const revLastMonth = paid
    .filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= lastMonthStart && t < monthStart;
    })
    .reduce((n, o) => n + o.total, 0);
  const revToday = paid.filter((o) => startOfDay(new Date(o.createdAt)).getTime() === today).reduce((n, o) => n + o.total, 0);
  const revWeek = paid.filter((o) => new Date(o.createdAt).getTime() >= weekAgo).reduce((n, o) => n + o.total, 0);

  // Daily revenue, last 30 days
  const daily: { date: string; amount: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today - i * 864e5);
    const key = d.toISOString().slice(0, 10);
    const amount = paid
      .filter((o) => o.createdAt.slice(0, 10) === key)
      .reduce((n, o) => n + o.total, 0);
    daily.push({ date: key, amount });
  }

  // Orders by status
  const statusCounts = new Map<string, number>();
  for (const o of orders) statusCounts.set(o.state, (statusCounts.get(o.state) ?? 0) + 1);
  const byStatus = [...statusCounts.entries()].map(([status, count]) => ({ status, count }));

  const ordThisMonth = orders.filter((o) => new Date(o.createdAt).getTime() >= monthStart).length;
  const ordLastMonth = orders.filter((o) => {
    const t = new Date(o.createdAt).getTime();
    return t >= lastMonthStart && t < monthStart;
  }).length;

  // Top spenders
  const spend = new Map<string, { name: string; email: string; totalSpent: number; orderCount: number }>();
  for (const o of paid) {
    const e = spend.get(o.customerEmail) ?? { name: o.customerName, email: o.customerEmail, totalSpent: 0, orderCount: 0 };
    e.totalSpent += o.total;
    e.orderCount += 1;
    spend.set(o.customerEmail, e);
  }
  const topSpenders = [...spend.values()].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  // Top selling products (by units)
  const sold = new Map<string, { id: string; name: string; colorway: string; sold: number; revenue: number }>();
  for (const o of paid) {
    for (const l of o.lines) {
      const e = sold.get(l.productId) ?? { id: l.productId, name: l.name, colorway: l.colorway, sold: 0, revenue: 0 };
      e.sold += l.qty;
      e.revenue += l.price * l.qty;
      sold.set(l.productId, e);
    }
  }
  const topSelling = [...sold.values()].sort((a, b) => b.sold - a.sold).slice(0, 5);

  // Stock
  const outOfStock = products.filter((p) => productStock(p) === 0).length;
  const lowStock = products.filter((p) => {
    const s = productStock(p);
    return s > 0 && s <= 20;
  }).length;

  // Category = product name group (the two tee lines)
  const catRev = new Map<string, number>();
  for (const o of paid) for (const l of o.lines) catRev.set(l.name, (catRev.get(l.name) ?? 0) + l.price * l.qty);
  const catTotal = [...catRev.values()].reduce((n, v) => n + v, 0) || 1;
  const categories = [...catRev.entries()]
    .map(([name, revenue]) => ({ name, revenue, pct: Math.round((revenue / catTotal) * 100) }))
    .sort((a, b) => b.revenue - a.revenue);

  // Insights
  const insights: Analytics["insights"] = [];
  if (outOfStock > 0) insights.push({ type: "danger", text: `${outOfStock} variant(s) out of stock`, action: "Restock in Inventory" });
  if (lowStock > 0) insights.push({ type: "warning", text: `${lowStock} product(s) running low`, action: "Review Inventory" });
  const newCount = orders.filter((o) => o.state === "new" || o.state === "payment_confirmed").length;
  if (newCount > 0) insights.push({ type: "info", text: `${newCount} new order(s) awaiting fulfilment`, action: "Open Order Monitor" });
  if (topSelling[0]) insights.push({ type: "success", text: `${topSelling[0].name} is your best seller (${topSelling[0].sold} sold)`, action: "Feature it" });
  const growth = revLastMonth > 0 ? Math.round(((revThisMonth - revLastMonth) / revLastMonth) * 100) : revThisMonth > 0 ? 100 : 0;

  return {
    revenue: {
      total: revTotal,
      thisMonth: revThisMonth,
      lastMonth: revLastMonth,
      today: revToday,
      thisWeek: revWeek,
      growthPct: growth,
      daily,
    },
    orders: {
      total: orders.length,
      thisMonth: ordThisMonth,
      lastMonth: ordLastMonth,
      today: orders.filter((o) => startOfDay(new Date(o.createdAt)).getTime() === today).length,
      growthPct: ordLastMonth > 0 ? Math.round(((ordThisMonth - ordLastMonth) / ordLastMonth) * 100) : ordThisMonth > 0 ? 100 : 0,
      byStatus,
    },
    customers: {
      total: customers.length,
      thisMonth: customers.filter((c) => new Date(c.createdAt).getTime() >= monthStart).length,
      topSpenders,
    },
    products: {
      total: products.length,
      outOfStock,
      lowStock,
      topSelling,
    },
    categories,
    insights,
  };
}

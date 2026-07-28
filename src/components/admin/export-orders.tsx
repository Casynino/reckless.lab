"use client";

import { Download } from "lucide-react";
import type { Order } from "@/lib/orders/types";

function esc(v: string | number) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function ExportOrders({ orders }: { orders: Order[] }) {
  function download() {
    const headers = [
      "Order", "Tracking", "Date", "Status", "Customer", "Email", "Phone",
      "Country", "City", "Items", "Subtotal", "Discount", "Shipping", "Total", "Coupon",
    ];
    const rows = orders.map((o) =>
      [
        o.reference, o.tracking, new Date(o.createdAt).toISOString().slice(0, 10), o.state,
        o.customerName, o.customerEmail, o.customerPhone, o.countryCode, o.city,
        o.lines.reduce((n, l) => n + l.qty, 0), o.subtotal, o.discount, o.shipping, o.total, o.couponCode ?? "",
      ].map(esc).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reckless-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      disabled={!orders.length}
      className="inline-flex items-center gap-2 rounded-sm border border-smoke px-4 py-2 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-bone hover:text-bone disabled:opacity-40"
    >
      <Download className="h-3.5 w-3.5" /> Export CSV
    </button>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { setCourierAction } from "@/lib/orders/actions";
import { STATE_META, type Order } from "@/lib/orders/types";
import { formatPrice } from "@/lib/shop/format";
import { countryName } from "@/lib/shop/shipping";

export function AdminOrderDetail({ order }: { order: Order }) {
  const [pending, start] = useTransition();
  const [courier, setCourier] = useState(order.courier ?? "");
  const [tracking, setTracking] = useState(order.courierTracking ?? "");
  const [saved, setSaved] = useState(false);
  const meta = STATE_META[order.state];

  function save() {
    setSaved(false);
    start(async () => {
      await setCourierAction(order.id, courier, tracking);
      setSaved(true);
    });
  }

  function printSlip() {
    const addr = [order.address1, order.address2, [order.city, order.region, order.postalCode].filter(Boolean).join(", "), countryName(order.countryCode)]
      .filter(Boolean)
      .join("<br>");
    const rows = order.lines
      .map((l) => `<tr><td>${l.name} — ${l.colorway}</td><td>${l.size}</td><td style="text-align:center">${l.qty}</td><td>${l.sku}</td></tr>`)
      .join("");
    const html = `<!doctype html><html><head><title>Packing Slip ${order.reference}</title><style>
      *{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#111}
      body{padding:40px;max-width:720px;margin:0 auto}
      h1{font-size:28px;letter-spacing:-0.5px;margin:0} .mono{font-family:monospace;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:2px}
      .row{display:flex;justify-content:space-between;gap:24px;margin-top:28px}
      table{width:100%;border-collapse:collapse;margin-top:24px} th,td{border-bottom:1px solid #ddd;padding:8px 6px;text-align:left;font-size:14px} th{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888}
      .tot{margin-top:20px;text-align:right;font-size:14px} .big{font-size:20px;font-weight:700}
      .box{border:1px solid #ddd;border-radius:6px;padding:16px}
    </style></head><body>
      <div class="row" style="margin-top:0">
        <div><h1>RECKLESS LABORATORY</h1><p class="mono">Packing Slip</p></div>
        <div style="text-align:right"><p class="mono">Order</p><p class="big">${order.reference}</p><p class="mono">${new Date(order.createdAt).toLocaleDateString("en-GB")}</p></div>
      </div>
      <div class="row">
        <div class="box" style="flex:1"><p class="mono">Ship to</p><p style="margin-top:8px"><strong>${order.customerName}</strong><br>${addr}<br>${order.customerPhone}</p></div>
        <div class="box" style="flex:1"><p class="mono">Tracking</p><p style="margin-top:8px">Internal: <strong>${order.tracking}</strong><br>Courier: ${order.courier || "—"}<br>Courier ref: ${order.courierTracking || "—"}</p></div>
      </div>
      <table><thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>SKU</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="mono" style="margin-top:16px">Shipping: ${order.shippingMethod || order.courier || "—"}${order.shippingEta ? ` — ${order.shippingEta}` : ""}</p>
      <div class="tot">
        Subtotal: ${formatPrice(order.subtotal)}<br>
        Shipping: ${order.shippingTbc ? "To be confirmed" : (order.freeShipping ?? order.shipping === 0) ? "Free" : formatPrice(order.shipping)}<br>
        ${order.discount > 0 ? `Discount${order.couponCode ? ` (${order.couponCode})` : ""}: -${formatPrice(order.discount)}<br>` : ""}
        <span class="big">Total: ${formatPrice(order.total)}</span>
      </div>
      <p class="mono" style="margin-top:40px;text-align:center">Reckless Laboratory · Banjul → Worldwide · It's not for you</p>
    </body></html>`;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash hover:text-bone">
          <ArrowLeft className="h-3.5 w-3.5" /> All orders
        </Link>
        <button onClick={printSlip} className="inline-flex items-center gap-2 rounded-sm border border-smoke px-4 py-2 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-bone hover:text-bone">
          <Printer className="h-3.5 w-3.5" /> Print packing slip
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl tracking-tight text-bone">{order.reference}</h1>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-mono text-[0.55rem] uppercase tracking-[0.15em] ${meta.tone}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} /> {meta.label}
        </span>
      </div>
      <p className="mt-1 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">
        Internal tracking · {order.tracking} · {new Date(order.createdAt).toLocaleString("en-GB")}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Customer + address */}
        <div className="rounded-sm border border-smoke bg-ink-soft p-6 text-sm">
          <p className="text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">Customer</p>
          <p className="mt-2 text-bone">{order.customerName}</p>
          <p className="text-fog">{order.customerEmail}</p>
          <p className="text-fog">{order.customerPhone}</p>
          <p className="mt-4 text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">Ship to</p>
          <p className="mt-2 text-fog">{order.address1}{order.address2 ? `, ${order.address2}` : ""}</p>
          <p className="text-fog">{[order.city, order.region, order.postalCode].filter(Boolean).join(", ")}</p>
          <p className="text-fog">{countryName(order.countryCode)}</p>
        </div>

        {/* Courier assignment */}
        <div className="rounded-sm border border-smoke bg-ink-soft p-6">
          <p className="text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">Assign courier</p>
          <div className="mt-4 space-y-3">
            <input value={courier} onChange={(e) => { setCourier(e.target.value); setSaved(false); }} placeholder="Courier (e.g. DHL, local rider)" className="w-full border-b border-smoke bg-transparent py-2 text-sm text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none" />
            <input value={tracking} onChange={(e) => { setTracking(e.target.value); setSaved(false); }} placeholder="Courier tracking number" className="w-full border-b border-smoke bg-transparent py-2 text-sm text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none" />
            <button onClick={save} disabled={pending} className="bg-acid px-6 py-2.5 text-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink disabled:opacity-50">
              {pending ? "Saving…" : saved ? "Saved ✓" : "Save courier"}
            </button>
          </div>
        </div>
      </div>

      {/* Shipping snapshot — captured at checkout, never recalculated */}
      <div className="mt-6 rounded-sm border border-smoke bg-ink-soft p-6">
        <p className="text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">Shipping</p>
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          <Fact label="Country" value={countryName(order.countryCode)} />
          <Fact
            label="Shipping fee"
            value={order.shippingTbc ? "To be confirmed" : shippingIsFree(order) ? "Free" : formatPrice(order.shipping)}
            accent={shippingIsFree(order)}
          />
          <Fact label="Method" value={order.shippingMethod ?? order.courier ?? "—"} />
          <Fact label="Est. delivery" value={order.shippingEta ?? "—"} />
          <Fact
            label="Free shipping"
            value={order.shippingTbc ? "TBC" : shippingIsFree(order) ? "Yes" : "No"}
            accent={shippingIsFree(order)}
          />
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 overflow-x-auto rounded-sm border border-smoke bg-ink-soft">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-smoke text-mono text-[0.6rem] uppercase tracking-[0.13em] text-ash">
              <th className="px-4 py-3 font-normal">Item</th>
              <th className="px-4 py-3 font-normal">Size</th>
              <th className="px-4 py-3 font-normal">Qty</th>
              <th className="px-4 py-3 font-normal">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.sku} className="border-b border-smoke/50">
                <td className="px-4 py-3 text-bone">{l.name} <span className="text-ash">· {l.colorway}</span></td>
                <td className="px-4 py-3 text-fog">{l.size}</td>
                <td className="px-4 py-3 text-fog">{l.qty}</td>
                <td className="px-4 py-3 text-fog">{formatPrice(l.price * l.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end gap-8 border-t border-smoke p-4 text-sm">
          <div className="text-right text-fog">
            <p>Subtotal {formatPrice(order.subtotal)}</p>
            <p>Shipping {order.shippingTbc ? "To be confirmed" : shippingIsFree(order) ? "Free" : formatPrice(order.shipping)}</p>
            {order.discount > 0 && <p className="text-acid">Discount −{formatPrice(order.discount)}</p>}
            <p className="mt-1 text-base font-medium text-bone">Total {formatPrice(order.total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Free when the snapshot says so; legacy orders fall back to a zero fee. */
function shippingIsFree(order: Order): boolean {
  return order.freeShipping ?? order.shipping === 0;
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-mono text-[0.5rem] uppercase tracking-[0.2em] text-ash">{label}</p>
      <p className={`mt-1 text-sm ${accent ? "text-acid" : "text-bone"}`}>{value}</p>
    </div>
  );
}

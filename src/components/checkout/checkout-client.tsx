"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/shop/cart-store";
import { formatPrice } from "@/lib/shop/format";
import { shippingCountries, getZoneForCountry, shippingCost, FREE_SHIPPING_THRESHOLD } from "@/lib/shop/shipping";
import { buildOrderDraft, buildWhatsAppUrl, buildOrderMessage } from "@/lib/shop/whatsapp";
import { shopConfig } from "@/lib/shop/config";
import type { ShippingAddress } from "@/lib/types";
import { SmartImage } from "@/components/ui/smart-image";

const EMPTY: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  region: "",
  postalCode: "",
  countryCode: shopConfig.contact.homeCountry,
};

const FIELDS: { key: keyof ShippingAddress; label: string; required?: boolean; type?: string; half?: boolean }[] = [
  { key: "fullName", label: "Full name", required: true },
  { key: "email", label: "Email", required: true, type: "email" },
  { key: "phone", label: "Phone (WhatsApp)", required: true },
  { key: "address1", label: "Address", required: true },
  { key: "address2", label: "Apartment, suite (optional)" },
  { key: "city", label: "City", required: true, half: true },
  { key: "region", label: "Region / State", half: true },
  { key: "postalCode", label: "Postal code", half: true },
];

export function CheckoutClient() {
  const lines = useCart((s) => s.lines);
  const [form, setForm] = useState<ShippingAddress>(EMPTY);
  const [touched, setTouched] = useState(false);

  const subtotal = cartSubtotal(lines);
  const zone = getZoneForCountry(form.countryCode);
  const shipping = shippingCost(form.countryCode, subtotal);
  const total = subtotal + shipping;

  const valid = useMemo(
    () =>
      FIELDS.filter((f) => f.required).every((f) => form[f.key]?.toString().trim()) &&
      form.email.includes("@") &&
      lines.length > 0,
    [form, lines],
  );

  function set<K extends keyof ShippingAddress>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function complete() {
    setTouched(true);
    if (!valid) {
      document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const order = buildOrderDraft(lines, form, Date.now());
    window.open(buildWhatsAppUrl(order), "_blank", "noopener");
  }

  if (lines.length === 0) {
    return (
      <div className="container-edge flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <span className="eyebrow">[ CHECKOUT ]</span>
        <h1 className="font-display display-lg text-bone">Nothing to check out</h1>
        <p className="max-w-sm text-fog">Your bag is empty. Find something worth breaking the rules for.</p>
        <Link
          href="/collections"
          className="border border-bone px-10 py-4 text-mono text-xs uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  const preview = buildOrderMessage(buildOrderDraft(lines, form, 0));

  return (
    <div className="container-edge grid gap-12 pt-32 pb-24 md:pt-40 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
      {/* Left: form */}
      <div id="checkout-form">
        <span className="eyebrow">[ CHECKOUT / 01 — SHIPPING ]</span>
        <h1 className="mt-4 font-display display-lg text-bone">Where&apos;s it going?</h1>
        <p className="mt-4 max-w-md text-fog">
          Enter your details. We&apos;ll generate your order and open WhatsApp so our team can confirm stock and
          send payment instructions directly.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {FIELDS.map((f) => {
            const invalid = touched && f.required && !form[f.key]?.toString().trim();
            return (
              <div key={f.key} className={f.half ? "col-span-1" : "col-span-2"}>
                <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
                  {f.label}
                  {f.required && <span className="text-acid"> *</span>}
                </label>
                <input
                  type={f.type ?? "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className={`w-full border-b bg-transparent py-2.5 text-bone placeholder:text-ash/60 focus:outline-none ${
                    invalid ? "border-acid" : "border-smoke focus:border-bone"
                  }`}
                />
              </div>
            );
          })}

          {/* Country */}
          <div className="col-span-2">
            <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
              Country / Region <span className="text-acid">*</span>
            </label>
            <select
              value={form.countryCode}
              onChange={(e) => set("countryCode", e.target.value)}
              className="w-full border-b border-smoke bg-ink py-2.5 text-bone focus:border-bone focus:outline-none"
            >
              {shippingCountries.map((c) => (
                <option key={c.code} value={c.code} className="bg-ink text-bone">
                  {c.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
              Zone: {zone.label} · Est. {zone.estimate}
            </p>
          </div>
        </div>

        {/* Payment note */}
        <div className="mt-10 border border-smoke bg-ink-soft p-5">
          <p className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-acid">Payment — WhatsApp</p>
          <p className="mt-2 text-sm text-fog">
            Online card & mobile-money payments are coming soon. For now, you complete your order over WhatsApp —
            fast, personal, and secure. Your full order summary is sent automatically.
          </p>
        </div>
      </div>

      {/* Right: summary */}
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="border border-smoke bg-ink-soft p-6">
          <h2 className="font-display text-xl text-bone">Order Summary</h2>

          <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
            {lines.map((l) => (
              <div key={l.sku} className="flex gap-3">
                <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden bg-carbon">
                  <SmartImage src={l.image} alt={l.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-acid px-1 text-[0.6rem] font-bold text-ink">
                    {l.qty}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm text-bone">{l.name}</p>
                    <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                      {l.colorway} · {l.size}
                    </p>
                  </div>
                  <span className="text-sm text-bone">{formatPrice(l.price * l.qty)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-smoke pt-5 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            <Row
              label={`Shipping · ${zone.label}`}
              value={shipping === 0 ? "FREE" : formatPrice(shipping)}
              accent={shipping === 0}
            />
            {FREE_SHIPPING_THRESHOLD > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} away from free shipping
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-smoke pt-4">
            <span className="text-mono text-xs uppercase tracking-[0.25em] text-fog">Total</span>
            <span className="font-display text-2xl text-bone">{formatPrice(total)}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={complete}
            data-cursor="send"
            className="mt-6 flex w-full items-center justify-center gap-2 bg-acid py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90"
          >
            Complete via WhatsApp <ArrowRight className="h-4 w-4" />
          </motion.button>
          <p className="mt-3 text-center text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
            Opens WhatsApp to {shopConfig.whatsapp.label}
          </p>
        </div>

        <details className="mt-4 border border-smoke bg-ink-soft p-4">
          <summary className="cursor-pointer text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-bone">
            Preview order message
          </summary>
          <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-fog">{preview}</pre>
        </details>
      </aside>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fog">{label}</span>
      <span className={accent ? "text-acid" : "text-bone"}>{value}</span>
    </div>
  );
}

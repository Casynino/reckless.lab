"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Truck, Clock, Sparkles, Info, Plus, Pencil, ArrowLeft } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/shop/cart-store";
import { formatPrice } from "@/lib/shop/format";
import { shippingCountries, quoteShipping, countryName, TBC_SHIPPING_MESSAGE, type ShippingQuote, type ShippingRegion } from "@/lib/shop/shipping";
import { buildOrderDraft, buildWhatsAppUrl, buildOrderMessage } from "@/lib/shop/whatsapp";
import { placeOrderAction } from "@/lib/orders/actions";
import { applyCouponAction } from "@/lib/promo/actions";
import { createAccountFromCheckoutAction } from "@/lib/auth/actions";
import { saveAddressAction } from "@/lib/account/address-actions";
import { shopConfig } from "@/lib/shop/config";
import type { ShippingAddress } from "@/lib/types";
import type { SavedAddress } from "@/lib/account/addresses";
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

type FieldDef = { key: keyof ShippingAddress; label: string; required?: boolean; type?: string; half?: boolean; placeholder?: string };

// Contact first, then Country, then the address — top-down so you never repeat
// the country. Labels/placeholders guide a city → area hierarchy.
const CONTACT_FIELDS: FieldDef[] = [
  { key: "fullName", label: "Full name", required: true },
  { key: "email", label: "Email", required: true, type: "email" },
  { key: "phone", label: "Phone (WhatsApp)", required: true },
];
const ADDRESS_FIELDS: FieldDef[] = [
  { key: "city", label: "City / Town", required: true, half: true, placeholder: "e.g. Dar es Salaam" },
  { key: "region", label: "Area / District", half: true, placeholder: "e.g. Kinondoni, Mbezi Beach" },
  { key: "address1", label: "Street / neighbourhood", required: true, placeholder: "e.g. Mbezi, Goigi" },
  { key: "address2", label: "House / apartment (optional)" },
  { key: "postalCode", label: "Postal code (optional)", half: true },
];
const REQUIRED_FIELDS = [...CONTACT_FIELDS, ...ADDRESS_FIELDS].filter((f) => f.required);

/** Map a saved address into the checkout form shape (email comes from the account). */
function addrToForm(a: SavedAddress, email?: string): ShippingAddress {
  return {
    fullName: a.fullName,
    email: email ?? "",
    phone: a.phone,
    address1: a.line1,
    address2: a.line2 ?? "",
    city: a.city,
    region: a.region ?? "",
    postalCode: a.postalCode ?? "",
    countryCode: a.countryCode,
  };
}

type Placed = { reference: string; tracking: string; waUrl: string };

export function CheckoutClient({
  loggedIn = false,
  regions,
  savedAddresses = [],
  userEmail,
}: {
  loggedIn?: boolean;
  regions: ShippingRegion[];
  savedAddresses?: SavedAddress[];
  userEmail?: string;
}) {
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clear);

  const defaultAddr = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];
  const [form, setForm] = useState<ShippingAddress>(() =>
    defaultAddr ? addrToForm(defaultAddr, userEmail) : { ...EMPTY, email: userEmail ?? "" },
  );
  const router = useRouter();
  // "saved" = choosing from the address book; "form" = typing a new/edited one.
  const [mode, setMode] = useState<"saved" | "form">(savedAddresses.length ? "saved" : "form");
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(defaultAddr?.id ?? null);
  // The saved-address id being edited (null = a brand-new address).
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addrSave, setAddrSave] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [addrErr, setAddrErr] = useState("");
  const [touched, setTouched] = useState(false);
  // Cart is persisted client-side; wait for mount before deciding it's empty so
  // the "nothing to check out" state never flashes on the real page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function pickAddress(a: SavedAddress) {
    setSelectedAddrId(a.id);
    setForm(addrToForm(a, userEmail));
  }
  function editAddress(a: SavedAddress) {
    pickAddress(a);
    setEditingId(a.id);
    setAddrSave("idle");
    setAddrErr("");
    setMode("form");
  }
  function newAddress() {
    setSelectedAddrId(null);
    setEditingId(null);
    setForm({ ...EMPTY, email: userEmail ?? "" });
    setAddrSave("idle");
    setAddrErr("");
    setMode("form");
  }
  function backToSaved() {
    if (!selectedAddrId && defaultAddr) pickAddress(defaultAddr);
    setMode("saved");
  }

  // Persist the address to the customer's book — updates when editing, creates
  // when new. Then return to the picker with it selected.
  async function saveAddressToBook() {
    setAddrErr("");
    setAddrSave("saving");
    const res = await saveAddressAction({
      id: editingId ?? undefined,
      fullName: form.fullName,
      phone: form.phone,
      line1: form.address1,
      line2: form.address2 || undefined,
      city: form.city,
      region: form.region || undefined,
      postalCode: form.postalCode || undefined,
      countryCode: form.countryCode,
    }).catch(() => null);
    if (!res) {
      setAddrSave("error");
      setAddrErr("Couldn't save. Try again.");
      return;
    }
    if ("error" in res) {
      setAddrSave("error");
      setAddrErr(res.error ?? "Couldn't save. Try again.");
      return;
    }
    setAddrSave("saved");
    const newId = res.id;
    if (newId) setSelectedAddrId(newId);
    router.refresh();
    setMode("saved");
  }
  const [pw, setPw] = useState("");
  const [acct, setAcct] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [acctErr, setAcctErr] = useState("");

  async function createAccount() {
    setAcctErr("");
    setAcct("saving");
    const res = await createAccountFromCheckoutAction({ name: form.fullName, email: form.email, password: pw });
    if (res?.error) {
      setAcct("error");
      setAcctErr(res.error);
      return;
    }
    setAcct("done");
  }
  const [status, setStatus] = useState<"idle" | "placing" | "error">("idle");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoErr, setPromoErr] = useState("");

  const subtotal = cartSubtotal(lines);
  // Single source of truth — recomputes instantly on country or cart change,
  // against the admin-editable rate card passed from the server.
  const quote = useMemo(() => quoteShipping(regions, form.countryCode, subtotal), [regions, form.countryCode, subtotal]);
  const shipping = quote.tbc ? 0 : quote.fee;
  const discount = Math.min(promo?.discount ?? 0, subtotal + shipping);
  const total = Math.max(0, subtotal + shipping - discount);

  async function applyPromo() {
    setPromoErr("");
    if (!promoInput.trim()) return;
    const res = await applyCouponAction({ code: promoInput, subtotal, shipping, email: form.email || undefined });
    if ("error" in res) {
      setPromo(null);
      setPromoErr(res.error);
      return;
    }
    setPromo({ code: res.code, discount: res.discount, label: res.label });
  }

  const valid = useMemo(
    () =>
      REQUIRED_FIELDS.every((f) => form[f.key]?.toString().trim()) &&
      form.email.includes("@") &&
      lines.length > 0,
    [form, lines],
  );

  function set<K extends keyof ShippingAddress>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function complete() {
    setTouched(true);
    if (!valid || status === "placing") {
      if (!valid) document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setStatus("placing");
    const draft = buildOrderDraft(regions, lines, form, Date.now());
    const res = await placeOrderAction({
      customerName: form.fullName,
      customerEmail: form.email,
      customerPhone: form.phone,
      countryCode: form.countryCode,
      address1: form.address1,
      address2: form.address2 || undefined,
      city: form.city,
      region: form.region || undefined,
      postalCode: form.postalCode || undefined,
      lines: lines.map((l) => ({
        productId: l.productId,
        slug: l.slug,
        name: l.name,
        colorway: l.colorway,
        size: l.size,
        price: l.price,
        qty: l.qty,
        image: l.image,
        sku: l.sku,
      })),
      subtotal,
      discount,
      couponCode: promo?.code,
    }).catch(() => null);

    if (!res || "error" in res) {
      setStatus("error");
      return;
    }
    // Use the real (server) order reference + discounted total in the hand-off.
    const waUrl = buildWhatsAppUrl({ ...draft, reference: res.reference, discount, couponCode: promo?.code, total });
    clearCart();
    setPlaced({ reference: res.reference, tracking: res.tracking, waUrl });
  }

  // Confirmation
  if (placed) {
    return (
      <div className="container-edge flex min-h-[80vh] flex-col items-center justify-center pt-28 pb-24 text-center">
        <span className="eyebrow text-acid">[ Order Placed ]</span>
        <h1 className="mt-5 font-display display-lg text-bone">You&apos;re in.</h1>
        <p className="mt-4 max-w-md text-fog">
          Your order is logged. Finish on WhatsApp — our team confirms stock and sends payment instructions.
          Save these numbers to track it any time.
        </p>
        <div className="mt-10 grid w-full max-w-md grid-cols-2 gap-4">
          <div className="rounded-sm border border-smoke bg-ink-soft p-5">
            <p className="text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">Order number</p>
            <p className="mt-2 font-display text-2xl tracking-tight text-bone">{placed.reference}</p>
          </div>
          <div className="rounded-sm border border-smoke bg-ink-soft p-5">
            <p className="text-mono text-[0.55rem] uppercase tracking-[0.25em] text-ash">Tracking number</p>
            <p className="mt-2 font-display text-2xl tracking-tight text-bone">{placed.tracking}</p>
          </div>
        </div>
        <a
          href={placed.waUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 bg-acid px-10 py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90"
        >
          Continue on WhatsApp <ArrowRight className="h-4 w-4" />
        </a>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link href={`/track?ref=${placed.reference}&trk=${placed.tracking}`} className="link-underline text-mono text-xs uppercase tracking-[0.2em] text-bone">
            Track your order
          </Link>
          <Link href="/collections" className="link-underline text-mono text-xs uppercase tracking-[0.2em] text-bone-dim hover:text-bone">
            Keep shopping
          </Link>
        </div>

        {/* Create account from checkout details */}
        {!loggedIn && (
          <div className="mt-12 w-full max-w-md rounded-sm border border-smoke bg-ink-soft p-6 text-left">
            {acct === "done" ? (
              <p className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">
                ✓ Account created — you&apos;re signed in.{" "}
                <Link href="/account" className="underline">Go to your dashboard →</Link>
              </p>
            ) : (
              <>
                <p className="text-mono text-[0.6rem] uppercase tracking-[0.25em] text-acid">Create your Reckless Lab account</p>
                <p className="mt-2 text-sm text-fog">
                  Save the details you just entered and track every order in one place. Only set a password.
                </p>
                <div className="mt-4 flex gap-2">
                  <input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="Choose a password (6+ chars)"
                    className="w-full border-b border-smoke bg-transparent py-2 text-bone placeholder:text-ash/60 focus:border-bone focus:outline-none"
                  />
                  <button
                    onClick={createAccount}
                    disabled={acct === "saving" || pw.length < 6}
                    className="shrink-0 bg-bone px-5 text-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {acct === "saving" ? "…" : "Create"}
                  </button>
                </div>
                {acctErr && <p className="mt-2 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{acctErr}</p>}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // Before the persisted cart hydrates we can't tell if it's really empty — show
  // a quiet placeholder instead of flashing the empty state.
  if (!mounted) {
    return <div className="container-edge flex min-h-[60vh] items-center justify-center text-mono text-[0.7rem] uppercase tracking-[0.25em] text-ash">Loading your bag…</div>;
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

  const preview = buildOrderMessage(buildOrderDraft(regions, lines, form, 0));

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

        {savedAddresses.length > 0 && mode === "saved" ? (
          /* Returning customer — pick a saved address, no retyping */
          <div className="mt-8">
            <SavedAddressPicker
              addresses={savedAddresses}
              selectedId={selectedAddrId}
              onSelect={pickAddress}
              onEdit={editAddress}
              onNew={newAddress}
            />
            <div className="mt-6">
              <ShippingMethodPanel quote={quote} />
            </div>
          </div>
        ) : (
          <div className="mt-8">
            {savedAddresses.length > 0 && (
              <button
                onClick={backToSaved}
                className="mb-5 inline-flex items-center gap-2 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Use a saved address
              </button>
            )}
            <div className="grid grid-cols-2 gap-4">
              {CONTACT_FIELDS.map((f) => (
                <AddressField key={f.key} f={f} value={form[f.key] ?? ""} touched={touched} onChange={(v) => set(f.key, v)} />
              ))}

              {/* Country — picked once, drives the shipping quote */}
              <div className="col-span-2">
                <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
                  Country <span className="text-acid">*</span>
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
              </div>

              <div className="col-span-2">
                <ShippingMethodPanel quote={quote} />
              </div>

              {ADDRESS_FIELDS.map((f) => (
                <AddressField key={f.key} f={f} value={form[f.key] ?? ""} touched={touched} onChange={(v) => set(f.key, v)} />
              ))}

              {loggedIn && (
                <div className="col-span-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={saveAddressToBook}
                    disabled={addrSave === "saving"}
                    className="border border-smoke px-6 py-2.5 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone transition-colors hover:border-bone disabled:opacity-50"
                  >
                    {addrSave === "saving" ? "Saving…" : editingId ? "Save changes" : "Save to my addresses"}
                  </button>
                  {addrSave === "saved" && (
                    <span className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">✓ Saved to your account</span>
                  )}
                  {addrErr && <span className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{addrErr}</span>}
                  <span className="w-full text-[0.7rem] leading-relaxed text-ash">
                    Saving updates your address book. You can still place the order without saving.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

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
              label={`Shipping · ${quote.regionLabel}`}
              value={quote.tbc ? "To be confirmed" : shipping === 0 ? "FREE" : formatPrice(shipping)}
              accent={!quote.tbc && shipping === 0}
            />
            <p className="text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">
              {quote.courier} · {quote.eta}
            </p>
            {discount > 0 && promo && (
              <Row label={`Promo · ${promo.code}`} value={`− ${formatPrice(discount)}`} accent />
            )}
          </div>

          {/* Free-shipping progress / status — the trust-builder */}
          <ShippingStatus quote={quote} />

          {/* Promo code */}
          <div className="mt-4 border-t border-smoke pt-4">
            {promo ? (
              <div className="flex items-center justify-between">
                <span className="text-mono text-[0.65rem] uppercase tracking-[0.15em] text-acid">✓ {promo.label} applied</span>
                <button
                  onClick={() => { setPromo(null); setPromoInput(""); }}
                  className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash hover:text-bone"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  className="w-full border-b border-smoke bg-transparent py-2 text-sm uppercase text-bone placeholder:normal-case placeholder:text-ash/60 focus:border-bone focus:outline-none"
                />
                <button
                  onClick={applyPromo}
                  className="shrink-0 border border-smoke px-4 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone-dim transition-colors hover:border-bone hover:text-bone"
                >
                  Apply
                </button>
              </div>
            )}
            {promoErr && <p className="mt-2 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">{promoErr}</p>}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-smoke pt-4">
            <span className="text-mono text-xs uppercase tracking-[0.25em] text-fog">Total</span>
            <span className="font-display text-2xl text-bone">{formatPrice(total)}</span>
          </div>
          {quote.tbc && (
            <p className="mt-1.5 text-right text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">
              + shipping · confirmed on WhatsApp
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={complete}
            disabled={status === "placing"}
            data-cursor="send"
            className="mt-6 flex w-full items-center justify-center gap-2 bg-acid py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "placing" ? "Placing order…" : <>Place order &amp; continue <ArrowRight className="h-4 w-4" /></>}
          </motion.button>
          {status === "error" ? (
            <p className="mt-3 text-center text-mono text-[0.6rem] uppercase tracking-[0.15em] text-acid">
              Something went wrong. Please try again.
            </p>
          ) : (
            <p className="mt-3 text-center text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
              Generates your order + tracking number, then WhatsApp to {shopConfig.whatsapp.label}
            </p>
          )}
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

function AddressField({
  f,
  value,
  touched,
  onChange,
}: {
  f: FieldDef;
  value: string;
  touched: boolean;
  onChange: (v: string) => void;
}) {
  const invalid = touched && f.required && !value.toString().trim();
  return (
    <div className={f.half ? "col-span-1" : "col-span-2"}>
      <label className="mb-1.5 block text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
        {f.label}
        {f.required && <span className="text-acid"> *</span>}
      </label>
      <input
        type={f.type ?? "text"}
        value={value}
        placeholder={f.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border-b bg-transparent py-2.5 text-bone placeholder:text-ash/60 focus:outline-none ${
          invalid ? "border-acid" : "border-smoke focus:border-bone"
        }`}
      />
    </div>
  );
}

/** Live courier / ETA / fee, updating the instant the country changes. */
function ShippingMethodPanel({ quote }: { quote: ShippingQuote }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quote.regionId + String(quote.freeShipping)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className="grid gap-px overflow-hidden rounded-sm border border-smoke bg-smoke sm:grid-cols-3"
      >
        <div className="flex items-center gap-2.5 bg-ink-soft px-4 py-3">
          <Truck className="h-4 w-4 shrink-0 text-acid" />
          <div className="min-w-0">
            <p className="text-mono text-[0.5rem] uppercase tracking-[0.2em] text-ash">Courier</p>
            <p className="truncate text-sm text-bone">{quote.courier}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-ink-soft px-4 py-3">
          <Clock className="h-4 w-4 shrink-0 text-acid" />
          <div className="min-w-0">
            <p className="text-mono text-[0.5rem] uppercase tracking-[0.2em] text-ash">Estimated delivery</p>
            <p className="text-sm leading-tight text-bone">{quote.eta}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-ink-soft px-4 py-3">
          <Sparkles className="h-4 w-4 shrink-0 text-acid" />
          <div className="min-w-0">
            <p className="text-mono text-[0.5rem] uppercase tracking-[0.2em] text-ash">Shipping fee</p>
            <p className={`text-sm ${quote.freeShipping ? "text-acid" : "text-bone"}`}>
              {quote.tbc ? "To be confirmed" : quote.fee === 0 ? "FREE" : formatPrice(quote.fee)}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Returning-customer address book at checkout — pick, edit, or add new. */
function SavedAddressPicker({
  addresses,
  selectedId,
  onSelect,
  onEdit,
  onNew,
}: {
  addresses: SavedAddress[];
  selectedId: string | null;
  onSelect: (a: SavedAddress) => void;
  onEdit: (a: SavedAddress) => void;
  onNew: () => void;
}) {
  return (
    <div>
      <p className="mb-3 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">Deliver to</p>
      <div className="space-y-3">
        {addresses.map((a) => {
          const sel = a.id === selectedId;
          return (
            <div
              key={a.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(a)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(a);
                }
              }}
              className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors ${
                sel ? "border-acid bg-acid/5" : "border-smoke hover:border-ash/60"
              }`}
            >
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${sel ? "border-acid" : "border-smoke"}`}>
                {sel && <span className="h-2 w-2 rounded-full bg-acid" />}
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-bone">{a.fullName}</span>
                  {a.isDefault && (
                    <span className="rounded-full border border-smoke px-2 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.15em] text-ash">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-fog">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
                <p className="text-fog">{[a.city, a.region, a.postalCode].filter(Boolean).join(", ")}</p>
                <p className="text-fog">{countryName(a.countryCode)} · {a.phone}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(a);
                }}
                aria-label="Edit this address"
                className="shrink-0 p-1 text-ash transition-colors hover:text-bone"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      <button
        onClick={onNew}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-smoke py-4 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash transition-colors hover:border-bone hover:text-bone"
      >
        <Plus className="h-3.5 w-3.5" /> Deliver to a new address
      </button>
    </div>
  );
}

/**
 * Premium free-shipping status. Three states, one component:
 *  · Rest-of-world → a trustworthy "to be confirmed" note
 *  · Threshold met / always-free → a celebratory confirmation
 *  · Below threshold → an animated progress bar counting down to free shipping
 */
function ShippingStatus({ quote }: { quote: ShippingQuote }) {
  if (quote.tbc) {
    return (
      <div className="mt-4 flex gap-2.5 rounded-sm border border-smoke bg-ink p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-acid" />
        <div>
          <p className="text-mono text-[0.6rem] uppercase tracking-[0.2em] text-acid">Shipping · To be confirmed</p>
          <p className="mt-1.5 text-xs leading-relaxed text-fog">{TBC_SHIPPING_MESSAGE}</p>
        </div>
      </div>
    );
  }

  if (quote.freeShipping) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 flex items-center gap-2.5 rounded-sm border border-acid/40 bg-acid/10 p-3.5"
      >
        <motion.span
          animate={{ scale: [1, 1.25, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.5 }}
        >
          <Sparkles className="h-4 w-4 shrink-0 text-acid" />
        </motion.span>
        <p className="text-xs font-medium leading-snug text-acid">
          Congratulations! Your order qualifies for FREE shipping.
        </p>
      </motion.div>
    );
  }

  if (quote.progressEligible && quote.remainingForFree > 0 && quote.freeThreshold > 0) {
    const pct = Math.max(
      5,
      Math.min(100, Math.round(((quote.freeThreshold - quote.remainingForFree) / quote.freeThreshold) * 100)),
    );
    return (
      <div className="mt-4 rounded-sm border border-smoke bg-ink p-4">
        <p className="text-xs text-fog">
          You&apos;re only <span className="font-semibold text-bone">{formatPrice(quote.remainingForFree)}</span> away from{" "}
          <span className="font-semibold text-acid">FREE shipping</span>.
        </p>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-smoke">
          <motion.div
            className="h-full rounded-full bg-acid"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    );
  }

  return null;
}

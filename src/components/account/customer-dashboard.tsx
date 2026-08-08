"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, MapPin, Package, Gift, LogOut, MessageSquare, ArrowUpRight } from "lucide-react";
import { useWishlist } from "@/lib/shop/wishlist-store";
import { useCart } from "@/lib/shop/cart-store";
import { logoutAction } from "@/lib/auth/actions";
import { SmartImage } from "@/components/ui/smart-image";
import { formatPrice } from "@/lib/shop/format";
import { STATE_META, type Order } from "@/lib/orders/types";
import { AccountOrders } from "./account-orders";
import { AddressBook } from "./address-book";
import { ProfileForm } from "./profile-form";
import type { Product, Size } from "@/lib/types";
import type { SavedAddress } from "@/lib/account/addresses";

const TABS = ["Overview", "Orders", "Wishlist", "Addresses", "Settings"] as const;
type Tab = (typeof TABS)[number];

function firstSize(p: Product): Size | undefined {
  return (p.variants.find((v) => v.stock > 0) ?? p.variants[0])?.size;
}

export function CustomerDashboard({
  name,
  email,
  orders,
  addresses,
  allProducts,
}: {
  name: string;
  email: string;
  orders: Order[];
  addresses: SavedAddress[];
  allProducts: Product[];
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  // Wishlist is persisted client-side — defer reading it until mount so the
  // server render (empty) matches the first client render (no hydration flash).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wishIds = useWishlist((s) => s.ids);
  const removeWish = useWishlist((s) => s.remove);
  const addCart = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);

  const saved = mounted ? allProducts.filter((p) => wishIds.includes(p.id)) : [];
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.state));
  const delivered = orders.filter((o) => o.state === "delivered");
  const recent = orders[0];

  const stats: { label: string; value: string | number; icon: typeof Package; tab?: Tab }[] = [
    { label: "Active orders", value: active.length, icon: Package, tab: "Orders" },
    { label: "Delivered", value: delivered.length, icon: ShoppingBag, tab: "Orders" },
    { label: "Wishlist", value: saved.length, icon: Heart, tab: "Wishlist" },
    { label: "Saved addresses", value: addresses.length, icon: MapPin, tab: "Addresses" },
    { label: "Rewards", value: "Soon", icon: Gift },
  ];

  return (
    <div className="container-edge pb-24">
      {/* Tab bar */}
      <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-smoke pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative text-mono text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${tab === t ? "text-bone" : "text-ash hover:text-bone"}`}
          >
            {t}
            {t === "Wishlist" && saved.length > 0 ? ` · ${saved.length}` : ""}
            {tab === t && <motion.span layoutId="acct-tab" className="absolute -bottom-4 left-0 h-px w-full bg-acid" />}
          </button>
        ))}
        <form action={logoutAction} className="ml-auto">
          <button className="flex items-center gap-2 text-mono text-[0.68rem] uppercase tracking-[0.2em] text-ash transition-colors hover:text-acid">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </form>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="mt-10">
          {tab === "Overview" && (
            <div className="space-y-12">
              {/* Stat tiles */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {stats.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => s.tab && setTab(s.tab)}
                    className="group rounded-sm border border-smoke bg-ink-soft p-5 text-left transition-colors hover:border-ash/50"
                  >
                    <s.icon className="h-4 w-4 text-acid" />
                    <p className="mt-6 font-display text-4xl text-bone">{s.value}</p>
                    <p className="mt-1 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">{s.label}</p>
                  </button>
                ))}
              </div>

              {/* Recent + quick links */}
              <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <h3 className="mb-4 text-mono text-xs uppercase tracking-[0.25em] text-bone">Recent activity</h3>
                  {recent ? (
                    <button onClick={() => setTab("Orders")} className="block w-full rounded-sm border border-smoke bg-ink-soft p-5 text-left transition-colors hover:border-ash/50">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-display text-lg tracking-tight text-bone">{recent.reference}</span>
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-mono text-[0.5rem] uppercase tracking-[0.15em] ${STATE_META[recent.state].tone}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${STATE_META[recent.state].dot}`} /> {STATE_META[recent.state].label}
                        </span>
                      </div>
                      <p className="mt-2 text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                        {new Date(recent.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {recent.lines.reduce((n, l) => n + l.qty, 0)} item(s) · {formatPrice(recent.total)} — view tracking →
                      </p>
                    </button>
                  ) : (
                    <div className="rounded-sm border border-smoke bg-ink-soft p-8 text-center">
                      <p className="text-sm text-fog">No orders yet. Your first drop is waiting.</p>
                      <Link href="/collections/new-arrivals" className="mt-4 inline-block border border-bone px-6 py-2.5 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-bone hover:bg-bone hover:text-ink">Shop now</Link>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <QuickLink href="/account/messages" icon={MessageSquare} label="Support chat" accent />
                  <QuickLink href="/track" icon={Package} label="Track an order" />
                  <QuickLink href="/collections/new-arrivals" icon={ShoppingBag} label="Continue shopping" />
                </div>
              </div>
            </div>
          )}

          {tab === "Orders" && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Order history</h3>
                <Link href="/track" className="link-underline text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash hover:text-bone">Track by number →</Link>
              </div>
              <AccountOrders orders={orders} />
            </div>
          )}

          {tab === "Wishlist" && (
            <div>
              <h3 className="mb-5 text-mono text-xs uppercase tracking-[0.25em] text-bone">Saved pieces</h3>
              {saved.length === 0 ? (
                <div className="rounded-sm border border-smoke bg-ink-soft p-10 text-center">
                  <p className="text-mono text-xs uppercase tracking-[0.15em] text-ash">Nothing saved yet</p>
                  <p className="mt-3 text-sm text-fog">Tap the heart on any piece to save it here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {saved.map((p) => (
                    <div key={p.id} className="group rounded-sm border border-smoke bg-ink-soft p-3">
                      <Link href={`/products/${p.slug}`} className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-carbon">
                        <SmartImage src={p.media[0]?.src ?? ""} alt={p.name} fill sizes="30vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                      <div className="mt-3">
                        <p className="text-sm text-bone">{p.name}</p>
                        <p className="text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">{p.colorway} · {formatPrice(p.price)}</p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => { const s = firstSize(p); if (!s) return; addCart(p, s, 1); removeWish(p.id); openCart(); }}
                          className="flex-1 bg-bone py-2 text-mono text-[0.55rem] font-bold uppercase tracking-[0.15em] text-ink transition-opacity hover:opacity-90"
                        >
                          Move to bag
                        </button>
                        <button onClick={() => removeWish(p.id)} className="border border-smoke px-3 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash hover:border-acid hover:text-acid">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "Addresses" && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Address book</h3>
                <span className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">Speeds up checkout</span>
              </div>
              <AddressBook addresses={addresses} />
            </div>
          )}

          {tab === "Settings" && (
            <div className="max-w-xl">
              <h3 className="mb-5 text-mono text-xs uppercase tracking-[0.25em] text-bone">Account settings</h3>
              <div className="rounded-sm border border-smoke bg-ink-soft p-6">
                <ProfileForm name={name} email={email} />
              </div>
              <p className="mt-4 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-ash">
                Phone &amp; preferred country are saved per address in your address book.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label, accent }: { href: string; icon: typeof Package; label: string; accent?: boolean }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-sm border border-smoke bg-ink-soft p-4 transition-colors hover:border-bone">
      <span className="flex items-center gap-3 text-bone">
        <Icon className={`h-4 w-4 ${accent ? "text-acid" : ""}`} /> {label}
      </span>
      <ArrowUpRight className="h-4 w-4 text-ash" />
    </Link>
  );
}

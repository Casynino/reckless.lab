"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/shop/cart-store";
import { formatPrice } from "@/lib/shop/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shop/shipping";
import { SmartImage } from "@/components/ui/smart-image";

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove } = useCart();
  const subtotal = cartSubtotal(lines);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-smoke bg-ink-soft"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-smoke px-6 py-5">
              <h2 className="font-display text-xl text-bone">
                Your Bag <span className="text-ash">({lines.reduce((n, l) => n + l.qty, 0)})</span>
              </h2>
              <button onClick={close} data-cursor="close" aria-label="Close cart" className="text-bone hover:text-acid">
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="text-mono text-xs uppercase tracking-[0.3em] text-ash">Your bag is empty</p>
                <p className="max-w-xs text-fog">Nothing in here yet. Go find something worth breaking the rules for.</p>
                <Link
                  href="/collections"
                  onClick={close}
                  className="border border-bone px-8 py-3 text-mono text-xs uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
                >
                  Explore
                </Link>
              </div>
            ) : (
              <>
                {/* Free-shipping meter */}
                {FREE_SHIPPING_THRESHOLD > 0 && (
                  <div className="border-b border-smoke px-6 py-4">
                    <p className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-fog">
                      {remaining > 0 ? (
                        <>Add <span className="text-acid">{formatPrice(remaining)}</span> for free worldwide shipping</>
                      ) : (
                        <span className="text-acid">You&apos;ve unlocked free shipping ✳</span>
                      )}
                    </p>
                    <div className="mt-2 h-px w-full bg-smoke">
                      <div className="h-px bg-acid transition-all duration-700" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <div key={line.sku} className="flex gap-4 border-b border-smoke/60 py-5">
                      <Link href={`/products/${line.slug}`} onClick={close} className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-carbon">
                        <SmartImage src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <div>
                            <Link href={`/products/${line.slug}`} onClick={close} className="text-sm font-medium text-bone hover:text-acid">
                              {line.name}
                            </Link>
                            <p className="mt-0.5 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">
                              {line.colorway} · {line.size}
                            </p>
                          </div>
                          <button onClick={() => remove(line.sku)} aria-label="Remove" className="text-ash hover:text-bone">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-smoke">
                            <button onClick={() => setQty(line.sku, line.qty - 1)} aria-label="Decrease" className="px-2 py-1.5 text-bone hover:text-acid">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-mono text-xs text-bone">{line.qty}</span>
                            <button onClick={() => setQty(line.sku, line.qty + 1)} aria-label="Increase" className="px-2 py-1.5 text-bone hover:text-acid">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm text-bone">{formatPrice(line.price * line.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-smoke px-6 py-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-mono text-xs uppercase tracking-[0.25em] text-fog">Subtotal</span>
                    <span className="font-display text-2xl text-bone">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
                    Shipping & taxes calculated at checkout
                  </p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    data-cursor="checkout"
                    className="block w-full bg-acid py-4 text-center text-mono text-xs font-bold uppercase tracking-[0.25em] text-ink transition-opacity hover:opacity-90"
                  >
                    Checkout →
                  </Link>
                  <button
                    onClick={close}
                    className="mt-3 w-full text-center text-mono text-[0.7rem] uppercase tracking-[0.2em] text-ash hover:text-bone"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

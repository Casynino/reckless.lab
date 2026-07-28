"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product, Size } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  /** Bumped whenever a line is added — drives the "just added" flourish. */
  lastAddedAt: number | null;

  add: (product: Product, size: Size, qty?: number) => void;
  remove: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      lastAddedAt: null,

      add: (product, size, qty = 1) =>
        set((state) => {
          const variant = product.variants.find((v) => v.size === size);
          if (!variant) return state;
          const existing = state.lines.find((l) => l.sku === variant.sku);
          const lines = existing
            ? state.lines.map((l) =>
                l.sku === variant.sku ? { ...l, qty: Math.min(l.qty + qty, variant.stock) } : l,
              )
            : [
                ...state.lines,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  size,
                  sku: variant.sku,
                  qty: Math.min(qty, variant.stock),
                  image: product.media[0]?.src ?? "",
                  colorway: product.colorway,
                },
              ];
          return { lines, isOpen: true, lastAddedAt: Date.now() };
        }),

      remove: (sku) => set((state) => ({ lines: state.lines.filter((l) => l.sku !== sku) })),

      setQty: (sku, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.sku !== sku)
              : state.lines.map((l) => (l.sku === sku ? { ...l, qty } : l)),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    { name: "reckless-cart", partialize: (s) => ({ lines: s.lines }) },
  ),
);

/** Derived selectors (kept outside the store to avoid re-render churn). */
export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
export const cartSubtotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.price * l.qty, 0);

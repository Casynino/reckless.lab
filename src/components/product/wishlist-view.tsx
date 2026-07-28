"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/lib/shop/wishlist-store";
import { ProductGrid } from "@/components/product/product-grid";

/**
 * Renders the saved products. Receives the full catalog from the server and
 * filters by the persisted wishlist ids on the client.
 */
export function WishlistView({ allProducts }: { allProducts: Product[] }) {
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="container-edge min-h-[30vh]" />;
  }

  const saved = allProducts.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <div className="container-edge flex min-h-[45vh] flex-col items-center justify-center gap-6 text-center">
        <p className="text-mono text-xs uppercase tracking-[0.3em] text-ash">Nothing saved yet</p>
        <p className="max-w-sm text-fog">
          Tap the heart on any piece to keep it here. Your watchlist lives on this device.
        </p>
        <Link
          href="/collections/new-arrivals"
          className="border border-bone px-10 py-4 text-mono text-xs uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
        >
          Browse the Drop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-edge pb-24">
      <div className="mb-10 flex items-center justify-between border-y border-smoke py-4">
        <span className="text-mono text-xs uppercase tracking-[0.25em] text-ash">
          {saved.length} {saved.length === 1 ? "piece" : "pieces"} saved
        </span>
        <button
          onClick={clear}
          className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-acid"
        >
          Clear all
        </button>
      </div>
      <ProductGrid products={saved} />
    </div>
  );
}

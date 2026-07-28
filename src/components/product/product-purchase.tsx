"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Product, Size } from "@/lib/types";
import { useCart } from "@/lib/shop/cart-store";
import { flyToCart } from "@/lib/shop/fly-to-cart";
import { formatPrice } from "@/lib/shop/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shop/shipping";
import { WishlistButton } from "@/components/product/wishlist-button";
import { SizeGuide } from "@/components/product/size-guide";
import { cn } from "@/lib/utils";

/** One-size items (caps, beanies, scarves) skip the size grid. */
function isOneSize(product: Product) {
  return product.variants.length === 1;
}

export function ProductPurchase({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const oneSize = isOneSize(product);
  const [size, setSize] = useState<Size | null>(oneSize ? product.variants[0].size : null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const selectedVariant = product.variants.find((v) => v.size === size);
  const soldOut = product.variants.every((v) => v.stock === 0);
  const lowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 4;

  function handleAdd(e?: React.MouseEvent) {
    if (!size) {
      setError(true);
      return;
    }
    add(product, size, 1);
    if (e) {
      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
      flyToCart(product.media[0]?.src ?? "", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div>
      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-bone">{formatPrice(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-lg text-ash line-through">{formatPrice(product.compareAtPrice)}</span>
        )}
        {product.compareAtPrice && (
          <span className="bg-acid px-2 py-0.5 text-mono text-[0.6rem] font-bold uppercase tracking-[0.15em] text-ink">
            Save {formatPrice(product.compareAtPrice - product.price)}
          </span>
        )}
      </div>

      <p className="mt-3 text-mono text-xs uppercase tracking-[0.2em] text-ash">
        Colorway — {product.colorway}
      </p>

      {/* Size */}
      {!oneSize && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-mono text-xs uppercase tracking-[0.25em] text-bone">Select Size</span>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash underline hover:text-bone"
            >
              Size Guide
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.variants.map((v) => {
              const out = v.stock === 0;
              return (
                <button
                  key={v.size}
                  disabled={out}
                  onClick={() => {
                    setSize(v.size);
                    setError(false);
                  }}
                  className={cn(
                    "relative border py-3.5 text-mono text-sm uppercase tracking-[0.1em] transition-colors",
                    out
                      ? "cursor-not-allowed border-smoke/60 text-ash/50"
                      : size === v.size
                        ? "border-acid bg-acid text-ink"
                        : "border-smoke text-bone hover:border-bone",
                  )}
                >
                  {v.size}
                  {out && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-px w-8 rotate-[-20deg] bg-ash/60" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {error && <p className="mt-3 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-acid">↑ Pick a size first</p>}
          {lowStock && (
            <p className="mt-3 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-fog">
              Only {selectedVariant!.stock} left in {size}
            </p>
          )}
        </div>
      )}

      {/* Add to cart */}
      <div className="mt-8 flex flex-col gap-3">
        <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={soldOut}
          data-cursor={soldOut ? undefined : "add"}
          className={cn(
            "relative flex h-14 flex-1 items-center justify-center overflow-hidden text-mono text-xs font-bold uppercase tracking-[0.25em] transition-colors",
            soldOut ? "cursor-not-allowed bg-smoke text-ash" : "bg-bone text-ink hover:bg-acid",
          )}
        >
          <motion.span
            key={added ? "added" : "add"}
            initial={{ y: added ? 20 : 0, opacity: added ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2"
          >
            {soldOut ? "Sold Out" : added ? (
              <>
                <Check className="h-4 w-4" /> Added to bag
              </>
            ) : (
              "Add to Bag"
            )}
          </motion.span>
        </button>
          <WishlistButton productId={product.id} variant="pdp" />
        </div>
        <p className="text-center text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
          Free worldwide shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)} · Ships in 1–3 days
        </p>
      </div>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}

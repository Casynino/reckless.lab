"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/shop/format";
import { SmartImage } from "@/components/ui/smart-image";
import { WishlistButton } from "@/components/product/wishlist-button";
import { cn } from "@/lib/utils";

/**
 * Editorial product card. Hover swaps to the second image, reveals a quick
 * "view" cue, and lifts the meta. The whole card is a link to the PDP.
 */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const primary = product.media[0];
  const secondary = product.media[1] ?? product.media[0];

  const badge = product.isLimited
    ? "Limited"
    : product.isNew
      ? "New"
      : product.isBestSeller
        ? "Best Seller"
        : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      data-cursor="view"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-carbon">
        <SmartImage
          src={primary.src}
          alt={primary.alt}
          fill
          priority={priority}
          sizes="(max-width:768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            hover ? "scale-105 opacity-0" : "scale-100 opacity-100",
          )}
        />
        <SmartImage
          src={secondary.src}
          alt={secondary.alt}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className={cn(
            "object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            hover ? "scale-105 opacity-100" : "scale-110 opacity-0",
          )}
        />

        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {badge && (
            <span className="bg-ink/80 px-2.5 py-1 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-acid backdrop-blur">
              {badge}
            </span>
          )}
          {product.compareAtPrice && (
            <span className="bg-acid px-2.5 py-1 text-mono text-[0.6rem] font-bold uppercase tracking-[0.15em] text-ink">
              Sale
            </span>
          )}
        </div>

        <WishlistButton productId={product.id} variant="card" />

        <motion.div
          className="absolute inset-x-3 bottom-3 flex items-center justify-between bg-bone px-4 py-3 text-ink"
          initial={false}
          animate={{ y: hover ? 0 : 24, opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-mono text-[0.65rem] font-bold uppercase tracking-[0.2em]">View piece</span>
          <span className="text-mono text-[0.65rem]">→</span>
        </motion.div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-bone transition-colors group-hover:text-acid">{product.name}</h3>
          <p className="mt-0.5 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">{product.colorway}</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-bone">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="ml-2 text-xs text-ash line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

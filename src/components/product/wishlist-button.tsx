"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/shop/wishlist-store";
import { cn } from "@/lib/utils";

/**
 * Heart toggle. `variant="card"` is the small overlay used on product cards;
 * `variant="pdp"` is the bordered pill used on the product page.
 */
export function WishlistButton({
  productId,
  variant = "card",
  className,
}: {
  productId: string;
  variant?: "card" | "pdp";
  className?: string;
}) {
  const toggle = useWishlist((s) => s.toggle);
  const ids = useWishlist((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const saved = mounted && ids.includes(productId);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  }

  if (variant === "pdp") {
    return (
      <button
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        data-cursor={saved ? "saved" : "save"}
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center border transition-colors",
          saved ? "border-acid text-acid" : "border-smoke text-bone hover:border-bone",
          className,
        )}
      >
        <Heart className={cn("h-5 w-5", saved && "fill-acid")} />
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.8 }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={cn(
        "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/60 backdrop-blur transition-colors hover:bg-ink/80",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4 transition-colors", saved ? "fill-acid text-acid" : "text-bone")} />
    </motion.button>
  );
}

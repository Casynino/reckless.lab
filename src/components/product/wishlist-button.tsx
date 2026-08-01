"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/shop/wishlist-store";
import { cn } from "@/lib/utils";

/**
 * Heart toggle. `variant="card"` is the small overlay used on product cards;
 * `variant="pdp"` is the bordered pill used on the product page.
 *
 * Both variants give immediate, unmistakable feedback on tap — a heart-fill
 * pop plus a floating "Saved / Removed" confirmation — so the action reads
 * clearly on mobile where there's no hover state to lean on.
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
  const [toast, setToast] = useState<"saved" | "removed" | null>(null);
  useEffect(() => setMounted(true), []);
  const saved = mounted && ids.includes(productId);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = !saved;
    toggle(productId);
    setToast(nowSaved ? "saved" : "removed");
  }

  // Auto-dismiss the confirmation pill.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  const Toast = (
    <AnimatePresence>
      {toast && (
        <motion.span
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-ink/90 px-3 py-1.5 text-mono text-[0.55rem] uppercase tracking-[0.15em] text-bone shadow-lg backdrop-blur"
        >
          <Heart className={cn("h-3 w-3", toast === "saved" && "fill-acid text-acid")} />
          {toast === "saved" ? "Saved" : "Removed"}
        </motion.span>
      )}
    </AnimatePresence>
  );

  if (variant === "pdp") {
    return (
      <button
        onClick={onClick}
        aria-pressed={saved}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        data-cursor={saved ? "saved" : "save"}
        className={cn(
          "relative flex h-14 shrink-0 items-center justify-center gap-2 border px-4 transition-colors",
          saved ? "border-acid text-acid" : "border-smoke text-bone hover:border-bone",
          className,
        )}
      >
        {Toast}
        <motion.span key={String(saved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
          <Heart className={cn("h-5 w-5", saved && "fill-acid")} />
        </motion.span>
        <span className="text-mono text-[0.6rem] uppercase tracking-[0.15em]">{saved ? "Saved" : "Save"}</span>
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
        saved && "bg-ink/80",
        className,
      )}
    >
      {Toast}
      <motion.span key={String(saved)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Heart className={cn("h-4 w-4 transition-colors", saved ? "fill-acid text-acid" : "text-bone")} />
      </motion.span>
    </motion.button>
  );
}

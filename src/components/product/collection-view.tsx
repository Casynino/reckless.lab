"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "./product-grid";

type Sort = "featured" | "price-asc" | "price-desc" | "new";

const SORTS: { key: Sort; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "new", label: "Newest" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
];

export function CollectionView({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "new":
        return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      default:
        return list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    }
  }, [products, sort]);

  return (
    <div className="container-edge pb-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-y border-smoke py-4">
        <span className="text-mono text-xs uppercase tracking-[0.25em] text-ash">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </span>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">Sort</span>
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`px-3 py-1.5 text-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors ${
                sort === s.key ? "bg-bone text-ink" : "text-bone-dim hover:text-bone"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length > 0 ? (
        <ProductGrid products={sorted} priorityCount={4} />
      ) : (
        <p className="py-24 text-center text-fog">No pieces in this formula yet — check back soon.</p>
      )}
    </div>
  );
}

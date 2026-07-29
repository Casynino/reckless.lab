"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/product-grid";

const SERIES = [
  { key: "all", label: "All" },
  { key: "i-exist", label: "I Exist" },
  { key: "identity", label: "Identity" },
  { key: "reckless", label: "Reckless" },
] as const;

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
] as const;

export function SearchClient({ products, initialQuery = "" }: { products: Product[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [series, setSeries] = useState<(typeof SERIES)[number]["key"]>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("featured");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (series !== "all" && !p.collections.includes(series)) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.colorway.toLowerCase().includes(term) ||
        p.collections.some((c) => c.includes(term)) ||
        p.subtitle.toLowerCase().includes(term)
      );
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, q, series, sort]);

  return (
    <div className="container-edge pb-28">
      {/* Search field */}
      <div className="mx-auto max-w-2xl">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pieces, colours, series…"
          className="w-full border-b border-smoke bg-transparent pb-4 text-center font-display text-3xl text-bone placeholder:text-ash/50 focus:border-bone focus:outline-none md:text-4xl"
        />
      </div>

      {/* Filters */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {SERIES.map((s) => (
            <button
              key={s.key}
              onClick={() => setSeries(s.key)}
              className={`rounded-full border px-4 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.2em] transition-colors ${
                series === s.key ? "border-acid bg-acid/10 text-acid" : "border-smoke text-fog hover:border-bone hover:text-bone"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`text-mono text-[0.6rem] uppercase tracking-[0.2em] transition-colors ${sort === s.key ? "text-bone" : "text-ash hover:text-bone"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">
        {results.length} {results.length === 1 ? "piece" : "pieces"}
      </p>

      <div className="mt-6">
        {results.length ? (
          <ProductGrid products={results} />
        ) : (
          <p className="py-20 text-center text-fog">Nothing matches — try another word.</p>
        )}
      </div>
    </div>
  );
}

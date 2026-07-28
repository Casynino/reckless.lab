"use client";

import { useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Search, ChevronDown } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { formatPrice } from "@/lib/shop/format";
import { setStockAction } from "@/lib/inventory/actions";
import { cn } from "@/lib/utils";

export interface InvProduct {
  id: string;
  slug: string;
  name: string;
  colorway: string;
  price: number;
  image: string;
  sizes: { size: string; sku: string; stock: number }[];
  total: number;
  sold: number;
}

type Level = "out" | "critical" | "low" | "healthy";

function levelOf(p: InvProduct): Level {
  if (p.total === 0) return "out";
  const min = Math.min(...p.sizes.map((s) => s.stock));
  if (min <= 4) return "critical";
  if (min <= 8) return "low";
  return "healthy";
}

const LEVEL_BADGE: Record<Level, string> = {
  out: "bg-rose-500/12 text-rose-400 border-rose-500/25",
  critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  low: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  healthy: "bg-emerald-500/8 text-emerald-400 border-emerald-500/20",
};

const CARDS: { id: Level; label: string; icon: typeof AlertCircle; tint: string; border: string }[] = [
  { id: "out", label: "Out of Stock", icon: AlertCircle, tint: "bg-rose-500/10 text-rose-400", border: "border-rose-500/20" },
  { id: "critical", label: "Critical (≤4)", icon: AlertTriangle, tint: "bg-rose-500/10 text-rose-400", border: "border-rose-500/15" },
  { id: "low", label: "Low (≤8)", icon: AlertTriangle, tint: "bg-amber-500/10 text-amber-400", border: "border-amber-500/15" },
  { id: "healthy", label: "Healthy", icon: CheckCircle2, tint: "bg-emerald-500/10 text-emerald-400", border: "border-emerald-500/15" },
];

export function InventoryView({ products }: { products: InvProduct[] }) {
  const [filter, setFilter] = useState<Level | "all">("all");
  const [query, setQuery] = useState("");

  const withLevel = useMemo(() => products.map((p) => ({ ...p, level: levelOf(p) })), [products]);
  const counts = useMemo(() => {
    const c: Record<Level, number> = { out: 0, critical: 0, low: 0, healthy: 0 };
    for (const p of withLevel) c[p.level]++;
    return c;
  }, [withLevel]);

  const filtered = withLevel
    .filter((p) => (filter === "all" ? true : p.level === filter))
    .filter((p) => (query ? p.name.toLowerCase().includes(query.toLowerCase()) || p.colorway.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => a.total - b.total);

  return (
    <div>
      {/* Status cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CARDS.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter((f) => (f === c.id ? "all" : c.id))}
            className={cn("border bg-ink-soft p-4 text-left transition-colors", filter === c.id ? "border-bone/40" : c.border)}
          >
            <div className={cn("flex h-7 w-7 items-center justify-center", c.tint)}>
              <c.icon className="h-3.5 w-3.5" />
            </div>
            <p className="mt-3 figure text-xl text-bone">{counts[c.id]}</p>
            <p className="text-[0.7rem] uppercase tracking-[0.13em] text-ash">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["all", "out", "critical", "low", "healthy"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.15em] transition-colors",
              filter === f ? "border-bone/40 bg-carbon text-bone" : "border-smoke text-ash hover:text-bone",
            )}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 border-b border-smoke px-2 pb-1">
          <Search className="h-3.5 w-3.5 text-ash" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-40 bg-transparent py-1 text-sm text-bone placeholder:text-ash focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-smoke bg-ink-soft">
        <div className="grid grid-cols-12 border-b border-smoke px-4 py-3 text-[0.7rem] uppercase tracking-[0.13em] text-ash">
          <span className="col-span-6">Product</span>
          <span className="col-span-2 text-right">Price</span>
          <span className="col-span-2 text-right">Sold</span>
          <span className="col-span-2 text-right">Stock</span>
        </div>
        {filtered.map((p) => (
          <InventoryRow key={p.id} product={p} level={p.level} />
        ))}
        {filtered.length === 0 && <p className="p-10 text-center text-sm text-fog">No products match.</p>}
      </div>
    </div>
  );
}

function InventoryRow({ product, level }: { product: InvProduct; level: Level }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, number>>(() =>
    Object.fromEntries(product.sizes.map((s) => [s.sku, s.stock])),
  );
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    start(async () => {
      await setStockAction(product.sizes.map((s) => ({ sku: s.sku, qty: draft[s.sku] })));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="border-b border-smoke/50 last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="grid w-full grid-cols-12 items-center px-4 py-3 text-left">
        <div className="col-span-6 flex items-center gap-3">
          <div className="relative h-10 w-9 shrink-0 overflow-hidden bg-carbon">
            <SmartImage src={product.image} alt={product.name} fill sizes="36px" className="object-cover" />
          </div>
          <div>
            <p className="text-sm text-bone">{product.name}</p>
            <p className="text-[0.7rem] uppercase tracking-[0.15em] text-ash">{product.colorway}</p>
          </div>
        </div>
        <span className="col-span-2 text-right text-sm text-emerald-400">{formatPrice(product.price)}</span>
        <span className="col-span-2 text-right text-sm text-bone-dim">{product.sold}</span>
        <span className="col-span-2 flex items-center justify-end gap-2">
          <span className={cn("border px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.1em]", LEVEL_BADGE[level])}>
            {product.total === 0 ? "OUT" : `${product.total} left`}
          </span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-ash transition-transform", open && "rotate-180")} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-end gap-4 border-t border-smoke/50 bg-ink px-4 py-4">
              {product.sizes.map((s) => (
                <label key={s.sku} className="flex flex-col gap-1">
                  <span className="text-[0.7rem] uppercase tracking-[0.13em] text-ash">{s.size}</span>
                  <input
                    type="number"
                    min={0}
                    value={draft[s.sku]}
                    onChange={(e) => setDraft((d) => ({ ...d, [s.sku]: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-16 border border-smoke bg-ink-soft px-2 py-1.5 text-sm text-bone focus:border-bone focus:outline-none"
                  />
                </label>
              ))}
              <button
                onClick={save}
                disabled={pending}
                className="ml-auto bg-bone px-5 py-2 text-mono text-[0.65rem] font-bold uppercase tracking-[0.13em] text-ink transition-colors hover:bg-acid hover:text-bone disabled:opacity-50"
              >
                {pending ? "Saving…" : saved ? "✳ Saved" : "Save stock"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

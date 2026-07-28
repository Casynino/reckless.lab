"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag, Boxes, AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AttnItem {
  id: string;
  category: "orders" | "stock" | "issues";
  title: string;
  sub: string;
  value?: string;
  href: string;
}

const ICON: Record<AttnItem["category"], LucideIcon> = { orders: ShoppingBag, stock: Boxes, issues: AlertTriangle };
const TINT: Record<AttnItem["category"], string> = {
  orders: "text-blue-400 bg-blue-500/10",
  stock: "text-amber-400 bg-amber-500/10",
  issues: "text-acid bg-acid/10",
};

export function AttentionPanel({ items }: { items: AttnItem[] }) {
  const [tab, setTab] = useState<"all" | AttnItem["category"]>("all");
  const tabs = [
    { id: "all" as const, label: "All", count: items.length },
    { id: "orders" as const, label: "Orders", count: items.filter((i) => i.category === "orders").length },
    { id: "stock" as const, label: "Stock", count: items.filter((i) => i.category === "stock").length },
    { id: "issues" as const, label: "Issues", count: items.filter((i) => i.category === "issues").length },
  ].filter((t) => t.id === "all" || t.count > 0);

  const shown = items.filter((i) => tab === "all" || i.category === tab);

  return (
    <div className="rounded-2xl border border-smoke bg-ink-soft p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.15em] transition-colors",
              tab === t.id ? "border-acid/50 bg-acid/10 text-acid" : "border-smoke text-ash hover:text-bone",
            )}
          >
            {t.label}
            <span className="text-[0.7rem]">{t.count}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-8 text-center text-sm text-fog">All clear. Nothing needs you right now.</p>
      ) : (
        <div className="divide-y divide-smoke/60">
          {shown.map((item, i) => {
            const Icon = ICON[item.category];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link href={item.href} className="group flex items-center gap-4 py-3.5">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", TINT[item.category])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-bone">{item.title}</p>
                    <p className="truncate text-xs text-fog">{item.sub}</p>
                  </div>
                  {item.value && <span className="text-sm text-bone-dim">{item.value}</span>}
                  <ChevronRight className="h-4 w-4 text-ash transition-transform group-hover:translate-x-1 group-hover:text-bone" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, Users, Boxes, type LucideIcon } from "lucide-react";
import { CountUp } from "./count-up";
import { formatPrice } from "@/lib/shop/format";

const ICONS: Record<string, LucideIcon> = { revenue: DollarSign, orders: ShoppingBag, customers: Users, stock: Boxes };
const TINTS: Record<string, string> = {
  revenue: "bg-emerald-500/15 text-emerald-400",
  orders: "bg-blue-500/15 text-blue-400",
  customers: "bg-violet-500/15 text-violet-400",
  stock: "bg-acid/15 text-acid",
};
const WASH: Record<string, string> = {
  revenue: "from-emerald-500/12",
  orders: "from-blue-500/12",
  customers: "from-violet-500/12",
  stock: "from-[#e0342a]/12",
};
const GLOW: Record<string, string> = {
  revenue: "bg-emerald-500/20",
  orders: "bg-blue-500/20",
  customers: "bg-violet-500/20",
  stock: "bg-[#e0342a]/20",
};

export interface HealthCard {
  key: "revenue" | "orders" | "customers" | "stock";
  label: string;
  value: number;
  money?: boolean;
  sub: string;
}

export function HealthCards({ cards }: { cards: HealthCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = ICONS[c.key];
        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className={`group relative overflow-hidden rounded-2xl border border-smoke bg-gradient-to-br ${WASH[c.key]} to-transparent p-5 transition-colors hover:border-ash/40`}
          >
            <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${GLOW[c.key]} opacity-0 blur-2xl transition-opacity group-hover:opacity-100`} />
            <div className="flex items-start justify-between">
              <p className="text-[0.7rem] uppercase tracking-[0.13em] text-ash">{c.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${TINTS[c.key]}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 figure text-3xl text-bone">
              <CountUp value={c.value} format={c.money ? (n) => formatPrice(n) : undefined} />
            </p>
            <p className="mt-1 text-mono text-[0.7rem] uppercase tracking-[0.15em] text-fog">{c.sub}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

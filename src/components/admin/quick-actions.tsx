import Link from "next/link";
import { ShoppingBag, BarChart2, Boxes, Shirt, Users, ExternalLink, Settings, type LucideIcon } from "lucide-react";

type Action = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** "filled" = gradient chip, "tint" = dark chip with coloured icon */
  style: "filled" | "tint";
  from?: string;
  to?: string;
  icontint?: string;
  external?: boolean;
};

const ACTIONS: Action[] = [
  { label: "Order Monitor", href: "/admin/orders", icon: ShoppingBag, style: "filled", from: "from-[#e0342a]", to: "to-[#ff6a3d]" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2, style: "filled", from: "from-violet-500", to: "to-fuchsia-500" },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes, style: "tint", icontint: "text-amber-400" },
  { label: "Products", href: "/admin/products", icon: Shirt, style: "tint", icontint: "text-sky-400" },
  { label: "Customers", href: "/admin/customers", icon: Users, style: "tint", icontint: "text-emerald-400" },
  { label: "Settings", href: "/admin/settings", icon: Settings, style: "tint", icontint: "text-cyan-400" },
  { label: "View store", href: "/", icon: ExternalLink, style: "tint", icontint: "text-pink-400", external: true },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        if (a.style === "filled") {
          return (
            <Link
              key={a.href}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${a.from} ${a.to} px-5 py-2.5 text-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-black/30 transition-transform hover:scale-[1.04]`}
            >
              <Icon className="h-3.5 w-3.5" />
              {a.label}
            </Link>
          );
        }
        return (
          <Link
            key={a.href}
            href={a.href}
            target={a.external ? "_blank" : undefined}
            className="flex items-center gap-2 rounded-xl border border-smoke bg-ink-soft px-5 py-2.5 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-bone-dim transition-all hover:-translate-y-0.5 hover:border-ash/50 hover:text-bone"
          >
            <Icon className={`h-3.5 w-3.5 ${a.icontint}`} />
            {a.label}
          </Link>
        );
      })}
    </div>
  );
}

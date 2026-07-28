import Link from "next/link";
import { ShoppingBag, BarChart2, Boxes, Shirt, Users, ExternalLink, type LucideIcon } from "lucide-react";

const ACTIONS: { label: string; href: string; icon: LucideIcon; primary?: boolean; external?: boolean }[] = [
  { label: "Order Monitor", href: "/admin/orders", icon: ShoppingBag, primary: true },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Products", href: "/admin/products", icon: Shirt },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "View store", href: "/", icon: ExternalLink, external: true },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {ACTIONS.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          target={a.external ? "_blank" : undefined}
          className={
            a.primary
              ? "flex items-center gap-2 rounded-full bg-acid px-5 py-2.5 text-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-bone transition-transform hover:scale-[1.03]"
              : "flex items-center gap-2 rounded-full border border-smoke bg-ink-soft px-5 py-2.5 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-bone-dim transition-colors hover:border-ash/50 hover:text-bone"
          }
        >
          <a.icon className="h-3.5 w-3.5" />
          {a.label}
        </Link>
      ))}
    </div>
  );
}

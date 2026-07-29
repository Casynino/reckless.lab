"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, FlaskConical, Search, User, ShoppingCart } from "lucide-react";
import { useCart, cartCount } from "@/lib/shop/cart-store";

const LINKS = [
  { href: "/collections", label: "Shop", icon: ShoppingBag },
  { href: "/about", label: "The Lab", icon: FlaskConical },
  { href: "/search", label: "Search", icon: Search },
  { href: "/account", label: "Account", icon: User },
];

/**
 * Fixed bottom navigation for phones — the storefront's key destinations are
 * hidden in the desktop header, so mobile gets a thumb-reachable tab bar.
 * Hidden on md+ where the full header nav is visible.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const [count, setCount] = useState(0);
  useEffect(() => setCount(cartCount(lines)), [lines]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-smoke bg-ink/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch justify-around">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${isActive(l.href) ? "text-acid" : "text-bone-dim"}`}
          >
            <l.icon className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-mono text-[0.5rem] uppercase tracking-[0.1em]">{l.label}</span>
          </Link>
        ))}
        <button onClick={openCart} className="flex flex-1 flex-col items-center gap-1 py-2.5 text-bone-dim transition-colors">
          <span className="relative">
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
            {count > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-acid px-1 text-[0.5rem] font-bold text-ink">
                {count}
              </span>
            )}
          </span>
          <span className="text-mono text-[0.5rem] uppercase tracking-[0.1em]">Cart</span>
        </button>
      </div>
    </nav>
  );
}

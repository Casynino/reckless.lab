"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  BarChart2,
  Boxes,
  MessageSquare,
  Ticket,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { Wordmark } from "@/components/layout/wordmark";
import { LogoMark } from "@/components/layout/logo-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const GROUPS: { title: string; items: { label: string; href: string; icon: LucideIcon }[] }[] = [
  { title: "", items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Products", href: "/admin/products", icon: Shirt },
      { label: "Inventory", href: "/admin/inventory", icon: Boxes },
      { label: "Promotions", href: "/admin/promotions", icon: Ticket },
      { label: "Shipping", href: "/admin/shipping", icon: Truck },
    ],
  },
  {
    title: "Insight",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    ],
  },
  { title: "System", items: [{ label: "Settings", href: "/admin/settings", icon: Settings }] },
];

export function AdminShell({
  adminName,
  adminEmail,
  children,
}: {
  adminName: string;
  adminEmail?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const initial = adminName.charAt(0).toUpperCase();

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const NavList = (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
      {GROUPS.map((g, gi) => (
        <div key={gi}>
          {g.title && <p className="mb-2 px-3 text-mono text-[0.55rem] uppercase tracking-[0.16em] text-ash/70">{g.title}</p>}
          <div className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                    active ? "bg-acid/10 text-acid" : "text-fog hover:bg-carbon/60 hover:text-bone",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-acid" />}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="admin-scope flex min-h-screen bg-ink text-bone">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-smoke bg-ink-soft md:flex">
        <Link href="/admin" className="flex items-center gap-2 border-b border-smoke px-5 py-5 text-bone">
          <LogoMark size={26} />
          <Wordmark className="text-sm" />
          <span className="rounded bg-acid/15 px-1.5 py-0.5 text-mono text-[0.5rem] uppercase tracking-[0.13em] text-acid">HQ</span>
        </Link>

        {NavList}

        {/* User footer */}
        <div className="border-t border-smoke p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-acid/15 font-display text-sm text-acid">{initial}</div>
            <div className="min-w-0">
              <p className="truncate text-sm text-bone">{adminName}</p>
              {adminEmail && <p className="truncate text-[0.7rem] uppercase tracking-[0.1em] text-ash">{adminEmail}</p>}
            </div>
          </div>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-mono text-[0.65rem] uppercase tracking-[0.13em] text-ash transition-colors hover:bg-carbon/60 hover:text-acid">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-smoke bg-ink/80 px-5 py-3.5 backdrop-blur-xl md:px-8">
          <span className="text-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">Operational HQ</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-full border border-smoke px-3 py-1.5 text-mono text-[0.7rem] uppercase tracking-[0.15em] text-bone-dim transition-colors hover:border-ash/50 hover:text-bone"
            >
              <ExternalLink className="h-3 w-3" /> Main site
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-acid/15 font-display text-xs text-acid">{initial}</div>
              <span className="hidden text-mono text-[0.65rem] uppercase tracking-[0.15em] text-bone sm:inline">{adminName}</span>
            </div>
            {/* Logout — always reachable, incl. mobile where the sidebar is hidden */}
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-smoke text-ash transition-colors hover:border-acid hover:text-acid md:hidden"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-smoke px-3 py-2 md:hidden">
          {GROUPS.flatMap((g) => g.items).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-mono text-[0.7rem] uppercase tracking-[0.15em]",
                isActive(item.href) ? "bg-acid/10 text-acid" : "text-fog",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

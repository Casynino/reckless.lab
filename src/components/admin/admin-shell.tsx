"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shirt, ShoppingBag, Users, Settings, LogOut, ArrowUpRight } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Shirt },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-ink text-bone">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-smoke bg-ink-soft p-5 md:flex">
        <Link href="/admin" className="mb-8 font-display text-lg tracking-tight text-bone">
          RECKLESS<span className="text-acid">.</span>HQ
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-carbon text-acid" : "text-fog hover:bg-carbon/50 hover:text-bone",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-smoke pt-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-2 px-3 py-2 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-bone"
          >
            <ArrowUpRight className="h-3.5 w-3.5" /> View store
          </Link>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-acid">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-smoke px-5 py-4 md:hidden">
          <Link href="/admin" className="font-display tracking-tight">
            RECKLESS<span className="text-acid">.</span>HQ
          </Link>
          <form action={logoutAction}>
            <button className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">Sign out</button>
          </form>
        </div>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-smoke px-3 py-2 md:hidden">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 text-mono text-[0.65rem] uppercase tracking-[0.15em]",
                  active ? "bg-carbon text-acid" : "text-fog",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-between border-b border-smoke px-6 py-4">
          <span className="text-mono text-[0.65rem] uppercase tracking-[0.25em] text-ash">
            Operational HQ
          </span>
          <span className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-bone-dim">
            {adminName}
          </span>
        </div>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { Cursor } from "@/components/layout/cursor";
import { Preloader } from "@/components/layout/preloader";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";

/**
 * The storefront chrome (intro, cursor, header, footer, cart) wraps every page
 * EXCEPT the admin HQ, the auth screen and the maintenance screen, which bring
 * their own shell.
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/maintenance");

  if (bare) return <>{children}</>;

  return (
    <>
      <Preloader />
      <Cursor />
      <SmoothScroll>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* Clears the fixed mobile tab bar */}
        <div className="h-16 md:hidden" />
      </SmoothScroll>
      <MobileTabBar />
      <CartDrawer />
    </>
  );
}

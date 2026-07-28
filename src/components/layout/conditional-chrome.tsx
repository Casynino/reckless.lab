"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { Cursor } from "@/components/layout/cursor";
import { Preloader } from "@/components/layout/preloader";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

/**
 * The storefront chrome (intro, cursor, header, footer, cart) wraps every page
 * EXCEPT the admin HQ and the auth screen, which bring their own shell.
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/login");

  if (bare) return <>{children}</>;

  return (
    <>
      <Preloader />
      <Cursor />
      <SmoothScroll>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </SmoothScroll>
      <CartDrawer />
    </>
  );
}

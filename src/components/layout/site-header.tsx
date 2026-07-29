"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Search } from "lucide-react";
import { useCart, cartCount } from "@/lib/shop/cart-store";
import { useWishlist } from "@/lib/shop/wishlist-store";
import { primaryNav, secondaryNav } from "@/lib/shop/nav";
import { shopConfig } from "@/lib/shop/config";
import { Wordmark } from "@/components/layout/wordmark";
import { LogoMark } from "@/components/layout/logo-mark";
import { AccountNav } from "@/components/auth/account-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const wishlistIds = useWishlist((s) => s.ids);
  const [count, setCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);

  // Avoid hydration mismatch: cart/wishlist counts are client-only.
  useEffect(() => setCount(cartCount(lines)), [lines]);
  useEffect(() => setWishCount(wishlistIds.length), [wishlistIds]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled && !menuOpen
            ? "bg-ink/70 backdrop-blur-xl border-b border-smoke/60"
            : "bg-transparent",
        )}
      >
        <div className="container-edge flex h-16 items-center justify-between md:h-20">
          {/* Left: menu trigger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="group flex items-center gap-3"
            data-cursor={menuOpen ? "close" : "menu"}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative flex h-3 w-6 flex-col justify-between">
              <span
                className={cn(
                  "h-px w-full bg-bone transition-all duration-500",
                  menuOpen && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px w-full bg-bone transition-all duration-500",
                  menuOpen && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
            <span className="hidden text-mono text-[0.7rem] uppercase tracking-[0.25em] text-bone sm:inline">
              {menuOpen ? "Close" : "Menu"}
            </span>
          </button>

          {/* Center: wordmark */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-bone"
            aria-label={shopConfig.brand.name}
          >
            <LogoMark size={26} />
            <Wordmark className="text-xs sm:text-base md:text-lg" />
          </Link>

          {/* Right: cart */}
          <div className="flex items-center gap-6">
            <Link
              href="/collections"
              className="link-underline hidden text-mono text-[0.7rem] uppercase tracking-[0.25em] text-bone md:inline"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="link-underline hidden text-mono text-[0.7rem] uppercase tracking-[0.25em] text-bone md:inline"
            >
              The Lab
            </Link>
            <Link href="/search" aria-label="Search" className="hidden text-bone transition-colors hover:text-acid md:inline-flex">
              <Search className="h-4 w-4" />
            </Link>
            <ThemeToggle className="hidden md:flex" />
            <AccountNav />
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden text-bone transition-colors hover:text-acid md:inline-flex"
            >
              <Heart className="h-4 w-4" />
              {wishCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-acid px-1 text-[0.55rem] font-bold text-ink">
                  {wishCount}
                </span>
              )}
            </Link>
            <Magnetic strength={0.4}>
              <button
                id="cart-fly-target"
                onClick={openCart}
                data-cursor="cart"
                className="flex items-center gap-2 text-mono text-[0.7rem] uppercase tracking-[0.25em] text-bone"
                aria-label="Open cart"
              >
                Cart
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-acid px-1 text-[0.65rem] font-bold text-ink">
                  {count}
                </span>
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ink"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          >
            <div className="container-edge flex flex-1 flex-col justify-center pt-20">
              <nav className="flex flex-col">
                {primaryNav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-baseline justify-between border-b border-smoke/50 py-3 md:py-4"
                    >
                      <span className="font-display text-4xl text-bone transition-colors duration-300 group-hover:text-acid md:text-7xl">
                        {item.label}
                      </span>
                      <span className="text-mono text-[0.65rem] uppercase tracking-[0.3em] text-ash">
                        {item.meta}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + primaryNav.length * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href="/about"
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-baseline justify-between py-3 md:py-4"
                  >
                    <span className="font-display text-4xl text-acid transition-opacity duration-300 group-hover:opacity-80 md:text-7xl">
                      The Lab
                    </span>
                    <span className="text-mono text-[0.65rem] uppercase tracking-[0.3em] text-ash">
                      OUR STORY
                    </span>
                  </Link>
                </motion.div>
              </nav>
            </div>

            <div className="container-edge flex flex-col gap-4 border-t border-smoke/50 py-6 text-mono text-[0.7rem] uppercase tracking-[0.25em] text-ash md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="link-underline text-bone-dim hover:text-bone"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <a
                href={shopConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-underline text-bone-dim hover:text-bone"
              >
                {shopConfig.social.instagramHandle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

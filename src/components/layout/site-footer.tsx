import Link from "next/link";
import { shopConfig } from "@/lib/shop/config";
import { primaryNav, secondaryNav } from "@/lib/shop/nav";
import { Marquee } from "@/components/motion/marquee";
import { Wordmark } from "@/components/layout/wordmark";

export function SiteFooter() {
  const year = 2024; // static to keep server/client output stable

  return (
    <footer className="relative border-t border-smoke bg-ink">
      <Marquee
        items={["RECKLESS LABORATORY", "IT'S NOT FOR YOU", "I EXIST", "EST 2026", "BREAK THE FORMULA"]}
        className="border-b border-smoke py-4 font-display text-2xl uppercase text-bone md:text-4xl"
        duration={30}
      />

      <div className="container-edge grid grid-cols-2 gap-10 py-16 md:grid-cols-4 md:py-24">
        <div className="col-span-2 flex flex-col justify-between md:col-span-1">
          <Link href="/" className="text-bone" aria-label={shopConfig.brand.name}>
            <Wordmark className="text-xl" />
          </Link>
          <p className="mt-6 max-w-xs text-sm text-fog">{shopConfig.brand.manifesto}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <h4 className="eyebrow mb-2">Shop</h4>
          {primaryNav.map((i) => (
            <Link key={i.href} href={i.href} className="link-underline w-fit text-sm text-bone-dim hover:text-bone">
              {i.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-3">
          <h4 className="eyebrow mb-2">The Lab</h4>
          {secondaryNav.map((i) => (
            <Link key={i.href} href={i.href} className="link-underline w-fit text-sm text-bone-dim hover:text-bone">
              {i.label}
            </Link>
          ))}
          <Link href="/support" className="link-underline w-fit text-sm text-bone-dim hover:text-bone">
            Shipping & Returns
          </Link>
        </nav>

        <div className="flex flex-col gap-3">
          <h4 className="eyebrow mb-2">Connect</h4>
          <a href={shopConfig.social.instagram} target="_blank" rel="noreferrer" className="link-underline w-fit text-sm text-bone-dim hover:text-bone">
            Instagram
          </a>
          <a href={shopConfig.social.tiktok} target="_blank" rel="noreferrer" className="link-underline w-fit text-sm text-bone-dim hover:text-bone">
            TikTok
          </a>
          <a href={`mailto:${shopConfig.contact.email}`} className="link-underline w-fit text-sm text-bone-dim hover:text-bone">
            {shopConfig.contact.email}
          </a>
          <a
            href={`https://wa.me/${shopConfig.whatsapp.number}`}
            target="_blank"
            rel="noreferrer"
            className="link-underline w-fit text-sm text-acid"
          >
            WhatsApp orders
          </a>
        </div>
      </div>

      <div className="container-edge flex flex-col gap-2 border-t border-smoke py-6 text-mono text-[0.65rem] uppercase tracking-[0.25em] text-ash md:flex-row md:items-center md:justify-between">
        <span>© {year} {shopConfig.brand.name}. All rights reserved.</span>
        <span>{shopConfig.brand.locationLabel} · EST. {shopConfig.brand.est}</span>
        <div className="flex gap-4">
          <Link href="/support" className="hover:text-bone">Privacy</Link>
          <Link href="/support" className="hover:text-bone">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

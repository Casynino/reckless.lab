import { HeroEditorial } from "@/components/home/hero-editorial";
import { Manifesto } from "@/components/home/manifesto";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { CampaignEditorial } from "@/components/home/campaign-editorial";
import { InteractiveGallery } from "@/components/home/interactive-gallery";
import { BehindBrand } from "@/components/home/behind-brand";
import { Newsletter } from "@/components/home/newsletter";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { Marquee } from "@/components/motion/marquee";
import { getBestSellers, getNewArrivals, getCollectionBySlug } from "@/lib/data";
import { CAMPAIGN, INDEX_ROWS } from "@/lib/brand/assets";

export default async function HomePage() {
  const [bestSellers, newArrivals, featured] = await Promise.all([
    getBestSellers(4),
    getNewArrivals(8),
    getCollectionBySlug("reckless"),
  ]);

  return (
    <>
      <HeroEditorial />

      <Marquee
        items={["IT'S NOT FOR YOU", "EST 2026 — FIRST DROP LIVE", "I EXIST", "555", "SHIPS WORLDWIDE"]}
        className="border-y border-smoke bg-ink-soft py-3 text-mono text-xs uppercase tracking-[0.25em] text-bone-dim"
        duration={28}
      />

      <Manifesto />

      {/* Best sellers */}
      <section className="container-edge py-16 md:py-24">
        <SectionHeading code="[ BEST SELLERS ]" title="The first favourites" link="/collections/new-arrivals" className="mb-12" />
        <ProductGrid products={bestSellers} priorityCount={4} />
      </section>

      {featured && <FeaturedCollection collection={featured} />}

      <CampaignEditorial
        image={CAMPAIGN.src}
        alt={CAMPAIGN.alt}
        kicker="[ CAMPAIGN — EST 2026 ]"
        statement="If you have to ask, it’s not for you."
        href="/collections/new-arrivals"
        focus={CAMPAIGN.focus}
      />

      {/* New arrivals */}
      <section className="container-edge py-16 md:py-24">
        <SectionHeading code="[ THE DROP ]" title="Fresh out the lab" link="/collections/new-arrivals" className="mb-12" />
        <ProductGrid products={newArrivals} />
      </section>

      <InteractiveGallery rows={INDEX_ROWS} />

      <BehindBrand />

      <Newsletter />

      <InstagramGrid />
    </>
  );
}

import { HeroEditorial } from "@/components/home/hero-editorial";
import { Manifesto } from "@/components/home/manifesto";
import { SeriesIndex } from "@/components/home/series-index";
import { EditorialDrop } from "@/components/home/editorial-drop";
import { CampaignEditorial } from "@/components/home/campaign-editorial";
import { InteractiveGallery } from "@/components/home/interactive-gallery";
import { BehindBrand } from "@/components/home/behind-brand";
import { Newsletter } from "@/components/home/newsletter";
import { InstagramGrid } from "@/components/home/instagram-grid";
import { Marquee } from "@/components/motion/marquee";
import { getNewArrivals } from "@/lib/data";
import { CAMPAIGN, INDEX_ROWS } from "@/lib/brand/assets";

export default async function HomePage() {
  const newArrivals = await getNewArrivals(6);

  return (
    <>
      {/* Cinematic cover */}
      <HeroEditorial />

      <Marquee
        items={["IT'S NOT FOR YOU", "EST 2026 — FIRST DROP LIVE", "I EXIST", "555", "SHIPS WORLDWIDE"]}
        className="border-y border-smoke bg-ink-soft py-3 text-mono text-xs uppercase tracking-[0.25em] text-bone-dim"
        duration={28}
      />

      {/* Brand philosophy */}
      <Manifesto />

      {/* The three series — editorial navigator */}
      <SeriesIndex />

      {/* The drop — art-directed product spread */}
      <EditorialDrop products={newArrivals} />

      {/* Behind the campaign — full-bleed statement */}
      <CampaignEditorial
        image={CAMPAIGN.src}
        alt={CAMPAIGN.alt}
        kicker="[ CAMPAIGN — EST 2026 ]"
        statement="If you have to ask, it’s not for you."
        href="/collections/new-arrivals"
        focus={CAMPAIGN.focus}
      />

      {/* Origin — routes into the exhibition */}
      <BehindBrand />

      {/* Interactive index gallery */}
      <InteractiveGallery rows={INDEX_ROWS} />

      {/* Community + newsletter */}
      <Newsletter />
      <InstagramGrid />
    </>
  );
}

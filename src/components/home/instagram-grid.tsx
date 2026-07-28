import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { shopConfig } from "@/lib/shop/config";
import { Reveal } from "@/components/motion/reveal";
import { FEED } from "@/lib/brand/assets";

const POSTS = FEED;

/**
 * Instagram wall. `FEED` (lib/brand/assets) drives it today; wire the IG Basic
 * Display API later and the grid + hover treatment stay the same.
 */
export function InstagramGrid() {
  return (
    <section className="container-edge py-24 md:py-32">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="eyebrow">[ THE FEED ]</span>
          <h2 className="mt-3 font-display display-lg text-bone">On the grid</h2>
        </div>
        <a
          href={shopConfig.social.instagram}
          target="_blank"
          rel="noreferrer"
          className="link-underline flex items-center gap-1 pb-2 text-mono text-xs uppercase tracking-[0.25em] text-bone-dim hover:text-bone"
        >
          {shopConfig.social.instagramHandle} <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {POSTS.map((src, i) => (
          <Reveal key={src} delay={(i % 6) * 0.05}>
            <a
              href={shopConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              data-cursor="open"
              className="group relative block aspect-square overflow-hidden bg-carbon"
            >
              <SmartImage
                src={src}
                alt="Reckless Lab on Instagram"
                fill
                sizes="(max-width:768px) 50vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight className="h-6 w-6 text-acid" />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

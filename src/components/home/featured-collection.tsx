import Link from "next/link";
import type { Collection } from "@/lib/types";
import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";

/** Big split editorial for the hero collection of the season. */
export function FeaturedCollection({ collection }: { collection: Collection }) {
  return (
    <section className="container-edge py-16 md:py-24">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 aspect-[4/5] overflow-hidden bg-carbon lg:order-1">
          <Parallax speed={0.14} className="absolute inset-0 scale-110">
            <SmartImage
              src={collection.cover.src}
              alt={collection.cover.alt}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Parallax>
          <span className="absolute left-4 top-4 bg-ink/70 px-3 py-1.5 text-mono text-[0.6rem] uppercase tracking-[0.25em] text-acid backdrop-blur">
            {collection.code}
          </span>
        </div>

        <div className="order-1 lg:order-2">
          <span className="eyebrow">[ FEATURED COLLECTION ]</span>
          <SplitText as="h2" text={collection.title} className="mt-4 font-display display-xl text-bone" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg text-fog">{collection.description}</p>
            <p className="mt-4 text-mono text-sm uppercase tracking-[0.2em] text-bone-dim">{collection.tagline}</p>
            <Link
              href={`/collections/${collection.slug}`}
              data-cursor="explore"
              className="mt-10 inline-flex border border-bone px-10 py-4 text-mono text-xs font-bold uppercase tracking-[0.25em] text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              Explore Collection
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

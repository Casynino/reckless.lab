import type { Metadata } from "next";
import Link from "next/link";
import { getAllCollections } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { SmartImage } from "@/components/ui/smart-image";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Collections",
  description: "Every formula from the lab — men, women, limited drops, essentials and what's next.",
};

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <div className="pb-24">
      <PageHero
        code="[ INDEX / ALL COLLECTIONS ]"
        title="The Formulas"
        tagline="Each collection is an experiment. Some become staples, some vanish after a single run."
      />

      <div className="container-edge grid gap-4 md:grid-cols-2">
        {collections.map((c, i) => (
          <Reveal key={c.slug} delay={(i % 2) * 0.08}>
            <Link
              href={`/collections/${c.slug}`}
              data-cursor="open"
              className="group relative block aspect-[4/3] overflow-hidden bg-carbon"
            >
              <SmartImage
                src={c.cover.src}
                alt={c.cover.alt}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                <span className="text-mono text-[0.65rem] uppercase tracking-[0.3em] text-acid">{c.code}</span>
                <div>
                  <h2 className="font-display text-4xl text-bone md:text-6xl">{c.title}</h2>
                  <p className="mt-2 text-mono text-xs uppercase tracking-[0.2em] text-bone-dim">{c.tagline}</p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

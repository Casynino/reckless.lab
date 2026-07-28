"use client";

import type { Product } from "@/lib/types";
import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";

function Plate({ src, alt, ratio, sizes }: { src: string; alt: string; ratio: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden rounded-sm bg-carbon ${ratio}`}>
      <SmartImage src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

/**
 * A per-product editorial band — turns the PDP into a small campaign feature
 * using the piece's own frames in an art-directed, parallaxed composition.
 */
export function ProductEditorial({ product }: { product: Product }) {
  const m = product.media;
  if (m.length < 2) return null;

  return (
    <section className="relative overflow-hidden bg-carbon/30 py-24 md:py-36">
      <div className="container-edge">
        <div className="mb-14 flex flex-col gap-4">
          <span className="text-mono text-[0.65rem] uppercase tracking-[0.3em] text-acid">
            The Piece — {product.colorway}
          </span>
          <SplitText as="h2" text={product.name} className="font-display display-xl uppercase text-bone" />
        </div>

        {/* Dominant frame + story */}
        <div className="grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 lg:col-span-7">
            <Parallax speed={0.08}>
              <Plate src={m[1].src} alt={m[1].alt} ratio="aspect-[4/5]" sizes="(max-width:1024px) 100vw, 58vw" />
            </Parallax>
          </Reveal>
          <div className="col-span-12 flex flex-col justify-between gap-10 lg:col-span-5 lg:pt-24">
            <Reveal delay={0.1}>
              <p className="max-w-sm text-lg leading-relaxed text-bone-dim">{product.story}</p>
            </Reveal>
            {m[2] && (
              <Reveal delay={0.15}>
                <Parallax speed={-0.06}>
                  <Plate src={m[2].src} alt={m[2].alt} ratio="aspect-square" sizes="40vw" />
                </Parallax>
              </Reveal>
            )}
          </div>
        </div>

        {/* Detail row + spec marginalia */}
        <div className="mt-6 grid grid-cols-12 items-start gap-6 md:mt-10">
          {m[3] && (
            <Reveal className="col-span-7 lg:col-span-5">
              <Plate src={m[3].src} alt={m[3].alt} ratio="aspect-[3/4]" sizes="40vw" />
            </Reveal>
          )}
          <div className="col-span-5 lg:col-span-3 lg:pt-16">
            <span className="text-mono text-[0.6rem] uppercase tracking-[0.3em] text-ash">In the detail</span>
            <ul className="mt-5 space-y-3 text-sm text-fog">
              {product.details.slice(0, 4).map((d) => (
                <li key={d} className="border-b border-smoke/60 pb-3">
                  {d}
                </li>
              ))}
            </ul>
          </div>
          {m[4] && (
            <Reveal className="col-span-12 lg:col-span-4 lg:mt-44">
              <Parallax speed={0.12}>
                <Plate src={m[4].src} alt={m[4].alt} ratio="aspect-[4/5]" sizes="34vw" />
              </Parallax>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

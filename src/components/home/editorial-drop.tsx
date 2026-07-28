import Link from "next/link";
import type { Product } from "@/lib/types";
import { SmartImage } from "@/components/ui/smart-image";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ButtonLink } from "@/components/ui/button-link";
import { ChapterTag } from "@/components/about/chapter-rail";
import { formatPrice } from "@/lib/shop/format";
import { cn } from "@/lib/utils";

function Plate({
  product,
  n,
  ratio,
  sizes,
  className,
}: {
  product: Product;
  n?: string;
  ratio: string;
  sizes: string;
  className?: string;
}) {
  return (
    <Link href={`/products/${product.slug}`} data-cursor="open" className={cn("group block", className)}>
      <div className={cn("relative w-full overflow-hidden rounded-sm bg-carbon", ratio)}>
        <SmartImage src={product.media[0].src} alt={product.name} fill sizes={sizes} className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {n && <span className="absolute left-4 top-3 font-display text-3xl text-onphoto/70 md:text-4xl">{n}</span>}
        <span className="absolute bottom-4 left-4 translate-y-2 text-mono text-[0.6rem] uppercase tracking-[0.25em] text-onphoto opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View piece →
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-base uppercase tracking-tight text-bone transition-colors group-hover:text-acid md:text-lg">{product.name}</h3>
          <p className="mt-0.5 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">{product.colorway}</p>
        </div>
        <span className="text-mono text-sm text-bone-dim">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

/**
 * "The Drop" — an art-directed editorial spread of the newest pieces. Never a
 * uniform grid: intentional spans, vertical offsets, parallax and oversized
 * marginalia so it reads like a magazine feature.
 */
export function EditorialDrop({ products }: { products: Product[] }) {
  const [a, b, c, d, e] = products;
  if (!a) return null;

  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="container-edge">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <ChapterTag index={1} label="The Drop — EST 2026" />
            <SplitText as="h2" text="Fresh from the lab." className="font-display display-xl text-bone" />
          </div>
          <Reveal className="md:pb-3">
            <ButtonLink href="/collections/new-arrivals" variant="outline" cursor="shop">
              Shop all new arrivals
            </ButtonLink>
          </Reveal>
        </div>

        {/* Spread 1 — dominant portrait + offset column */}
        <div className="mt-16 grid grid-cols-12 gap-6 md:mt-24">
          <Reveal className="col-span-12 lg:col-span-7">
            <Parallax speed={0.08}>
              <Plate product={a} n="01" ratio="aspect-[4/5]" sizes="(max-width:1024px) 100vw, 58vw" />
            </Parallax>
          </Reveal>

          <div className="col-span-12 flex flex-col justify-between gap-10 lg:col-span-5 lg:pt-28">
            <Reveal delay={0.1}>
              <p className="max-w-sm text-lg leading-relaxed text-bone-dim">
                Six colourways, three silhouettes, one serpent. Garment-dyed, heavyweight, and made in
                small runs — when a wash is gone, it&rsquo;s gone.
              </p>
            </Reveal>
            {b && (
              <Reveal delay={0.15}>
                <Parallax speed={-0.06}>
                  <Plate product={b} n="02" ratio="aspect-square" sizes="(max-width:1024px) 100vw, 40vw" />
                </Parallax>
              </Reveal>
            )}
          </div>
        </div>

        {/* Spread 2 — offset trio with typographic marginalia */}
        <div className="mt-6 grid grid-cols-12 items-start gap-6 md:mt-10">
          {c && (
            <Reveal className="col-span-6 lg:col-span-4">
              <Plate product={c} n="03" ratio="aspect-[3/4]" sizes="40vw" />
            </Reveal>
          )}
          {d && (
            <Reveal className="col-span-6 lg:col-span-4 lg:mt-40">
              <Parallax speed={0.12}>
                <Plate product={d} n="04" ratio="aspect-[3/4]" sizes="40vw" />
              </Parallax>
            </Reveal>
          )}
          <div className="col-span-12 flex items-center justify-center lg:col-span-4 lg:min-h-[40vh]">
            {e ? (
              <Reveal className="w-full lg:mt-16">
                <Plate product={e} n="05" ratio="aspect-square" sizes="40vw" />
              </Reveal>
            ) : (
              <span className="font-display text-8xl uppercase text-transparent [-webkit-text-stroke:1px_var(--color-ash)]">555</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

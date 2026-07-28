import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug, getRelatedProducts, getColorwaysOf } from "@/lib/data";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ColorwaySwitcher } from "@/components/product/colorway-switcher";
import { ProductAccordion } from "@/components/product/product-accordion";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/home/section-heading";
import { Reveal } from "@/components/motion/reveal";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.subtitle,
    openGraph: { images: [product.media[0]?.src] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, colorways] = await Promise.all([
    getRelatedProducts(product, 4),
    getColorwaysOf(product),
  ]);

  return (
    <div className="pb-24 pt-24 md:pt-28">
      {/* Breadcrumb */}
      <div className="container-edge mb-6 flex items-center gap-2 text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash">
        <Link href="/" className="hover:text-bone">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-bone">Collections</Link>
        <span>/</span>
        <span className="text-bone-dim">{product.name}</span>
      </div>

      <div className="container-edge grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery media={product.media} name={product.name} />
        </div>

        {/* Info */}
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            {product.isLimited && (
              <span className="bg-acid px-2.5 py-1 text-mono text-[0.6rem] font-bold uppercase tracking-[0.15em] text-ink">
                Limited Run
              </span>
            )}
            {product.isNew && (
              <span className="border border-smoke px-2.5 py-1 text-mono text-[0.6rem] uppercase tracking-[0.2em] text-acid">
                New
              </span>
            )}
            <span className="text-mono text-[0.6rem] uppercase tracking-[0.25em] text-ash">
              {product.variants[0]?.sku.split("-").slice(0, -1).join("-")}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl text-bone md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-fog">{product.subtitle}</p>

          <ColorwaySwitcher colorways={colorways} currentSlug={product.slug} />

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>

          {/* Story */}
          <Reveal className="mt-12">
            <span className="eyebrow">[ THE STORY ]</span>
            <p className="mt-4 text-lg leading-relaxed text-bone-dim">{product.story}</p>
          </Reveal>

          {/* Details / Materials / Care */}
          <div className="mt-10">
            <ProductAccordion
              sections={[
                {
                  title: "Details",
                  body: (
                    <ul className="space-y-1.5">
                      {product.details.map((d) => (
                        <li key={d} className="flex gap-2">
                          <span className="text-acid">—</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  title: "Materials",
                  body: (
                    <ul className="space-y-1.5">
                      {product.materials.map((m) => (
                        <li key={m} className="flex gap-2">
                          <span className="text-acid">—</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                ...(product.care
                  ? [
                      {
                        title: "Care",
                        body: (
                          <ul className="space-y-1.5">
                            {product.care.map((c) => (
                              <li key={c} className="flex gap-2">
                                <span className="text-acid">—</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        ),
                      },
                    ]
                  : []),
                {
                  title: "Shipping & Returns",
                  body: (
                    <p>
                      Ships worldwide from Banjul in 1–3 days. Free shipping over $90. 14-day returns on unworn
                      pieces. Orders are confirmed and paid via WhatsApp for now — checkout generates your order
                      summary automatically.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {related.length > 0 && (
        <section className="container-edge mt-28">
          <SectionHeading code="[ STYLE IT WITH ]" title="Complete the look" className="mb-12" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

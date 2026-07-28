import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCollections, getCollectionBySlug, getProductsByCollection } from "@/lib/data";
import type { CollectionSlug } from "@/lib/types";
import { PageHero } from "@/components/layout/page-hero";
import { CollectionView } from "@/components/product/collection-view";

export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection" };
  return { title: collection.title, description: collection.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await getProductsByCollection(slug as CollectionSlug);

  return (
    <div>
      <PageHero
        code={`[ ${collection.code} ]`}
        title={collection.title}
        tagline={collection.description}
        image={collection.cover.src}
      />
      <CollectionView products={products} />
    </div>
  );
}

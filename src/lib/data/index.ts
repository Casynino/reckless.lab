import "server-only";
import { db } from "@/lib/db";
import type { Collection, CollectionSlug, Product, Size } from "@/lib/types";
import type { Prisma } from "@prisma/client";

/**
 * Catalog data-access layer — now backed by Postgres (Prisma). Every UI surface
 * reads through these functions and receives the same `Product` / `Collection`
 * shapes as before, so nothing downstream changed when we moved off local files.
 */

const SIZE_ORDER: Record<string, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5 };

const productInclude = {
  variants: true,
  images: { orderBy: { order: "asc" } },
  collections: { include: { collection: true } },
} satisfies Prisma.ProductInclude;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function toProduct(p: ProductRow): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    gender: p.gender.toLowerCase() as Product["gender"],
    colorway: p.colorway,
    collections: p.collections.map((pc) => pc.collection.slug as CollectionSlug),
    media: p.images.map((i) => ({ src: i.url, alt: i.alt })),
    variants: [...p.variants]
      .sort((a, b) => (SIZE_ORDER[a.size] ?? 9) - (SIZE_ORDER[b.size] ?? 9))
      .map((v) => ({ size: v.size as Size, stock: v.stock, sku: v.sku })),
    story: p.story,
    details: p.details,
    materials: p.materials,
    care: p.care.length ? p.care : undefined,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    isLimited: p.isLimited,
    order: p.order,
  };
}

function toCollection(c: {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  code: string;
  cover: string;
  coverAlt: string;
}): Collection {
  return {
    slug: c.slug as CollectionSlug,
    title: c.title,
    tagline: c.tagline,
    description: c.description,
    code: c.code,
    cover: { src: c.cover, alt: c.coverAlt },
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { published: true },
    include: productInclude,
    orderBy: { order: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await db.product.findUnique({ where: { slug }, include: productInclude });
  return row ? toProduct(row) : undefined;
}

export async function getProductsByCollection(slug: CollectionSlug): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { published: true, collections: { some: { collection: { slug } } } },
    include: productInclude,
    orderBy: { order: "asc" },
  });
  return rows.map(toProduct);
}

export async function getNewArrivals(limit?: number): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { published: true, isNew: true },
    include: productInclude,
    orderBy: { order: "asc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(toProduct);
}

export async function getBestSellers(limit?: number): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { published: true, isBestSeller: true },
    include: productInclude,
    orderBy: { order: "asc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(toProduct);
}

export async function getLimitedDrops(limit?: number): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { published: true, isLimited: true },
    include: productInclude,
    orderBy: { order: "asc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(toProduct);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const primary = product.collections[0];
  if (!primary) return [];
  const rows = await db.product.findMany({
    where: {
      published: true,
      id: { not: product.id },
      collections: { some: { collection: { slug: primary } } },
    },
    include: productInclude,
    take: limit,
  });
  return rows.map(toProduct);
}

/** All colourways of the same design (grouped by name). */
export async function getColorwaysOf(product: Product): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { published: true, name: product.name },
    include: productInclude,
    orderBy: { order: "asc" },
  });
  return rows.map(toProduct);
}

export async function getAllCollections(): Promise<Collection[]> {
  const rows = await db.collection.findMany({ orderBy: { order: "asc" } });
  return rows.map(toCollection);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const row = await db.collection.findUnique({ where: { slug } });
  return row ? toCollection(row) : undefined;
}

/** Total in-stock units across a product's variants (from loaded data — sync). */
export function getProductStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

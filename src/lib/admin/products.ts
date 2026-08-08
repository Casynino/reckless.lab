import "server-only";
import { db } from "@/lib/db";
import type { Prisma, Size, Gender } from "@prisma/client";

/** Editable shape used by the admin product editor. */
export interface EditableVariant {
  size: Size;
  sku: string;
  stock: number;
}
export interface EditableImage {
  url: string;
  alt: string;
}
export interface EditableProduct {
  id?: string;
  slug: string;
  name: string;
  subtitle: string;
  story: string;
  price: number;
  compareAtPrice: number | null;
  gender: Gender;
  colorway: string;
  isNew: boolean;
  isBestSeller: boolean;
  isLimited: boolean;
  published: boolean;
  order: number;
  details: string[];
  materials: string[];
  care: string[];
  collectionSlugs: string[];
  variants: EditableVariant[];
  images: EditableImage[];
}

const editInclude = {
  variants: true,
  images: { orderBy: { order: "asc" } },
  collections: { include: { collection: true } },
} satisfies Prisma.ProductInclude;

const SIZE_ORDER: Record<string, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5 };

export async function getProductForEdit(id: string): Promise<EditableProduct | null> {
  const p = await db.product.findUnique({ where: { id }, include: editInclude });
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    story: p.story,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    gender: p.gender,
    colorway: p.colorway,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    isLimited: p.isLimited,
    published: p.published,
    order: p.order,
    details: p.details,
    materials: p.materials,
    care: p.care,
    collectionSlugs: p.collections.map((c) => c.collection.slug),
    variants: [...p.variants].sort((a, b) => (SIZE_ORDER[a.size] ?? 9) - (SIZE_ORDER[b.size] ?? 9)).map((v) => ({ size: v.size, sku: v.sku, stock: v.stock })),
    images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
  };
}

/** All products (including unpublished) for the admin list. */
export async function listAdminProducts() {
  const rows = await db.product.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 }, variants: true },
    orderBy: { order: "asc" },
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    colorway: p.colorway,
    price: p.price,
    published: p.published,
    isNew: p.isNew,
    isLimited: p.isLimited,
    isBestSeller: p.isBestSeller,
    image: p.images[0]?.url ?? "",
    stock: p.variants.reduce((n, v) => n + v.stock, 0),
  }));
}

function scalarData(input: EditableProduct) {
  return {
    slug: input.slug.trim().toLowerCase(),
    name: input.name.trim(),
    subtitle: input.subtitle.trim(),
    story: input.story.trim(),
    price: Math.max(0, Math.round(Number(input.price)) || 0),
    compareAtPrice: input.compareAtPrice && input.compareAtPrice > 0 ? Math.round(input.compareAtPrice) : null,
    gender: input.gender,
    colorway: input.colorway.trim(),
    isNew: input.isNew,
    isBestSeller: input.isBestSeller,
    isLimited: input.isLimited,
    published: input.published,
    order: Math.round(Number(input.order)) || 0,
    details: input.details.map((d) => d.trim()).filter(Boolean),
    materials: input.materials.map((m) => m.trim()).filter(Boolean),
    care: input.care.map((c) => c.trim()).filter(Boolean),
  };
}

/** Create or update a product with its variants, images and collections. */
export async function saveProduct(input: EditableProduct): Promise<string> {
  const collections = await db.collection.findMany({ where: { slug: { in: input.collectionSlugs } }, select: { id: true } });
  const cleanImages = input.images.filter((i) => i.url.trim());
  const cleanVariants = input.variants.filter((v) => v.sku.trim());
  const data = scalarData(input);

  if (input.id) {
    const id = input.id;
    await db.product.update({ where: { id }, data });
    // Collections — reset the join set
    await db.productCollection.deleteMany({ where: { productId: id } });
    if (collections.length) {
      await db.productCollection.createMany({ data: collections.map((c) => ({ productId: id, collectionId: c.id })) });
    }
    // Images — replace
    await db.productImage.deleteMany({ where: { productId: id } });
    if (cleanImages.length) {
      await db.productImage.createMany({ data: cleanImages.map((im, idx) => ({ productId: id, url: im.url.trim(), alt: im.alt.trim(), order: idx })) });
    }
    // Variants — drop removed sizes, upsert the rest
    const keep = cleanVariants.map((v) => v.size);
    await db.productVariant.deleteMany({ where: { productId: id, size: { notIn: keep } } });
    for (const v of cleanVariants) {
      await db.productVariant.upsert({
        where: { productId_size: { productId: id, size: v.size } },
        create: { productId: id, size: v.size, sku: v.sku.trim(), stock: Math.max(0, Math.round(v.stock) || 0) },
        update: { sku: v.sku.trim(), stock: Math.max(0, Math.round(v.stock) || 0) },
      });
    }
    return id;
  }

  const created = await db.product.create({
    data: {
      ...data,
      collections: { create: collections.map((c) => ({ collectionId: c.id })) },
      images: { create: cleanImages.map((im, idx) => ({ url: im.url.trim(), alt: im.alt.trim(), order: idx })) },
      variants: { create: cleanVariants.map((v) => ({ size: v.size, sku: v.sku.trim(), stock: Math.max(0, Math.round(v.stock) || 0) })) },
    },
  });
  return created.id;
}

export async function deleteProduct(id: string): Promise<void> {
  await db.product.delete({ where: { id } }); // cascades variants, images, collection joins, wishlist items
}

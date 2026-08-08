import { notFound } from "next/navigation";
import { getProductForEdit } from "@/lib/admin/products";
import { getAllCollections } from "@/lib/data";
import { ProductEditor } from "@/components/admin/product-editor";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, collections] = await Promise.all([getProductForEdit(id), getAllCollections()]);
  if (!product) notFound();
  return <ProductEditor product={product} collections={collections.map((c) => ({ slug: c.slug, title: c.title }))} />;
}

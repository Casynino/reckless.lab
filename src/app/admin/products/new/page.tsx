import { getAllCollections } from "@/lib/data";
import { ProductEditor } from "@/components/admin/product-editor";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const collections = await getAllCollections();
  return <ProductEditor collections={collections.map((c) => ({ slug: c.slug, title: c.title }))} />;
}

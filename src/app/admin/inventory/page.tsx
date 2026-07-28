import { products } from "@/lib/data/products";
import { listOrders } from "@/lib/orders/store";
import { variantStockMap, productStock } from "@/lib/inventory/store";
import { PageTitle } from "@/components/admin/ui";
import { InventoryView, type InvProduct } from "@/components/admin/inventory-view";

export const dynamic = "force-dynamic";

export default function AdminInventory() {
  // Units sold per product (from paid orders).
  const sold = new Map<string, number>();
  for (const o of listOrders()) {
    if (o.state === "cancelled" || o.state === "new") continue;
    for (const l of o.lines) sold.set(l.productId, (sold.get(l.productId) ?? 0) + l.qty);
  }

  const inv: InvProduct[] = products.map((p) => {
    const map = variantStockMap(p);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      colorway: p.colorway,
      price: p.price,
      image: p.media[0]?.src ?? "",
      sizes: p.variants.map((v) => ({ size: v.size, sku: v.sku, stock: map[v.size] ?? v.stock })),
      total: productStock(p),
      sold: sold.get(p.id) ?? 0,
    };
  });

  return (
    <div>
      <PageTitle title="Inventory" subtitle="Stock levels + per-size adjustments across the drop." />
      <InventoryView products={inv} />
    </div>
  );
}

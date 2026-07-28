import Link from "next/link";
import { getAllProducts, getAllCollections, getProductStock } from "@/lib/data";
import { listCustomers } from "@/lib/auth/store";
import { formatPrice } from "@/lib/shop/format";
import { PageTitle, StatCard, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [products, collections] = await Promise.all([getAllProducts(), getAllCollections()]);
  const customers = listCustomers();

  const totalUnits = products.reduce((n, p) => n + getProductStock(p), 0);
  const inventoryValue = products.reduce((n, p) => n + p.price * getProductStock(p), 0);
  const lowStock = products.flatMap((p) =>
    p.variants.filter((v) => v.stock > 0 && v.stock <= 4).map((v) => ({ p, v })),
  );
  const soldOut = products.flatMap((p) => p.variants.filter((v) => v.stock === 0).map((v) => ({ p, v })));

  return (
    <div>
      <PageTitle title="Overview" subtitle="Live snapshot of the lab. Read from the catalog in real time." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Products" value={products.length} hint={`${collections.length} collections`} />
        <StatCard label="Units in stock" value={totalUnits.toLocaleString()} />
        <StatCard label="Inventory value" value={formatPrice(inventoryValue)} accent />
        <StatCard label="Customers" value={customers.length} hint="registered" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Low stock"
          action={
            <Link href="/admin/products" className="text-mono text-[0.65rem] uppercase tracking-[0.2em] text-ash hover:text-bone">
              All products →
            </Link>
          }
        >
          {lowStock.length === 0 ? (
            <p className="text-sm text-fog">Everything&rsquo;s well stocked.</p>
          ) : (
            <ul className="divide-y divide-smoke/60">
              {lowStock.slice(0, 6).map(({ p, v }) => (
                <li key={v.sku} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-bone">
                    {p.name} <span className="text-ash">/ {p.colorway} / {v.size}</span>
                  </span>
                  <span className="text-mono text-xs text-acid">{v.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Attention">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-fog">Sold-out variants</span>
              <span className="text-mono text-bone">{soldOut.length}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-fog">Low-stock variants</span>
              <span className="text-mono text-bone">{lowStock.length}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-fog">New this drop</span>
              <span className="text-mono text-bone">{products.filter((p) => p.isNew).length}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-fog">Limited pieces</span>
              <span className="text-mono text-bone">{products.filter((p) => p.isLimited).length}</span>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}

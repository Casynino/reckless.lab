import Link from "next/link";
import { Plus } from "lucide-react";
import { listAdminProducts } from "@/lib/admin/products";
import { formatPrice } from "@/lib/shop/format";
import { SmartImage } from "@/components/ui/smart-image";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await listAdminProducts();
  const live = products.filter((p) => p.published).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle title="Products" subtitle={`${live} live · ${products.length} total`} />
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-acid px-5 py-2.5 text-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> New product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-smoke bg-ink-soft">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-smoke text-mono text-[0.7rem] uppercase tracking-[0.13em] text-ash">
              <th className="px-4 py-3 font-normal">Piece</th>
              <th className="px-4 py-3 font-normal">Colour</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Stock</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-smoke/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-carbon">
                      <SmartImage src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <p className="font-medium text-bone">{p.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-bone-dim">{p.colorway}</td>
                <td className="px-4 py-3 text-bone">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock < 20 ? "text-acid" : "text-bone"}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {!p.published && <Tag accent>Draft</Tag>}
                    {p.isNew && <Tag>New</Tag>}
                    {p.isLimited && <Tag accent>Limited</Tag>}
                    {p.isBestSeller && <Tag>Best</Tag>}
                    {p.stock === 0 && <Tag>Sold out</Tag>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-mono text-[0.7rem] uppercase tracking-[0.13em] text-acid hover:underline">
                      Edit
                    </Link>
                    <Link href={`/products/${p.slug}`} target="_blank" className="text-mono text-[0.7rem] uppercase tracking-[0.13em] text-ash hover:text-bone">
                      View ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 max-w-2xl text-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.15em] text-ash">
        Add or edit pieces here. Stock can also be adjusted per size on the{" "}
        <Link href="/admin/inventory" className="text-acid hover:underline">Inventory</Link> page. Images are set by URL —
        host them anywhere and paste the link.
      </p>
    </div>
  );
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={
        accent
          ? "bg-acid px-2 py-0.5 text-mono text-[0.55rem] font-bold uppercase tracking-[0.1em] text-bone"
          : "border border-smoke px-2 py-0.5 text-mono text-[0.55rem] uppercase tracking-[0.1em] text-fog"
      }
    >
      {children}
    </span>
  );
}

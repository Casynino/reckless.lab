import Link from "next/link";
import { getAllProducts, getProductStock } from "@/lib/data";
import { formatPrice } from "@/lib/shop/format";
import { SmartImage } from "@/components/ui/smart-image";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await getAllProducts();

  return (
    <div>
      <PageTitle title="Products" subtitle={`${products.length} pieces across the drop.`} />

      <div className="overflow-x-auto border border-smoke bg-ink-soft">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-smoke text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
              <th className="px-4 py-3 font-normal">Piece</th>
              <th className="px-4 py-3 font-normal">Colour</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Stock (S / M / L / XL)</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = getProductStock(p);
              const bySize = (s: string) => p.variants.find((v) => v.size === s)?.stock;
              return (
                <tr key={p.id} className="border-b border-smoke/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-carbon">
                        <SmartImage src={p.media[0]?.src} alt={p.name} fill sizes="40px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-bone">{p.name}</p>
                        <p className="text-mono text-[0.6rem] uppercase tracking-[0.15em] text-ash">
                          {p.variants[0]?.sku.split("-").slice(0, -1).join("-")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-bone-dim">{p.colorway}</td>
                  <td className="px-4 py-3 text-bone">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={stock < 20 ? "text-acid" : "text-bone"}>{stock}</span>{" "}
                    <span className="text-mono text-[0.65rem] text-ash">
                      ({["S", "M", "L", "XL"].map((s) => bySize(s) ?? "–").join(" / ")})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.isNew && <Tag>New</Tag>}
                      {p.isLimited && <Tag accent>Limited</Tag>}
                      {p.isBestSeller && <Tag>Best</Tag>}
                      {stock === 0 && <Tag>Sold out</Tag>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash hover:text-acid"
                    >
                      View ↗
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-5 max-w-2xl text-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.15em] text-ash">
        Read-only view for now — the catalog is served from typed files. Editing, image uploads and stock
        adjustments land when the catalog moves to the database (the data layer is already abstracted for it).
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

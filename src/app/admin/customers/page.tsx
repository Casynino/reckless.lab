import { listCustomers } from "@/lib/auth/store";
import { getCustomerOrderStats } from "@/lib/orders/store";
import { PageTitle } from "@/components/admin/ui";
import { formatPrice } from "@/lib/shop/format";
import { CustomerReset } from "@/components/admin/customer-reset";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const [customers, stats] = await Promise.all([listCustomers(), getCustomerOrderStats()]);
  const rows = customers
    .map((c) => ({ ...c, s: stats[c.email.toLowerCase()] ?? { orders: 0, spend: 0, last: "" } }))
    .sort((a, b) => b.s.spend - a.s.spend || b.createdAt.localeCompare(a.createdAt));

  const totalLtv = rows.reduce((n, r) => n + r.s.spend, 0);

  return (
    <div>
      <PageTitle
        title="Customers"
        subtitle={`${customers.length} accounts · ${formatPrice(totalLtv)} lifetime value`}
      />

      {customers.length === 0 ? (
        <div className="rounded-sm border border-smoke bg-ink-soft p-10 text-center">
          <p className="text-mono text-xs uppercase tracking-[0.15em] text-ash">No customers yet</p>
          <p className="mt-3 text-sm text-fog">Accounts created at the storefront login appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border border-smoke bg-ink-soft">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-smoke text-mono text-[0.7rem] uppercase tracking-[0.13em] text-ash">
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Orders</th>
                <th className="px-4 py-3 font-normal">Lifetime value</th>
                <th className="px-4 py-3 font-normal">Last order</th>
                <th className="px-4 py-3 font-normal">Joined</th>
                <th className="px-4 py-3 font-normal text-right">Password</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-smoke/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-bone">{c.name}</p>
                    <p className="text-mono text-[0.6rem] uppercase tracking-[0.1em] text-ash">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-bone-dim">{c.s.orders}</td>
                  <td className="px-4 py-3 font-medium text-bone">{formatPrice(c.s.spend)}</td>
                  <td className="px-4 py-3 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">
                    {c.s.last ? new Date(c.s.last).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-4 py-3 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <CustomerReset id={c.id} name={c.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { listCustomers } from "@/lib/auth/store";
import { PageTitle } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const customers = (await listCustomers()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <PageTitle title="Customers" subtitle={`${customers.length} registered ${customers.length === 1 ? "account" : "accounts"}.`} />

      {customers.length === 0 ? (
        <div className="border border-smoke bg-ink-soft p-10 text-center">
          <p className="text-mono text-xs uppercase tracking-[0.25em] text-ash">No customers yet</p>
          <p className="mt-3 text-sm text-fog">Accounts created at the storefront login appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-smoke bg-ink-soft">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-smoke text-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-smoke/50">
                  <td className="px-4 py-3 font-medium text-bone">{c.name}</td>
                  <td className="px-4 py-3 text-bone-dim">{c.email}</td>
                  <td className="px-4 py-3 text-mono text-[0.65rem] uppercase tracking-[0.15em] text-ash">
                    {new Date(c.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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

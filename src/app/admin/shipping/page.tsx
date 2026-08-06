import { PageTitle } from "@/components/admin/ui";
import { listShippingRates } from "@/lib/shop/shipping-store";
import { ShippingManager, type ShippingRow } from "@/components/admin/shipping-manager";

export const dynamic = "force-dynamic";

export default async function AdminShipping() {
  const rates = await listShippingRates();
  const rows: ShippingRow[] = rates.map((r) => ({
    id: r.id,
    label: r.label,
    countries: r.countries,
    courier: r.courier,
    eta: r.eta,
    flatRate: r.flatRate,
    freeThreshold: r.freeThreshold,
    requiresQuote: r.requiresQuote ?? false,
    isDefault: r.isDefault ?? false,
    active: r.active,
  }));

  return (
    <div>
      <PageTitle
        title="Shipping rates"
        subtitle={`${rows.filter((r) => r.active).length} active · edit costs, couriers & delivery per market`}
      />
      <div className="mt-8">
        <ShippingManager rates={rows} />
      </div>
    </div>
  );
}

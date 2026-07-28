import { PageTitle } from "@/components/admin/ui";
import { listCoupons } from "@/lib/promo/store";
import { PromotionsManager, type CouponRow } from "@/components/admin/promotions-manager";

export const dynamic = "force-dynamic";

export default async function AdminPromotions() {
  const coupons = await listCoupons();
  const rows: CouponRow[] = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type as CouponRow["type"],
    value: c.value,
    description: c.description,
    minSubtotal: c.minSubtotal,
    firstOrderOnly: c.firstOrderOnly,
    active: c.active,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
  }));

  return (
    <div>
      <PageTitle title="Promotions" subtitle={`${rows.filter((r) => r.active).length} active · ${rows.length} total`} />
      <div className="mt-8">
        <PromotionsManager coupons={rows} />
      </div>
    </div>
  );
}

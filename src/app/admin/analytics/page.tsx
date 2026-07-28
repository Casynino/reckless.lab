import { computeAnalytics } from "@/lib/orders/analytics";
import { PageTitle } from "@/components/admin/ui";
import { AnalyticsView } from "@/components/admin/analytics-view";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
  const data = await computeAnalytics();
  return (
    <div>
      <PageTitle title="Analytics" subtitle="Live business intelligence — revenue, orders, customers, products." />
      <AnalyticsView data={data} />
    </div>
  );
}

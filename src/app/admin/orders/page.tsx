import { listOrders } from "@/lib/orders/store";
import { PageTitle } from "@/components/admin/ui";
import { OrderMonitor } from "@/components/admin/order-monitor";
import { ExportOrders } from "@/components/admin/export-orders";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageTitle title="Order Monitor" subtitle={`${orders.length} orders · live tracking + status control.`} />
        <ExportOrders orders={orders} />
      </div>
      <OrderMonitor orders={orders} />
    </div>
  );
}

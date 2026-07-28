import { listOrders } from "@/lib/orders/store";
import { PageTitle } from "@/components/admin/ui";
import { OrderMonitor } from "@/components/admin/order-monitor";

export const dynamic = "force-dynamic";

export default function AdminOrders() {
  const orders = listOrders();
  return (
    <div>
      <PageTitle title="Order Monitor" subtitle={`${orders.length} orders · live tracking + status control.`} />
      <OrderMonitor orders={orders} />
    </div>
  );
}

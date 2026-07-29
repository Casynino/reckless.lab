import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders/store";
import { AdminOrderDetail } from "@/components/admin/admin-order-detail";

export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  return (
    <div>
      <AdminOrderDetail order={order} />
    </div>
  );
}

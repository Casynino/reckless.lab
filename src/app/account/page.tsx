import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session-cookies";
import { listOrdersForEmail } from "@/lib/orders/store";
import { listAddresses } from "@/lib/account/addresses";
import { getAllProducts } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { CustomerDashboard } from "@/components/account/customer-dashboard";

export const metadata: Metadata = { title: "Your Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  if (user.role === "admin") redirect("/admin");

  const [orders, addresses, allProducts] = await Promise.all([
    listOrdersForEmail(user.email),
    listAddresses(user.id),
    getAllProducts(),
  ]);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="pb-24">
      <PageHero code="[ ACCOUNT / YOUR LAB PASS ]" title={`Hey, ${firstName}.`} tagline={user.email} />
      <CustomerDashboard
        name={user.name}
        email={user.email}
        orders={orders}
        addresses={addresses}
        allProducts={allProducts}
      />
    </div>
  );
}

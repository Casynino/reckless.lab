import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session-cookies";
import { listOrdersForEmail } from "@/lib/orders/store";
import { listAddresses } from "@/lib/account/addresses";
import { getAllProducts } from "@/lib/data";
import { PageHero } from "@/components/layout/page-hero";
import { CustomerDashboard } from "@/components/account/customer-dashboard";

export const metadata: Metadata = { title: "Your Account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");
  if (session.role === "admin") redirect("/admin");

  const [orders, addresses, allProducts] = await Promise.all([
    listOrdersForEmail(session.email),
    listAddresses(session.sub),
    getAllProducts(),
  ]);
  const firstName = session.name.split(" ")[0];

  return (
    <div className="pb-24">
      <PageHero code="[ ACCOUNT / YOUR LAB PASS ]" title={`Hey, ${firstName}.`} tagline={session.email} />
      <CustomerDashboard
        name={session.name}
        email={session.email}
        orders={orders}
        addresses={addresses}
        allProducts={allProducts}
      />
    </div>
  );
}

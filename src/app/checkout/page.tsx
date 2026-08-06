import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getSession } from "@/lib/auth/session-cookies";
import { getShippingRegions } from "@/lib/shop/shipping-store";
import { listAddresses } from "@/lib/account/addresses";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and complete via WhatsApp.",
};

export default async function CheckoutPage() {
  const [session, regions] = await Promise.all([getSession(), getShippingRegions()]);
  const savedAddresses = session ? await listAddresses(session.sub) : [];
  return (
    <CheckoutClient
      loggedIn={!!session}
      regions={regions}
      savedAddresses={savedAddresses}
      userEmail={session?.email}
    />
  );
}

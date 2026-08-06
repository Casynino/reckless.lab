import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getSession } from "@/lib/auth/session-cookies";
import { getShippingRegions } from "@/lib/shop/shipping-store";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and complete via WhatsApp.",
};

export default async function CheckoutPage() {
  const [session, regions] = await Promise.all([getSession(), getShippingRegions()]);
  return <CheckoutClient loggedIn={!!session} regions={regions} />;
}

import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getSession } from "@/lib/auth/session-cookies";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and complete via WhatsApp.",
};

export default async function CheckoutPage() {
  const session = await getSession();
  return <CheckoutClient loggedIn={!!session} />;
}

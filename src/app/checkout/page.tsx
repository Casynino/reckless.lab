import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and complete via WhatsApp.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

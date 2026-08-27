import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MaintenanceScreen } from "@/components/layout/maintenance-screen";
import { maintenance } from "@/lib/shop/maintenance";
import { shopConfig } from "@/lib/shop/config";

export const metadata: Metadata = {
  // Absolute: the root template would otherwise append the brand name twice.
  title: { absolute: `${maintenance.headline} · ${shopConfig.brand.name}` },
  description: maintenance.body,
  // Nothing here should ever be indexed in place of the real storefront.
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  // Off-switch flipped? Don't leave a stray dark-store page lying around.
  if (!maintenance.enabled) redirect("/");

  return <MaintenanceScreen />;
}

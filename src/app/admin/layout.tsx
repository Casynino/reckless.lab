import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session-cookies";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = { title: "Reckless HQ" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already guards this, but double-check on the server. Name/email
  // are read FRESH from the DB so profile changes show everywhere immediately.
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/account");

  return (
    <AdminShell adminName={user.name} adminEmail={user.email}>
      {children}
    </AdminShell>
  );
}

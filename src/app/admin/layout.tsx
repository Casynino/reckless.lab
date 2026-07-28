import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session-cookies";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = { title: "Reckless HQ" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Middleware already guards this, but double-check on the server.
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "admin") redirect("/account");

  return (
    <AdminShell adminName={session.name} adminEmail={session.email}>
      {children}
    </AdminShell>
  );
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session-cookies";

/** Lightweight user probe for client components (e.g. the header). Reads the
 *  name/role FRESH from the DB so it's never a stale token value. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(
    { user: user ? { name: user.name, email: user.email, role: user.role } : null },
    { headers: { "cache-control": "no-store" } },
  );
}

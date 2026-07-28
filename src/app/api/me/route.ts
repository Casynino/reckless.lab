import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session-cookies";

/** Lightweight session probe for client components (e.g. the header). */
export async function GET() {
  const session = await getSession();
  return NextResponse.json(
    { user: session ? { name: session.name, role: session.role } : null },
    { headers: { "cache-control": "no-store" } },
  );
}

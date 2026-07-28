import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * Route guards:
 *   /admin/*   → admins only (others bounce to /account or /login)
 *   /account/* → any signed-in user
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname + search);

  if (pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(loginUrl);
    if (session.role !== "admin") return NextResponse.redirect(new URL("/account", req.url));
  }

  if (pathname.startsWith("/account")) {
    if (!session) return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { maintenance } from "@/lib/shop/maintenance";

/** Never gated by maintenance mode — HQ has to stay usable while we're dark. */
const ALWAYS_OPEN = ["/admin", "/login", "/api", "/maintenance"];

/**
 * Route guards:
 *   maintenance → every public route bounces to /maintenance (admins exempt)
 *   /admin/*    → admins only (others bounce to /account or /login)
 *   /account/*  → any signed-in user
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (
    maintenance.enabled &&
    session?.role !== "admin" &&
    !ALWAYS_OPEN.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

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
  // Everything except Next internals and files served straight off disk —
  // maintenance mode has to catch the whole storefront, not just /admin.
  matcher: [
    "/((?!_next/static|_next/image|favicon|icon|apple-icon|opengraph-image|twitter-image|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|txt|xml|json|webmanifest|woff|woff2|ttf|mp4)$).*)",
  ],
};

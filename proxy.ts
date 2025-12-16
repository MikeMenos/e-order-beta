import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILES = new Set([
  "/manifest.webmanifest",
  "/favicon.ico",
  "/logo192x192.png",
  "/logo512x512.png",
]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    PUBLIC_FILES.has(pathname)
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get("ergastirio-session-key")?.value;
  const isLogin = pathname === "/login";

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && isLogin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|logo192x192.png|logo512x512.png).*)",
  ],
};

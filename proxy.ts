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
  const specialSession = req.cookies.get("ergastirio-special-session")?.value;
  const hasSession = !!session || !!specialSession;
  const isLogin = pathname === "/login";
  const isClients = pathname.startsWith("/clients");
  const referer = req.headers.get("referer");
  const refererUrl = referer ? new URL(referer) : null;
  const refererPath = refererUrl?.pathname || "/";

  // Case 1: If user has regular session (not special) and tries to access /clients, redirect back
  if (session && !specialSession && isClients) {
    // Try to redirect to referer, otherwise redirect to home
    const redirectUrl = refererPath !== "/clients" && refererPath !== "/login" 
      ? refererPath 
      : "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Case 2: Special session users are allowed to access pages
  // Client-side will handle redirecting them to /clients if they don't have currentBranch

  if (!hasSession && !isLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (hasSession && isLogin) {
    // Redirect special AFM users to /clients, others to /
    if (specialSession) {
      return NextResponse.redirect(new URL("/clients", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|logo192x192.png|logo512x512.png).*)",
  ],
};

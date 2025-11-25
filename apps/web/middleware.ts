import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en"],
  defaultLocale: "en",
});

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-email-change",
];
const protectedRoutes = ["/dashboard", "/settings", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname
  const localeMatch = pathname.match(/^\/(en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "en";

  // Remove locale from pathname for checking
  const pathnameWithoutLocale = pathname.replace(/^\/(en)/, "") || "/";

  const isAuthRoute = authRoutes.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  // Get session from cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  // Only redirect for explicitly protected routes, not for unknown routes (let Next.js handle 404)
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

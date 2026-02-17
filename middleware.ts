import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Middleware
 *
 * Runs on every matched request to:
 * 1. Refresh the auth session (keeps user logged in)
 * 2. Protect routes that require authentication
 * 3. Redirect authenticated users away from auth pages
 */

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/surveys", "/account"];

// Routes only for unauthenticated users
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && user) {
    // Check if there's a redirect URL in the query params
    const redirectTo =
      request.nextUrl.searchParams.get("redirect") || "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     * - api routes that don't need auth (like webhooks)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

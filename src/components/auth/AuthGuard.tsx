"use client";

/**
 * AuthGuard Component
 *
 * Client-side wrapper that protects routes requiring authentication.
 * Shows a loading state while checking auth, redirects to login if
 * unauthenticated, and renders children if authenticated.
 */

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { APP_ROUTES } from "@/lib/constants";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  fallback,
  requireAuth = true,
  redirectTo = APP_ROUTES.login,
}: AuthGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !user) {
      // User is not authenticated, redirect to login with return URL
      const redirectUrl = new URL(redirectTo, window.location.origin);
      redirectUrl.searchParams.set("redirectTo", pathname);
      router.push(redirectUrl.toString());
    }
  }, [user, isLoading, requireAuth, redirectTo, pathname, router]);

  // Show loading state
  if (isLoading) {
    return fallback ?? <AuthLoadingFallback />;
  }

  // Not authenticated and auth is required
  if (requireAuth && !user) {
    return fallback ?? <AuthLoadingFallback />;
  }

  // Authenticated or auth not required
  return <>{children}</>;
}

/**
 * Default loading fallback component
 */
function AuthLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-text-muted">Checking authentication...</p>
      </div>
    </div>
  );
}

/**
 * Wrapper for routes that should only be accessible to guests (not logged in)
 */
export function GuestGuard({
  children,
  fallback,
  redirectTo = APP_ROUTES.dashboard,
}: Omit<AuthGuardProps, "requireAuth">) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      // User is authenticated, redirect to dashboard
      router.push(redirectTo);
    }
  }, [user, isLoading, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return fallback ?? <AuthLoadingFallback />;
  }

  // User is authenticated, will redirect
  if (user) {
    return fallback ?? <AuthLoadingFallback />;
  }

  // Not authenticated - show guest content
  return <>{children}</>;
}

export default AuthGuard;

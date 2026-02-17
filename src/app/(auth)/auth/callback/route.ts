import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APP_ROUTES } from "@/lib/constants";

/**
 * OAuth Callback Route Handler
 *
 * This route handles the callback from OAuth providers (GitHub, Google)
 * and magic link authentication. It exchanges the code for a session
 * and redirects the user to the dashboard or their original destination.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? APP_ROUTES.dashboard;
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    const redirectUrl = new URL(APP_ROUTES.login, origin);
    redirectUrl.searchParams.set("error", errorDescription || error);
    return NextResponse.redirect(redirectUrl);
  }

  // Exchange code for session
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange error:", exchangeError.message);
      const redirectUrl = new URL(APP_ROUTES.login, origin);
      redirectUrl.searchParams.set("error", exchangeError.message);
      return NextResponse.redirect(redirectUrl);
    }

    // Successful authentication - redirect to intended destination
    const redirectUrl = new URL(next, origin);
    return NextResponse.redirect(redirectUrl);
  }

  // No code provided - redirect to login
  const redirectUrl = new URL(APP_ROUTES.login, origin);
  redirectUrl.searchParams.set("error", "No authentication code provided");
  return NextResponse.redirect(redirectUrl);
}

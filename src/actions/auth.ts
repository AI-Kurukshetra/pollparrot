"use server";

/**
 * Authentication Server Actions
 *
 * All auth operations using Supabase Auth.
 * These actions handle signup, login, OAuth, magic link, and password reset flows.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations";
import type { FormState } from "@/types";
import { APP_ROUTES } from "@/lib/constants";

type OAuthProvider = "github" | "google";

/**
 * Sign up with email and password
 */
export async function signUp(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    fullName: formData.get("fullName") as string | undefined,
  };

  // Validate input
  const validationResult = signupSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName } = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Check your email to confirm your account.",
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validate input
  const validationResult = loginSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect(APP_ROUTES.dashboard);
}

/**
 * Sign in with OAuth provider (GitHub or Google)
 */
export async function signInWithOAuth(provider: OAuthProvider): Promise<FormState> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return {
    success: false,
    message: "Failed to initiate OAuth flow",
  };
}

/**
 * Sign in with magic link (passwordless)
 */
export async function signInWithMagicLink(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return {
      success: false,
      errors: { email: ["Please enter a valid email address"] },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Check your email for the magic link.",
  };
}

/**
 * Send password reset email
 */
export async function forgotPassword(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    email: formData.get("email") as string,
  };

  // Validate input
  const validationResult = forgotPasswordSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email } = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getBaseUrl()}/reset-password`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Check your email for the password reset link.",
  };
}

/**
 * Reset password (after clicking reset link)
 */
export async function resetPassword(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate input
  const validationResult = resetPasswordSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { password } = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect(APP_ROUTES.login);
}

/**
 * Sign out and clear session
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(APP_ROUTES.home);
}

/**
 * Get current user (for server components)
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get current session (for server components)
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session;
}

/**
 * Helper to get the base URL for redirects
 */
async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

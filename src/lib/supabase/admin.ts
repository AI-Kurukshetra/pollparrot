/**
 * ============================================================
 * ⚠️  DANGER: ADMIN SUPABASE CLIENT - SERVER-ONLY
 * ============================================================
 *
 * This client uses SUPABASE_SERVICE_ROLE_KEY which:
 * - BYPASSES all Row Level Security (RLS) policies
 * - Has FULL READ/WRITE access to ALL data
 * - Must NEVER be exposed to the browser
 *
 * ONLY use this client in:
 * - Server Actions (files with "use server")
 * - API Route Handlers (src/app/api/...)
 * - Server-side scripts (scripts/*.ts)
 *
 * NEVER:
 * - Import this file in client components
 * - Import this file in files without "use server"
 * - Log or expose the service role key
 *
 * The 'server-only' import below will cause a BUILD ERROR
 * if this file is ever imported in client-side code.
 * ============================================================
 */

import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Validate that the service role key is available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
      "Please add it to your .env.local file."
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
      "Please add it to your .env.local file. " +
      "⚠️ This key should NEVER have a NEXT_PUBLIC_ prefix!"
  );
}

/**
 * Admin Supabase Client
 *
 * WARNING: This client bypasses RLS. Only use for:
 * - Database seeding
 * - Admin operations
 * - Background jobs
 * - Operations requiring cross-user data access
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

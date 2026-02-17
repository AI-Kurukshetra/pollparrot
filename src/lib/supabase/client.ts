import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Browser Supabase Client (Singleton)
 *
 * Use this client in:
 * - Client Components ("use client")
 * - Browser-side code
 *
 * Security:
 * - Uses ANON KEY only (safe for browser)
 * - Row Level Security (RLS) is enforced
 * - User can only access data allowed by RLS policies
 */

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return browserClient;
}

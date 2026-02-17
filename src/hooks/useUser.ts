"use client";

/**
 * useUser Hook
 *
 * Client-side hook for accessing the current authenticated user.
 * Subscribes to auth state changes and provides user data, loading state,
 * and a signOut function.
 */

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { APP_ROUTES } from "@/lib/constants";

interface UseUserReturn {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create client outside component to ensure single instance
const supabase = createClient();

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const initRef = useRef(false);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
      }

      return data as Profile;
    } catch {
      return null;
    }
  };

  // Refresh user data
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      setSession(currentSession);

      if (currentSession?.user) {
        setUser(currentSession.user);
        const userProfile = await fetchProfile(currentSession.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      setUser(null);
      setProfile(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      router.push(APP_ROUTES.home);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to sign out"));
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Initial load and auth state subscription - runs once
  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initRef.current) return;
    initRef.current = true;

    let isMounted = true;
    let hasResolved = false;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!isMounted || hasResolved) return;

        if (sessionError) {
          console.error("Auth session error:", sessionError);
          hasResolved = true;
          setIsLoading(false);
          return;
        }

        setSession(currentSession);

        if (currentSession?.user) {
          setUser(currentSession.user);
          const userProfile = await fetchProfile(currentSession.user.id);
          if (isMounted && !hasResolved) {
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (isMounted && !hasResolved) {
          setError(err instanceof Error ? err : new Error("Failed to fetch user"));
        }
      } finally {
        if (isMounted && !hasResolved) {
          hasResolved = true;
          setIsLoading(false);
        }
      }
    };

    // Set a safety timeout - ensures buttons show even if auth hangs
    const timeoutId = setTimeout(() => {
      if (isMounted && !hasResolved) {
        console.warn("Auth initialization timed out");
        hasResolved = true;
        setIsLoading(false);
      }
    }, 3000);

    initializeAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      setSession(newSession);

      if (newSession?.user) {
        setUser(newSession.user);
        const userProfile = await fetchProfile(newSession.user.id);
        if (isMounted) {
          setProfile(userProfile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false);

      // Refresh router on auth state change
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        router.refresh();
      }
    });

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once

  return {
    user,
    profile,
    session,
    isLoading,
    error,
    signOut,
    refreshUser,
  };
}

export default useUser;

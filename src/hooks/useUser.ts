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

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const initializedRef = useRef(false);

  // Get the singleton client
  const supabase = createClient();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
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
  }, [supabase]);

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
  }, [supabase, fetchProfile]);

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
  }, [supabase, router]);

  // Initial load and auth state subscription - runs once
  useEffect(() => {
    // Prevent double initialization in React strict mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Get initial session
    const initializeAuth = async () => {
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
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        setUser(newSession.user);
        const userProfile = await fetchProfile(newSession.user.id);
        setProfile(userProfile);
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

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, fetchProfile]);

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

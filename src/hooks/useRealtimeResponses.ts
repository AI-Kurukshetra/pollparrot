"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresInsertPayload } from "@supabase/supabase-js";

interface RealtimeResponse {
  survey_id: string;
  is_complete: boolean;
  created_at: string;
}

interface RealtimeUpdate {
  surveyId: string;
  timestamp: number;
}

interface UseRealtimeResponsesResult {
  recentUpdates: Map<string, number>; // surveyId -> timestamp of last update
  isConnected: boolean;
}

export function useRealtimeResponses(surveyIds: string[]): UseRealtimeResponsesResult {
  const [recentUpdates, setRecentUpdates] = useState<Map<string, number>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabaseRef = useRef(createClient());

  const handleInsert = useCallback(
    (payload: RealtimePostgresInsertPayload<RealtimeResponse>) => {
      const newResponse = payload.new;

      // Only track if it's for one of our surveys and is complete
      if (surveyIds.includes(newResponse.survey_id) && newResponse.is_complete) {
        setRecentUpdates((prev) => {
          const next = new Map(prev);
          next.set(newResponse.survey_id, Date.now());
          return next;
        });
      }
    },
    [surveyIds]
  );

  useEffect(() => {
    if (surveyIds.length === 0) {
      return;
    }

    const supabase = supabaseRef.current;

    // Create channel for realtime updates
    const channel = supabase
      .channel("responses-realtime")
      .on<RealtimeResponse>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "responses",
        },
        handleInsert
      )
      .on<RealtimeResponse>(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "responses",
          filter: "is_complete=eq.true",
        },
        (payload) => {
          // Handle response completion updates
          const response = payload.new as RealtimeResponse;
          if (surveyIds.includes(response.survey_id) && response.is_complete) {
            setRecentUpdates((prev) => {
              const next = new Map(prev);
              next.set(response.survey_id, Date.now());
              return next;
            });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    // Cleanup on unmount or when surveyIds change
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [surveyIds.join(","), handleInsert]); // Join surveyIds for stable dependency

  return {
    recentUpdates,
    isConnected,
  };
}

// Helper hook to check if a survey had a recent update (within last N seconds)
export function useHasRecentUpdate(
  surveyId: string,
  recentUpdates: Map<string, number>,
  withinMs: number = 5000
): boolean {
  const [hasRecentUpdate, setHasRecentUpdate] = useState(false);

  useEffect(() => {
    const lastUpdate = recentUpdates.get(surveyId);
    if (!lastUpdate) {
      setHasRecentUpdate(false);
      return;
    }

    const isRecent = Date.now() - lastUpdate < withinMs;
    setHasRecentUpdate(isRecent);

    if (isRecent) {
      // Clear the "recent" state after the timeout
      const timeout = setTimeout(() => {
        setHasRecentUpdate(false);
      }, withinMs - (Date.now() - lastUpdate));

      return () => clearTimeout(timeout);
    }
  }, [surveyId, recentUpdates, withinMs]);

  return hasRecentUpdate;
}

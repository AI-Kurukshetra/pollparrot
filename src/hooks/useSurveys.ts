"use client";

import { useEffect, useState, useCallback } from "react";
import { getSurveys } from "@/actions/surveys";
import type { Survey } from "@/types";

type SurveyWithCounts = Survey & { question_count?: number; response_count?: number };

export function useSurveys() {
  const [surveys, setSurveys] = useState<SurveyWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveys = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSurveys();
      setSurveys(data as SurveyWithCounts[]);
    } catch (err) {
      console.error("Error fetching surveys:", err);
      setError("Failed to load surveys");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const refetch = useCallback(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  return {
    surveys,
    isLoading,
    error,
    refetch,
  };
}

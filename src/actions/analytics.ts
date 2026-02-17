"use server";

import { createClient } from "@/lib/supabase/server";
import type { Question, Response, Answer, Json } from "@/types";

export interface SurveyStats {
  totalResponses: number;
  completedResponses: number;
  completionRate: number;
  averageTime: number | null; // in seconds
}

export interface QuestionSummary {
  questionId: string;
  questionTitle: string;
  questionType: string;
  responseCount: number;
  answers: AnswerSummary[];
}

export interface AnswerSummary {
  value: string;
  count: number;
  percentage: number;
}

// Get survey statistics
export async function getSurveyAnalytics(surveyId: string): Promise<SurveyStats | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get all responses for this survey
  const { data: responses, error } = await supabase
    .from("responses")
    .select("*")
    .eq("survey_id", surveyId);

  if (error) {
    console.error("Error fetching responses:", error);
    return null;
  }

  const totalResponses = responses?.length || 0;
  const completedResponses = responses?.filter((r) => r.is_complete).length || 0;
  const completionRate = totalResponses > 0 ? (completedResponses / totalResponses) * 100 : 0;

  // Calculate average completion time
  let averageTime: number | null = null;
  const completedWithTime = responses?.filter(
    (r) => r.is_complete && r.started_at && r.completed_at
  );
  if (completedWithTime && completedWithTime.length > 0) {
    const totalTime = completedWithTime.reduce((sum, r) => {
      const start = new Date(r.started_at).getTime();
      const end = new Date(r.completed_at!).getTime();
      return sum + (end - start) / 1000;
    }, 0);
    averageTime = Math.round(totalTime / completedWithTime.length);
  }

  return {
    totalResponses,
    completedResponses,
    completionRate,
    averageTime,
  };
}

// Get question summaries with aggregated answers
export async function getQuestionSummaries(surveyId: string): Promise<QuestionSummary[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Get questions
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", surveyId)
    .order("sort_order", { ascending: true });

  if (questionsError || !questions) return [];

  // Get all answers for this survey
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select(`
      *,
      response:responses!inner(survey_id, is_complete)
    `)
    .eq("response.survey_id", surveyId)
    .eq("response.is_complete", true);

  if (answersError) {
    console.error("Error fetching answers:", answersError);
    return [];
  }

  // Aggregate answers per question
  const summaries: QuestionSummary[] = questions.map((question) => {
    const questionAnswers = answers?.filter((a) => a.question_id === question.id) || [];
    const responseCount = questionAnswers.length;

    // Aggregate answer values
    const valueCounts: Record<string, number> = {};
    questionAnswers.forEach((answer) => {
      const value = formatAnswerValue(answer.value, question.type);
      if (Array.isArray(value)) {
        value.forEach((v) => {
          valueCounts[v] = (valueCounts[v] || 0) + 1;
        });
      } else {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
      }
    });

    const answerSummaries: AnswerSummary[] = Object.entries(valueCounts)
      .map(([value, count]) => ({
        value,
        count,
        percentage: responseCount > 0 ? (count / responseCount) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      questionId: question.id,
      questionTitle: question.title,
      questionType: question.type,
      responseCount,
      answers: answerSummaries,
    };
  });

  return summaries;
}

// Get individual responses with answers
export async function getResponses(
  surveyId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ responses: (Response & { answers: Answer[] })[]; total: number }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { responses: [], total: 0 };

  // Get total count
  const { count } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("survey_id", surveyId)
    .eq("is_complete", true);

  // Get responses with answers
  let query = supabase
    .from("responses")
    .select(`
      *,
      answers:answers(*)
    `)
    .eq("survey_id", surveyId)
    .eq("is_complete", true)
    .order("completed_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching responses:", error);
    return { responses: [], total: 0 };
  }

  return {
    responses: data || [],
    total: count || 0,
  };
}

// Export responses as CSV
export async function exportResponsesCSV(surveyId: string): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "";

  // Get questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", surveyId)
    .order("sort_order", { ascending: true });

  if (!questions) return "";

  // Get responses with answers
  const { data: responses } = await supabase
    .from("responses")
    .select(`
      *,
      answers:answers(*)
    `)
    .eq("survey_id", surveyId)
    .eq("is_complete", true)
    .order("completed_at", { ascending: false });

  if (!responses) return "";

  // Build CSV header
  const headers = [
    "Response ID",
    "Submitted At",
    "Email",
    ...questions.map((q) => q.title),
  ];

  // Build CSV rows
  const rows = responses.map((response) => {
    const answersMap = new Map(
      response.answers.map((a: Answer) => [a.question_id, a.value])
    );

    return [
      response.id,
      response.completed_at || "",
      response.respondent_email || "",
      ...questions.map((q) => {
        const value = answersMap.get(q.id);
        return formatAnswerValue(value ?? null, q.type).toString();
      }),
    ];
  });

  // Convert to CSV string
  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  return csvContent;
}

// Helper to format answer values for display
function formatAnswerValue(value: Json, questionType: string): string | string[] {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {
    return value.map((v) => formatAnswerValue(v, questionType) as string);
  }

  if (typeof value === "object") {
    // For matrix questions or complex objects
    return JSON.stringify(value);
  }

  return String(value);
}

// Helper to escape CSV values
function escapeCSV(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FormState, Json } from "@/types";

// Get survey by share slug (public, no auth required)
export async function getSurveyBySlug(shareSlug: string) {
  // Use admin client for public access since this doesn't require auth
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      questions:questions(*)
    `)
    .eq("share_slug", shareSlug)
    .single();

  if (error) {
    console.error("Error fetching survey:", error);
    return null;
  }

  // Sort questions by sort_order
  if (data.questions) {
    data.questions.sort((a: { sort_order: number }, b: { sort_order: number }) =>
      (a.sort_order || 0) - (b.sort_order || 0)
    );
  }

  return data;
}

// Create a new response (start response session)
// This is called for anonymous users submitting surveys
export async function createResponse(surveyId: string): Promise<{ id: string } | null> {
  // Use admin client to bypass RLS for anonymous users
  const supabase = createAdminClient();

  // First verify the survey is active
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, status")
    .eq("id", surveyId)
    .single();

  if (surveyError || !survey || survey.status !== "active") {
    console.error("Survey not active or not found:", surveyError);
    return null;
  }

  const { data, error } = await supabase
    .from("responses")
    .insert({
      survey_id: surveyId,
      started_at: new Date().toISOString(),
      is_complete: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating response:", error);
    return null;
  }

  return { id: data.id };
}

// Submit response with all answers
// This is called for anonymous users submitting surveys
export async function submitResponse(
  responseId: string,
  surveyId: string,
  answers: Record<string, unknown>,
  respondentEmail?: string
): Promise<FormState> {
  // Use admin client to bypass RLS for anonymous users
  const supabase = createAdminClient();

  // Verify survey is still active
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id, status")
    .eq("id", surveyId)
    .single();

  if (surveyError || !survey || survey.status !== "active") {
    return { success: false, message: "This survey is no longer accepting responses" };
  }

  // Create answer records for each question
  const answerRecords = Object.entries(answers).map(([questionId, value]) => ({
    response_id: responseId,
    question_id: questionId,
    value: value as Json,
  }));

  if (answerRecords.length > 0) {
    const { error: answersError } = await supabase
      .from("answers")
      .insert(answerRecords);

    if (answersError) {
      console.error("Error creating answers:", answersError);
      return { success: false, message: "Failed to save answers" };
    }
  }

  // Update response as complete
  const { error: responseError } = await supabase
    .from("responses")
    .update({
      is_complete: true,
      completed_at: new Date().toISOString(),
      respondent_email: respondentEmail || null,
    })
    .eq("id", responseId);

  if (responseError) {
    console.error("Error updating response:", responseError);
    return { success: false, message: "Failed to complete response" };
  }

  return { success: true, message: "Response submitted successfully" };
}

// Check if survey accepts responses
export async function checkSurveyAcceptsResponses(surveyId: string): Promise<{
  accepts: boolean;
  reason?: string;
}> {
  // Use admin client for public access
  const supabase = createAdminClient();

  const { data: survey, error } = await supabase
    .from("surveys")
    .select("status, settings")
    .eq("id", surveyId)
    .single();

  if (error || !survey) {
    return { accepts: false, reason: "Survey not found" };
  }

  if (survey.status !== "active") {
    return { accepts: false, reason: "This survey is no longer accepting responses" };
  }

  const settings = survey.settings as Record<string, unknown> | null;

  // Check end date
  if (settings?.endDate) {
    const endDate = new Date(settings.endDate as string);
    if (new Date() > endDate) {
      return { accepts: false, reason: "This survey has expired" };
    }
  }

  // Check start date
  if (settings?.startDate) {
    const startDate = new Date(settings.startDate as string);
    if (new Date() < startDate) {
      return { accepts: false, reason: "This survey has not started yet" };
    }
  }

  return { accepts: true };
}

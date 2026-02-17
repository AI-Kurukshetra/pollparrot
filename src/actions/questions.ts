"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Question, QuestionType, FormState, Json } from "@/types";

// Get all questions for a survey
export async function getQuestions(surveyId: string): Promise<Question[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", surveyId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  return data || [];
}

// Create a new question
export async function createQuestion(
  surveyId: string,
  data: {
    type: QuestionType;
    title: string;
    description?: string;
    is_required?: boolean;
    settings?: Json;
  }
): Promise<FormState & { data?: { id: string } }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  // Get the highest sort_order for this survey
  const { data: existingQuestions } = await supabase
    .from("questions")
    .select("sort_order")
    .eq("survey_id", surveyId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSortOrder = existingQuestions && existingQuestions.length > 0
    ? (existingQuestions[0].sort_order || 0) + 1
    : 0;

  const { data: newQuestion, error } = await supabase
    .from("questions")
    .insert({
      survey_id: surveyId,
      type: data.type,
      title: data.title,
      description: data.description || null,
      is_required: data.is_required || false,
      settings: data.settings || {},
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating question:", error);
    return { success: false, message: "Failed to create question" };
  }

  revalidatePath(`/dashboard/surveys/${surveyId}/edit`);

  return {
    success: true,
    message: "Question created",
    data: { id: newQuestion.id },
  };
}

// Update a question
export async function updateQuestion(
  questionId: string,
  data: Partial<{
    title: string;
    description: string | null;
    is_required: boolean;
    settings: Json;
  }>
): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  const { error } = await supabase
    .from("questions")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", questionId);

  if (error) {
    console.error("Error updating question:", error);
    return { success: false, message: "Failed to update question" };
  }

  return { success: true, message: "Question updated" };
}

// Delete a question
export async function deleteQuestion(questionId: string): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  // Get the question to find its survey_id
  const { data: question } = await supabase
    .from("questions")
    .select("survey_id")
    .eq("id", questionId)
    .single();

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (error) {
    console.error("Error deleting question:", error);
    return { success: false, message: "Failed to delete question" };
  }

  if (question) {
    revalidatePath(`/dashboard/surveys/${question.survey_id}/edit`);
  }

  return { success: true, message: "Question deleted" };
}

// Reorder questions
export async function reorderQuestions(
  surveyId: string,
  questionIds: string[]
): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  // Update sort_order for each question
  const updates = questionIds.map((id, index) =>
    supabase
      .from("questions")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("survey_id", surveyId)
  );

  const results = await Promise.all(updates);

  const hasError = results.some((result) => result.error);
  if (hasError) {
    console.error("Error reordering questions");
    return { success: false, message: "Failed to reorder questions" };
  }

  revalidatePath(`/dashboard/surveys/${surveyId}/edit`);

  return { success: true, message: "Questions reordered" };
}

// Move question up
export async function moveQuestionUp(
  surveyId: string,
  questionId: string
): Promise<FormState> {
  const questions = await getQuestions(surveyId);
  const currentIndex = questions.findIndex((q) => q.id === questionId);

  if (currentIndex <= 0) {
    return { success: false, message: "Question is already at the top" };
  }

  const newOrder = questions.map((q) => q.id);
  [newOrder[currentIndex - 1], newOrder[currentIndex]] = [
    newOrder[currentIndex],
    newOrder[currentIndex - 1],
  ];

  return reorderQuestions(surveyId, newOrder);
}

// Move question down
export async function moveQuestionDown(
  surveyId: string,
  questionId: string
): Promise<FormState> {
  const questions = await getQuestions(surveyId);
  const currentIndex = questions.findIndex((q) => q.id === questionId);

  if (currentIndex < 0 || currentIndex >= questions.length - 1) {
    return { success: false, message: "Question is already at the bottom" };
  }

  const newOrder = questions.map((q) => q.id);
  [newOrder[currentIndex], newOrder[currentIndex + 1]] = [
    newOrder[currentIndex + 1],
    newOrder[currentIndex],
  ];

  return reorderQuestions(surveyId, newOrder);
}

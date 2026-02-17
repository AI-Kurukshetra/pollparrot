"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Survey, SurveyStatus, FormState, Json } from "@/types";

// Get all templates (uses admin client to bypass RLS - templates are public)
export async function getTemplates(): Promise<Survey[]> {
  // Use admin client so all authenticated users can see templates
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      questions:questions(count)
    `)
    .eq("is_template", true)
    .eq("status", "active")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching templates:", error);
    return [];
  }

  return (data || []).map((template) => ({
    ...template,
    question_count: template.questions?.[0]?.count || 0,
  }));
}

// Use a template (duplicate it for the current user)
export async function useTemplate(templateId: string): Promise<FormState & { data?: { id: string } }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  // Fetch template with questions
  const { data: template, error: fetchError } = await supabase
    .from("surveys")
    .select(`
      *,
      questions:questions(*)
    `)
    .eq("id", templateId)
    .eq("is_template", true)
    .single();

  if (fetchError || !template) {
    return { success: false, message: "Template not found" };
  }

  // Create new survey from template
  const shareSlug = `${template.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 15)}-${Date.now().toString(36)}`;

  const { data: newSurvey, error: createError } = await supabase
    .from("surveys")
    .insert({
      user_id: user.id,
      title: template.title,
      description: template.description,
      status: "draft" as SurveyStatus,
      share_slug: shareSlug,
      settings: template.settings,
      is_template: false,
    })
    .select()
    .single();

  if (createError || !newSurvey) {
    console.error("Error creating survey from template:", createError);
    return { success: false, message: "Failed to create survey from template" };
  }

  // Duplicate questions
  if (template.questions && template.questions.length > 0) {
    const questions = template.questions.map((q: { type: string; title: string; description: string | null; is_required: boolean; settings: Json; sort_order: number; options?: Json }) => ({
      survey_id: newSurvey.id,
      type: q.type,
      title: q.title,
      description: q.description,
      is_required: q.is_required,
      settings: q.settings as Json,
      sort_order: q.sort_order,
      options: q.options as Json ?? null,
    }));

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(questions);

    if (questionsError) {
      console.error("Error duplicating questions:", questionsError);
    }
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Survey created from template",
    data: { id: newSurvey.id },
  };
}


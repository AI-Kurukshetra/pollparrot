"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { surveySchema } from "@/lib/validations";
import type { Survey, SurveyStatus, FormState } from "@/types";

// Get all surveys for the current user
export async function getSurveys(): Promise<Survey[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      questions:questions(count),
      responses:responses(count)
    `)
    .eq("user_id", user.id)
    .eq("is_template", false)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching surveys:", error);
    return [];
  }

  return (data || []).map((survey) => ({
    ...survey,
    question_count: survey.questions?.[0]?.count || 0,
    response_count: survey.responses?.[0]?.count || 0,
  }));
}

// Get a single survey by ID
export async function getSurvey(id: string): Promise<Survey | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      questions:questions(*),
      responses:responses(count)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching survey:", error);
    return null;
  }

  // Verify ownership or if it's a public survey
  if (data.user_id !== user.id && data.status !== "active") {
    return null;
  }

  return {
    ...data,
    response_count: data.responses?.[0]?.count || 0,
  };
}

// Create a new survey
export async function createSurvey(
  _prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to create a survey" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const validatedFields = surveySchema.safeParse({ title, description });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Generate unique share slug
  const shareSlug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20)}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("surveys")
    .insert({
      user_id: user.id,
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      status: "draft" as SurveyStatus,
      share_slug: shareSlug,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating survey:", error);
    return { success: false, message: "Failed to create survey" };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Survey created successfully",
    data: { id: data.id },
  };
}

// Quick create survey (returns ID directly)
export async function quickCreateSurvey(): Promise<{ id: string } | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const shareSlug = `survey-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from("surveys")
    .insert({
      user_id: user.id,
      title: "Untitled Survey",
      status: "draft" as SurveyStatus,
      share_slug: shareSlug,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating survey:", error);
    return null;
  }

  revalidatePath("/dashboard");

  return { id: data.id };
}

// Update survey details
export async function updateSurvey(
  id: string,
  data: Partial<Pick<Survey, "title" | "description" | "settings">>
): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  const { error } = await supabase
    .from("surveys")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating survey:", error);
    return { success: false, message: "Failed to update survey" };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/surveys/${id}`);

  return { success: true, message: "Survey updated successfully" };
}

// Update survey status
export async function updateSurveyStatus(
  id: string,
  status: SurveyStatus
): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  const { error } = await supabase
    .from("surveys")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating survey status:", error);
    return { success: false, message: "Failed to update survey status" };
  }

  revalidatePath("/dashboard");

  return { success: true, message: `Survey ${status === "active" ? "published" : status}` };
}

// Duplicate a survey
export async function duplicateSurvey(id: string): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  // Fetch original survey with questions
  const { data: original, error: fetchError } = await supabase
    .from("surveys")
    .select(`
      *,
      questions:questions(*)
    `)
    .eq("id", id)
    .single();

  if (fetchError || !original) {
    return { success: false, message: "Survey not found" };
  }

  // Create new survey
  const shareSlug = `${original.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 15)}-copy-${Date.now().toString(36)}`;

  const { data: newSurvey, error: createError } = await supabase
    .from("surveys")
    .insert({
      user_id: user.id,
      title: `${original.title} (Copy)`,
      description: original.description,
      status: "draft" as SurveyStatus,
      share_slug: shareSlug,
      settings: original.settings,
      is_template: false,
    })
    .select()
    .single();

  if (createError || !newSurvey) {
    console.error("Error duplicating survey:", createError);
    return { success: false, message: "Failed to duplicate survey" };
  }

  // Duplicate questions
  if (original.questions && original.questions.length > 0) {
    for (const question of original.questions) {
      const { data: newQuestion, error: questionError } = await supabase
        .from("questions")
        .insert({
          survey_id: newSurvey.id,
          type: question.type,
          title: question.title,
          description: question.description,
          is_required: question.is_required,
          settings: question.settings,
          sort_order: question.sort_order,
        })
        .select()
        .single();

      if (questionError) {
        console.error("Error duplicating question:", questionError);
      }
    }
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Survey duplicated successfully",
    data: { id: newSurvey.id },
  };
}

// Delete a survey
export async function deleteSurvey(id: string): Promise<FormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in" };
  }

  const { error } = await supabase
    .from("surveys")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting survey:", error);
    return { success: false, message: "Failed to delete survey" };
  }

  revalidatePath("/dashboard");

  return { success: true, message: "Survey deleted successfully" };
}

// Get survey stats
export async function getSurveyStats(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_survey_stats", {
    p_survey_id: id,
  });

  if (error) {
    console.error("Error fetching survey stats:", error);
    return null;
  }

  return data;
}

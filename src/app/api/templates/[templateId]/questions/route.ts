import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;

  // Use admin client to bypass RLS for templates
  const supabase = createAdminClient();

  // Verify this is a template
  const { data: template, error: templateError } = await supabase
    .from("surveys")
    .select("id, is_template")
    .eq("id", templateId)
    .eq("is_template", true)
    .single();

  if (templateError || !template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  // Fetch questions
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", templateId)
    .order("sort_order", { ascending: true });

  if (questionsError) {
    console.error("Error fetching template questions:", questionsError);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }

  return NextResponse.json({ questions: questions || [] });
}

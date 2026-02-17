"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileText, Copy, Sparkles, Eye, X } from "lucide-react";
import { Button, Card, Spinner, Badge, Modal } from "@/components/ui";
import { getTemplates, useTemplate } from "@/actions/templates";
import { TEMPLATE_CATEGORIES, getCategoryLabel } from "@/lib/constants/templates";
import type { Survey, Question, SurveySettings } from "@/types";

interface TemplateWithQuestions extends Survey {
  question_count?: number;
  questions?: Question[];
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateWithQuestions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateWithQuestions | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getTemplates();
      setTemplates(data);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleUseTemplate = async (templateId: string) => {
    setUsingTemplate(templateId);
    const result = await useTemplate(templateId);
    if (result.success && result.data?.id) {
      router.push(`/dashboard/surveys/${result.data.id}/edit`);
    }
    setUsingTemplate(null);
  };

  // Get category from template settings
  const getTemplateCategory = (template: TemplateWithQuestions): string => {
    const settings = template.settings as unknown as Record<string, unknown> | null;
    return (settings?.templateCategory as string) || "other";
  };

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return templates;
    return templates.filter(template => getTemplateCategory(template) === activeCategory);
  }, [templates, activeCategory]);

  // Count templates per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: templates.length };
    templates.forEach(template => {
      const category = getTemplateCategory(template);
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [templates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Survey Templates</h1>
        <p className="text-gray-500 mt-1">
          Start with a pre-built template and customize it to your needs.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TEMPLATE_CATEGORIES.map((category) => {
          const count = categoryCounts[category.id] || 0;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#FF6B35] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.label}
              {category.id !== "all" && count > 0 && (
                <span className={`ml-1.5 ${isActive ? "text-white/80" : "text-gray-400"}`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card padding="lg" className="text-center py-16 bg-white border border-gray-200">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FFF5F0] flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-[#FF6B35]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeCategory === "all" ? "No templates yet" : "No templates in this category"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeCategory === "all"
              ? "Templates will appear here once they're created."
              : "Try selecting a different category or view all templates."}
          </p>
          {activeCategory !== "all" && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setActiveCategory("all")}
            >
              View All Templates
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const category = getTemplateCategory(template);

            return (
              <Card
                key={template.id}
                padding="none"
                className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="p-5">
                  {/* Header with icon and title */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFF5F0] flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-[#FF6B35]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {template.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="draft"
                          size="sm"
                          className="bg-gray-100 text-gray-600 text-xs"
                        >
                          {getCategoryLabel(category)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {template.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {template.description}
                    </p>
                  )}

                  {/* Question count */}
                  <p className="text-xs text-gray-400 mb-4">
                    📝 {template.question_count || 0} questions
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => setPreviewTemplate(template)}
                      leftIcon={<Eye className="h-4 w-4" />}
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-[#FF6B35] hover:bg-[#E8551F]"
                      onClick={() => handleUseTemplate(template.id)}
                      isLoading={usingTemplate === template.id}
                      leftIcon={<Copy className="h-4 w-4" />}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => handleUseTemplate(previewTemplate.id)}
          isUsing={usingTemplate === previewTemplate.id}
        />
      )}
    </div>
  );
}

// Template Preview Modal Component
interface TemplatePreviewModalProps {
  template: TemplateWithQuestions;
  onClose: () => void;
  onUse: () => void;
  isUsing: boolean;
}

function TemplatePreviewModal({ template, onClose, onUse, isUsing }: TemplatePreviewModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      // Fetch template questions
      const response = await fetch(`/api/templates/${template.id}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      }
      setIsLoading(false);
    };
    loadQuestions();
  }, [template.id]);

  const getQuestionTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      rating: "⭐",
      scale: "📊",
      multiple_choice: "⚪",
      checkbox: "☑️",
      short_text: "📝",
      long_text: "📝",
      dropdown: "▼",
      date: "📅",
      file_upload: "📎",
      ranking: "🔢",
      matrix: "▦",
    };
    return icons[type] || "❓";
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      rating: "Rating",
      scale: "Scale",
      multiple_choice: "Multiple choice",
      checkbox: "Checkbox",
      short_text: "Short text",
      long_text: "Long text",
      dropdown: "Dropdown",
      date: "Date",
      file_upload: "File upload",
      ranking: "Ranking",
      matrix: "Matrix",
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{template.title}</h2>
            {template.description && (
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : questions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No questions in this template</p>
          ) : (
            <div className="space-y-4">
              {questions
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {index + 1}. {question.title}
                          {question.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getQuestionTypeLabel(question.type)}
                          {question.options && (question.options as unknown[]).length > 0 && (
                            <span> · {(question.options as unknown[]).length} options</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button
            fullWidth
            className="bg-[#FF6B35] hover:bg-[#E8551F]"
            onClick={onUse}
            isLoading={isUsing}
            leftIcon={<Copy className="h-4 w-4" />}
          >
            Use This Template
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Copy, Sparkles } from "lucide-react";
import { Button, Card, Spinner, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { getTemplates, useTemplate } from "@/actions/templates";
import { TEMPLATE_CATEGORIES } from "@/lib/constants/templates";
import type { Survey } from "@/types";

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<(Survey & { question_count?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null);

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

  const filteredTemplates = templates.filter((template) => {
    if (activeCategory === "all") return true;
    // For now, show all templates as we don't have category field
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Survey Templates</h1>
        <p className="text-gray-500 mt-1">
          Start with a pre-built template and customize it to your needs.
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onChange={setActiveCategory}>
        <TabsList>
          {TEMPLATE_CATEGORIES.slice(0, 4).map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No templates yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Templates will appear here once they&apos;re created. In the meantime, you can create a survey from scratch.
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push("/dashboard/surveys/create")}
          >
            Create Survey
          </Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} padding="none" hoverable>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {template.question_count || 0} questions
                    </p>
                  </div>
                </div>
                {template.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {template.description}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleUseTemplate(template.id)}
                  isLoading={usingTemplate === template.id}
                  leftIcon={<Copy className="h-4 w-4" />}
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

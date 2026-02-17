"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Share2,
  Play,
  Pause,
  Check,
  Settings,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Button, Badge, Spinner, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { QuestionBuilder, SurveySettingsPanel } from "@/components/survey";
import { getSurvey, updateSurvey, updateSurveyStatus } from "@/actions/surveys";
import { getQuestions } from "@/actions/questions";
import type { Survey, Question, SurveyStatus } from "@/types";

export default function SurveyEditPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("questions");

  // Title editing
  const [title, setTitle] = useState("");
  const [isTitleSaving, setIsTitleSaving] = useState(false);
  const [titleSaved, setTitleSaved] = useState(false);

  // Status updating
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadSurvey = useCallback(async () => {
    const data = await getSurvey(surveyId);
    if (data) {
      setSurvey(data);
      setTitle(data.title);
    }
  }, [surveyId]);

  const loadQuestions = useCallback(async () => {
    const data = await getQuestions(surveyId);
    setQuestions(data);
  }, [surveyId]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([loadSurvey(), loadQuestions()]);
      setIsLoading(false);
    };
    load();
  }, [loadSurvey, loadQuestions]);

  // Auto-save title
  useEffect(() => {
    if (!survey || title === survey.title) return;

    const timer = setTimeout(async () => {
      setIsTitleSaving(true);
      await updateSurvey(surveyId, { title });
      setIsTitleSaving(false);
      setTitleSaved(true);
      setTimeout(() => setTitleSaved(false), 2000);
      loadSurvey();
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, survey, surveyId, loadSurvey]);

  const handleStatusChange = async (status: SurveyStatus) => {
    setIsUpdatingStatus(true);
    await updateSurveyStatus(surveyId, status);
    await loadSurvey();
    setIsUpdatingStatus(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Survey not found
        </h2>
        <p className="text-gray-500 mb-6">
          This survey doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="-m-6 md:-m-8 min-h-screen bg-white">
      {/* Editor Header */}
      <div className="sticky top-0 z-20 h-14 px-4 md:px-6 border-b border-gray-200 bg-white flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/dashboard">
            <button className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>

          <div className="flex items-center gap-3 min-w-0 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-[#FF6B35] focus:outline-none px-1 py-0.5 max-w-md transition-colors"
              placeholder="Untitled Survey"
            />
            {isTitleSaving && (
              <span className="text-xs text-gray-400">Saving...</span>
            )}
            {titleSaved && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3 w-3" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Badge
            variant={survey.status as "draft" | "active" | "closed"}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {survey.status}
          </Badge>

          <Link href={`/s/${survey.share_slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </Link>

          <Link href={`/dashboard/surveys/${surveyId}/share`}>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Share2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </Link>

          {survey.status === "draft" && (
            <Button
              onClick={() => handleStatusChange("active")}
              isLoading={isUpdatingStatus}
              size="sm"
              className="bg-[#FF6B35] hover:bg-[#E8551F] text-white rounded-full px-4"
            >
              <Play className="h-4 w-4 mr-1" />
              Publish
            </Button>
          )}
          {survey.status === "active" && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange("closed")}
              isLoading={isUpdatingStatus}
              size="sm"
            >
              <Pause className="h-4 w-4 mr-1" />
              Close
            </Button>
          )}
          {survey.status === "closed" && (
            <Button
              onClick={() => handleStatusChange("active")}
              isLoading={isUpdatingStatus}
              size="sm"
              className="bg-[#FF6B35] hover:bg-[#E8551F] text-white"
            >
              <Play className="h-4 w-4 mr-1" />
              Reopen
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Left Content - Questions/Settings */}
        <div className="flex-1 min-w-0">
          {/* Tab Bar */}
          <div className="border-b border-gray-200 px-4 md:px-6 bg-white">
            <Tabs value={activeTab} onChange={setActiveTab}>
              <TabsList className="border-0 bg-transparent gap-0">
                <TabsTrigger
                  value="questions"
                  className="px-4 py-3 text-sm font-medium border-b-2 rounded-none data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Questions ({questions.length})
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="px-4 py-3 text-sm font-medium border-b-2 rounded-none data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35] data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-6 lg:p-8 bg-gray-50/50">
            <div className="max-w-3xl mx-auto">
              {activeTab === "questions" && (
                <QuestionBuilder
                  surveyId={surveyId}
                  questions={questions}
                  onQuestionsChange={loadQuestions}
                />
              )}
              {activeTab === "settings" && (
                <SurveySettingsPanel survey={survey} onUpdate={loadSurvey} />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Survey Stats */}
        <div className="hidden xl:block w-72 border-l border-gray-200 bg-[#FAFAFA] p-6">
          <div className="sticky top-20">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Survey Stats
            </h3>

            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">Questions</span>
                <span className="text-sm font-semibold text-gray-900">
                  {questions.length}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">Responses</span>
                <span className="text-sm font-semibold text-gray-900">
                  {(survey as Survey & { response_count?: number }).response_count || 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500">Status</span>
                <Badge variant={survey.status as "draft" | "active" | "closed"} size="sm">
                  {survey.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created
                </span>
                <span className="text-sm text-gray-700">
                  {new Date(survey.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated
                </span>
                <span className="text-sm text-gray-700">
                  {new Date(survey.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            {(survey as Survey & { response_count?: number }).response_count > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href={`/dashboard/surveys/${surveyId}/results`}>
                  <Button variant="outline" fullWidth size="sm" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

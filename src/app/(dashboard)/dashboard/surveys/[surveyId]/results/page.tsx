"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button, Card, Spinner, Badge } from "@/components/ui";
import { getSurvey } from "@/actions/surveys";
import {
  getSurveyAnalytics,
  getQuestionSummaries,
  getResponses,
  exportResponsesCSV,
  type SurveyStats,
  type QuestionSummary,
} from "@/actions/analytics";
import type { Survey, Response, Answer } from "@/types";

export default function ResultsPage() {
  const params = useParams();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [summaries, setSummaries] = useState<QuestionSummary[]>([]);
  const [responses, setResponses] = useState<(Response & { answers: Answer[] })[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [surveyData, statsData, summariesData, responsesData] = await Promise.all([
      getSurvey(surveyId),
      getSurveyAnalytics(surveyId),
      getQuestionSummaries(surveyId),
      getResponses(surveyId, { limit: 10 }),
    ]);
    setSurvey(surveyData);
    setStats(statsData);
    setSummaries(summariesData);
    setResponses(responsesData.responses);
    setTotalResponses(responsesData.total);
    setIsLoading(false);
  }, [surveyId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async () => {
    setIsExporting(true);
    const csv = await exportResponsesCSV(surveyId);
    if (csv) {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${survey?.title || "survey"}-responses.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setIsExporting(false);
  };

  const toggleResponse = (responseId: string) => {
    const newExpanded = new Set(expandedResponses);
    if (newExpanded.has(responseId)) {
      newExpanded.delete(responseId);
    } else {
      newExpanded.add(responseId);
    }
    setExpandedResponses(newExpanded);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
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
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/surveys/${surveyId}/edit`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Results</h1>
            <p className="text-gray-500">{survey.title}</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          isLoading={isExporting}
          leftIcon={<Download className="h-4 w-4" />}
          disabled={totalResponses === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFF5F0] flex items-center justify-center">
              <Users className="h-5 w-5 text-[#FF6B35]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalResponses || 0}
              </p>
              <p className="text-sm text-gray-500">Total Responses</p>
            </div>
          </div>
        </Card>
        <Card padding="md" className="bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.completedResponses || 0}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </Card>
        <Card padding="md" className="bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.completionRate ? `${Math.round(stats.completionRate)}%` : "0%"}
              </p>
              <p className="text-sm text-gray-500">Completion Rate</p>
            </div>
          </div>
        </Card>
        <Card padding="md" className="bg-white border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.averageTime ? formatDuration(stats.averageTime) : "-"}
              </p>
              <p className="text-sm text-gray-500">Avg. Time</p>
            </div>
          </div>
        </Card>
      </div>

      {totalResponses === 0 ? (
        <Card padding="lg" className="text-center py-16 bg-white border border-gray-200">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FFF5F0] flex items-center justify-center mb-6">
            <BarChart3 className="h-8 w-8 text-[#FF6B35]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No responses yet
          </h3>
          <p className="text-gray-500 mb-6">
            Share your survey to start collecting responses.
          </p>
          <Link href={`/dashboard/surveys/${surveyId}/share`}>
            <Button className="bg-[#FF6B35] hover:bg-[#E8551F]">Share Survey</Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Question Summaries */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Question Breakdown
            </h2>
            <div className="space-y-4">
              {summaries.map((summary) => (
                <Card key={summary.questionId} padding="md" className="bg-white border border-gray-200">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {summary.questionTitle}
                      </h3>
                      <Badge variant="draft" size="sm" className="bg-gray-100 text-gray-600">
                        {summary.questionType.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {summary.responseCount} responses
                    </p>
                  </div>
                  {summary.answers.length > 0 ? (
                    <div className="space-y-2">
                      {summary.answers.slice(0, 10).map((answer, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-900 truncate max-w-[70%]">
                                {answer.value || "(empty)"}
                              </span>
                              <span className="text-sm text-gray-500">
                                {answer.count} ({Math.round(answer.percentage)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#FF6B35] rounded-full transition-all"
                                style={{ width: `${answer.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {summary.answers.length > 10 && (
                        <p className="text-sm text-gray-500">
                          +{summary.answers.length - 10} more responses
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No responses for this question</p>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Individual Responses */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Individual Responses ({totalResponses})
            </h2>
            <div className="space-y-3">
              {responses.map((response) => (
                <Card key={response.id} padding="none" className="bg-white border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleResponse(response.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {response.respondent_email || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(response.completed_at || response.created_at).toLocaleString()}
                      </p>
                    </div>
                    {expandedResponses.has(response.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedResponses.has(response.id) && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-3">
                        {summaries.map((summary) => {
                          const answer = response.answers.find(
                            (a) => a.question_id === summary.questionId
                          );
                          return (
                            <div key={summary.questionId}>
                              <p className="text-sm font-medium text-gray-500">
                                {summary.questionTitle}
                              </p>
                              <p className="text-gray-900">
                                {answer?.value
                                  ? typeof answer.value === "object"
                                    ? JSON.stringify(answer.value)
                                    : String(answer.value)
                                  : "-"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

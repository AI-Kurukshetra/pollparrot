"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, X, FileText, Sparkles, Wifi, WifiOff } from "lucide-react";
import { Button, Card, Input, Tabs, TabsList, TabsTrigger, Spinner } from "@/components/ui";
import { SurveyCard } from "@/components/survey";
import { useSurveys } from "@/hooks/useSurveys";
import { useRealtimeResponses, useHasRecentUpdate } from "@/hooks/useRealtimeResponses";
import { quickCreateSurvey } from "@/actions/surveys";
import { useUser } from "@/hooks/useUser";

const statusTabs = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "active", label: "Active" },
  { id: "closed", label: "Closed" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useUser();
  const { surveys, isLoading, refetch } = useSurveys();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [realtimeCounts, setRealtimeCounts] = useState<Map<string, number>>(new Map());

  // Get survey IDs for realtime subscription
  const surveyIds = useMemo(() => surveys.map((s) => s.id), [surveys]);

  // Subscribe to realtime response updates
  const { recentUpdates, isConnected } = useRealtimeResponses(surveyIds);

  // Track additional responses that arrived via realtime
  useEffect(() => {
    recentUpdates.forEach((timestamp, surveyId) => {
      setRealtimeCounts((prev) => {
        const next = new Map(prev);
        const current = next.get(surveyId) || 0;
        next.set(surveyId, current + 1);
        return next;
      });
    });
  }, [recentUpdates]);

  // Clear realtime counts when surveys are refetched
  const handleRefetch = useCallback(() => {
    setRealtimeCounts(new Map());
    refetch();
  }, [refetch]);

  const handleCreateSurvey = async () => {
    setIsCreating(true);
    const result = await quickCreateSurvey();
    if (result?.id) {
      router.push(`/dashboard/surveys/${result.id}/edit`);
    }
    setIsCreating(false);
  };

  // Filter surveys based on search and status
  const filteredSurveys = useMemo(() => {
    return surveys.filter((survey) => {
      // Filter by status
      if (activeTab !== "all" && survey.status !== activeTab) {
        return false;
      }
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          survey.title?.toLowerCase().includes(query) ||
          survey.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [surveys, activeTab, searchQuery]);

  // Count surveys by status
  const statusCounts = useMemo(() => {
    return {
      all: surveys.length,
      draft: surveys.filter((s) => s.status === "draft").length,
      active: surveys.filter((s) => s.status === "active").length,
      closed: surveys.filter((s) => s.status === "closed").length,
    };
  }, [surveys]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your surveys and track responses.
          </p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleCreateSurvey}
          isLoading={isCreating}
          className="shrink-0"
        >
          Create Survey
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={
              searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
          />
        </div>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsList>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label} ({statusCounts[tab.id as keyof typeof statusCounts]})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filteredSurveys.length === 0 ? (
        <EmptyState
          hasSearchQuery={!!searchQuery}
          hasStatusFilter={activeTab !== "all"}
          onClearFilters={() => {
            setSearchQuery("");
            setActiveTab("all");
          }}
          onCreateSurvey={handleCreateSurvey}
          isCreating={isCreating}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSurveys.map((survey) => (
            <SurveyCardWithRealtime
              key={survey.id}
              survey={survey}
              onUpdate={handleRefetch}
              recentUpdates={recentUpdates}
              additionalResponses={realtimeCounts.get(survey.id) || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  hasSearchQuery: boolean;
  hasStatusFilter: boolean;
  onClearFilters: () => void;
  onCreateSurvey: () => void;
  isCreating: boolean;
}

function EmptyState({
  hasSearchQuery,
  hasStatusFilter,
  onClearFilters,
  onCreateSurvey,
  isCreating,
}: EmptyStateProps) {
  if (hasSearchQuery || hasStatusFilter) {
    return (
      <Card padding="lg" className="text-center py-16">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No surveys found</h3>
        <p className="mt-2 text-gray-500 max-w-sm mx-auto">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
        <Button variant="outline" className="mt-6" onClick={onClearFilters}>
          Clear filters
        </Button>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="text-center py-16">
      <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">
        Create your first survey
      </h3>
      <p className="mt-2 text-gray-500 max-w-md mx-auto">
        Build beautiful surveys in minutes. Choose from 11 question types and
        start collecting valuable feedback today.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={onCreateSurvey}
          isLoading={isCreating}
        >
          Create Survey
        </Button>
        <Link href="/dashboard/templates">
          <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />}>
            Browse Templates
          </Button>
        </Link>
      </div>
    </Card>
  );
}

// Wrapper component to handle realtime updates for individual survey cards
interface SurveyCardWithRealtimeProps {
  survey: Parameters<typeof SurveyCard>[0]["survey"];
  onUpdate?: () => void;
  recentUpdates: Map<string, number>;
  additionalResponses: number;
}

function SurveyCardWithRealtime({
  survey,
  onUpdate,
  recentUpdates,
  additionalResponses,
}: SurveyCardWithRealtimeProps) {
  const hasRecentResponse = useHasRecentUpdate(survey.id, recentUpdates, 5000);

  return (
    <SurveyCard
      survey={survey}
      onUpdate={onUpdate}
      hasRecentResponse={hasRecentResponse}
      additionalResponses={additionalResponses}
    />
  );
}

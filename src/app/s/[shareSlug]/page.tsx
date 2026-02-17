import { notFound } from "next/navigation";
import { getSurveyBySlug, checkSurveyAcceptsResponses } from "@/actions/responses";
import { SurveyRenderer } from "@/components/survey/SurveyRenderer";
import { Card, Button } from "@/components/ui";
import Link from "next/link";
import { AlertCircle, Clock, Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ shareSlug: string }>;
}

export default async function PublicSurveyPage({ params }: PageProps) {
  const { shareSlug } = await params;

  const survey = await getSurveyBySlug(shareSlug);

  if (!survey) {
    notFound();
  }

  // Check if survey accepts responses
  const { accepts, reason } = await checkSurveyAcceptsResponses(survey.id);

  if (!accepts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card padding="lg" className="max-w-md text-center bg-white shadow-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-6">
            {survey.status === "draft" ? (
              <Clock className="h-8 w-8 text-amber-500" />
            ) : survey.status === "closed" ? (
              <Lock className="h-8 w-8 text-amber-500" />
            ) : (
              <AlertCircle className="h-8 w-8 text-amber-500" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {survey.status === "draft"
              ? "Survey Not Published"
              : survey.status === "closed"
              ? "Survey Closed"
              : "Survey Unavailable"}
          </h1>
          <p className="text-gray-600 mb-6">
            {reason || "This survey is not currently accepting responses."}
          </p>
          <Link href="/">
            <Button variant="outline">Go to PollParrot</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Check if survey has questions
  if (!survey.questions || survey.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card padding="lg" className="max-w-md text-center bg-white shadow-lg">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            No Questions Yet
          </h1>
          <p className="text-gray-600 mb-6">
            This survey doesn&apos;t have any questions yet. Please check back later.
          </p>
          <Link href="/">
            <Button variant="outline">Go to PollParrot</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4">
      <SurveyRenderer survey={survey} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { shareSlug } = await params;
  const survey = await getSurveyBySlug(shareSlug);

  if (!survey) {
    return {
      title: "Survey Not Found",
    };
  }

  return {
    title: `${survey.title} | PollParrot`,
    description: survey.description || "Complete this survey on PollParrot",
  };
}

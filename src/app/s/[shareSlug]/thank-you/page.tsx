import { getSurveyBySlug } from "@/actions/responses";
import { Card, Button } from "@/components/ui";
import Link from "next/link";
import { CheckCircle, PartyPopper } from "lucide-react";
import type { SurveySettings } from "@/types";

interface PageProps {
  params: Promise<{ shareSlug: string }>;
}

export default async function ThankYouPage({ params }: PageProps) {
  const { shareSlug } = await params;
  const survey = await getSurveyBySlug(shareSlug);

  const settings = (survey?.settings as unknown as SurveySettings) || {};
  const completionMessage =
    settings.completionMessage || "Thank you for completing this survey!";

  // Handle redirect URL if set
  if (settings.redirectUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card padding="lg" className="max-w-md text-center bg-white shadow-lg">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Response Submitted!
          </h1>
          <p className="text-gray-600 mb-6">{completionMessage}</p>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting you in a moment...
          </p>
          <meta httpEquiv="refresh" content={`3;url=${settings.redirectUrl}`} />
          <a href={settings.redirectUrl}>
            <Button>Continue</Button>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card padding="lg" className="max-w-md text-center bg-white shadow-lg">
        <div className="mx-auto w-20 h-20 rounded-full bg-[#FFF5F0] flex items-center justify-center mb-6">
          <PartyPopper className="h-10 w-10 text-[#FF6B35]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Thank You!
        </h1>
        <p className="text-gray-600 mb-8 text-lg">{completionMessage}</p>

        <div className="space-y-3">
          {survey?.status === "active" && (
            <Link href={`/s/${shareSlug}`}>
              <Button variant="outline" className="w-full">
                Submit Another Response
              </Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="ghost" className="w-full">
              Visit PollParrot
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Want to create your own surveys?
          </p>
          <Link href="/signup">
            <Button variant="outline" size="sm" className="mt-2">
              Get Started Free
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { shareSlug } = await params;
  const survey = await getSurveyBySlug(shareSlug);

  return {
    title: `Thank You | ${survey?.title || "Survey"} | PollParrot`,
  };
}

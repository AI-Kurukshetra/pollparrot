"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  Mail,
  Link2,
  QrCode,
  Code,
  ExternalLink,
} from "lucide-react";
import { Button, Card, Input, Spinner } from "@/components/ui";
import { getSurvey } from "@/actions/surveys";
import type { Survey } from "@/types";

export default function ShareSurveyPage() {
  const params = useParams();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getSurvey(surveyId);
      setSurvey(data);
      setIsLoading(false);
    };
    load();
  }, [surveyId]);

  const surveyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/s/${survey?.share_slug}`
    : "";

  const embedCode = `<iframe src="${surveyUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
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
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Survey not found
        </h2>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/dashboard/surveys/${surveyId}/edit`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Share Survey</h1>
          <p className="text-text-muted">{survey.title}</p>
        </div>
      </div>

      {/* Warning if draft */}
      {survey.status === "draft" && (
        <Card padding="md" className="mb-6 border-warning bg-warning/10">
          <div className="flex items-start gap-3">
            <div className="text-warning text-lg">!</div>
            <div>
              <h3 className="font-semibold text-text-primary">Survey is in draft mode</h3>
              <p className="text-sm text-text-muted mt-1">
                Publish your survey to allow responses. People can preview it but won&apos;t be able to submit responses.
              </p>
              <Link href={`/dashboard/surveys/${surveyId}/edit`}>
                <Button size="sm" className="mt-3">
                  Publish Survey
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {/* Direct Link */}
        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">Direct Link</h3>
              <p className="text-sm text-text-muted mb-4">
                Share this link directly with your audience
              </p>
              <div className="flex gap-2">
                <Input
                  value={surveyUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyLink} variant="outline">
                  {copiedLink ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Link href={`/s/${survey.share_slug}`} target="_blank">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Email */}
        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">Share via Email</h3>
              <p className="text-sm text-text-muted mb-4">
                Send survey invitations via email
              </p>
              <a
                href={`mailto:?subject=${encodeURIComponent(`Please complete this survey: ${survey.title}`)}&body=${encodeURIComponent(`Hi,\n\nI'd like to invite you to complete this survey:\n\n${surveyUrl}\n\nThank you!`)}`}
              >
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Open Email Client
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* Embed Code */}
        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">Embed on Website</h3>
              <p className="text-sm text-text-muted mb-4">
                Embed this survey directly on your website
              </p>
              <div className="flex gap-2">
                <Input
                  value={embedCode}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyEmbed} variant="outline">
                  {copiedEmbed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Code (placeholder) */}
        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary mb-1">QR Code</h3>
              <p className="text-sm text-text-muted mb-4">
                Download a QR code for print materials
              </p>
              <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center border border-border">
                <div className="text-center text-text-muted">
                  <QrCode className="h-16 w-16 mx-auto mb-2" />
                  <span className="text-xs">QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

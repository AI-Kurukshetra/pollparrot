"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui";
import { quickCreateSurvey } from "@/actions/surveys";

export default function CreateSurveyPage() {
  const router = useRouter();
  const hasCreated = useRef(false);

  useEffect(() => {
    if (hasCreated.current) return;
    hasCreated.current = true;

    const createAndRedirect = async () => {
      const result = await quickCreateSurvey();
      if (result?.id) {
        router.replace(`/dashboard/surveys/${result.id}/edit`);
      } else {
        router.replace("/dashboard");
      }
    };

    createAndRedirect();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="lg" />
      <p className="text-text-muted">Creating your survey...</p>
    </div>
  );
}

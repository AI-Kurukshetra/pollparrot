"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, ProgressBar, Card } from "@/components/ui";
import { getQuestionRenderer } from "./QuestionTypes";
import { createResponse, submitResponse } from "@/actions/responses";
import type { Survey, Question, SurveySettings, QuestionType } from "@/types";

interface SurveyRendererProps {
  survey: Survey & { questions: Question[] };
}

export function SurveyRenderer({ survey }: SurveyRendererProps) {
  const router = useRouter();
  const questions = survey.questions || [];
  const settings = (survey.settings as unknown as SurveySettings) || {};

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [respondentEmail, setRespondentEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculate progress
  const progress = useMemo(() => {
    const answeredCount = Object.keys(answers).filter(
      (key) => answers[key] !== undefined && answers[key] !== "" && answers[key] !== null
    ).length;
    return questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  }, [answers, questions.length]);

  const updateAnswer = useCallback((questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user starts answering
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  }, []);

  const validateResponses = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Validate required questions
    for (const question of questions) {
      if (question.is_required) {
        const answer = answers[question.id];
        if (answer === undefined || answer === null || answer === "" ||
            (Array.isArray(answer) && answer.length === 0)) {
          newErrors[question.id] = "This question is required";
        }
      }
    }

    // Validate email if required
    if (settings.requireEmail && !respondentEmail) {
      newErrors["email"] = "Email is required";
    } else if (respondentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondentEmail)) {
      newErrors["email"] = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [questions, answers, settings.requireEmail, respondentEmail]);

  const handleSubmit = async () => {
    if (!validateResponses()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.getElementById(`question_${firstErrorKey}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create response record
      const responseResult = await createResponse(survey.id);
      if (!responseResult) {
        throw new Error("Failed to create response");
      }

      // Submit all answers
      const submitResult = await submitResponse(
        responseResult.id,
        survey.id,
        answers,
        respondentEmail || undefined
      );

      if (!submitResult.success) {
        throw new Error(submitResult.message || "Failed to submit response");
      }

      // Redirect to thank you page
      router.push(`/s/${survey.share_slug}/thank-you`);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(error instanceof Error ? error.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {survey.title}
        </h1>
        {survey.description && (
          <p className="text-gray-600 text-lg">{survey.description}</p>
        )}
      </div>

      {/* Progress bar */}
      {settings.showProgressBar !== false && questions.length > 0 && (
        <div className="mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6B35] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Email collection */}
      {settings.requireEmail && (
        <Card padding="md" className="mb-6 bg-white shadow-sm border border-gray-200">
          <label className="block">
            <span className="text-sm font-medium text-gray-900">
              Email Address <span className="text-red-500">*</span>
            </span>
            <Input
              type="email"
              value={respondentEmail}
              onChange={(e) => {
                setRespondentEmail(e.target.value);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors["email"];
                  return newErrors;
                });
              }}
              placeholder="your@email.com"
              className={`mt-1.5 ${errors["email"] ? "border-red-500" : ""}`}
            />
            {errors["email"] && (
              <p className="text-sm text-red-500 mt-1">{errors["email"]}</p>
            )}
          </label>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const QuestionComponent = getQuestionRenderer(question.type as QuestionType);
          const questionNumber = settings.showQuestionNumbers !== false ? index + 1 : null;

          return (
            <Card
              key={question.id}
              id={`question_${question.id}`}
              padding="lg"
              className={`bg-white shadow-sm transition-all duration-200 ${
                errors[question.id]
                  ? "border-red-500 border-2"
                  : "border border-gray-200 hover:shadow-md"
              }`}
            >
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {questionNumber && (
                    <span className="text-[#FF6B35] mr-2">Q{questionNumber}.</span>
                  )}
                  {question.title}
                  {question.is_required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </h3>
                {question.description && (
                  <p className="text-gray-500 mt-1">{question.description}</p>
                )}
              </div>

              <QuestionComponent
                question={question}
                value={answers[question.id]}
                onChange={(value) => updateAnswer(question.id, value)}
                error={errors[question.id]}
                disabled={isSubmitting}
              />
            </Card>
          );
        })}
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
          {submitError}
        </div>
      )}

      {/* Submit button */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="px-12 bg-[#FF6B35] hover:bg-[#E8551F] text-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          Submit Response
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Powered by{" "}
          <a href="/" className="text-[#FF6B35] hover:underline font-medium">
            PollParrot
          </a>
        </p>
      </div>
    </div>
  );
}

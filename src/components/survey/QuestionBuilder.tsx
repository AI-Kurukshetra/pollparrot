"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";
import { QuestionTypeSelector } from "./QuestionTypeSelector";
import { createQuestion } from "@/actions/questions";
import type { Question, QuestionType } from "@/types";

interface QuestionBuilderProps {
  surveyId: string;
  questions: Question[];
  onQuestionsChange: () => void;
}

export function QuestionBuilder({
  surveyId,
  questions,
  onQuestionsChange,
}: QuestionBuilderProps) {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddQuestion = async (type: QuestionType) => {
    setIsCreating(true);
    setShowTypeSelector(false);
    await createQuestion(surveyId, {
      type,
      title: "Untitled Question",
    });
    onQuestionsChange();
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      {questions.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#FFF5F0] flex items-center justify-center mb-6">
            <Plus className="h-8 w-8 text-[#FF6B35]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Add your first question
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Choose from 11 different question types to build your survey. Your respondents will love it!
          </p>

          <div className="relative inline-block">
            <button
              onClick={() => setShowTypeSelector(true)}
              disabled={isCreating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#E8551F] text-white font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
              Add Question
            </button>
            {showTypeSelector && (
              <QuestionTypeSelector
                onSelect={handleAddQuestion}
                onClose={() => setShowTypeSelector(false)}
              />
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Question list */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                surveyId={surveyId}
                index={index}
                totalQuestions={questions.length}
                onUpdate={onQuestionsChange}
                onDelete={onQuestionsChange}
              />
            ))}
          </div>

          {/* Add question button */}
          <div className="relative">
            <button
              onClick={() => setShowTypeSelector(true)}
              disabled={isCreating}
              className="w-full p-4 bg-gray-50 hover:bg-[#FFF5F0] border-2 border-dashed border-gray-200 hover:border-[#FFB08A] rounded-xl text-center cursor-pointer transition-all duration-200 group disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-5 w-5 text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
                <span className="text-sm font-medium text-gray-500 group-hover:text-[#FF6B35] transition-colors">
                  {isCreating ? "Adding..." : "Add Question"}
                </span>
              </div>
            </button>
            {showTypeSelector && (
              <QuestionTypeSelector
                onSelect={handleAddQuestion}
                onClose={() => setShowTypeSelector(false)}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

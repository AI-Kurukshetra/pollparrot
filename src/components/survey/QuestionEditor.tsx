"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  GripVertical,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  MoreHorizontal,
  Check,
  Settings,
} from "lucide-react";
import { Switch } from "@/components/ui";
import { QUESTION_TYPE_OPTIONS } from "./QuestionTypeSelector";
import { getQuestionEditor } from "./QuestionTypes";
import { updateQuestion, deleteQuestion, moveQuestionUp, moveQuestionDown } from "@/actions/questions";
import type { Question, QuestionType, Json } from "@/types";

interface QuestionEditorProps {
  question: Question;
  surveyId: string;
  index: number;
  totalQuestions: number;
  onUpdate: () => void;
  onDelete: () => void;
}

export function QuestionEditor({
  question,
  surveyId,
  index,
  totalQuestions,
  onUpdate,
  onDelete,
}: QuestionEditorProps) {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description || "");
  const [isRequired, setIsRequired] = useState(question.is_required);
  const [settings, setSettings] = useState<Json>(question.settings || {});
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const questionTypeOption = QUESTION_TYPE_OPTIONS.find((t) => t.type === question.type);
  const QuestionEditorComponent = getQuestionEditor(question.type as QuestionType);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle card focus/active state
  useEffect(() => {
    const handleClickOutsideCard = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideCard);
    return () => document.removeEventListener("mousedown", handleClickOutsideCard);
  }, []);

  // Debounced auto-save
  const saveChanges = useCallback(async () => {
    const hasChanges =
      title !== question.title ||
      description !== (question.description || "") ||
      isRequired !== question.is_required ||
      JSON.stringify(settings) !== JSON.stringify(question.settings || {});

    if (!hasChanges) return;

    setIsSaving(true);
    await updateQuestion(question.id, {
      title,
      description: description || null,
      is_required: isRequired,
      settings: settings,
    });
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onUpdate();
  }, [title, description, isRequired, settings, question, onUpdate]);

  // Auto-save after 1 second of no changes
  useEffect(() => {
    const timer = setTimeout(() => {
      saveChanges();
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, description, isRequired, settings, saveChanges]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteQuestion(question.id);
    onDelete();
  };

  const handleMoveUp = async () => {
    setShowMenu(false);
    await moveQuestionUp(surveyId, question.id);
    onUpdate();
  };

  const handleMoveDown = async () => {
    setShowMenu(false);
    await moveQuestionDown(surveyId, question.id);
    onUpdate();
  };

  const handleSettingsChange = (newSettings: Json) => {
    setSettings(newSettings);
  };

  // Check if this question type needs options/settings editor
  const needsOptionsEditor = [
    "multiple_choice",
    "checkbox",
    "dropdown",
    "rating",
    "scale",
    "ranking",
    "matrix",
  ].includes(question.type);

  return (
    <div
      ref={cardRef}
      onClick={() => setIsActive(true)}
      className={`
        bg-white rounded-xl border shadow-sm
        transition-all duration-200
        hover:shadow-md
        ${isActive ? "border-[#FF6B35] border-2 shadow-md" : "border-gray-200"}
      `}
    >
      <div className="flex">
        {/* Drag handle */}
        <div className="flex items-center justify-center w-8 rounded-l-xl bg-gray-50/80 border-r border-gray-100 cursor-grab hover:bg-[#FFF5F0] transition-colors group">
          <GripVertical className="h-4 w-4 text-gray-300 group-hover:text-[#FF6B35] transition-colors" />
        </div>

        {/* Question content */}
        <div className="flex-1 p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              {/* Question number badge */}
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#FFF5F0] text-[#FF6B35] font-semibold text-sm">
                {index + 1}
              </span>
              {/* Question type indicator */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-500">
                <span className="[&>svg]:w-3.5 [&>svg]:h-3.5">{questionTypeOption?.icon}</span>
                <span className="font-medium">{questionTypeOption?.label}</span>
              </div>
              {/* Save status */}
              {isSaving && (
                <span className="text-xs text-gray-400 animate-pulse">Saving...</span>
              )}
              {isSaved && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" /> Saved
                </span>
              )}
            </div>

            {/* Actions menu */}
            <div ref={menuRef} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl border border-gray-200 bg-white shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    onClick={handleMoveUp}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                    Move Up
                  </button>
                  <button
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    onClick={handleMoveDown}
                    disabled={index === totalQuestions - 1}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                    Move Down
                  </button>
                  <button
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                    Duplicate
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Question inputs */}
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your question"
              className="w-full text-base font-medium text-gray-900 placeholder-gray-400 bg-transparent border-0 border-b-2 border-transparent focus:border-[#FF6B35] focus:outline-none px-0 py-1.5 transition-colors"
            />

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className="w-full text-sm text-gray-600 placeholder-gray-400 bg-transparent border-0 border-b border-transparent hover:border-gray-200 focus:border-gray-300 focus:outline-none px-0 py-1 transition-colors"
            />
          </div>

          {/* Question Type Editor (Options/Settings) */}
          {needsOptionsEditor && (
            <div className="mt-5">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-3"
              >
                <Settings className="h-4 w-4" />
                {showSettings ? "Hide" : "Show"} Options
              </button>

              {showSettings && (
                <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100">
                  <QuestionEditorComponent
                    question={{ ...question, settings }}
                    onSettingsChange={handleSettingsChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* Footer bar */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
              />
              <span className="text-sm text-gray-600">Required</span>
            </div>

            {/* Quick actions */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
              title="Delete question"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

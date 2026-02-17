"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  MoreVertical,
  Edit,
  Eye,
  Share2,
  Copy,
  Trash2,
  Play,
  Pause,
} from "lucide-react";
import { Card, Badge, Button, Modal } from "@/components/ui";
import { deleteSurvey, duplicateSurvey, updateSurveyStatus } from "@/actions/surveys";
import type { Survey, SurveyStatus } from "@/types";

interface SurveyCardProps {
  survey: Survey & { question_count?: number; response_count?: number };
  onUpdate?: () => void;
  hasRecentResponse?: boolean;
  additionalResponses?: number;
}

function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export function SurveyCard({ survey, onUpdate, hasRecentResponse = false, additionalResponses = 0 }: SurveyCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteSurvey(survey.id);
    setIsDeleting(false);
    setShowDeleteModal(false);
    if (result.success && onUpdate) {
      onUpdate();
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    setShowMenu(false);
    await duplicateSurvey(survey.id);
    setIsDuplicating(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleStatusChange = async (status: SurveyStatus) => {
    setIsUpdatingStatus(true);
    setShowMenu(false);
    await updateSurveyStatus(survey.id, status);
    setIsUpdatingStatus(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <>
      <Card
        hoverable
        padding="none"
        className="group relative overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
      >
        <Link href={`/dashboard/surveys/${survey.id}/edit`} className="block p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                {survey.title || "Untitled Survey"}
              </h3>
              {survey.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {survey.description}
                </p>
              )}
            </div>
            <Badge variant={survey.status as "draft" | "active" | "closed"}>
              {survey.status}
            </Badge>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{survey.question_count || 0} questions</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors ${hasRecentResponse ? "text-success" : ""}`}>
              <Users className={`h-4 w-4 ${hasRecentResponse ? "animate-pulse" : ""}`} />
              <span>
                {(survey.response_count || 0) + additionalResponses} responses
                {hasRecentResponse && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-success/20 text-success rounded">
                    New!
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Updated {formatRelativeTime(survey.updated_at)}
            </span>
          </div>
        </Link>

        {/* Actions menu button */}
        <div
          className="absolute top-4 right-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
              disabled={isUpdatingStatus || isDuplicating}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {/* Menu dropdown */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-lg border border-gray-200 bg-white shadow-lg py-1">
                  <Link
                    href={`/dashboard/surveys/${survey.id}/edit`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                  <Link
                    href={`/s/${survey.share_slug}`}
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Link>
                  <Link
                    href={`/dashboard/surveys/${survey.id}/share`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Link>

                  <div className="border-t border-gray-200 my-1" />

                  {survey.status === "draft" && (
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleStatusChange("active")}
                    >
                      <Play className="h-4 w-4" />
                      Publish
                    </button>
                  )}
                  {survey.status === "active" && (
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleStatusChange("closed")}
                    >
                      <Pause className="h-4 w-4" />
                      Close Survey
                    </button>
                  )}
                  {survey.status === "closed" && (
                    <button
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleStatusChange("active")}
                    >
                      <Play className="h-4 w-4" />
                      Reopen
                    </button>
                  )}
                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full text-left"
                    onClick={handleDuplicate}
                    disabled={isDuplicating}
                  >
                    <Copy className="h-4 w-4" />
                    {isDuplicating ? "Duplicating..." : "Duplicate"}
                  </button>

                  <div className="border-t border-gray-200 my-1" />

                  <button
                    className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 w-full text-left"
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Survey"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              {survey.title || "this survey"}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

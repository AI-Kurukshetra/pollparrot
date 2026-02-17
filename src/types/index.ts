/**
 * PollParrot Application Types
 *
 * Shared TypeScript types derived from database schema.
 * Use these throughout the application for type safety.
 */

import type { Database } from "./database";

// ============================================
// Database Table Types (Row types)
// ============================================

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Survey = Database["public"]["Tables"]["surveys"]["Row"];
export type SurveyInsert = Database["public"]["Tables"]["surveys"]["Insert"];
export type SurveyUpdate = Database["public"]["Tables"]["surveys"]["Update"];

export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type QuestionInsert = Database["public"]["Tables"]["questions"]["Insert"];
export type QuestionUpdate = Database["public"]["Tables"]["questions"]["Update"];

export type Response = Database["public"]["Tables"]["responses"]["Row"];
export type ResponseInsert = Database["public"]["Tables"]["responses"]["Insert"];
export type ResponseUpdate = Database["public"]["Tables"]["responses"]["Update"];

export type Answer = Database["public"]["Tables"]["answers"]["Row"];
export type AnswerInsert = Database["public"]["Tables"]["answers"]["Insert"];
export type AnswerUpdate = Database["public"]["Tables"]["answers"]["Update"];

export type SurveyCollaborator = Database["public"]["Tables"]["survey_collaborators"]["Row"];
export type SurveyCollaboratorInsert = Database["public"]["Tables"]["survey_collaborators"]["Insert"];
export type SurveyCollaboratorUpdate = Database["public"]["Tables"]["survey_collaborators"]["Update"];

// ============================================
// Question Types
// ============================================

export const QUESTION_TYPES = [
  "short_text",
  "long_text",
  "multiple_choice",
  "checkbox",
  "dropdown",
  "rating",
  "scale",
  "date",
  "file_upload",
  "ranking",
  "matrix",
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

// ============================================
// Survey Status Types
// ============================================

export const SURVEY_STATUSES = ["draft", "active", "paused", "closed"] as const;
export type SurveyStatus = (typeof SURVEY_STATUSES)[number];

// ============================================
// Collaborator Role Types
// ============================================

export const COLLABORATOR_ROLES = ["viewer", "editor", "admin"] as const;
export type CollaboratorRole = (typeof COLLABORATOR_ROLES)[number];

// ============================================
// Plan Types
// ============================================

export const PLAN_TYPES = ["free", "pro", "enterprise"] as const;
export type PlanType = (typeof PLAN_TYPES)[number];

// ============================================
// Survey Settings Type
// ============================================

export interface SurveySettings {
  allowAnonymous: boolean;
  requireEmail: boolean;
  showProgressBar: boolean;
  shuffleQuestions: boolean;
  oneQuestionPerPage: boolean;
  allowBackNavigation: boolean;
  showQuestionNumbers: boolean;
  completionMessage: string;
  redirectUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  maxResponses: number | null;
}

// ============================================
// Question Settings Types (by question type)
// ============================================

export interface BaseQuestionSettings {
  placeholder?: string | null;
}

export interface TextQuestionSettings extends BaseQuestionSettings {
  minLength?: number | null;
  maxLength?: number | null;
}

export interface NumberQuestionSettings extends BaseQuestionSettings {
  minValue?: number | null;
  maxValue?: number | null;
}

export interface ScaleQuestionSettings extends NumberQuestionSettings {
  minLabel?: string | null;
  maxLabel?: string | null;
}

export interface ChoiceQuestionSettings extends BaseQuestionSettings {
  allowOther?: boolean;
}

export interface FileQuestionSettings {
  allowedFileTypes?: string[] | null;
  maxFileSize?: number | null; // in bytes
}

export interface MatrixQuestionSettings {
  rows?: string[] | null;
  columns?: string[] | null;
}

export type QuestionSettings =
  | TextQuestionSettings
  | NumberQuestionSettings
  | ScaleQuestionSettings
  | ChoiceQuestionSettings
  | FileQuestionSettings
  | MatrixQuestionSettings;

// ============================================
// Question Option Type
// ============================================

export interface QuestionOption {
  id: string;
  label: string;
  value?: string;
}

// ============================================
// Extended Types (with relations)
// ============================================

export interface SurveyWithQuestions extends Survey {
  questions: Question[];
}

export interface SurveyWithStats extends Survey {
  stats?: {
    totalResponses: number;
    completedResponses: number;
    completionRate: number;
  };
}

export interface ResponseWithAnswers extends Response {
  answers: Answer[];
}

export interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

// ============================================
// Auth Types
// ============================================

export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Form State Types
// ============================================

export interface FormState {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: Record<string, unknown>;
}

// ============================================
// Re-export database types
// ============================================

export type { Database } from "./database";
export type Json = Database["public"]["Tables"]["answers"]["Row"]["value"];

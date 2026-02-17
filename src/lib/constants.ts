/**
 * PollParrot Application Constants
 *
 * Centralized constants for plan limits, question types, and configuration.
 */

import type { PlanType, QuestionType, SurveySettings, SurveyStatus } from "@/types";

// ============================================
// Plan Limits
// ============================================

export interface PlanLimits {
  maxSurveys: number | null; // null = unlimited
  maxQuestionsPerSurvey: number | null;
  maxResponsesPerSurvey: number | null;
  maxCollaborators: number;
  canExportData: boolean;
  canRemoveBranding: boolean;
  canUseCustomDomain: boolean;
  canAccessAnalytics: boolean;
  canUseTemplates: boolean;
  storageLimit: number; // in MB
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxSurveys: 3,
    maxQuestionsPerSurvey: 10,
    maxResponsesPerSurvey: 100,
    maxCollaborators: 0,
    canExportData: false,
    canRemoveBranding: false,
    canUseCustomDomain: false,
    canAccessAnalytics: false,
    canUseTemplates: true,
    storageLimit: 100, // 100 MB
  },
  pro: {
    maxSurveys: null,
    maxQuestionsPerSurvey: 50,
    maxResponsesPerSurvey: 10000,
    maxCollaborators: 5,
    canExportData: true,
    canRemoveBranding: true,
    canUseCustomDomain: false,
    canAccessAnalytics: true,
    canUseTemplates: true,
    storageLimit: 1000, // 1 GB
  },
  enterprise: {
    maxSurveys: null,
    maxQuestionsPerSurvey: null,
    maxResponsesPerSurvey: null,
    maxCollaborators: 100,
    canExportData: true,
    canRemoveBranding: true,
    canUseCustomDomain: true,
    canAccessAnalytics: true,
    canUseTemplates: true,
    storageLimit: 10000, // 10 GB
  },
};

// ============================================
// Question Type Configuration
// ============================================

export interface QuestionTypeConfig {
  type: QuestionType;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  hasOptions: boolean;
  category: "text" | "choice" | "scale" | "special";
}

export const QUESTION_TYPE_CONFIG: QuestionTypeConfig[] = [
  {
    type: "short_text",
    label: "Short Text",
    description: "Single line text input",
    icon: "Type",
    hasOptions: false,
    category: "text",
  },
  {
    type: "long_text",
    label: "Long Text",
    description: "Multi-line text area",
    icon: "AlignLeft",
    hasOptions: false,
    category: "text",
  },
  {
    type: "multiple_choice",
    label: "Multiple Choice",
    description: "Select one option from a list",
    icon: "CircleDot",
    hasOptions: true,
    category: "choice",
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    description: "Select multiple options",
    icon: "CheckSquare",
    hasOptions: true,
    category: "choice",
  },
  {
    type: "dropdown",
    label: "Dropdown",
    description: "Select from a dropdown menu",
    icon: "ChevronDown",
    hasOptions: true,
    category: "choice",
  },
  {
    type: "rating",
    label: "Rating",
    description: "Star or emoji rating",
    icon: "Star",
    hasOptions: false,
    category: "scale",
  },
  {
    type: "scale",
    label: "Linear Scale",
    description: "Numeric scale (e.g., 1-10)",
    icon: "Sliders",
    hasOptions: false,
    category: "scale",
  },
  {
    type: "date",
    label: "Date",
    description: "Date picker",
    icon: "Calendar",
    hasOptions: false,
    category: "special",
  },
  {
    type: "file_upload",
    label: "File Upload",
    description: "Allow file attachments",
    icon: "Upload",
    hasOptions: false,
    category: "special",
  },
  {
    type: "ranking",
    label: "Ranking",
    description: "Drag to rank items in order",
    icon: "ListOrdered",
    hasOptions: true,
    category: "special",
  },
  {
    type: "matrix",
    label: "Matrix / Grid",
    description: "Grid of questions with same options",
    icon: "Grid3X3",
    hasOptions: true,
    category: "special",
  },
];

// Helper to get config by type
export const getQuestionTypeConfig = (type: QuestionType): QuestionTypeConfig | undefined => {
  return QUESTION_TYPE_CONFIG.find((config) => config.type === type);
};

// ============================================
// Survey Status Configuration
// ============================================

export interface StatusConfig {
  status: SurveyStatus;
  label: string;
  description: string;
  color: string; // Tailwind color class
  icon: string;
}

export const SURVEY_STATUS_CONFIG: StatusConfig[] = [
  {
    status: "draft",
    label: "Draft",
    description: "Survey is being created",
    color: "text-text-muted",
    icon: "FileEdit",
  },
  {
    status: "active",
    label: "Active",
    description: "Survey is accepting responses",
    color: "text-success",
    icon: "Play",
  },
  {
    status: "paused",
    label: "Paused",
    description: "Survey is temporarily paused",
    color: "text-warning",
    icon: "Pause",
  },
  {
    status: "closed",
    label: "Closed",
    description: "Survey is no longer accepting responses",
    color: "text-error",
    icon: "XCircle",
  },
];

// Helper to get status config
export const getSurveyStatusConfig = (status: SurveyStatus): StatusConfig | undefined => {
  return SURVEY_STATUS_CONFIG.find((config) => config.status === status);
};

// ============================================
// Default Survey Settings
// ============================================

export const DEFAULT_SURVEY_SETTINGS: SurveySettings = {
  allowAnonymous: true,
  requireEmail: false,
  showProgressBar: true,
  shuffleQuestions: false,
  oneQuestionPerPage: false,
  allowBackNavigation: true,
  showQuestionNumbers: true,
  completionMessage: "Thank you for completing this survey!",
  redirectUrl: null,
  startDate: null,
  endDate: null,
  maxResponses: null,
};

// ============================================
// File Upload Limits
// ============================================

export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  allowedDocumentTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ],
  avatarMaxSize: 2 * 1024 * 1024, // 2 MB
  surveyImageMaxSize: 5 * 1024 * 1024, // 5 MB
};

// ============================================
// Pagination Defaults
// ============================================

export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
  pageSizeOptions: [10, 25, 50, 100],
};

// ============================================
// Theme Colors (matching globals.css)
// ============================================

export const THEME_COLORS = {
  primary: {
    DEFAULT: "#FF9472",
    light: "#FFB396",
    lighter: "#FFD4C2",
  },
  background: {
    dark: "#1A1210",
    medium: "#2D2220",
    light: "#3D302A",
  },
  accent: {
    gold: "#FFD700",
    cream: "#FFF5E6",
  },
  text: {
    primary: "#FFF0E0",
    secondary: "#E0D0C0",
    muted: "#A09080",
  },
  semantic: {
    success: "#4ADE80",
    warning: "#FBBF24",
    error: "#F87171",
  },
};

// ============================================
// API Routes
// ============================================

export const API_ROUTES = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
    logout: "/api/auth/logout",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  surveys: {
    list: "/api/surveys",
    create: "/api/surveys",
    get: (id: string) => `/api/surveys/${id}`,
    update: (id: string) => `/api/surveys/${id}`,
    delete: (id: string) => `/api/surveys/${id}`,
    duplicate: (id: string) => `/api/surveys/${id}/duplicate`,
  },
  questions: {
    list: (surveyId: string) => `/api/surveys/${surveyId}/questions`,
    create: (surveyId: string) => `/api/surveys/${surveyId}/questions`,
    update: (surveyId: string, questionId: string) =>
      `/api/surveys/${surveyId}/questions/${questionId}`,
    delete: (surveyId: string, questionId: string) =>
      `/api/surveys/${surveyId}/questions/${questionId}`,
    reorder: (surveyId: string) => `/api/surveys/${surveyId}/questions/reorder`,
  },
  responses: {
    submit: (surveySlug: string) => `/api/s/${surveySlug}/responses`,
    list: (surveyId: string) => `/api/surveys/${surveyId}/responses`,
    get: (surveyId: string, responseId: string) =>
      `/api/surveys/${surveyId}/responses/${responseId}`,
  },
};

// ============================================
// App Routes
// ============================================

export const APP_ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  surveys: {
    list: "/dashboard/surveys",
    create: "/dashboard/surveys/new",
    edit: (id: string) => `/dashboard/surveys/${id}/edit`,
    results: (id: string) => `/dashboard/surveys/${id}/results`,
    share: (id: string) => `/dashboard/surveys/${id}/share`,
  },
  templates: "/dashboard/templates",
  account: "/account",
  publicSurvey: (slug: string) => `/s/${slug}`,
};

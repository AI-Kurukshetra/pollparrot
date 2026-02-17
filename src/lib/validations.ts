/**
 * PollParrot Zod Validation Schemas
 *
 * Centralized validation schemas for all forms and API inputs.
 * Use z.infer<typeof schema> to get TypeScript types.
 */

import { z } from "zod";
import { QUESTION_TYPES, SURVEY_STATUSES, COLLABORATOR_ROLES, PLAN_TYPES } from "@/types";

// ============================================
// Auth Schemas
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================
// Profile Schemas
// ============================================

export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  avatarUrl: z.string().url("Please enter a valid URL").optional().nullable(),
});

// ============================================
// Survey Schemas
// ============================================

export const surveySettingsSchema = z.object({
  allowAnonymous: z.boolean().default(true),
  requireEmail: z.boolean().default(false),
  showProgressBar: z.boolean().default(true),
  shuffleQuestions: z.boolean().default(false),
  oneQuestionPerPage: z.boolean().default(false),
  allowBackNavigation: z.boolean().default(true),
  showQuestionNumbers: z.boolean().default(true),
  completionMessage: z.string().default("Thank you for completing this survey!"),
  redirectUrl: z.string().url().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  maxResponses: z.number().int().positive().optional().nullable(),
});

export const surveySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  status: z.enum(SURVEY_STATUSES).default("draft"),
  isTemplate: z.boolean().default(false),
  settings: surveySettingsSchema.optional(),
});

export const surveyCreateSchema = surveySchema;

export const surveyUpdateSchema = surveySchema.partial();

// ============================================
// Question Schemas
// ============================================

export const questionOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Option label is required"),
  value: z.string().optional(),
});

export const questionSettingsSchema = z.object({
  placeholder: z.string().optional().nullable(),
  minLength: z.number().int().min(0).optional().nullable(),
  maxLength: z.number().int().min(1).optional().nullable(),
  minValue: z.number().optional().nullable(),
  maxValue: z.number().optional().nullable(),
  minLabel: z.string().optional().nullable(),
  maxLabel: z.string().optional().nullable(),
  allowOther: z.boolean().optional(),
  allowedFileTypes: z.array(z.string()).optional().nullable(),
  maxFileSize: z.number().int().positive().optional().nullable(),
  rows: z.array(z.string()).optional().nullable(),
  columns: z.array(z.string()).optional().nullable(),
});

export const questionSchema = z.object({
  surveyId: z.string().uuid("Invalid survey ID"),
  type: z.enum(QUESTION_TYPES),
  title: z
    .string()
    .min(1, "Question title is required")
    .max(500, "Question title must be less than 500 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  isRequired: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  options: z.array(questionOptionSchema).optional(),
  settings: questionSettingsSchema.optional(),
});

export const questionCreateSchema = questionSchema;

export const questionUpdateSchema = questionSchema.partial().omit({ surveyId: true });

export const questionReorderSchema = z.object({
  questionId: z.string().uuid(),
  newSortOrder: z.number().int().min(0),
});

// ============================================
// Answer & Response Schemas
// ============================================

export const answerValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  z.null(),
]);

export const answerSchema = z.object({
  questionId: z.string().uuid("Invalid question ID"),
  value: answerValueSchema,
  fileUrl: z.string().url().optional().nullable(),
});

export const responseSubmissionSchema = z.object({
  surveyId: z.string().uuid("Invalid survey ID"),
  respondentEmail: z.string().email().optional(),
  respondentName: z.string().optional(),
  answers: z.array(answerSchema),
});

export const responseUpdateSchema = z.object({
  isComplete: z.boolean().optional(),
  answers: z.array(answerSchema).optional(),
});

// ============================================
// Collaborator Schemas
// ============================================

export const collaboratorInviteSchema = z.object({
  surveyId: z.string().uuid("Invalid survey ID"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(COLLABORATOR_ROLES).default("viewer"),
});

export const collaboratorUpdateSchema = z.object({
  role: z.enum(COLLABORATOR_ROLES),
});

// ============================================
// Search & Filter Schemas
// ============================================

export const surveyFilterSchema = z.object({
  status: z.enum(SURVEY_STATUSES).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(["created_at", "updated_at", "title", "response_count"]).default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================
// Inferred Types
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

export type SurveySettingsInput = z.infer<typeof surveySettingsSchema>;
export type SurveyInput = z.infer<typeof surveySchema>;
export type SurveyCreateInput = z.infer<typeof surveyCreateSchema>;
export type SurveyUpdateInput = z.infer<typeof surveyUpdateSchema>;

export type QuestionOptionInput = z.infer<typeof questionOptionSchema>;
export type QuestionSettingsInput = z.infer<typeof questionSettingsSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type QuestionCreateInput = z.infer<typeof questionCreateSchema>;
export type QuestionUpdateInput = z.infer<typeof questionUpdateSchema>;
export type QuestionReorderInput = z.infer<typeof questionReorderSchema>;

export type AnswerValueInput = z.infer<typeof answerValueSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type ResponseSubmissionInput = z.infer<typeof responseSubmissionSchema>;
export type ResponseUpdateInput = z.infer<typeof responseUpdateSchema>;

export type CollaboratorInviteInput = z.infer<typeof collaboratorInviteSchema>;
export type CollaboratorUpdateInput = z.infer<typeof collaboratorUpdateSchema>;

export type SurveyFilterInput = z.infer<typeof surveyFilterSchema>;

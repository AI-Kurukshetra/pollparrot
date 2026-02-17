import type { Question, Json } from "@/types";

// Common props for all question editors
export interface QuestionEditorProps {
  question: Question;
  onSettingsChange: (settings: Json) => void;
}

// Common props for all question renderers
export interface QuestionRendererProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
}

// Settings types for different question types
export interface TextSettings {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}

export interface ChoiceSettings {
  options?: Array<{ id: string; label: string; value?: string }>;
  allowOther?: boolean;
}

export interface RatingSettings {
  maxRating?: number;
  icon?: "star" | "heart" | "circle";
}

export interface ScaleSettings {
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface DateSettings {
  minDate?: string;
  maxDate?: string;
  includeTime?: boolean;
}

export interface FileSettings {
  allowedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
}

export interface MatrixSettings {
  rows?: string[];
  columns?: string[];
}

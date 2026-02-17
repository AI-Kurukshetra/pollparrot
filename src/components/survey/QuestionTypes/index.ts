// Export all question type components
export * from "./types";

export { ShortTextEditor, ShortTextRenderer } from "./ShortText";
export { LongTextEditor, LongTextRenderer } from "./LongText";
export { MultipleChoiceEditor, MultipleChoiceRenderer } from "./MultipleChoice";
export { CheckboxEditor, CheckboxRenderer } from "./Checkbox";
export { DropdownEditor, DropdownRenderer } from "./Dropdown";
export { RatingEditor, RatingRenderer } from "./Rating";
export { ScaleEditor, ScaleRenderer } from "./Scale";
export { DateEditor, DateRenderer } from "./DatePicker";
export { FileUploadEditor, FileUploadRenderer } from "./FileUpload";
export { RankingEditor, RankingRenderer } from "./Ranking";
export { MatrixEditor, MatrixRenderer } from "./Matrix";

import type { ComponentType } from "react";
import type { QuestionEditorProps, QuestionRendererProps } from "./types";
import type { QuestionType } from "@/types";

import { ShortTextEditor, ShortTextRenderer } from "./ShortText";
import { LongTextEditor, LongTextRenderer } from "./LongText";
import { MultipleChoiceEditor, MultipleChoiceRenderer } from "./MultipleChoice";
import { CheckboxEditor, CheckboxRenderer } from "./Checkbox";
import { DropdownEditor, DropdownRenderer } from "./Dropdown";
import { RatingEditor, RatingRenderer } from "./Rating";
import { ScaleEditor, ScaleRenderer } from "./Scale";
import { DateEditor, DateRenderer } from "./DatePicker";
import { FileUploadEditor, FileUploadRenderer } from "./FileUpload";
import { RankingEditor, RankingRenderer } from "./Ranking";
import { MatrixEditor, MatrixRenderer } from "./Matrix";

// Editor component mapping
export const QuestionEditors: Record<QuestionType, ComponentType<QuestionEditorProps>> = {
  short_text: ShortTextEditor,
  long_text: LongTextEditor,
  multiple_choice: MultipleChoiceEditor,
  checkbox: CheckboxEditor,
  dropdown: DropdownEditor,
  rating: RatingEditor,
  scale: ScaleEditor,
  date: DateEditor,
  file_upload: FileUploadEditor,
  ranking: RankingEditor,
  matrix: MatrixEditor,
};

// Renderer component mapping
export const QuestionRenderers: Record<QuestionType, ComponentType<QuestionRendererProps>> = {
  short_text: ShortTextRenderer,
  long_text: LongTextRenderer,
  multiple_choice: MultipleChoiceRenderer,
  checkbox: CheckboxRenderer,
  dropdown: DropdownRenderer,
  rating: RatingRenderer,
  scale: ScaleRenderer,
  date: DateRenderer,
  file_upload: FileUploadRenderer,
  ranking: RankingRenderer,
  matrix: MatrixRenderer,
};

// Helper function to get editor component
export function getQuestionEditor(type: QuestionType): ComponentType<QuestionEditorProps> {
  return QuestionEditors[type] || ShortTextEditor;
}

// Helper function to get renderer component
export function getQuestionRenderer(type: QuestionType): ComponentType<QuestionRendererProps> {
  return QuestionRenderers[type] || ShortTextRenderer;
}

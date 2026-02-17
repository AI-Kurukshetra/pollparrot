"use client";

import { Plus, X, GripVertical, ChevronDown } from "lucide-react";
import { Input, Button } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, ChoiceSettings } from "./types";

// Editor component for survey builder
export function DropdownEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as ChoiceSettings) || { options: [] };
  const options = settings.options || [];

  const updateSettings = (updates: Partial<ChoiceSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const addOption = () => {
    const newOption = {
      id: `opt_${Date.now()}`,
      label: `Option ${options.length + 1}`,
    };
    updateSettings({ options: [...options, newOption] });
  };

  const updateOption = (index: number, label: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label };
    updateSettings({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    updateSettings({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-text-muted cursor-grab" />
            <Input
              value={option.label}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
              disabled={options.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addOption} leftIcon={<Plus className="h-4 w-4" />}>
        Add Option
      </Button>
    </div>
  );
}

// Renderer component for public survey
export function DropdownRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as ChoiceSettings) || { options: [] };
  const options = settings.options || [];

  return (
    <div>
      <div className="relative">
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full p-3 rounded-lg border appearance-none bg-surface text-text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
            error ? "border-error" : "border-border"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted pointer-events-none" />
      </div>
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}

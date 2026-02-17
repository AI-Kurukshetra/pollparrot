"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Input, Button, Switch } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, ChoiceSettings } from "./types";

// Editor component for survey builder
export function MultipleChoiceEditor({ question, onSettingsChange }: QuestionEditorProps) {
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
            <div className="w-5 h-5 rounded-full border-2 border-border" />
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
      <div className="pt-4 border-t border-border">
        <Switch
          checked={settings.allowOther || false}
          onChange={(e) => updateSettings({ allowOther: e.target.checked })}
          label="Allow 'Other' option"
          description="Let respondents enter a custom answer"
        />
      </div>
    </div>
  );
}

// Renderer component for public survey
export function MultipleChoiceRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as ChoiceSettings) || {};
  // Options are stored in question.options column, fallback to settings for backwards compatibility
  const options = (question.options as Array<{ id: string; label: string }>) || settings.options || [];
  const [otherValue, setOtherValue] = useState("");

  const selectedValue = value as string | undefined;
  const isOtherSelected = selectedValue?.startsWith("other:");

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    onChange(optionId);
  };

  const handleOtherChange = (text: string) => {
    setOtherValue(text);
    onChange(`other:${text}`);
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
            selectedValue === option.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name={`question_${question.id}`}
            checked={selectedValue === option.id}
            onChange={() => handleSelect(option.id)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selectedValue === option.id ? "border-primary" : "border-border"
            }`}
          >
            {selectedValue === option.id && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            )}
          </div>
          <span className="text-text-primary">{option.label}</span>
        </label>
      ))}
      {settings.allowOther && (
        <label
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
            isOtherSelected
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name={`question_${question.id}`}
            checked={isOtherSelected}
            onChange={() => handleOtherChange(otherValue)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isOtherSelected ? "border-primary" : "border-border"
            }`}
          >
            {isOtherSelected && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            )}
          </div>
          <span className="text-text-primary">Other:</span>
          <Input
            value={otherValue}
            onChange={(e) => handleOtherChange(e.target.value)}
            placeholder="Please specify"
            disabled={disabled}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          />
        </label>
      )}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}

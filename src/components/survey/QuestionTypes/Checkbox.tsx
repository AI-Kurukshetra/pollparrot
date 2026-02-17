"use client";

import { useState } from "react";
import { Plus, X, GripVertical, Check } from "lucide-react";
import { Input, Button, Switch } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, ChoiceSettings } from "./types";

// Editor component for survey builder
export function CheckboxEditor({ question, onSettingsChange }: QuestionEditorProps) {
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
            <div className="w-5 h-5 rounded border-2 border-border" />
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
export function CheckboxRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as ChoiceSettings) || {};
  // Options are stored in question.options column, fallback to settings for backwards compatibility
  const options = (question.options as Array<{ id: string; label: string }>) || settings.options || [];
  const [otherValue, setOtherValue] = useState("");

  const selectedValues = (value as string[]) || [];
  const otherSelected = selectedValues.find((v) => v.startsWith("other:"));

  const toggleOption = (optionId: string) => {
    if (disabled) return;
    const newValues = selectedValues.includes(optionId)
      ? selectedValues.filter((v) => v !== optionId)
      : [...selectedValues, optionId];
    onChange(newValues);
  };

  const handleOtherChange = (text: string, checked: boolean) => {
    setOtherValue(text);
    const filtered = selectedValues.filter((v) => !v.startsWith("other:"));
    if (checked && text) {
      onChange([...filtered, `other:${text}`]);
    } else {
      onChange(filtered);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.id);
        return (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              isChecked
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggleOption(option.id)}
              disabled={disabled}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                isChecked ? "border-primary bg-primary" : "border-border"
              }`}
            >
              {isChecked && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className="text-text-primary">{option.label}</span>
          </label>
        );
      })}
      {settings.allowOther && (
        <label
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
            otherSelected
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="checkbox"
            checked={!!otherSelected}
            onChange={(e) => handleOtherChange(otherValue, e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              otherSelected ? "border-primary bg-primary" : "border-border"
            }`}
          >
            {otherSelected && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="text-text-primary">Other:</span>
          <Input
            value={otherValue}
            onChange={(e) => handleOtherChange(e.target.value, !!otherSelected)}
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

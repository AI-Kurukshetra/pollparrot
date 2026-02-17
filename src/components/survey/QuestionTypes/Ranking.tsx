"use client";

import { Plus, X, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Input, Button } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, ChoiceSettings } from "./types";

// Editor component for survey builder
export function RankingEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as ChoiceSettings) || { options: [] };
  const options = settings.options || [];

  const updateSettings = (updates: Partial<ChoiceSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const addOption = () => {
    const newOption = {
      id: `opt_${Date.now()}`,
      label: `Item ${options.length + 1}`,
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
      <p className="text-sm text-text-muted">
        Add items that respondents will rank in order of preference.
      </p>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
              {index + 1}
            </span>
            <Input
              value={option.label}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
              disabled={options.length <= 2}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={addOption} leftIcon={<Plus className="h-4 w-4" />}>
        Add Item
      </Button>
    </div>
  );
}

// Renderer component for public survey
export function RankingRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as ChoiceSettings) || {};
  // Options are stored in question.options column, fallback to settings for backwards compatibility
  const options = (question.options as Array<{ id: string; label: string }>) || settings.options || [];

  // Initialize ranking with default order if not set
  const ranking = (value as string[]) || options.map((o) => o.id);

  const moveItem = (index: number, direction: "up" | "down") => {
    if (disabled) return;
    const newRanking = [...ranking];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= ranking.length) return;

    [newRanking[index], newRanking[newIndex]] = [newRanking[newIndex], newRanking[index]];
    onChange(newRanking);
  };

  const getOptionLabel = (optionId: string) => {
    const option = options.find((o) => o.id === optionId);
    return option?.label || optionId;
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-muted mb-3">
        Drag or use arrows to rank items in order of preference (1 = most preferred)
      </p>
      {ranking.map((optionId, index) => (
        <div
          key={optionId}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
            disabled ? "opacity-50" : "cursor-grab hover:border-primary/50"
          } border-border bg-surface`}
        >
          <GripVertical className="h-5 w-5 text-text-muted" />
          <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="flex-1 text-text-primary">{getOptionLabel(optionId)}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveItem(index, "up")}
              disabled={disabled || index === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveItem(index, "down")}
              disabled={disabled || index === ranking.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}

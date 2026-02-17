"use client";

import { Input, Switch } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, DateSettings } from "./types";

// Editor component for survey builder
export function DateEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as DateSettings) || {};

  const updateSettings = (updates: Partial<DateSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-4">
      <Switch
        checked={settings.includeTime || false}
        onChange={(e) => updateSettings({ includeTime: e.target.checked })}
        label="Include time"
        description="Allow respondents to select time along with date"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Minimum Date (optional)
          </label>
          <Input
            type="date"
            value={settings.minDate || ""}
            onChange={(e) => updateSettings({ minDate: e.target.value || undefined })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Maximum Date (optional)
          </label>
          <Input
            type="date"
            value={settings.maxDate || ""}
            onChange={(e) => updateSettings({ maxDate: e.target.value || undefined })}
          />
        </div>
      </div>
    </div>
  );
}

// Renderer component for public survey
export function DateRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as DateSettings) || {};
  const inputType = settings.includeTime ? "datetime-local" : "date";

  return (
    <div>
      <Input
        type={inputType}
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        min={settings.minDate}
        max={settings.maxDate}
        disabled={disabled}
        className={`${error ? "border-error" : ""}`}
      />
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}

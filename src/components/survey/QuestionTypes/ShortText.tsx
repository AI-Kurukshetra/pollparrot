"use client";

import { Input } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, TextSettings } from "./types";

// Editor component for survey builder
export function ShortTextEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as TextSettings) || {};

  const updateSettings = (updates: Partial<TextSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Placeholder Text
        </label>
        <Input
          value={settings.placeholder || ""}
          onChange={(e) => updateSettings({ placeholder: e.target.value })}
          placeholder="Enter a placeholder..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Min Length
          </label>
          <Input
            type="number"
            min={0}
            value={settings.minLength || ""}
            onChange={(e) => updateSettings({ minLength: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="No minimum"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Max Length
          </label>
          <Input
            type="number"
            min={1}
            value={settings.maxLength || ""}
            onChange={(e) => updateSettings({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="No maximum"
          />
        </div>
      </div>
    </div>
  );
}

// Renderer component for public survey
export function ShortTextRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as TextSettings) || {};

  return (
    <div>
      <Input
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={settings.placeholder || "Your answer"}
        maxLength={settings.maxLength}
        disabled={disabled}
        className={error ? "border-error" : ""}
      />
      {settings.maxLength && (
        <p className="text-xs text-text-muted mt-1">
          {((value as string) || "").length}/{settings.maxLength} characters
        </p>
      )}
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}

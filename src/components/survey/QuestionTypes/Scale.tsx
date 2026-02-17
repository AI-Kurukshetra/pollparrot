"use client";

import { Input } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, ScaleSettings } from "./types";

// Editor component for survey builder
export function ScaleEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as ScaleSettings) || {
    minValue: 0,
    maxValue: 10,
    minLabel: "Not at all likely",
    maxLabel: "Extremely likely",
  };

  const updateSettings = (updates: Partial<ScaleSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Minimum Value
          </label>
          <Input
            type="number"
            min={0}
            max={9}
            value={settings.minValue ?? 0}
            onChange={(e) => updateSettings({ minValue: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Maximum Value
          </label>
          <Input
            type="number"
            min={1}
            max={10}
            value={settings.maxValue ?? 10}
            onChange={(e) => updateSettings({ maxValue: parseInt(e.target.value) || 10 })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Minimum Label
          </label>
          <Input
            value={settings.minLabel || ""}
            onChange={(e) => updateSettings({ minLabel: e.target.value })}
            placeholder="e.g., Not at all likely"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Maximum Label
          </label>
          <Input
            value={settings.maxLabel || ""}
            onChange={(e) => updateSettings({ maxLabel: e.target.value })}
            placeholder="e.g., Extremely likely"
          />
        </div>
      </div>
    </div>
  );
}

// Renderer component for public survey
export function ScaleRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as ScaleSettings) || {
    minValue: 0,
    maxValue: 10,
    minLabel: "Not at all likely",
    maxLabel: "Extremely likely",
  };

  const minValue = settings.minValue ?? 0;
  const maxValue = settings.maxValue ?? 10;
  const currentValue = value as number | undefined;
  const scalePoints = Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i);

  return (
    <div>
      {(settings.minLabel || settings.maxLabel) && (
        <div className="flex justify-between text-sm text-text-muted mb-2">
          <span>{settings.minLabel}</span>
          <span>{settings.maxLabel}</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        {scalePoints.map((point) => (
          <button
            key={point}
            onClick={() => !disabled && onChange(point)}
            disabled={disabled}
            className={`flex-1 py-3 text-center rounded border-2 transition-colors ${
              currentValue === point
                ? "border-primary bg-primary text-white font-semibold"
                : "border-border hover:border-primary/50"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            {point}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}

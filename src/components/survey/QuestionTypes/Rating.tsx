"use client";

import { Star, Heart, Circle } from "lucide-react";
import { Input } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, RatingSettings } from "./types";

// Editor component for survey builder
export function RatingEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as RatingSettings) || { maxRating: 5, icon: "star" };

  const updateSettings = (updates: Partial<RatingSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Maximum Rating
        </label>
        <Input
          type="number"
          min={3}
          max={10}
          value={settings.maxRating || 5}
          onChange={(e) => updateSettings({ maxRating: parseInt(e.target.value) || 5 })}
        />
        <p className="text-xs text-text-muted mt-1">Between 3 and 10</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Icon Style
        </label>
        <div className="flex gap-4">
          {(["star", "heart", "circle"] as const).map((icon) => (
            <button
              key={icon}
              onClick={() => updateSettings({ icon })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                settings.icon === icon
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {icon === "star" && <Star className="h-5 w-5" />}
              {icon === "heart" && <Heart className="h-5 w-5" />}
              {icon === "circle" && <Circle className="h-5 w-5" />}
              <span className="capitalize">{icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Renderer component for public survey
export function RatingRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as RatingSettings) || { maxRating: 5, icon: "star" };
  const maxRating = settings.maxRating || 5;
  const currentValue = (value as number) || 0;

  const IconComponent = settings.icon === "heart" ? Heart : settings.icon === "circle" ? Circle : Star;

  return (
    <div>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            onClick={() => !disabled && onChange(rating)}
            disabled={disabled}
            className={`p-1 transition-colors ${
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
            }`}
          >
            <IconComponent
              className={`h-8 w-8 transition-colors ${
                rating <= currentValue
                  ? "fill-primary text-primary"
                  : "text-border hover:text-primary/50"
              }`}
            />
          </button>
        ))}
        {currentValue > 0 && (
          <span className="ml-2 text-sm text-text-muted">
            {currentValue} / {maxRating}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}

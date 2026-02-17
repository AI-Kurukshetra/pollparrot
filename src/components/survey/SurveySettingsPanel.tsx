"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Switch, Card } from "@/components/ui";
import { updateSurvey } from "@/actions/surveys";
import type { Survey, SurveySettings, Json } from "@/types";

interface SurveySettingsPanelProps {
  survey: Survey;
  onUpdate: () => void;
}

const DEFAULT_SETTINGS: SurveySettings = {
  allowAnonymous: true,
  requireEmail: false,
  showProgressBar: true,
  shuffleQuestions: false,
  oneQuestionPerPage: false,
  allowBackNavigation: true,
  showQuestionNumbers: true,
  completionMessage: "Thank you for completing this survey!",
  redirectUrl: null,
  startDate: null,
  endDate: null,
  maxResponses: null,
};

export function SurveySettingsPanel({ survey, onUpdate }: SurveySettingsPanelProps) {
  const currentSettings = { ...DEFAULT_SETTINGS, ...(survey.settings as unknown as SurveySettings || {}) };

  const [settings, setSettings] = useState<SurveySettings>(currentSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save settings when they change
  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    await updateSurvey(survey.id, { settings: settings as unknown as Json });
    setIsSaving(false);
    onUpdate();
  }, [settings, survey.id, onUpdate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(settings) !== JSON.stringify(currentSettings)) {
        saveSettings();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [settings, saveSettings, currentSettings]);

  const updateSetting = <K extends keyof SurveySettings>(key: K, value: SurveySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {isSaving && (
        <div className="text-xs text-text-muted text-right">Saving...</div>
      )}

      {/* Response Settings */}
      <Card padding="md">
        <h3 className="font-semibold text-text-primary mb-4">Response Settings</h3>
        <div className="space-y-4">
          <Switch
            checked={settings.allowAnonymous}
            onChange={(e) => updateSetting("allowAnonymous", e.target.checked)}
            label="Allow anonymous responses"
            description="Respondents don't need to identify themselves"
          />
          <Switch
            checked={settings.requireEmail}
            onChange={(e) => updateSetting("requireEmail", e.target.checked)}
            label="Require email address"
            description="Collect email before allowing response"
          />
        </div>
      </Card>

      {/* Display Settings */}
      <Card padding="md">
        <h3 className="font-semibold text-text-primary mb-4">Display Settings</h3>
        <div className="space-y-4">
          <Switch
            checked={settings.showProgressBar}
            onChange={(e) => updateSetting("showProgressBar", e.target.checked)}
            label="Show progress bar"
            description="Display completion progress to respondents"
          />
          <Switch
            checked={settings.showQuestionNumbers}
            onChange={(e) => updateSetting("showQuestionNumbers", e.target.checked)}
            label="Show question numbers"
            description="Display question numbers (Q1, Q2, etc.)"
          />
          <Switch
            checked={settings.oneQuestionPerPage}
            onChange={(e) => updateSetting("oneQuestionPerPage", e.target.checked)}
            label="One question per page"
            description="Show only one question at a time"
          />
          <Switch
            checked={settings.allowBackNavigation}
            onChange={(e) => updateSetting("allowBackNavigation", e.target.checked)}
            label="Allow back navigation"
            description="Let respondents go back to previous questions"
          />
          <Switch
            checked={settings.shuffleQuestions}
            onChange={(e) => updateSetting("shuffleQuestions", e.target.checked)}
            label="Shuffle questions"
            description="Randomize question order for each respondent"
          />
        </div>
      </Card>

      {/* Completion Settings */}
      <Card padding="md">
        <h3 className="font-semibold text-text-primary mb-4">Completion Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Completion Message
            </label>
            <Input
              value={settings.completionMessage}
              onChange={(e) => updateSetting("completionMessage", e.target.value)}
              placeholder="Thank you for completing this survey!"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Redirect URL (optional)
            </label>
            <Input
              value={settings.redirectUrl || ""}
              onChange={(e) => updateSetting("redirectUrl", e.target.value || null)}
              placeholder="https://example.com/thank-you"
              type="url"
            />
            <p className="text-xs text-text-muted mt-1">
              Redirect respondents to this URL after completion
            </p>
          </div>
        </div>
      </Card>

      {/* Schedule Settings */}
      <Card padding="md">
        <h3 className="font-semibold text-text-primary mb-4">Schedule</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Start Date (optional)
            </label>
            <Input
              type="datetime-local"
              value={settings.startDate || ""}
              onChange={(e) => updateSetting("startDate", e.target.value || null)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              End Date (optional)
            </label>
            <Input
              type="datetime-local"
              value={settings.endDate || ""}
              onChange={(e) => updateSetting("endDate", e.target.value || null)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Max Responses (optional)
            </label>
            <Input
              type="number"
              min={1}
              value={settings.maxResponses || ""}
              onChange={(e) => updateSetting("maxResponses", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Unlimited"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

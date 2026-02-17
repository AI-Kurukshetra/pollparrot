"use client";

import { Plus, X } from "lucide-react";
import { Input, Button } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, MatrixSettings } from "./types";

// Editor component for survey builder
export function MatrixEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as MatrixSettings) || {
    rows: ["Row 1", "Row 2"],
    columns: ["Column 1", "Column 2", "Column 3"],
  };

  const updateSettings = (updates: Partial<MatrixSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const addRow = () => {
    const rows = settings.rows || [];
    updateSettings({ rows: [...rows, `Row ${rows.length + 1}`] });
  };

  const updateRow = (index: number, value: string) => {
    const rows = [...(settings.rows || [])];
    rows[index] = value;
    updateSettings({ rows });
  };

  const removeRow = (index: number) => {
    const rows = (settings.rows || []).filter((_, i) => i !== index);
    updateSettings({ rows });
  };

  const addColumn = () => {
    const columns = settings.columns || [];
    updateSettings({ columns: [...columns, `Column ${columns.length + 1}`] });
  };

  const updateColumn = (index: number, value: string) => {
    const columns = [...(settings.columns || [])];
    columns[index] = value;
    updateSettings({ columns });
  };

  const removeColumn = (index: number) => {
    const columns = (settings.columns || []).filter((_, i) => i !== index);
    updateSettings({ columns });
  };

  return (
    <div className="space-y-6">
      {/* Rows */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Rows (Questions/Items)
        </label>
        <div className="space-y-2">
          {(settings.rows || []).map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={row}
                onChange={(e) => updateRow(index, e.target.value)}
                placeholder={`Row ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRow(index)}
                disabled={(settings.rows || []).length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          leftIcon={<Plus className="h-4 w-4" />}
          className="mt-2"
        >
          Add Row
        </Button>
      </div>

      {/* Columns */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Columns (Options)
        </label>
        <div className="space-y-2">
          {(settings.columns || []).map((column, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={column}
                onChange={(e) => updateColumn(index, e.target.value)}
                placeholder={`Column ${index + 1}`}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeColumn(index)}
                disabled={(settings.columns || []).length <= 2}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addColumn}
          leftIcon={<Plus className="h-4 w-4" />}
          className="mt-2"
        >
          Add Column
        </Button>
      </div>
    </div>
  );
}

// Renderer component for public survey
export function MatrixRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as MatrixSettings) || {
    rows: ["Row 1", "Row 2"],
    columns: ["Column 1", "Column 2", "Column 3"],
  };

  const rows = settings.rows || [];
  const columns = settings.columns || [];
  const answers = (value as Record<string, string>) || {};

  const handleSelect = (rowIndex: number, columnIndex: number) => {
    if (disabled) return;
    const newAnswers = { ...answers, [rowIndex]: columnIndex.toString() };
    onChange(newAnswers);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-medium text-text-muted border-b border-border"></th>
              {columns.map((column, colIndex) => (
                <th
                  key={colIndex}
                  className="p-3 text-center text-sm font-medium text-text-primary border-b border-border"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-b-0">
                <td className="p-3 text-sm text-text-primary">{row}</td>
                {columns.map((_, colIndex) => {
                  const isSelected = answers[rowIndex] === colIndex.toString();
                  return (
                    <td key={colIndex} className="p-3 text-center">
                      <button
                        onClick={() => handleSelect(rowIndex, colIndex)}
                        disabled={disabled}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-border hover:border-primary/50"
                        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="text-sm text-error mt-2">{error}</p>}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Upload, X, File, Image, FileText } from "lucide-react";
import { Input, Button, Switch } from "@/components/ui";
import type { QuestionEditorProps, QuestionRendererProps, FileSettings } from "./types";

const FILE_TYPE_OPTIONS = [
  { value: "image/*", label: "Images" },
  { value: "application/pdf", label: "PDF" },
  { value: ".doc,.docx", label: "Word Documents" },
  { value: ".xls,.xlsx", label: "Excel Files" },
  { value: "*", label: "All Files" },
];

// Editor component for survey builder
export function FileUploadEditor({ question, onSettingsChange }: QuestionEditorProps) {
  const settings = (question.settings as FileSettings) || {
    allowedTypes: ["*"],
    maxSize: 10,
    multiple: false,
  };

  const updateSettings = (updates: Partial<FileSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const toggleFileType = (type: string) => {
    const currentTypes = settings.allowedTypes || ["*"];
    if (type === "*") {
      updateSettings({ allowedTypes: ["*"] });
    } else {
      const filtered = currentTypes.filter((t) => t !== "*");
      if (filtered.includes(type)) {
        updateSettings({ allowedTypes: filtered.filter((t) => t !== type) });
      } else {
        updateSettings({ allowedTypes: [...filtered, type] });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Allowed File Types
        </label>
        <div className="flex flex-wrap gap-2">
          {FILE_TYPE_OPTIONS.map((option) => {
            const isSelected =
              (settings.allowedTypes || []).includes(option.value) ||
              (option.value === "*" && (settings.allowedTypes || []).includes("*"));
            return (
              <button
                key={option.value}
                onClick={() => toggleFileType(option.value)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Maximum File Size (MB)
        </label>
        <Input
          type="number"
          min={1}
          max={50}
          value={settings.maxSize || 10}
          onChange={(e) => updateSettings({ maxSize: parseInt(e.target.value) || 10 })}
        />
      </div>
      <Switch
        checked={settings.multiple || false}
        onChange={(e) => updateSettings({ multiple: e.target.checked })}
        label="Allow multiple files"
        description="Let respondents upload more than one file"
      />
    </div>
  );
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

// Renderer component for public survey
export function FileUploadRenderer({ question, value, onChange, error, disabled }: QuestionRendererProps) {
  const settings = (question.settings as FileSettings) || {
    allowedTypes: ["*"],
    maxSize: 10,
    multiple: false,
  };

  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const files = (value as UploadedFile[]) || [];
  const maxSizeBytes = (settings.maxSize || 10) * 1024 * 1024;

  const acceptTypes = (settings.allowedTypes || ["*"]).join(",");

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeBytes) {
      return `File exceeds ${settings.maxSize}MB limit`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles || disabled) return;

      const fileArray = Array.from(newFiles);
      const validFiles: UploadedFile[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          setUploadError(error);
          return;
        }
        validFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file,
        });
      }

      setUploadError(null);
      if (settings.multiple) {
        onChange([...files, ...validFiles]);
      } else {
        onChange(validFiles.slice(0, 1));
      }
    },
    [disabled, files, maxSizeBytes, onChange, settings.maxSize, settings.multiple]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type === "application/pdf") return FileText;
    return File;
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : error || uploadError
            ? "border-error"
            : "border-border hover:border-primary/50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="file"
          id={`file_${question.id}`}
          accept={acceptTypes}
          multiple={settings.multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
        />
        <label
          htmlFor={`file_${question.id}`}
          className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          <Upload className="h-10 w-10 mx-auto text-text-muted mb-3" />
          <p className="text-text-primary font-medium">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-sm text-text-muted mt-1">
            Max file size: {settings.maxSize}MB
            {settings.multiple && " • Multiple files allowed"}
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background-light"
              >
                <FileIcon className="h-5 w-5 text-text-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-sm text-error">{error || uploadError}</p>
      )}
    </div>
  );
}

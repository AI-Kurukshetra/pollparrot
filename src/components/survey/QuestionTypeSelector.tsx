"use client";

import {
  Type,
  AlignLeft,
  List,
  CheckSquare,
  ChevronDown,
  Star,
  Sliders,
  Calendar,
  Upload,
  GripVertical,
  Grid3X3,
} from "lucide-react";
import type { QuestionType } from "@/types";

interface QuestionTypeOption {
  type: QuestionType;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "text" | "choice" | "rating" | "other";
}

export const QUESTION_TYPE_OPTIONS: QuestionTypeOption[] = [
  {
    type: "short_text",
    label: "Short Text",
    description: "Single line text input",
    icon: <Type className="h-5 w-5" />,
    category: "text",
  },
  {
    type: "long_text",
    label: "Long Text",
    description: "Multi-line text area",
    icon: <AlignLeft className="h-5 w-5" />,
    category: "text",
  },
  {
    type: "multiple_choice",
    label: "Multiple Choice",
    description: "Select one option",
    icon: <List className="h-5 w-5" />,
    category: "choice",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    description: "Select multiple options",
    icon: <CheckSquare className="h-5 w-5" />,
    category: "choice",
  },
  {
    type: "dropdown",
    label: "Dropdown",
    description: "Select from dropdown list",
    icon: <ChevronDown className="h-5 w-5" />,
    category: "choice",
  },
  {
    type: "rating",
    label: "Rating",
    description: "Star rating scale",
    icon: <Star className="h-5 w-5" />,
    category: "rating",
  },
  {
    type: "scale",
    label: "Linear Scale",
    description: "Numeric scale (e.g., 1-10)",
    icon: <Sliders className="h-5 w-5" />,
    category: "rating",
  },
  {
    type: "date",
    label: "Date",
    description: "Date picker",
    icon: <Calendar className="h-5 w-5" />,
    category: "other",
  },
  {
    type: "file_upload",
    label: "File Upload",
    description: "Upload files",
    icon: <Upload className="h-5 w-5" />,
    category: "other",
  },
  {
    type: "ranking",
    label: "Ranking",
    description: "Order items by preference",
    icon: <GripVertical className="h-5 w-5" />,
    category: "other",
  },
  {
    type: "matrix",
    label: "Matrix",
    description: "Grid of questions",
    icon: <Grid3X3 className="h-5 w-5" />,
    category: "other",
  },
];

interface QuestionTypeSelectorProps {
  onSelect: (type: QuestionType) => void;
  onClose: () => void;
}

export function QuestionTypeSelector({ onSelect, onClose }: QuestionTypeSelectorProps) {
  const categories = [
    { id: "text", label: "Text" },
    { id: "choice", label: "Choice" },
    { id: "rating", label: "Rating" },
    { id: "other", label: "Other" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 w-[480px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Choose Question Type</h3>

        <div className="space-y-5">
          {categories.map((category) => {
            const types = QUESTION_TYPE_OPTIONS.filter((t) => t.category === category.id);
            if (types.length === 0) return null;

            return (
              <div key={category.id}>
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  {category.label}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {types.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => {
                        onSelect(option.type);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-[#FF6B35] hover:bg-[#FFF5F0] transition-all duration-200 text-left group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-[#FFE5DB] flex items-center justify-center text-gray-500 group-hover:text-[#FF6B35] transition-colors">
                        {option.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 text-sm">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

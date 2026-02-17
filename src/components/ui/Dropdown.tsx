"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  fullWidth?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  multiple = false,
  searchable = false,
  fullWidth = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get display text for selected values
  const displayText = selectedValues.length
    ? selectedValues
        .map((v) => options.find((opt) => opt.value === v)?.label)
        .filter(Boolean)
        .join(", ")
    : placeholder;

  // Handle option selection
  const handleSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        onChange?.(newValues);
      } else {
        onChange?.(optionValue);
        setIsOpen(false);
      }
    },
    [multiple, onChange, selectedValues]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          } else {
            setIsOpen(true);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              Math.min(prev + 1, filteredOptions.length - 1)
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, filteredOptions, highlightedIndex, handleSelect]
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedEl = listRef.current.children[highlightedIndex] as HTMLElement;
      highlightedEl?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  const hasError = !!error;

  return (
    <div ref={containerRef} className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-900 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${id}-label` : undefined}
          className={`
            w-full flex items-center justify-between
            px-4 py-2.5 rounded-lg
            bg-white border
            text-left
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            ${
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-primary focus:ring-primary/20"
            }
            ${selectedValues.length ? "text-gray-900" : "text-gray-400"}
          `}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>
            )}
            <ul
              ref={listRef}
              role="listbox"
              aria-multiselectable={multiple}
              className="max-h-60 overflow-auto py-1"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-2 text-sm text-gray-500">
                  No options found
                </li>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`
                        flex items-center justify-between
                        px-4 py-2 text-sm cursor-pointer
                        ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                        ${isHighlighted ? "bg-gray-50" : ""}
                        ${isSelected ? "text-primary font-medium" : "text-gray-900"}
                      `}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Dropdown;

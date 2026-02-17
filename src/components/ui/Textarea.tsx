"use client";

import { forwardRef, useId, useState, useEffect, useRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCharCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      showCharCount = false,
      maxLength,
      autoResize = false,
      fullWidth = true,
      disabled,
      className = "",
      id,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const hasError = !!error;
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const [charCount, setCharCount] = useState(() => {
      if (value !== undefined) return String(value).length;
      if (defaultValue !== undefined) return String(defaultValue).length;
      return 0;
    });

    // Handle auto-resize
    useEffect(() => {
      if (autoResize && internalRef.current) {
        internalRef.current.style.height = "auto";
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (autoResize && internalRef.current) {
        internalRef.current.style.height = "auto";
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
      onChange?.(e);
    };

    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-900 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={setRefs}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined
          }
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={`
            block w-full rounded-lg
            bg-white border
            text-gray-900 placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white
            disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
            px-4 py-2.5
            min-h-[100px]
            resize-y
            ${autoResize ? "resize-none overflow-hidden" : ""}
            ${
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-200 focus:border-primary focus:ring-primary/20"
            }
            ${className}
          `}
          {...props}
        />
        <div className="flex justify-between mt-1.5">
          <div>
            {error && (
              <p id={`${textareaId}-error`} className="text-sm text-red-600">
                {error}
              </p>
            )}
            {hint && !error && (
              <p id={`${textareaId}-hint`} className="text-sm text-gray-500">
                {hint}
              </p>
            )}
          </div>
          {showCharCount && (
            <p className="text-sm text-gray-500">
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;

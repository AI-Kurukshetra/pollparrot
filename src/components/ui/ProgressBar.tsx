"use client";

import { forwardRef } from "react";

type ProgressBarSize = "sm" | "md" | "lg";
type ProgressBarColor = "primary" | "success" | "warning" | "error";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: ProgressBarSize;
  color?: ProgressBarColor;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const sizeStyles: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const colorStyles: Record<ProgressBarColor, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      size = "md",
      color = "primary",
      showLabel = false,
      label,
      animated = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={className} {...props}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-1.5">
            {label && (
              <span className="text-sm font-medium text-text-primary">{label}</span>
            )}
            {showLabel && (
              <span className="text-sm text-text-muted">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          className={`
            w-full rounded-full overflow-hidden
            bg-background-light
            ${sizeStyles[size]}
          `}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={`
              h-full rounded-full
              ${colorStyles[color]}
              ${animated ? "transition-all duration-500 ease-out" : ""}
            `}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;

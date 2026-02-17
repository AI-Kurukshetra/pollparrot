"use client";

import { forwardRef } from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "draft" | "active" | "paused" | "closed";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 border border-gray-200",
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  error: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-primary-50 text-primary-700 border border-primary-200",
  // Survey status badges
  draft: "bg-gray-50 text-gray-600 border border-gray-200",
  active: "bg-green-50 text-green-700 border border-green-200",
  paused: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  closed: "bg-red-50 text-red-700 border border-red-200",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-3.5 py-1.5 text-base",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium rounded-full
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;

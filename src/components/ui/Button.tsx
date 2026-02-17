"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm disabled:bg-primary/50 disabled:shadow-none",
  secondary:
    "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400",
  outline:
    "border-2 border-primary text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100 disabled:border-primary/50 disabled:text-primary/50",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:text-gray-400",
  danger:
    "bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-sm disabled:bg-error/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-semibold rounded-full
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-white
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

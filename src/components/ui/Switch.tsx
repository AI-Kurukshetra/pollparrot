"use client";

import { forwardRef, useId } from "react";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, disabled, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            disabled={disabled}
            role="switch"
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={switchId}
            className={`
              relative inline-flex h-6 w-11 cursor-pointer rounded-full
              bg-gray-200
              transition-colors duration-200
              peer-checked:bg-[#FF6B35]
              peer-focus:ring-2 peer-focus:ring-[#FF6B35]/20 peer-focus:ring-offset-2 peer-focus:ring-offset-white
              peer-disabled:cursor-not-allowed peer-disabled:opacity-50
              after:absolute after:top-0.5 after:left-0.5
              after:h-5 after:w-5 after:rounded-full
              after:bg-white after:shadow-md
              after:transition-transform after:duration-200
              peer-checked:after:translate-x-5
            `}
          >
            <span className="sr-only">{label || "Toggle"}</span>
          </label>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={switchId}
                className={`text-sm font-medium text-gray-900 ${
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;

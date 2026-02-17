"use client";

import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padding = "md", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl border border-gray-200 shadow-sm
          ${paddingStyles[padding]}
          ${hoverable ? "hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-start justify-between gap-4 ${className}`}
        {...props}
      >
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

export const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`mt-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = "CardBody";

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mt-4 pt-4 border-t border-gray-100 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

export default Card;

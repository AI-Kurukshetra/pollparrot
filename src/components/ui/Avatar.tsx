"use client";

import { forwardRef, useState } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  showOnline?: boolean;
  isOnline?: boolean;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

const indicatorSizes: Record<AvatarSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-4 w-4",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name = "User",
      size = "md",
      showOnline = false,
      isOnline = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const showFallback = !src || imageError;
    const initials = getInitials(name);
    const bgColor = getColorFromName(name);

    return (
      <div ref={ref} className={`relative inline-block ${className}`} {...props}>
        <div
          className={`
            ${sizeStyles[size]}
            rounded-full overflow-hidden
            flex items-center justify-center
            font-medium text-white
            ${showFallback ? bgColor : "bg-gray-100"}
          `}
        >
          {showFallback ? (
            <span>{initials}</span>
          ) : (
            <img
              src={src!}
              alt={alt || name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        {showOnline && (
          <span
            className={`
              absolute bottom-0 right-0
              ${indicatorSizes[size]}
              rounded-full ring-2 ring-white
              ${isOnline ? "bg-green-500" : "bg-gray-400"}
            `}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;

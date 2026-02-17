"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { icon: 24, text: "text-lg" },
  md: { icon: 32, text: "text-xl" },
  lg: { icon: 40, text: "text-2xl" },
};

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const { icon, text } = sizeStyles[size];

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="PollParrot"
        width={icon}
        height={icon}
        className="flex-shrink-0"
      />
      {showText && (
        <span className={`font-bold text-text-primary ${text}`}>
          Poll<span className="text-primary">Parrot</span>
        </span>
      )}
    </Link>
  );
}

export default Logo;

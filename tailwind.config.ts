import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Vibrant Peach/Coral accent
        primary: {
          DEFAULT: "#FF6B35",
          light: "#FF8C5C",
          lighter: "#FFB08A",
          50: "#FFF5F0",
          100: "#FFE8DB",
          200: "#FFD0B8",
          300: "#FFB08A",
          400: "#FF8C5C",
          500: "#FF6B35",
          600: "#E8551F",
          700: "#C4410F",
          800: "#9E3610",
          900: "#7E2E11",
        },
        // Gray - Cool neutral grays
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        // Backgrounds - Light and clean
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F9FAFB",
          tertiary: "#F3F4F6",
          dark: "#111827",
          medium: "#F3F4F6",
          light: "#F9FAFB",
        },
        // Text colors
        text: {
          DEFAULT: "#111827",
          primary: "#111827",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
        // Semantic colors
        success: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
          dark: "#059669",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
          dark: "#D97706",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
          dark: "#DC2626",
        },
        info: {
          DEFAULT: "#3B82F6",
          light: "#DBEAFE",
          dark: "#2563EB",
        },
        // Surface colors for cards, modals, etc.
        surface: {
          DEFAULT: "#FFFFFF",
          elevated: "#FFFFFF",
          overlay: "rgba(0, 0, 0, 0.5)",
        },
        // Border colors
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
          dark: "#D1D5DB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        "peach-glow": "0 0 20px rgba(255, 107, 53, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;

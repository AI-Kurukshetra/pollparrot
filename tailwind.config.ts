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
        // Primary - Peach tones
        primary: {
          DEFAULT: "#FF9472",
          light: "#FFB396",
          lighter: "#FFD4C2",
          50: "#FFF5F0",
          100: "#FFE8E0",
          200: "#FFD4C2",
          300: "#FFB396",
          400: "#FF9472",
          500: "#FF7550",
          600: "#E65A35",
          700: "#CC4020",
          800: "#A63015",
          900: "#80200A",
        },
        // Backgrounds - Warm dark tones
        background: {
          DEFAULT: "#1A1210",
          secondary: "#2D2220",
          tertiary: "#3D302A",
          dark: "#1A1210",
          medium: "#2D2220",
          light: "#3D302A",
        },
        // Accents
        accent: {
          gold: "#FFD700",
          cream: "#FFF5E6",
        },
        // Text colors
        text: {
          DEFAULT: "#FFF0E0",
          primary: "#FFF0E0",
          secondary: "#E0D0C0",
          muted: "#A09080",
        },
        // Semantic colors
        success: {
          DEFAULT: "#4ADE80",
          light: "#86EFAC",
          dark: "#22C55E",
        },
        warning: {
          DEFAULT: "#FBBF24",
          light: "#FCD34D",
          dark: "#F59E0B",
        },
        error: {
          DEFAULT: "#F87171",
          light: "#FCA5A5",
          dark: "#EF4444",
        },
        // Surface colors for cards, modals, etc.
        surface: {
          DEFAULT: "#2D2220",
          elevated: "#3D302A",
          overlay: "rgba(26, 18, 16, 0.8)",
        },
        // Border colors
        border: {
          DEFAULT: "#4D403A",
          light: "#5D504A",
          dark: "#3D302A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      boxShadow: {
        "peach-sm": "0 1px 2px 0 rgba(255, 148, 114, 0.05)",
        "peach-md": "0 4px 6px -1px rgba(255, 148, 114, 0.1), 0 2px 4px -1px rgba(255, 148, 114, 0.06)",
        "peach-lg": "0 10px 15px -3px rgba(255, 148, 114, 0.1), 0 4px 6px -2px rgba(255, 148, 114, 0.05)",
        "peach-glow": "0 0 20px rgba(255, 148, 114, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;

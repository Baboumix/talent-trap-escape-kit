import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme palette
        cream: "#FAF7F3", // page background
        surface: "#FFFFFF", // card background
        ink: "#1A1A1A", // primary text
        line: "#E8E1D7", // soft border on cream
        // Coral: brand accent (gradient kept for headings)
        coral: {
          DEFAULT: "#FE6B63",
          500: "#FE6B63",
          400: "#FF8A54",
        },
        // Complementary palette for scores / quadrant zones
        // Sain / positive → emerald
        emerald: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        // Intermediate / sous influence → amber
        amber: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

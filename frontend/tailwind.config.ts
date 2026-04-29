import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#f7f2e8",
        moss: "#2f5d50",
        ember: "#e56b3f",
        wheat: "#ead9b7",
      },
      boxShadow: {
        "soft-panel": "0 24px 80px rgba(47, 93, 80, 0.18)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Trebuchet MS", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

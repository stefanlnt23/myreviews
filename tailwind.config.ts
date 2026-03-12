import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#faf8f5",
        card: "#ffffff",
        border: "#e8e4de",
        foreground: "#111111", // Dark text for light bg
        accent: "#e65c00",
        score: {
          green: "#2d8a6b",
          amber: "#d4720a",
          grey: "#888888"
        },
        category: {
          accounting: { bg: "#e8f4f0", text: "#2d8a6b" },
          invoicing: { bg: "#fef3e8", text: "#d4720a" },
          website: { bg: "#eef2fb", text: "#3a5fd9" },
          payments: { bg: "#fdf0f0", text: "#c0392b" },
          jobs: { bg: "#f5f0fe", text: "#7c3aed" },
          insurance: { bg: "#f0f9ff", text: "#0284c7" },
        }
      },
      fontFamily: {
        sans: ['var(--font-barlow)', 'sans-serif'],
        heading: ['var(--font-barlow-condensed)', 'sans-serif'],
        serif: ['var(--font-lora)', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;

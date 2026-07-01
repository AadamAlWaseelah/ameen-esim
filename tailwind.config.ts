import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Semantic (shadcn-compatible)
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "#b4231f",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        // Brand tokens (use directly: bg-navy, text-gold-deep, etc.)
        // Hex literals, NOT var() strings: Tailwind can only generate opacity
        // modifiers (bg-navy/45, via-cream/15, ...) from parseable colors.
        // Keep in sync with the CSS variables in globals.css.
        navy: {
          DEFAULT: "#19202e",
          700: "#232c3e",
        },
        gold: {
          DEFAULT: "#c9a961",
          deep: "#a8863f",
          pale: "#e7d592",
        },
        saudi: {
          DEFAULT: "#1f4a32",
          deep: "#163a27",
          tint: "#edf3ec",
          "tint-2": "#f5f9f3",
        },
        intl: {
          DEFAULT: "#1f4f8f",
          deep: "#173c6c",
          tint: "#eef3fa",
          "tint-2": "#f5f8fd",
        },
        slate: "#565d71",
        cream: "#faf8f2",
        paper: "#ffffff",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "-apple-system", "sans-serif"],
      },
      transitionTimingFunction: {
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.3s var(--ease-out) both",
        marquee: "marquee 48s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

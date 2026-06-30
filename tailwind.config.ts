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
          DEFAULT: "var(--destructive)",
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
        navy: {
          DEFAULT: "var(--navy)",
          700: "var(--navy-700)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          deep: "var(--gold-deep)",
          pale: "var(--gold-pale)",
        },
        saudi: {
          DEFAULT: "var(--saudi)",
          deep: "var(--saudi-deep)",
          tint: "var(--saudi-tint)",
          "tint-2": "var(--saudi-tint-2)",
        },
        intl: {
          DEFAULT: "var(--intl)",
          deep: "var(--intl-deep)",
          tint: "var(--intl-tint)",
          "tint-2": "var(--intl-tint-2)",
        },
        slate: "var(--slate)",
        cream: "var(--cream)",
        paper: "var(--paper)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
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

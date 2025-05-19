/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
  "*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      cosmic: {
        dark: "#0A0A1B",
        darker: "#050510",
        blue: "#3B9EFF",
        purple: "#9747FF",
        cyan: "#47DFFF",
        accent: "#7B61FF",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
      float: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-10px)" },
      },      floating: {
        "0%": { transform: "translateY(0px) translateX(0px)" },
        "25%": { transform: "translateY(-10px) translateX(5px)" },
        "50%": { transform: "translateY(0px) translateX(10px)" },
        "75%": { transform: "translateY(10px) translateX(5px)" },
        "100%": { transform: "translateY(0px) translateX(0px)" },
      },      blob: {
        "0%": { transform: "translate(0px, 0px) scale(1)" },
        "33%": { transform: "translate(30px, -20px) scale(1.1)" },
        "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        "100%": { transform: "translate(0px, 0px) scale(1)" },
      },
      gradient: {
        "0%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
        "100%": { backgroundPosition: "0% 50%" },
      },
      pulse: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.5" },
      },
    },    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      float: "float 6s ease-in-out infinite",
      floating: "floating 12s ease-in-out infinite",      blob: "blob 7s infinite",
      "blob-slow": "blob 10s infinite",
      "blob-delay": "blob 12s infinite 2s",
      gradient: "gradient 15s ease infinite",
      pulse: "pulse 3s ease-in-out infinite",
    },
    fontFamily: {
       angelos: ["Angelos"] ,
       milker: ["Milker"] ,
      },
  },
};
export const plugins = [require("tailwindcss-animate")];

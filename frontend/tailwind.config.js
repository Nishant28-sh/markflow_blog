/** @type {import('tailwindcss').Config} */
function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue !== undefined ? `rgb(var(${variable}) / ${opacityValue})` : `rgb(var(${variable}))`;
}

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withOpacity("--color-primary"),
          hover: withOpacity("--color-primary-hover"),
          muted: withOpacity("--color-primary-muted"),
        },
        secondary: {
          DEFAULT: withOpacity("--color-secondary"),
          hover: withOpacity("--color-secondary-hover"),
        },
        accent: {
          DEFAULT: withOpacity("--color-accent"),
          hover: withOpacity("--color-accent-hover"),
        },
        bg: {
          DEFAULT: withOpacity("--color-bg"),
          raised: withOpacity("--color-bg-raised"),
        },
        surface: {
          DEFAULT: withOpacity("--color-surface"),
          hover: withOpacity("--color-surface-hover"),
        },
        border: {
          DEFAULT: withOpacity("--color-border"),
          light: withOpacity("--color-border-light"),
        },
        text: {
          DEFAULT: withOpacity("--color-text"),
          muted: withOpacity("--color-text-muted"),
          faint: withOpacity("--color-text-faint"),
        },
        danger: {
          DEFAULT: withOpacity("--color-danger"),
          hover: withOpacity("--color-danger-hover"),
        },
        warning: withOpacity("--color-warning"),
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "22px",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgb(var(--color-shadow) / 0.35)",
        card: "0 1px 2px rgb(var(--color-shadow) / 0.06), 0 8px 24px -8px rgb(var(--color-shadow) / 0.18)",
        glow: "0 0 0 1px rgb(var(--color-primary) / 0.4), 0 8px 32px -8px rgb(var(--color-primary) / 0.45)",
        "glow-accent": "0 0 0 1px rgb(var(--color-accent) / 0.4), 0 8px 24px -8px rgb(var(--color-accent) / 0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        breathe: "breathe 2.8s ease-in-out infinite",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:        "#12100F",
        surface:           "#1A1817",
        "surface-2":       "#232120",
        border:            "#2E2B29",
        foreground:        "#ECEAE7",
        muted:             "#A29D97",
        faint:             "#6B6660",
        accent:            "#E5A24E",
        "accent-hover":    "#EFB268",
        "accent-foreground": "#1B1206",
        danger:            "#E5674E",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

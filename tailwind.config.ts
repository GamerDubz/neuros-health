import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary — Deep Teal
        "primary":                    "#00685d",
        "primary-container":          "#008376",
        "primary-fixed":              "#8cf5e4",
        "primary-fixed-dim":          "#6fd8c8",
        "on-primary":                 "#ffffff",
        "on-primary-container":       "#f4fffb",
        "on-primary-fixed":           "#00201c",
        "on-primary-fixed-variant":   "#005048",
        "inverse-primary":            "#6fd8c8",

        // Secondary — Warm Amber/Gold
        "secondary":                  "#765a05",
        "secondary-container":        "#ffd87c",
        "secondary-fixed":            "#ffdf96",
        "secondary-fixed-dim":        "#e7c268",
        "on-secondary":               "#ffffff",
        "on-secondary-container":     "#795d08",
        "on-secondary-fixed":         "#251a00",
        "on-secondary-fixed-variant": "#5a4400",

        // Tertiary — Success Green
        "tertiary":                   "#006948",
        "tertiary-container":         "#00855b",
        "tertiary-fixed":             "#85f8c2",
        "tertiary-fixed-dim":         "#67dca7",
        "on-tertiary":                "#ffffff",
        "on-tertiary-container":      "#f5fff6",
        "on-tertiary-fixed":          "#002114",
        "on-tertiary-fixed-variant":  "#005236",

        // Surfaces — The depth stack
        "surface":                    "#f9f9ff",
        "surface-dim":                "#d3daea",
        "surface-bright":             "#f9f9ff",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f0f3ff",
        "surface-container":          "#e7eefe",
        "surface-container-high":     "#e2e8f8",
        "surface-container-highest":  "#dce2f3",
        "surface-tint":               "#006a60",
        "surface-variant":            "#dce2f3",
        "inverse-surface":            "#2a313d",
        "inverse-on-surface":         "#ebf1ff",

        // Text
        "on-surface":                 "#151c27",
        "on-surface-variant":         "#3d4947",
        "outline":                    "#6d7a77",
        "outline-variant":            "#bcc9c6",

        // Semantic
        "error":                      "#ba1a1a",
        "error-container":            "#ffdad6",
        "on-error":                   "#ffffff",
        "on-error-container":         "#93000a",

        "background":                 "#f9f9ff",
        "on-background":              "#151c27",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",  // 4px
        "lg":      "0.5rem",   // 8px
        "xl":      "0.75rem",  // 12px
        "2xl":     "1rem",     // 16px
        "3xl":     "1.5rem",   // 24px
        "full":    "9999px",   // pills
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00685d 0%, #008376 100%)',
      }
    },
  },
  plugins: [],
};
export default config;

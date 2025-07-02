import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Dark mode is enabled via class
  theme: {
    extend: {
      // We are defining colors inside the daisyui theme, so this can be left empty
      // unless you have other specific needs.
    },
  },
  plugins: [daisyui],
  
  // DaisyUI configuration with our custom theme
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          "primary": "#4338CA",     // A strong, inviting Indigo
          "secondary": "#EC4899",   // A vibrant Pink for secondary actions
          "accent": "#FBBF24",      // An accent color for highlights or warnings
          "neutral": "#3D4451",     // For body text
          "base-100": "#FFFFFF",    // Main background color
          "success": "#16A34A",
          "error": "#DC2626",
          
          // --- Global Border Radius for Consistency ---
          "--rounded-box": "0.75rem", // 12px for cards, modals, etc.
          "--rounded-btn": "0.5rem",  // 8px for buttons, inputs
          "--rounded-badge": "1.9rem",// default for badges
        },
      },
      {
        dark: {
          ...themes["dark"],
          "primary": "#6D28D9",      // A brighter purple for better contrast in dark mode
          "secondary": "#EC4899",    // Pink works well in dark mode too
          "accent": "#FBBF24",
          "neutral": "#D1D5DB",      // Lighter text for dark backgrounds
          "base-100": "#111827",     // Dark background
          "success": "#22C55E",
          "error": "#E11D48",

          // --- Global Border Radius for Consistency ---
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    logs: false, // Prevents DaisyUI from logging to the console
  },
};
import daisyui from 'daisyui';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // ✅ Tell Tailwind to use class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
  },
};

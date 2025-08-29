/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-purple': {
          light: '#b799b8',
          DEFAULT: '#8a638b',
          dark: '#79557a',
        },
      },
    },
  },
  plugins: [],
};
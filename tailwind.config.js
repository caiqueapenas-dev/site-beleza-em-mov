/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-purple': {
  light: '#C084FC',   // Roxo claro/lilás vibrante
  DEFAULT: '#9333EA', // Roxo principal forte e charmoso
  dark: '#6B21A8',    // Roxo profundo elegante
},
      },
    },
  },
  plugins: [],
};
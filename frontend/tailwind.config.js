/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [...require('safelist.json'), 'w-8', 'h-8'],
  theme: {
    extend: {},
  },
  plugins: [],
};

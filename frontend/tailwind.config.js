/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [...require('safelist.json')],
  theme: {
    extend: {},
  },
  plugins: [],
};

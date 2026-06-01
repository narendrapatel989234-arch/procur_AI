const tokens = require('./src/tokens/tailwind-theme.js')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: tokens,
  },
  plugins: [],
}
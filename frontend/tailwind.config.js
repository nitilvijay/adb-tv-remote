/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tv-bg': '#121212',
        'tv-card': '#1e1e1e',
        'tv-primary': '#bb86fc',
        'tv-secondary': '#03dac6',
      }
    },
  },
  plugins: [],
}

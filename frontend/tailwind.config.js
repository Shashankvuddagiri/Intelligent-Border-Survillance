/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0b10',
        'bg-card': 'rgba(18, 20, 28, 0.8)',
        'secondary': '#94a3b8',
        'border-color': 'rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}

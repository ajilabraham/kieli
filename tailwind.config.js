/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        surface: '#f7f9fb',
        secondary: '#f0f4f7',
        card: '#ffffff',
        primary: '#395e9f',
        gradientEnd: '#92b6fd',
        brandText: '#2c3437',
      },
    },
  },
  plugins: [],
}


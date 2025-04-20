/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          primary: '#50C878',
        },
        powder: {
          blue: '#B0E0E6',
        },
        accent: {
          red: '#b31b00',
        },
      },
    },
  },
  plugins: [],
} 
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: {
          primary: '#50C878',
          dark: '#3DA261',
        },
        powder: {
          blue: '#B0E0E6',
          dark: '#8BAFB4',
        },
        accent: {
          red: '#b31b00',
          dark: '#8C1500',
        },
      },
    },
  },
  plugins: [],
} 
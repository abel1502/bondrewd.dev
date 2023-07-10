/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "primary": "#454545",
        "secondary": "#9f6cd2",
        "primary-dark": "#353535",
        "primary-text": "#e8e8e8",
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}


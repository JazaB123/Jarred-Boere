/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      colors: {
        cyber: {
          blue: '#1a6bff',
          purple: '#8b2be2',
          pink: '#ff2d78',
          cyan: '#00f0ff',
        },
        win98: {
          gray: '#c0c0c0',
          darkgray: '#808080',
          blue: '#000080',
          white: '#ffffff',
          silver: '#dfdfdf',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: '#e2dc54',
        forest: '#266433',
        mint: '#d1efca',
        deepblue: '#032f98',
        sky: '#add0ee',
        berry: '#6d2459',
        tangerine: '#f45c27',
        lavender: '#d1c4e9',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F0EDE8',
        'cream-light': '#FAF9F7',
        'cream-dark': '#E5E0D8',
        'brown-deep': '#3A2415',
        'brown-dark': '#2A1A0E',
        'brown-mid': '#7A6555',
        'brown-light': '#A89585',
        border: '#DDD8D0'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Jost', 'Helvetica Neue', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};

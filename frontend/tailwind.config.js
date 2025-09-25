/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(15 23 42)', // slate-900
          foreground: 'rgb(241 245 249)', // slate-100
        },
        accent: {
          DEFAULT: 'rgb(79 70 229)', // indigo-600
          hover: 'rgb(67 56 202)', // indigo-700
        },
        background: 'rgb(255 255 255)', // white
        card: {
          DEFAULT: 'rgb(255 255 255)', // white
          foreground: 'rgb(15 23 42)', // slate-900
        },
        border: 'rgb(226 232 240)', // slate-200
        input: 'rgb(226 232 240)', // slate-200
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

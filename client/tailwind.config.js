/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff5f6',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fea3b4',
          400: '#fb718e',
          500: '#f43f68',
          600: '#e11d4d',
          700: '#be123c',
          800: '#9f1237',
          900: '#831834',
        },
        blush: {
          50: '#fdfbfb',
          100: '#fcf3f4',
          200: '#f9e3e6',
          300: '#f3c7ce',
          400: '#e9a1ad',
          500: '#dc7a8c',
          600: '#c5576c',
          700: '#a34153',
          800: '#863846',
          900: '#6f323c',
        },
        lavender: {
          50: '#faf7fd',
          100: '#f3edfa',
          200: '#e9dcf5',
          300: '#d7beef',
          400: '#be95e4',
          500: '#a56ed6',
          600: '#8d4fc4',
          700: '#753ea4',
          800: '#613486',
          900: '#512d6e',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfaf5',
          200: '#fbf4ea',
          300: '#f6e9d6',
        },
        sage: {
          50: '#f4f8f5',
          100: '#e4eee6',
          500: '#4e8560',
          600: '#3e6a4d',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(225, 29, 77, 0.06)',
        'float': '0 20px 40px rgba(131, 24, 67, 0.08)',
        'inner-light': 'inset 0 2px 4px rgba(255, 255, 255, 0.6)',
      },
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.85' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'pulse-gentle': 'pulse-gentle 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}

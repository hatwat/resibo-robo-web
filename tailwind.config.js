/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f0f4ff',
          100: '#d6e0f7',
          200: '#adc1ef',
          300: '#7a9add',
          400: '#4d74c4',
          500: '#2a52a0',
          600: '#1b3a7a',
          700: '#122759',
          800: '#0b1a3d',
          900: '#060e24',
        },
        accent: {
          gold:  '#C9A84C',
          amber: '#F5A623',
          red:   '#FF4D4D',
          blue:  '#4A90D9',
          green: '#00C48C',
        }
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
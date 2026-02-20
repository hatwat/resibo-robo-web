/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      colors: {
        navy: {
          50:  '#eef3fb',
          100: '#d5e2f5',
          200: '#adc5eb',
          300: '#7aa0db',
          400: '#4a7ac8',
          500: '#2a5aad',
          600: '#1a3f85',
          700: '#112b60',
          800: '#0b1d40',
          900: '#060e24',
          950: '#030812',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#C9A84C',
          600: '#a87d28',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        ink: {
          50:  '#f0f4ff',
          100: '#dce6f8',
          200: '#b8cdf1',
          300: '#8aaae0',
          400: '#5c82c9',
          500: '#3660a8',
          600: '#234480',
          700: '#152d5e',
          800: '#0c1d3d',
          900: '#060e20',
        },
        accent: {
          gold:  '#C9A84C',
          green: '#10b981',
          blue:  '#4a7ac8',
          red:   '#ef4444',
        }
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'gold': '0 0 0 2px #C9A84C',
        'card': '0 4px 24px 0 rgba(10,30,80,0.10)',
      }
    },
  },
  plugins: [],
}
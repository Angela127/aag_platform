/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        aag: {
          primary: '#870105',
          'primary-dark': '#5e0003',
          'primary-light': '#a8000a',
          accent: '#ffe4d1',
          'accent-mid': '#ffc4a0',
        },
        surface: {
          DEFAULT: '#f8f7f5',
          card: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)',
        'card-hover': '0 10px 30px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06)',
        'modal': '0 20px 50px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
        'slide-up': 'slideUp 0.35s ease-out both',
        'slide-down': 'slideDown 0.2s ease-out both',
        'scale-in': 'scaleIn 0.2s ease-out both',
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

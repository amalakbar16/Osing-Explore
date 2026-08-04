/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#F7F3EE',
        surface: '#FFFFFF',
        'surface-alt': '#F0EBE3',
        'accent-primary': '#0D8A82',
        'accent-gold': '#B8860B',
        'accent-rose': '#C0392B',
        ink: '#1C1917',
        'ink-muted': '#6B7280',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'colored-teal': '0 10px 25px -5px rgba(13, 138, 130, 0.2)',
        'colored-gold': '0 10px 25px -5px rgba(184, 134, 11, 0.15)',
        'colored-blue': '0 10px 25px -5px rgba(59, 130, 246, 0.15)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      fontSize: {
        'display-sm': '1.75rem',
        'display-md': '2.25rem',
        'display-lg': '3rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'dash-flow': {
          '0%': { strokeDashoffset: '10' },
          '100%': { strokeDashoffset: '0' },
        },
        'bobbing': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(5%)' },
        },
        'blob-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        'marquee-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.7s ease-out forwards',
        'dash-flow': 'dash-flow 10s linear infinite',
        'bobbing': 'bobbing 4s ease-in-out infinite',
        'blob-float': 'blob-float 15s ease-in-out infinite',
        'marquee-scroll': 'marquee-scroll 25s linear infinite',
        'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

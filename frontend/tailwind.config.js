import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A1A1A",
          light: "#2D2D2D",
        },
        secondary: {
          DEFAULT: "#DC143C",
          light: "#FF6B6B",
        },
        accent: "#C41E3A",
        success: "#4CAF50",
        danger: "#F44336",
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        body: ["Noto Serif", "serif"],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
}
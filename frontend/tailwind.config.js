/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070A10',
          900: '#0B0F19',
          850: '#101726',
          800: '#162035',
          700: '#1E2D4A',
          600: '#2A3C60',
        },
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B8DCFF',
          400: '#38BDF8',
          500: '#0284C7',
          600: '#0369A1',
          700: '#075985',
        },
        civic: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          indigo: '#6366F1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(2, 132, 199, 0.15)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '24px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
}

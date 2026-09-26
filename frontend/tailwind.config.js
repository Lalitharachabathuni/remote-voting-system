/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VoteRemote New Civic Color System
        burgundy: {
          DEFAULT: '#5A2633', // Primary Deep Burgundy
          50: '#F7F0F2',
          100: '#EEDEE2',
          200: '#D9BAC1',
          300: '#BE8C98',
          400: '#9E5B6B',
          500: '#7A3848',
          600: '#5A2633',
          700: '#481E29',
          800: '#38161F',
          900: '#2A1017',
        },
        terracotta: {
          DEFAULT: '#C75C3C', // Secondary Terracotta
          50: '#FDF5F2',
          100: '#FAE7E0',
          200: '#F4CFC2',
          300: '#EAB09D',
          400: '#DD846A',
          500: '#C75C3C',
          600: '#A9472A',
          700: '#8A351D',
          800: '#6C2815',
          900: '#531F10',
          red: '#B9473D', // Error Terracotta Red
        },
        saffron: {
          DEFAULT: '#E5A83B', // Accent Saffron
          50: '#FDF9F0',
          100: '#FAF1DC',
          200: '#F4E0B3',
          300: '#ECC97E',
          400: '#E5A83B',
          500: '#CA8B22',
          600: '#A66E17',
          700: '#815313',
          800: '#633F11',
          900: '#4B300F',
        },
        jade: {
          DEFAULT: '#2F8F83', // Secondary Accent / Success Jade
          50: '#F0F9F8',
          100: '#DBF0ED',
          200: '#B6E0DB',
          300: '#85C9C0',
          400: '#53ACA0',
          500: '#2F8F83',
          600: '#24746A',
          700: '#1D5A53',
          800: '#194742',
          900: '#153C37',
        },
        sand: {
          DEFAULT: '#F5F0E7', // Background Warm Sand
          50: '#FAF8F4',
          100: '#F5F0E7',
          200: '#EAE1D2',
          300: '#DED1BC',
          400: '#CDBCA1',
          500: '#BBA484',
        },
        sandstone: {
          DEFAULT: '#DED6CA', // Border Sandstone
          100: '#EFEAE2',
          200: '#DED6CA',
          300: '#C9BEAF',
          400: '#B1A392',
        },
        warmwhite: {
          DEFAULT: '#FFFDF8', // Surface Warm White
          50: '#FFFFFF',
          100: '#FFFDF8',
          200: '#FAF6EE',
        },
        charcoal: {
          DEFAULT: '#252322', // Text Charcoal
          50: '#F6F5F5',
          100: '#E5E3E2',
          200: '#C8C5C4',
          300: '#A5A19F',
          400: '#756E67',
          500: '#4E4945',
          600: '#3A3634',
          700: '#2F2B2A',
          800: '#252322',
          900: '#1A1817',
        },
        warmgray: {
          DEFAULT: '#756E67', // Secondary Text Warm Gray
          50: '#F7F6F5',
          100: '#E9E7E5',
          200: '#D4D0CD',
          300: '#B7B1AC',
          400: '#948D86',
          500: '#756E67',
          600: '#5D5751',
          700: '#47423E',
        },
        // Semantic Aliases & Compatibility mappings
        background: {
          DEFAULT: '#F5F0E7', // Warm Sand
          surface: '#FFFDF8',   // Warm White
          elevated: '#FFFFFF',
          dark: '#5A2633',      // Deep Burgundy
          charcoal: '#252322',
        },
        card: {
          DEFAULT: '#FFFDF8',  // Warm White
          elevated: '#FFFFFF',
          dark: '#5A2633',
        },
        border: {
          DEFAULT: '#DED6CA', // Sandstone
          light: '#EFEAE2',
          dark: '#481E29',
        },
        brand: {
          DEFAULT: '#5A2633', // Deep Burgundy
          50: '#F7F0F2',
          100: '#EEDEE2',
          200: '#D9BAC1',
          300: '#BE8C98',
          400: '#9E5B6B',
          500: '#7A3848',
          600: '#5A2633',
          700: '#481E29',
          800: '#38161F',
          900: '#2A1017',
        },
        // Backward-compatibility aliases mapped cleanly to new palette
        ivory: {
          DEFAULT: '#F5F0E7',
          warm: '#F5F0E7',
          50: '#FAF8F4',
          100: '#F5F0E7',
          200: '#EAE1D2',
        },
        pearl: {
          DEFAULT: '#FFFDF8',
          50: '#FFFFFF',
          100: '#FFFDF8',
          200: '#FAF6EE',
        },
        teal: {
          DEFAULT: '#5A2633', // mapped to Deep Burgundy
          deep: '#5A2633',
          electric: '#2F8F83', // mapped to Jade
          50: '#F0F9F8',
          100: '#DBF0ED',
          200: '#B6E0DB',
          300: '#85C9C0',
          400: '#53ACA0',
          500: '#2F8F83',
          600: '#24746A',
          700: '#481E29',
          800: '#5A2633',
          900: '#38161F',
          950: '#2A1017',
        },
        amethyst: {
          DEFAULT: '#C75C3C', // mapped to Terracotta
          royal: '#C75C3C',
          50: '#FDF5F2',
          100: '#FAE7E0',
          200: '#F4CFC2',
          300: '#EAB09D',
          400: '#DD846A',
          500: '#C75C3C',
          600: '#A9472A',
          700: '#8A351D',
          800: '#6C2815',
          900: '#531F10',
        },
        coral: {
          DEFAULT: '#B9473D',
          50: '#FDF5F5',
          400: '#DD5D52',
          500: '#B9473D',
          600: '#9E372E',
        },
        amber: {
          DEFAULT: '#E5A83B', // mapped to Saffron
          warm: '#E5A83B',
          50: '#FDF9F0',
          300: '#ECC97E',
          400: '#E5A83B',
          500: '#CA8B22',
          600: '#A66E17',
        },
        slate: {
          muted: '#756E67',
          50: '#F7F6F5',
          100: '#E9E7E5',
          200: '#D4D0CD',
          300: '#B7B1AC',
          400: '#948D86',
          500: '#756E67',
          600: '#5D5751',
          700: '#47423E',
          800: '#3A3634',
          900: '#252322',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(90, 38, 51, 0.05)',
        'card': '0 4px 20px -2px rgba(90, 38, 51, 0.06), 0 2px 6px -1px rgba(90, 38, 51, 0.03)',
        'elevated': '0 12px 36px -4px rgba(90, 38, 51, 0.1), 0 4px 12px -2px rgba(90, 38, 51, 0.05)',
        'glow-burgundy': '0 0 25px rgba(90, 38, 51, 0.22)',
        'glow-terracotta': '0 0 25px rgba(199, 92, 60, 0.25)',
        'glow-jade': '0 0 25px rgba(47, 143, 131, 0.25)',
        'glow-saffron': '0 0 25px rgba(229, 168, 59, 0.25)',
      },
    },
  },
  plugins: [],
}

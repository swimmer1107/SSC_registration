import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#030A03',
          900: '#0A1A0A',
          800: '#1B5E20',
          700: '#2E7D32',
          600: '#388E3C',
          500: '#4CAF50',
          400: '#66BB6A',
          300: '#A5D6A7',
          200: '#C8E6C9',
          100: '#E8F5E9',
          50:  '#F0FFF0',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        space: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'green-glow': '0 0 30px rgba(76,175,80,0.3)',
        'green-glow-lg': '0 0 60px rgba(76,175,80,0.4)',
      },
      animation: {
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'count-up': 'count-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config

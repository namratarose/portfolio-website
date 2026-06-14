import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#070B14',
        primary: { DEFAULT: '#7C5CFF', foreground: '#ffffff' },
        secondary: { DEFAULT: '#61DAFB', foreground: '#070B14' },
        accent: { DEFAULT: '#FF7AE5', foreground: '#070B14' },
        highlight: { DEFAULT: '#F9D423', foreground: '#070B14' },
        surface: { DEFAULT: '#0D1321', elevated: '#111827', border: '#1E293B' },
        muted: { DEFAULT: '#64748B', foreground: '#94A3B8' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Fira Code', 'monospace'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'aurora': 'linear-gradient(135deg, #7C5CFF20, #61DAFB20, #FF7AE520)',
        'glow-primary': 'radial-gradient(circle at center, #7C5CFF40, transparent 70%)',
        'glow-secondary': 'radial-gradient(circle at center, #61DAFB40, transparent 70%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px #7C5CFF60, 0 0 40px #7C5CFF30',
        'glow-secondary': '0 0 20px #61DAFB60, 0 0 40px #61DAFB30',
        'glow-accent': '0 0 20px #FF7AE560, 0 0 40px #FF7AE530',
        'glow-highlight': '0 0 20px #F9D42360, 0 0 40px #F9D42330',
        'card': '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.5)',
        'card-hover': '0 20px 40px -10px rgba(124,92,255,0.3)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.1)',
      },
      animation: {
        'orbit': 'orbit var(--orbit-duration, 20s) linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'aurora': 'aurora 8s ease infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'typing': 'typing 3s steps(40) 1s forwards',
        'blink': 'blink 1s step-end infinite',
        'spin-slow': 'spin 20s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0,0,0.2,1) infinite',
        'tilt': 'tilt 10s infinite linear',
        'shimmer': 'shimmer 2s linear infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(var(--orbit-start, 0deg)) translateX(var(--orbit-radius, 150px)) rotate(calc(-1 * var(--orbit-start, 0deg)))' },
          '100%': { transform: 'rotate(calc(var(--orbit-start, 0deg) + 360deg)) translateX(var(--orbit-radius, 150px)) rotate(calc(-1 * (var(--orbit-start, 0deg) + 360deg)))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        tilt: {
          '0%, 50%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(0.5deg)' },
          '75%': { transform: 'rotate(-0.5deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config

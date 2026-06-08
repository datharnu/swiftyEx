import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // colors: {
      //   ink: {
      //     DEFAULT: '#ffff',
      //     2: '#110E1C',
      //     3: '#1A1528',
      //     4: '#221D33',
      //     5: '#2D2744',
      //   },
      //   vio: {
      //     DEFAULT: '#8B6FD4',
      //     2: '#A98EE8',
      //     3: '#C4B0F5',
      //     dim: 'rgba(139,111,212,0.10)',
      //     glow: 'rgba(139,111,212,0.22)',
      //   },
      //   jade: {
      //     DEFAULT: '#32C98B',
      //     dim: 'rgba(50,201,139,0.10)',
      //   },
      //   rose: {
      //     DEFAULT: '#E85C6A',
      //     dim: 'rgba(232,92,106,0.10)',
      //   },
      //   gold: {
      //     DEFAULT: '#E2B14A',
      //     dim: 'rgba(226,177,74,0.12)',
      //   },
      //   sky: {
      //     DEFAULT: '#5BB8F5',
      //     dim: 'rgba(91,184,245,0.10)',
      //   },
      //   snow: '#F2EEF9',
      //   mist: '#9B93B8',
      //   fog: '#544D6B',
      // },
      fontFamily: {
        sans: ['Cabinet Grotesk', 'sans-serif'],
        display: ['Clash Display', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        app: '430px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config

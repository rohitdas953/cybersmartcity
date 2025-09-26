/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0078ff',
          dark: '#0057b8',
        },
        secondary: {
          light: '#61efff',
          DEFAULT: '#00d8ff',
          dark: '#00a3c4',
        },
        danger: {
          light: '#ff6b6b',
          DEFAULT: '#ff3333',
          dark: '#cc0000',
        },
        warning: {
          light: '#ffd166',
          DEFAULT: '#ffb400',
          dark: '#cc9000',
        },
        success: {
          light: '#6bff84',
          DEFAULT: '#33ff57',
          dark: '#00cc29',
        },
        dark: {
          light: '#2d3748',
          DEFAULT: '#1a202c',
          dark: '#171923',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
}
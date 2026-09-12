
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0c0c0f',
          raised: '#131316',
          elevated: '#1a1a1f',
          border: '#252529',
        },
        warm: {
          50: '#f5f3ee',
          100: '#e8e6e1',
          200: '#d5d2cb',
          300: '#b8b4ab',
          400: '#9a968d',
          500: '#7c7a75',
          600: '#5e5c58',
          700: '#3d3c39',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#dabe62',
          dark: '#a88a3a',
          muted: 'rgba(201, 168, 76, 0.08)',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

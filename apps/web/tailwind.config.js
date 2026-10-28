const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/app/**/*.{js,ts,jsx,tsx,mdx}'),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pley: {
          lime: '#D7FF64',
          purple: '#7655F7',
          coral: '#FF795D',
          sky: '#78D8FF',
          cream: '#FFF9EF',
          ink: '#242424',
          white: '#FFFFFF',
          purpleDark: '#5c3fd6',
          limeDark: '#bce83e',
          coralDark: '#e65c3e',
        },
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        tactile: '4px 4px 0px #242424',
        'tactile-sm': '2px 2px 0px #242424',
        'tactile-lg': '6px 6px 0px #242424',
        'tactile-xl': '8px 8px 0px #242424',
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};


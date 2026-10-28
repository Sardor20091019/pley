import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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

export default config;


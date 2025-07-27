/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/pages/**/*.vue',
    './src/layouts/**/*.vue',
    './src/components/**/*.vue',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '16px',
      },
    },
  },
  plugins: [],
};

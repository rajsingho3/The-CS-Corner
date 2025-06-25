/** @type {import('tailwindcss').Config} */
import flowbitePlugin from 'flowbite/plugin';
import scrollbarPlugin from 'tailwind-scrollbar';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    flowbitePlugin,
    scrollbarPlugin,
  ],
};

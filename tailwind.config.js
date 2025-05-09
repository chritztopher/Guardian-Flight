/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // If you also use the pages directory
    './components/**/*.{js,ts,jsx,tsx,mdx}', // If you create a components directory
 
    // Or if using `src` directory:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      rotate: {
        '180': '180deg',
      },
      transitionProperty: {
        'transform': 'transform',
      }
    },
  },
  plugins: [],
} 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          blue: '#A7C7E7',    // Soft blue like the sky
          green: '#C1E1C1',   // Soft green like grass
          pink: '#F8C8DC',    // Soft pink like cotton candy
          purple: '#C3B1E1',  // Soft purple like lavender
          yellow: '#FDFD96',  // Soft yellow like sunshine
          peach: '#FFDAB9',   // Soft peach color
        }
      },
    },
  },
  plugins: [],
}

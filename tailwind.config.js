/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1F4172',
        'custom-blue': 'rgb(42, 124, 190)',
    },
    backgroundImage: {
      'hero': "url('https://4kwallpapers.com/images/walls/thumbs_3t/10876.jpg')"
    },
    fontFamily: {
      'manrope': ['Manrope', 'sans-serif'],
    },
  },
},
  plugins: [],
}
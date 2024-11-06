/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1F4172',
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
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./templates/**/*.html", "./static/js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};

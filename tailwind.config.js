/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // if using app dir (Next.js 13+)
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require("tailwind-scrollbar-hide"),
  ],
}

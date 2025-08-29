/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F3EDEA", // light tint of cream
          100: "#EDE7C7",
          200: "#8B0101",
          300: "#5B0302",
          400: "#200E00",
        },
        brand: {
          cream: "#EDE7C7",
          red: "#8B0101",
          maroon: "#5B0302",
          espresso: "#200E00",
        },
        lightblue:{
          50:"#eff7fe"
        }
      },
    },
  },
  plugins: [],
};

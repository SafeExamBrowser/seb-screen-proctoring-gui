const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./public/**/*.html", 
    "./src/**/*.{vue,js}"
  ],
  theme: {
    extend: {
      colors: { 
        primary: colors.slate,
        eth: {
          red: "rgb(210, 32, 53)",
          green: "rgb(100, 201, 79)",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B42318",
        secondary: "#475467",
        bg: "#F9FAFB",
        pinkBg: "#FEF3F2",
        grey: "#1D2939",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        xs: "480px",
        mds: "600px",
        md: "800px",
        lgss: "976px",
        lg: "1000px",
        xxl: "1300px",
      },
    },
  },
  variants: {},
  plugins: [],
};

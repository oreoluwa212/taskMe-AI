/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0034EE",
        secondary: "#00114F",
        bg: "#F9FAFB",
        dashboardBg: "#FAFAFA",
        grey: "#1D2939",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        bricolageGrotesque: ["Bricolage Grotesque", "sans-serif"],
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

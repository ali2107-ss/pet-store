/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fly-to-top-right": "fly-to-top-right 0.8s ease-out forwards",
      },
      keyframes: {
        "fly-to-top-right": {
          "0%": {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "translate(600%, -600%) scale(0.2)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};

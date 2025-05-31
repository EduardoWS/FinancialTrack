import { colors } from "./styles/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // Principal!
    "./components/**/*.{js,jsx,ts,tsx}", // Componentes
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colors
    },
  },
  plugins: [],
}


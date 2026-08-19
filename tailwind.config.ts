import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2533",
          50: "#F4F6F8",
          100: "#E5E9EE",
          800: "#17202C",
          900: "#101620",
        },
        emerald: {
          DEFAULT: "#2D8A4E",
          50: "#F0F9F3",
          100: "#DDF2E4",
          200: "#B9E5C8",
          300: "#8DD4A7",
          400: "#5CBF83",
          500: "#2D8A4E",
          600: "#247340",
          700: "#1C5B32",
          800: "#164727",
          900: "#11381F",
        },
        amber: {
          DEFAULT: "#C59B27",
          50: "#FAF7ED",
          100: "#F3ECD2",
          200: "#E6D8A2",
          300: "#D6C06B",
          400: "#CFA938",
          500: "#C59B27",
          600: "#A37D1A",
          700: "#806012",
          800: "#634911",
          900: "#523B11",
        },
        gold: {
          DEFAULT: "#C59B27",
          50: "#FAF7ED",
          100: "#F3ECD2",
          200: "#E6D8A2",
          300: "#D6C06B",
          400: "#CFA938",
          500: "#C59B27",
          600: "#A37D1A",
          700: "#806012",
        },
        parchment: {
          DEFAULT: "#FAF8F5",
          50: "#FDFBF7",
          100: "#FAF8F3",
          200: "#F3EFE6",
        },
      },
      boxShadow: {
        soft: "0 18px 55px rgba(27,37,51,.08)",
        gold: "0 10px 30px rgba(197,155,39,.25)",
        emerald: "0 10px 30px rgba(45,138,78,.25)",
      },
    },
  },
  plugins: [],
};

export default config;
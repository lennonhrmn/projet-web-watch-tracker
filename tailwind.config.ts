import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        '72': '18rem',  // 288px
        '80': '20rem',  // 320px
        '96': '24rem',  // 384px
        // Add as many as you need...
      },
      screens: {
        'xs': '200px',
        'sm2': '400px',
        'sm1': '587px',
        'md2': '720px',
        'md1': '848px',
        'lg': '992px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
};
export default config;

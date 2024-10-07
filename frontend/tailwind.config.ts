import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#2B2B2B',
        'cyber-darker': '#1F1F1F',
        'cyber-primary': '#9c78ff',
      },
    },
  },
  plugins: [],
}
export default config;

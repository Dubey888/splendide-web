import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Nota: Al usar Tailwind v4, los colores y fuentes ya se procesan 
      // de forma nativa mediante el bloque @theme en app/globals.css
    },
  },
  plugins: [],
};

export default config;
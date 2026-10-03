/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./404.html",
    "./**/*.html",
    "./*.js",
    "./scripts/**/*.js",
    "./assets/**/*.js",
    "./data/**/*.json"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
          navy: "#0a1128",
          blue: "#0066ff",
          cyan: "#00e5ff",
          emerald: "#10b981",
          slate: "#0f172a"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"]
      }
    },
  },
  plugins: [],
}

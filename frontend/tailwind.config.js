/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aegis: {
          bg: "#0B0F17",
          card: "#121824",
          cardHover: "#162030",
          border: "#1E293B",
          cyan: "#00D2FF",
          cyanGlow: "rgba(0, 210, 255, 0.15)",
          red: "#EF4444",
          redGlow: "rgba(239, 68, 68, 0.15)",
          amber: "#F59E0B",
          amberGlow: "rgba(245, 158, 11, 0.15)",
          green: "#10B981",
          greenGlow: "rgba(16, 185, 129, 0.15)",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

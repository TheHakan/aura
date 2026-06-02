/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },
      colors: {
        cyber: {
          bg: "#0a0a0f",
          surface: "#0f0f1a",
          border: "#1a1a2e",
          green: "#00ff88",
          cyan: "#00d4ff",
          purple: "#7b2fff",
          red: "#ff2d55",
          yellow: "#ffcc00",
          dim: "#2a2a3e",
          muted: "#4a4a6a",
          text: "#c8d8e8",
        },
      },
      backgroundImage: {
        "scan-lines":
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.02) 2px, rgba(0,255,136,0.02) 4px)",
        "grid-pattern":
          "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      animation: {
        "scan": "scan 4s linear infinite",
        "blink": "blink 1s step-end infinite",
        "flicker": "flicker 0.15s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0,255,136,0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(0,255,136,0.6), 0 0 40px rgba(0,255,136,0.2)" },
        },
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", "monospace"],
        rajdhani: ["'Rajdhani'", "sans-serif"],
        exo: ["'Exo 2'", "sans-serif"],
      },
      colors: {
        void:    "#03030a",
        carbon:  "#08080f",
        panel:   "#0c0c18",
        glass:   "rgba(12,12,24,0.75)",
        nred:    "#ff1e3c",
        ncyan:   "#00e5ff",
        ngreen:  "#00ff9d",
        nyellow: "#ffd000",
        nblue:   "#0099ff",
        npurple: "#b347ff",
        dim:     "#6b7280",
        muted:   "#374151",
      },
      animation: {
        "pulse-fast":  "pulse 0.8s ease-in-out infinite",
        "spin-slow":   "spin 12s linear infinite",
        "float":       "float 4s ease-in-out infinite",
        "scan":        "scan 2s ease-in-out infinite",
        "flicker":     "flicker 3s ease-in-out infinite",
        "wave":        "wave 1.2s ease-in-out infinite",
        "glow-red":    "glowRed 2s ease-in-out infinite",
      },
      keyframes: {
        float:   { "0%,100%": { transform:"translateY(0)" }, "50%": { transform:"translateY(-8px)" } },
        scan:    { "0%,100%": { opacity:"0.2" }, "50%": { opacity:"1" } },
        flicker: { "0%,100%": { opacity:"1" }, "50%": { opacity:"0.7" }, "75%": { opacity:"0.9" } },
        wave:    { "0%,100%": { transform:"scaleY(0.3)" }, "50%": { transform:"scaleY(1)" } },
        glowRed: { "0%,100%": { boxShadow:"0 0 10px #ff1e3c44" }, "50%": { boxShadow:"0 0 30px #ff1e3c, 0 0 60px #ff1e3c44" } },
      },
      backdropBlur: { xs:"2px", xl:"24px" },
    },
  },
  plugins: [],
};
export default config;

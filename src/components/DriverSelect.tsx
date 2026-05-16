"use client";
import { motion } from "framer-motion";
import { Driver, DRIVERS } from "@/data/telemetry";

interface Props { onSelect: (driver: Driver) => void; }

const TEAM_GRADIENTS: Record<string, string> = {
  "Red Bull Racing":  "from-blue-900/40 to-blue-800/20",
  "Scuderia Ferrari": "from-red-900/40 to-red-800/20",
  "Mercedes AMG":     "from-emerald-900/40 to-emerald-800/20",
  "McLaren Racing":   "from-orange-900/40 to-orange-800/20",
};

const TEAM_ACCENT: Record<string, string> = {
  "Red Bull Racing":  "#1d4ed8",
  "Scuderia Ferrari": "#dc2626",
  "Mercedes AMG":     "#059669",
  "McLaren Racing":   "#ea580c",
};

const POSITION_LABELS = ["P1", "P2", "P3", "P4"];

export default function DriverSelect({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10"
    >
      <div className="ambient-bg" />
      <div className="grid-overlay" />
      <div className="scan-line" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-14"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.span
            className="text-4xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >🏎</motion.span>
          <h1
            className="orb font-black text-4xl tracking-widest"
            style={{
              background: "linear-gradient(135deg,#fff,#ff1e3c)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >RACEMATE AI</h1>
        </div>
        <div className="orb text-[0.65rem] tracking-[0.35em] text-dim uppercase mb-2">
          Monaco Grand Prix · Select Your Driver
        </div>
        <div className="flex items-center justify-center gap-2 text-nred/60 text-[0.58rem] orb tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-nred animate-pulse" />
          LIVE · LAP 12 OF 57
        </div>
      </motion.div>

      {/* Driver grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl">
        {DRIVERS.map((driver, i) => {
          const accent = TEAM_ACCENT[driver.team] ?? "#ff1e3c";
          const grad   = TEAM_GRADIENTS[driver.team] ?? "from-gray-900/40 to-gray-800/20";
          return (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 180, damping: 22 }}
              onClick={() => onSelect(driver)}
              className={`driver-card bg-gradient-to-br ${grad}`}
            >
              {/* Position badge */}
              <div
                className="absolute top-3 left-3 orb text-[0.55rem] font-bold tracking-widest px-2 py-0.5 rounded"
                style={{ background: `${accent}22`, border: `1px solid ${accent}44`, color: accent }}
              >
                {POSITION_LABELS[i]}
              </div>

              {/* Gap badge */}
              <div className="absolute top-3 right-3 orb text-[0.52rem] tracking-widest text-dim/60">
                {driver.gap}
              </div>

              {/* Driver emoji / avatar */}
              <div className="flex flex-col items-center pt-10 pb-6 px-5">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-5xl mb-5 relative"
                  style={{ background: `${accent}18`, border: `2px solid ${accent}30`, boxShadow: `0 0 30px ${accent}20` }}
                >
                  <span>{driver.emoji}</span>
                  {/* Number overlay */}
                  <div
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center orb text-[0.7rem] font-black"
                    style={{ background: accent, boxShadow: `0 0 12px ${accent}66` }}
                  >
                    {driver.number}
                  </div>
                </div>

                {/* Name */}
                <div className="orb font-bold text-base tracking-wider text-center mb-1" style={{ color: "#f0f2ff" }}>
                  {driver.name.split(" ")[0]}
                </div>
                <div className="orb font-black text-xl tracking-widest text-center" style={{ color: accent, textShadow: `0 0 16px ${accent}55` }}>
                  {driver.name.split(" ").slice(1).join(" ").toUpperCase()}
                </div>

                {/* Team */}
                <div className="raj text-[0.72rem] text-dim tracking-wide mt-2 text-center">
                  {driver.team}
                </div>

                {/* Bio */}
                <div className="raj text-[0.7rem] text-dim/60 text-center mt-3 leading-relaxed px-2">
                  {driver.bio}
                </div>

                {/* Flag + nationality */}
                <div className="flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-sm">{driver.flag}</span>
                  <span className="orb text-[0.5rem] tracking-widest text-dim/70">{driver.nationality.toUpperCase()}</span>
                </div>

                {/* CTA */}
                <motion.div
                  className="mt-5 w-full py-2.5 rounded-xl orb text-[0.58rem] tracking-[0.2em] font-bold text-center"
                  style={{
                    background: `linear-gradient(135deg, ${accent}44, ${accent}22)`,
                    border: `1px solid ${accent}55`,
                    color: "#fff",
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  SELECT DRIVER
                </motion.div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            </motion.div>
          );
        })}
      </div>

      {/* Bottom badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-4 mt-12"
      >
        {["⬛ IBM Granite", "⬡ Langflow", "🎙 Voice AI", "🏁 Monaco GP"].map(b => (
          <span key={b} className="orb text-[0.48rem] tracking-widest px-3 py-1.5 rounded-md border border-white/[0.07] text-dim/50">
            {b}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

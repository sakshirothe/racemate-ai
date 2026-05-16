"use client";
import { motion } from "framer-motion";
import { Driver, TelemetryRow } from "@/data/telemetry";

interface Props {
  driver: Driver;
  tel: TelemetryRow;
  onAdvanceLap: () => void;
  onResetRace: () => void;
  onBackToSelect: () => void;
}

export default function DashboardHeader({ driver, tel, onAdvanceLap, onResetRace, onBackToSelect }: Props) {
  const accentColor = {
    "Red Bull Racing":  "#1d4ed8",
    "Scuderia Ferrari": "#dc2626",
    "Mercedes AMG":     "#059669",
    "McLaren Racing":   "#ea580c",
  }[driver.team] ?? "#ff1e3c";

  return (
    <header className="relative z-20 flex items-center justify-between px-5 py-2.5 border-b border-white/[0.06]"
      style={{ background: "rgba(3,3,10,0.97)", backdropFilter: "blur(24px)" }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Left: back + logo */}
      <div className="flex items-center gap-4">
        <button onClick={onBackToSelect} className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.5rem] tracking-widest">
          ← GRID
        </button>
        <div className="flex items-center gap-2.5">
          <motion.span className="text-2xl" animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity }}>🏎</motion.span>
          <div>
            <div
              className="orb font-black text-base tracking-widest leading-none"
              style={{ background: "linear-gradient(135deg,#fff,#ff1e3c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >RACEMATE AI</div>
            <div className="orb text-[0.45rem] tracking-[0.3em] text-dim/60 mt-0.5">FORMULA 1 AI CO-PILOT</div>
          </div>
        </div>
      </div>

      {/* Center: driver + lap */}
      <div className="flex items-center gap-6">
        {/* Driver info */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xl"
            style={{ background: `${accentColor}22`, border: `1.5px solid ${accentColor}44` }}
          >{driver.emoji}</div>
          <div>
            <div className="orb font-bold text-sm tracking-wider" style={{ color: accentColor }}>{driver.name}</div>
            <div className="orb text-[0.48rem] tracking-widest text-dim/60">{driver.team} · #{driver.number}</div>
          </div>
        </div>

        {/* Lap counter */}
        <div className="text-center">
          <div className="flex items-center gap-2">
            <span className="orb text-[0.52rem] text-dim tracking-widest">LAP</span>
            <motion.span
              key={tel.lap}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="orb font-black text-2xl t-red"
            >{tel.lap}</motion.span>
            <span className="orb text-[0.52rem] text-dim tracking-widest">/ 57</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-nred"
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
            />
            <span className="orb text-[0.48rem] tracking-widest text-nred">LIVE</span>
          </div>
        </div>

        {/* Lap time */}
        <div className="text-center">
          <div className="orb text-[0.45rem] tracking-widest text-dim/50 mb-0.5">LAP TIME</div>
          <div className="orb font-bold text-base t-cyan">{tel.lap_time}</div>
        </div>
      </div>

      {/* Right: controls + badges */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <button onClick={onAdvanceLap} className="hud-btn hud-btn-red px-3 py-1.5 text-[0.5rem] tracking-widest">▶ NEXT LAP</button>
          <button onClick={onResetRace}  className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.5rem] tracking-widest">↩ RESET</button>
        </div>
        <div className="flex gap-1.5">
          <span className="orb text-[0.45rem] tracking-widest px-2 py-1 rounded border border-indigo-500/35 bg-indigo-500/10 text-indigo-300">⬛ Granite</span>
          <span className="orb text-[0.45rem] tracking-widest px-2 py-1 rounded border border-emerald-500/30 bg-emerald-500/08 text-emerald-300">⬡ Langflow</span>
        </div>
      </div>
    </header>
  );
}

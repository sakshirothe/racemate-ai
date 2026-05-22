"use client";
import { motion } from "framer-motion";

export type AppMode = "racer" | "fan" | "game" | "learn";

interface Props { onSelect: (mode: AppMode) => void; }

const MODES = [
  {
    id:       "racer" as AppMode,
    icon:     "🏎",
    title:    "RACER MODE",
    sub:      "AI Co-Pilot Dashboard",
    desc:     "Real-time AI race engineer. Telemetry, tire management, fuel strategy, and voice assistance — built for drivers.",
    color:    "#ff1e3c",
    gradient: "from-red-900/30 to-red-950/10",
    border:   "rgba(255,30,60,0.3)",
    glow:     "rgba(255,30,60,0.15)",
    tags:     ["AI Voice", "Telemetry", "Strategy", "Live Data"],
  },
  {
    id:       "fan" as AppMode,
    icon:     "🎧",
    title:    "FAN MODE",
    sub:      "AI Race Experience",
    desc:     "Understand every race moment with AI commentary, live strategy explanations, driver insights, and cinematic race breakdowns.",
    color:    "#0099ff",
    gradient: "from-blue-900/30 to-blue-950/10",
    border:   "rgba(0,153,255,0.3)",
    glow:     "rgba(0,153,255,0.15)",
    tags:     ["Commentary", "Strategy", "DRS", "Fan Insights"],
  },
  {
    id:       "game" as AppMode,
    icon:     "🎮",
    title:    "AI RACE EXPERIENCE",
    sub:      "Interactive Race Decisions",
    desc:     "Step into the cockpit. Make real race strategy calls. AI guides every decision. Feel what it's like to race at the limit.",
    color:    "#00ff9d",
    gradient: "from-emerald-900/30 to-emerald-950/10",
    border:   "rgba(0,255,157,0.3)",
    glow:     "rgba(0,255,157,0.15)",
    tags:     ["Strategy Game", "AI Guide", "Decisions", "Immersive"],
  },
  {
    id:       "learn" as AppMode,
    icon:     "📚",
    title:    "LEARNING HUB",
    sub:      "Formula Racing Academy",
    desc:     "From beginner to expert. AI-powered lessons on DRS, tyre strategy, race engineering, and everything F1.",
    color:    "#b347ff",
    gradient: "from-purple-900/30 to-purple-950/10",
    border:   "rgba(179,71,255,0.3)",
    glow:     "rgba(179,71,255,0.15)",
    tags:     ["DRS", "Tyres", "Strategy", "Beginner"],
  },
];

export default function ModeSelect({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <motion.span className="text-4xl" animate={{ y: [0,-5,0] }} transition={{ duration:3, repeat:Infinity }}>🏎</motion.span>
          <h1 className="orb font-black text-4xl tracking-widest"
            style={{ background:"linear-gradient(135deg,#fff,#ff1e3c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            RACEMATE AI
          </h1>
        </div>
        <p className="orb text-[0.62rem] tracking-[0.35em] text-dim uppercase">
          Formula 1 AI Operating System · Select Your Experience
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <motion.span className="w-1.5 h-1.5 rounded-full bg-nred" animate={{ opacity:[1,0.3,1] }} transition={{ duration:0.9, repeat:Infinity }} />
          <span className="orb text-[0.52rem] tracking-widest text-nred/70">IBM GRANITE · LANGFLOW · OPENF1</span>
        </div>
      </motion.div>

      {/* Mode cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl">
        {MODES.map((mode, i) => (
          <motion.div
            key={mode.id}
            initial={{ opacity:0, y:50, scale:0.9 }}
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ delay: 0.2 + i * 0.1, type:"spring", stiffness:160, damping:20 }}
            onClick={() => onSelect(mode.id)}
            className={`relative cursor-pointer rounded-2xl bg-gradient-to-br ${mode.gradient} overflow-hidden group`}
            style={{ border:`1px solid ${mode.border}` }}
            whileHover={{ y:-8, scale:1.02 }}
            whileTap={{ scale:0.98 }}
          >
            {/* Glow bg */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background:`radial-gradient(ellipse at 50% 0%, ${mode.glow}, transparent 70%)` }}
            />

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background:`linear-gradient(90deg, transparent, ${mode.color}, transparent)` }} />

            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: mode.color, opacity:0.5 }} />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: mode.color, opacity:0.5 }} />

            <div className="p-6 flex flex-col gap-4 relative z-10">
              {/* Icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background:`${mode.color}18`, border:`1px solid ${mode.color}30`, boxShadow:`0 0 24px ${mode.color}20` }}
                animate={{ boxShadow:[`0 0 16px ${mode.color}20`,`0 0 32px ${mode.color}40`,`0 0 16px ${mode.color}20`] }}
                transition={{ duration:2.5, repeat:Infinity }}
              >
                {mode.icon}
              </motion.div>

              {/* Title */}
              <div>
                <div className="orb font-black text-lg tracking-widest leading-none mb-1"
                  style={{ color: mode.color, textShadow:`0 0 16px ${mode.color}55` }}>
                  {mode.title}
                </div>
                <div className="orb text-[0.52rem] tracking-[0.15em] text-dim/60">{mode.sub}</div>
              </div>

              {/* Description */}
              <p className="raj text-sm text-dim/70 leading-relaxed">{mode.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {mode.tags.map(tag => (
                  <span key={tag} className="orb text-[0.42rem] tracking-widest px-2 py-0.5 rounded"
                    style={{ background:`${mode.color}15`, border:`1px solid ${mode.color}25`, color: mode.color }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                className="w-full py-2.5 rounded-xl orb text-[0.58rem] tracking-[0.2em] font-bold text-center mt-1"
                style={{ background:`linear-gradient(135deg,${mode.color}44,${mode.color}22)`, border:`1px solid ${mode.color}55`, color:"#fff" }}
                whileHover={{ boxShadow:`0 0 24px ${mode.color}44` }}
              >
                ENTER →
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
        className="flex gap-4 mt-10">
        {["⬛ IBM Granite","⬡ Langflow","📡 OpenF1 Live","🎙 Voice AI","🏁 Monaco GP"].map(b => (
          <span key={b} className="orb text-[0.45rem] tracking-widest px-3 py-1.5 rounded-md border border-white/[0.07] text-dim/40">{b}</span>
        ))}
      </motion.div>
    </motion.div>
  );
}

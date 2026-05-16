"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onComplete: () => void; }

const BOOT_LINES = [
  "INITIALIZING RACEMATE AI SYSTEMS...",
  "CONNECTING TO IBM GRANITE ENGINE...",
  "LOADING LANGFLOW PIPELINE...",
  "CALIBRATING TELEMETRY SENSORS...",
  "VOICE ASSISTANT ONLINE...",
  "ALL SYSTEMS GO — RACE CONTROL ACTIVE",
];

export default function IntroScreen({ onComplete }: Props) {
  const [phase, setPhase]         = useState<"boot"|"logo"|"subtitle"|"done">("boot");
  const [bootLine, setBootLine]   = useState(0);
  const [showSkip, setShowSkip]   = useState(false);

  useEffect(() => {
    // Boot sequence
    const interval = setInterval(() => {
      setBootLine(l => {
        if (l >= BOOT_LINES.length - 1) {
          clearInterval(interval);
          setTimeout(() => setPhase("logo"), 400);
          return l;
        }
        return l + 1;
      });
    }, 420);
    setTimeout(() => setShowSkip(true), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "logo") setTimeout(() => setPhase("subtitle"), 1200);
    if (phase === "subtitle") setTimeout(() => { setPhase("done"); onComplete(); }, 2200);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="intro-overlay flex-col gap-8"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Ambient lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px w-full"
                style={{
                  top: `${15 + i * 14}%`,
                  background: `linear-gradient(90deg, transparent, rgba(255,30,60,${0.03 + i * 0.01}), transparent)`,
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
              />
            ))}
          </div>

          {/* Corner brackets */}
          {[
            "top-4 left-4 border-l border-t",
            "top-4 right-4 border-r border-t",
            "bottom-4 left-4 border-l border-b",
            "bottom-4 right-4 border-r border-b",
          ].map((cls, i) => (
            <div key={i} className={`absolute w-8 h-8 border-nred/40 ${cls}`} />
          ))}

          {/* Boot phase */}
          {phase === "boot" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs text-nred/80 space-y-1.5 px-8 w-full max-w-lg"
            >
              {BOOT_LINES.slice(0, bootLine + 1).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-ngreen text-[0.6rem]">▶</span>
                  <span className="orb text-[0.58rem] tracking-widest" style={{ color: i === bootLine ? "#00ff9d" : "rgba(255,30,60,0.5)" }}>
                    {line}
                  </span>
                  {i === bootLine && (
                    <motion.span
                      className="inline-block w-1.5 h-3 bg-nred"
                      animate={{ opacity: [1,0,1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Logo phase */}
          {(phase === "logo" || phase === "subtitle") && (
            <div className="flex flex-col items-center gap-6">
              <motion.div
                className="text-7xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >🏎</motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="orb font-black text-center"
                style={{
                  fontSize: "clamp(2.5rem,8vw,5rem)",
                  background: "linear-gradient(135deg, #ffffff 0%, #ff1e3c 50%, #ff6b6b 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  letterSpacing: "0.12em",
                }}
              >
                RACEMATE AI
              </motion.div>

              {phase === "subtitle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="orb text-[0.65rem] tracking-[0.4em] text-dim uppercase"
                >
                  Formula 1 AI Co-Pilot Operating System
                </motion.div>
              )}

              {/* Horizontal scan */}
              <motion.div
                className="absolute left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #ff1e3c, transparent)" }}
                initial={{ top: "40%" }}
                animate={{ top: ["35%", "65%", "35%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          )}

          {/* Skip button */}
          {showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => { setPhase("done"); onComplete(); }}
              className="absolute bottom-8 right-8 orb text-[0.52rem] tracking-widest text-dim/50 hover:text-dim transition-colors"
            >
              SKIP INTRO ▶
            </motion.button>
          )}

          {/* Bottom bar */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <span className="orb text-[0.45rem] tracking-widest text-dim/30">IBM GRANITE</span>
            <span className="text-dim/20">·</span>
            <span className="orb text-[0.45rem] tracking-widest text-dim/30">LANGFLOW</span>
            <span className="text-dim/20">·</span>
            <span className="orb text-[0.45rem] tracking-widest text-dim/30">MONACO GRAND PRIX</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

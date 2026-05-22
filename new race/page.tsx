"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import IntroScreen     from "@/components/IntroScreen";
import ModeSelect      from "@/components/ModeSelect";
import DriverSelect    from "@/components/DriverSelect";
import DashboardHeader from "@/components/DashboardHeader";
import StatusCards     from "@/components/StatusCards";
import TrackMap        from "@/components/TrackMap";
import ChatPanel       from "@/components/ChatPanel";
import EmergencyPanel  from "@/components/EmergencyPanel";
import LiveDashboard   from "@/components/LiveDashboard";
import FanMode         from "@/components/fan/FanMode";
import GameMode        from "@/components/game/GameMode";
import LearnHub        from "@/components/learn/LearnHub";

import { Driver, TELEMETRY } from "@/data/telemetry";
import type { AppMode } from "@/components/ModeSelect";

type Screen = "intro" | "modeselect" | "driverselect" | "dashboard" | "fan" | "game" | "learn";
type Tab    = "cockpit" | "live";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [mode,   setMode]   = useState<AppMode>("racer");
  const [driver, setDriver] = useState<Driver | null>(null);
  const [lapIdx, setLapIdx] = useState(0);
  const [tab,    setTab]    = useState<Tab>("cockpit");

  const tel = TELEMETRY[lapIdx % TELEMETRY.length];

  function handleModeSelect(m: AppMode) {
    setMode(m);
    if (m === "racer")  setScreen("driverselect");
    if (m === "fan")    setScreen("fan");
    if (m === "game")   setScreen("game");
    if (m === "learn")  setScreen("learn");
  }

  function handleDriverSelect(d: Driver) {
    setDriver(d);
    setScreen("dashboard");
  }

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <div className="ambient-bg" />
      <div className="grid-overlay" />
      <div className="scan-line" />

      <AnimatePresence mode="wait">

        {/* ── INTRO ── */}
        {screen === "intro" && (
          <IntroScreen key="intro" onComplete={() => setScreen("modeselect")} />
        )}

        {/* ── MODE SELECT ── */}
        {screen === "modeselect" && (
          <motion.div key="modeselect"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}
          >
            <ModeSelect onSelect={handleModeSelect} />
          </motion.div>
        )}

        {/* ── DRIVER SELECT (Racer Mode) ── */}
        {screen === "driverselect" && (
          <motion.div key="driverselect"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
          >
            <DriverSelect onSelect={handleDriverSelect} />
          </motion.div>
        )}

        {/* ── RACER DASHBOARD ── */}
        {screen === "dashboard" && driver && (
          <motion.div key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen relative z-10"
          >
            <DashboardHeader
              driver={driver}
              tel={tel}
              onAdvanceLap={() => setLapIdx(i => i + 1)}
              onResetRace={() => setLapIdx(0)}
              onBackToSelect={() => setScreen("modeselect")}
            />

            {/* Tab switcher */}
            <div className="flex items-center gap-1 px-4 pt-3 pb-0">
              {([
                { id: "cockpit", label: "🏎 AI COCKPIT",   sub: "Voice + Telemetry" },
                { id: "live",    label: "📡 LIVE F1 DATA",  sub: "OpenF1 Real-Time"  },
              ] as { id: Tab; label: string; sub: string }[]).map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="px-4 py-2 rounded-t-xl transition-all"
                  style={{
                    background:   tab === t.id ? "rgba(14,14,26,0.90)" : "rgba(255,255,255,0.02)",
                    border:      `1px solid ${tab === t.id ? "rgba(255,30,60,0.25)" : "rgba(255,255,255,0.05)"}`,
                    borderBottom: tab === t.id ? "1px solid rgba(14,14,26,0.90)" : undefined,
                  }}
                >
                  <div className="orb text-[0.52rem] font-bold tracking-widest"
                    style={{ color: tab === t.id ? "#ff1e3c" : "#6b7280" }}>{t.label}</div>
                  <div className="orb text-[0.4rem] tracking-widest text-dim/40">{t.sub}</div>
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2 px-3">
                <motion.div className="w-1.5 h-1.5 rounded-full bg-ngreen"
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                <span className="orb text-[0.45rem] tracking-widest text-ngreen/70">AUTO-REFRESH 10s</span>
              </div>
            </div>

            <main className="flex-1 p-3 pt-0 overflow-auto"
              style={{ background: "rgba(14,14,26,0.90)", borderTop: "1px solid rgba(255,30,60,0.15)", margin: "0 16px", borderRadius: "0 12px 12px 12px" }}>
              <AnimatePresence mode="wait">

                {tab === "cockpit" && (
                  <motion.div key="cockpit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="pt-3 grid grid-rows-[auto_1fr] gap-3">
                    <StatusCards tel={tel} driverName={driver.name} />
                    <div className="grid grid-cols-12 gap-3">
                      <motion.div className="col-span-12 lg:col-span-4"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                        <TrackMap lap={tel.lap} rainProb={tel.rain_prob} selectedDriverId={driver.id} />
                      </motion.div>
                      <motion.div className="col-span-12 lg:col-span-5 flex flex-col"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <ChatPanel tel={tel} driverName={driver.name} />
                      </motion.div>
                      <motion.div className="col-span-12 lg:col-span-3 flex flex-col gap-3"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <EmergencyPanel tel={tel} />
                        <div className="hud-card bracket p-4 flex-1">
                          <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-3">🏁 PIT STRATEGY</div>
                          <div className="space-y-2.5">
                            {[
                              { label: "UNDERCUT",  val: tel.lap < 20 ? "OPEN" : "CLOSED",           color: tel.lap < 20 ? "#00ff9d" : "#ff1e3c" },
                              { label: "OVERCUT",   val: tel.lap > 25 ? "OPEN" : "CLOSED",           color: tel.lap > 25 ? "#00ff9d" : "#ff1e3c" },
                              { label: "PIT LAP",   val: `LAP ${Math.round(57 * 0.42)}`,             color: "#ffd000" },
                              { label: "COMPOUND",  val: "SOFT C4",                                   color: "#ff1e3c" },
                              { label: "RIVAL GAP", val: "+1.4s",                                    color: "#00e5ff" },
                              { label: "DRS",       val: tel.speed > 290 ? "ACTIVE" : "INACTIVE",    color: tel.speed > 290 ? "#00ff9d" : "#6b7280" },
                            ].map(({ label, val, color }) => (
                              <div key={label} className="flex items-center justify-between">
                                <span className="orb text-[0.48rem] tracking-widest text-dim/60">{label}</span>
                                <span className="orb text-[0.55rem] font-bold" style={{ color }}>{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {tab === "live" && (
                  <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-3">
                    <LiveDashboard lapIdx={lapIdx} onAdvance={() => setLapIdx(i => i + 1)} />
                  </motion.div>
                )}

              </AnimatePresence>
            </main>
          </motion.div>
        )}

        {/* ── FAN MODE ── */}
        {screen === "fan" && (
          <motion.div key="fan"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            <FanMode onBack={() => setScreen("modeselect")} />
          </motion.div>
        )}

        {/* ── GAME MODE ── */}
        {screen === "game" && (
          <motion.div key="game"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            <GameMode onBack={() => setScreen("modeselect")} />
          </motion.div>
        )}

        {/* ── LEARN HUB ── */}
        {screen === "learn" && (
          <motion.div key="learn"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="min-h-screen"
          >
            <LearnHub onBack={() => setScreen("modeselect")} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

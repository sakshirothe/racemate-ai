"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntroScreen      from "@/components/IntroScreen";
import DriverSelect     from "@/components/DriverSelect";
import DashboardHeader  from "@/components/DashboardHeader";
import StatusCards      from "@/components/StatusCards";
import TrackMap         from "@/components/TrackMap";
import ChatPanel        from "@/components/ChatPanel";
import EmergencyPanel   from "@/components/EmergencyPanel";
import { Driver, TELEMETRY } from "@/data/telemetry";

type Screen = "intro" | "select" | "dashboard";

export default function Home() {
  const [screen,   setScreen]   = useState<Screen>("intro");
  const [driver,   setDriver]   = useState<Driver | null>(null);
  const [lapIdx,   setLapIdx]   = useState(0);

  const tel = TELEMETRY[lapIdx % TELEMETRY.length];

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
          <IntroScreen key="intro" onComplete={() => setScreen("select")} />
        )}

        {/* ── DRIVER SELECT ── */}
        {screen === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <DriverSelect onSelect={handleDriverSelect} />
          </motion.div>
        )}

        {/* ── DASHBOARD ── */}
        {screen === "dashboard" && driver && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col min-h-screen relative z-10"
          >
            <DashboardHeader
              driver={driver}
              tel={tel}
              onAdvanceLap={() => setLapIdx(i => i + 1)}
              onResetRace={() => setLapIdx(0)}
              onBackToSelect={() => setScreen("select")}
            />

            <main className="flex-1 grid grid-rows-[auto_1fr] gap-3 p-3 overflow-hidden">
              {/* Status cards row */}
              <StatusCards tel={tel} driverName={driver.name} />

              {/* Main content: track | chat | alerts */}
              <div className="grid grid-cols-12 gap-3 overflow-hidden">

                {/* Track map — 4 cols */}
                <motion.div
                  className="col-span-12 lg:col-span-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TrackMap
                    lap={tel.lap}
                    rainProb={tel.rain_prob}
                    selectedDriverId={driver.id}
                  />
                </motion.div>

                {/* Chat + voice — 5 cols */}
                <motion.div
                  className="col-span-12 lg:col-span-5 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <ChatPanel tel={tel} driverName={driver.name} />
                </motion.div>

                {/* Alerts — 3 cols */}
                <motion.div
                  className="col-span-12 lg:col-span-3 flex flex-col gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <EmergencyPanel tel={tel} />

                  {/* Pit strategy card */}
                  <div className="hud-card bracket p-4 flex-1">
                    <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-3">🏁 PIT STRATEGY</div>
                    <div className="space-y-2.5">
                      {[
                        { label: "UNDERCUT WINDOW",  val: tel.lap < 20 ? "OPEN" : "CLOSED",  color: tel.lap < 20 ? "#00ff9d" : "#ff1e3c" },
                        { label: "OVERCUT WINDOW",   val: tel.lap > 25 ? "OPEN" : "CLOSED",  color: tel.lap > 25 ? "#00ff9d" : "#ff1e3c" },
                        { label: "OPTIMAL PIT LAP",  val: `LAP ${Math.round(57 * 0.42)}`,    color: "#ffd000" },
                        { label: "TIRE COMPOUND",    val: "SOFT C4",                          color: "#ff1e3c" },
                        { label: "RIVAL GAP",        val: "+1.4s",                            color: "#00e5ff" },
                        { label: "DRS WINDOW",       val: tel.speed > 290 ? "ACTIVE" : "INACTIVE", color: tel.speed > 290 ? "#00ff9d" : "#6b7280" },
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
            </main>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

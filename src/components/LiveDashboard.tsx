"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRealTimeF1, LiveDriver } from "@/hooks/useRealTimeF1";
import { compoundColor } from "@/lib/openf1";
import { TELEMETRY, fuelColor, statusColor, rainEmoji } from "@/data/telemetry";

interface Props {
  lapIdx:    number;
  onAdvance: () => void;
}

function CompoundBadge({ compound }: { compound: string }) {
  const color = compoundColor(compound);
  return (
    <span
      className="orb text-[0.45rem] font-bold px-1.5 py-0.5 rounded"
      style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
    >
      {compound || "?"}
    </span>
  );
}

function DriverRow({ driver, index }: { driver: LiveDriver; index: number }) {
  const isLeader = driver.position === 1;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
      style={{
        background:  isLeader ? `${driver.teamColor}12` : "rgba(255,255,255,0.02)",
        border:      `1px solid ${isLeader ? driver.teamColor + "30" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      {/* Position */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center orb font-black text-xs flex-shrink-0"
        style={{
          background:  isLeader ? driver.teamColor : "rgba(255,255,255,0.06)",
          color:       isLeader ? "#fff" : "#9ca3af",
          boxShadow:   isLeader ? `0 0 12px ${driver.teamColor}55` : "none",
        }}
      >
        {driver.position}
      </div>

      {/* Team color strip */}
      <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: driver.teamColor }} />

      {/* Name + team */}
      <div className="flex-1 min-w-0">
        <div className="orb font-bold text-[0.68rem] tracking-wider truncate" style={{ color: driver.teamColor }}>
          {driver.acronym}
        </div>
        <div className="raj text-[0.62rem] text-dim/60 truncate">{driver.team}</div>
      </div>

      {/* Lap time */}
      <div className="text-center">
        <div className="orb text-[0.58rem] font-bold text-white">{driver.lastLapTime}</div>
        <div className="orb text-[0.45rem] text-dim/50">LAP {driver.lapNumber}</div>
      </div>

      {/* Gap */}
      <div className="text-right w-16">
        <div className="orb text-[0.55rem] font-bold" style={{ color: isLeader ? "#00ff9d" : "#ffd000" }}>
          {driver.gap}
        </div>
        <div className="orb text-[0.42rem] text-dim/40">{driver.interval !== driver.gap ? driver.interval : ""}</div>
      </div>

      {/* Tire */}
      <CompoundBadge compound={driver.compound} />

      {/* Tyre age */}
      <div className="text-center w-8">
        <div className="orb text-[0.52rem]" style={{ color: driver.tyreAge > 20 ? "#ff1e3c" : driver.tyreAge > 10 ? "#ffd000" : "#00ff9d" }}>
          {driver.tyreAge}L
        </div>
        <div className="orb text-[0.38rem] text-dim/40">AGE</div>
      </div>

      {/* Pit stops */}
      <div className="text-center w-6">
        <div className="orb text-[0.52rem] text-dim/70">{driver.pitStops}</div>
        <div className="orb text-[0.38rem] text-dim/40">PIT</div>
      </div>
    </motion.div>
  );
}

export default function LiveDashboard({ lapIdx, onAdvance }: Props) {
  const f1 = useRealTimeF1();
  const simTel = TELEMETRY[lapIdx % TELEMETRY.length];

  // Use real weather if available, else simulated
  const rainProb = f1.weather?.rainProbability ?? simTel.rain_prob;
  const trackTemp = f1.weather?.trackTemp ?? 38;
  const airTemp   = f1.weather?.airTemp ?? 24;

  // Leading driver real data
  const leader = f1.drivers[0];
  const leaderSpeed = leader?.speed ?? simTel.speed;

  return (
    <div className="flex flex-col gap-3">

      {/* Status bar */}
      <div className="hud-card px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Live / Offline indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: f1.live ? "#00ff9d" : "#ffd000" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: f1.live ? 0.8 : 2, repeat: Infinity }}
            />
            <span className="orb text-[0.52rem] tracking-widest" style={{ color: f1.live ? "#00ff9d" : "#ffd000" }}>
              {f1.loading ? "CONNECTING..." : f1.live ? "LIVE F1 DATA" : f1.isRaceWeekend ? "SESSION DATA" : "NO ACTIVE SESSION"}
            </span>
          </div>

          {/* Session info */}
          {f1.session && (
            <div className="flex items-center gap-3">
              <span className="orb text-[0.48rem] tracking-widest text-dim/60">
                {f1.session.meeting} · {f1.session.name}
              </span>
              <span className="orb text-[0.48rem] tracking-widest text-dim/40">
                {f1.session.circuit}
              </span>
            </div>
          )}

          {/* No session message */}
          {!f1.session && !f1.loading && (
            <span className="orb text-[0.48rem] tracking-widest text-dim/40">
              NEXT RACE WEEKEND · USING SIMULATED DATA
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Last updated */}
          {f1.lastUpdated && (
            <span className="orb text-[0.42rem] tracking-widest text-dim/30">
              UPDATED {new Date(f1.lastUpdated).toLocaleTimeString()}
            </span>
          )}
          {/* OpenF1 badge */}
          <span className="orb text-[0.42rem] tracking-widest px-2 py-0.5 rounded border border-white/[0.06] text-dim/40">
            OpenF1 API
          </span>
        </div>
      </div>

      {/* Weather + telemetry strip */}
      <div className="grid grid-cols-6 gap-2">
        {[
          {
            label: "TRACK TEMP",
            val:   `${trackTemp.toFixed(1)}°C`,
            color: trackTemp > 45 ? "#ff1e3c" : trackTemp > 35 ? "#ffd000" : "#00ff9d",
            icon:  "🌡️",
            live:  !!f1.weather,
          },
          {
            label: "AIR TEMP",
            val:   `${airTemp.toFixed(1)}°C`,
            color: "#00e5ff",
            icon:  "🌬️",
            live:  !!f1.weather,
          },
          {
            label: "RAIN PROB",
            val:   `${rainProb.toFixed(0)}%`,
            color: statusColor(rainProb, 35, 55),
            icon:  rainEmoji(rainProb),
            live:  !!f1.weather,
          },
          {
            label: "HUMIDITY",
            val:   `${(f1.weather?.humidity ?? 55).toFixed(0)}%`,
            color: "#0099ff",
            icon:  "💧",
            live:  !!f1.weather,
          },
          {
            label: "WIND",
            val:   `${(f1.weather?.windSpeed ?? 12).toFixed(1)} m/s`,
            color: "#b347ff",
            icon:  "🌪️",
            live:  !!f1.weather,
          },
          {
            label: "LEADER SPD",
            val:   `${leaderSpeed} km/h`,
            color: "#00ff9d",
            icon:  "⚡",
            live:  !!leader,
          },
        ].map(({ label, val, color, icon, live }) => (
          <div key={label} className="hud-card px-3 py-2.5 text-center relative">
            {live && (
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-ngreen" style={{ boxShadow: "0 0 4px #00ff9d" }} />
            )}
            <div className="text-lg mb-1">{icon}</div>
            <div className="orb font-bold text-sm" style={{ color }}>{val}</div>
            <div className="orb text-[0.42rem] tracking-widest text-dim/50 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Live leaderboard */}
      <div className="hud-card bracket p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="orb text-[0.52rem] tracking-[0.2em] text-dim">
            🏁 {f1.live ? "LIVE RACE STANDINGS" : f1.isRaceWeekend ? "SESSION STANDINGS" : "SIMULATED STANDINGS"}
          </div>
          <div className="flex items-center gap-2">
            {f1.live && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="orb text-[0.45rem] tracking-widest text-nred"
              >
                ● LIVE
              </motion.div>
            )}
            <span className="orb text-[0.42rem] tracking-widest text-dim/30">
              AUTO-REFRESH 10s
            </span>
          </div>
        </div>

        {/* Header row */}
        <div className="grid grid-cols-[28px_8px_1fr_80px_64px_60px_32px_24px] gap-3 px-3 mb-2">
          {["POS", "", "DRIVER", "LAP TIME", "GAP", "TIRE", "AGE", "PIT"].map(h => (
            <div key={h} className="orb text-[0.42rem] tracking-widest text-dim/40">{h}</div>
          ))}
        </div>

        <div className="space-y-1.5">
          <AnimatePresence>
            {f1.loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="h-12 rounded-xl bg-white/[0.02] animate-pulse"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))
            ) : f1.drivers.length > 0 ? (
              f1.drivers.map((driver, i) => (
                <DriverRow key={driver.driverNumber} driver={driver} index={i} />
              ))
            ) : (
              // Simulated fallback rows
              [
                { position:1, driverNumber:1,  name:"Max Verstappen",  acronym:"VER", team:"Red Bull Racing",  teamColor:"#1d4ed8", gap:"LEADER", interval:"LEADER", lapNumber:simTel.lap, lastLapTime:"1:13.442", sector1:"0:27.1", sector2:"0:22.8", sector3:"0:23.5", speed:simTel.speed, throttle:85, brake:0, gear:7, drs:1, rpm:11200, compound:"SOFT", tyreAge:8, pitStops:0, country:"NL", headshot:"" },
                { position:2, driverNumber:16, name:"Charles Leclerc", acronym:"LEC", team:"Scuderia Ferrari", teamColor:"#dc2626", gap:"+1.4s", interval:"+1.4s", lapNumber:simTel.lap, lastLapTime:"1:13.891", sector1:"0:27.4", sector2:"0:23.1", sector3:"0:23.4", speed:simTel.speed-8, throttle:82, brake:0, gear:7, drs:1, rpm:11100, compound:"SOFT", tyreAge:8, pitStops:0, country:"MC", headshot:"" },
                { position:3, driverNumber:44, name:"Lewis Hamilton",  acronym:"HAM", team:"Mercedes AMG",    teamColor:"#059669", gap:"+3.1s", interval:"+1.7s", lapNumber:simTel.lap, lastLapTime:"1:14.102", sector1:"0:27.6", sector2:"0:23.2", sector3:"0:23.3", speed:simTel.speed-15, throttle:80, brake:0, gear:7, drs:0, rpm:11000, compound:"MEDIUM", tyreAge:14, pitStops:0, country:"GB", headshot:"" },
                { position:4, driverNumber:4,  name:"Lando Norris",   acronym:"NOR", team:"McLaren Racing",  teamColor:"#ea580c", gap:"+4.8s", interval:"+1.7s", lapNumber:simTel.lap, lastLapTime:"1:14.334", sector1:"0:27.8", sector2:"0:23.3", sector3:"0:23.2", speed:simTel.speed-20, throttle:78, brake:0, gear:6, drs:0, rpm:10900, compound:"MEDIUM", tyreAge:14, pitStops:0, country:"GB", headshot:"" },
              ].map((driver, i) => (
                <DriverRow key={driver.driverNumber} driver={driver as LiveDriver} index={i} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sector times breakdown */}
      {f1.drivers.length > 0 && (
        <div className="hud-card p-4">
          <div className="orb text-[0.52rem] tracking-[0.2em] text-dim mb-3">⏱ SECTOR TIMES</div>
          <div className="grid grid-cols-4 gap-2">
            {f1.drivers.slice(0, 4).map((d) => (
              <div key={d.driverNumber} className="text-center p-2 rounded-lg" style={{ background: `${d.teamColor}0a`, border: `1px solid ${d.teamColor}20` }}>
                <div className="orb text-[0.55rem] font-bold mb-2" style={{ color: d.teamColor }}>{d.acronym}</div>
                {[{ label: "S1", val: d.sector1, color: "#00ff9d" }, { label: "S2", val: d.sector2, color: "#ffd000" }, { label: "S3", val: d.sector3, color: "#ff8c00" }].map(s => (
                  <div key={s.label} className="flex justify-between items-center py-0.5">
                    <span className="orb text-[0.42rem] text-dim/50">{s.label}</span>
                    <span className="orb text-[0.5rem] font-bold" style={{ color: s.color }}>{s.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

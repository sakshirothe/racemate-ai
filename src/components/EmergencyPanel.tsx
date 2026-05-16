"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TelemetryRow, statusColor } from "@/data/telemetry";

interface Props { tel: TelemetryRow; }

interface Alert { id: string; icon: string; title: string; msg: string; color: string; priority: "critical"|"warning"|"info"; }

function buildAlerts(tel: TelemetryRow): Alert[] {
  const alerts: Alert[] = [];
  const tireMax = Math.max(tel.tire_fl, tel.tire_fr, tel.tire_rl, tel.tire_rr);

  if (tireMax > 138)
    alerts.push({ id:"tire_crit", icon:"🔴", title:"TIRE CRITICAL", msg:`Front-right at ${tireMax}°C. Box immediately.`, color:"#ff1e3c", priority:"critical" });
  else if (tireMax > 125)
    alerts.push({ id:"tire_warn", icon:"🟡", title:"TIRE WARNING", msg:`Peak ${tireMax}°C. Reduce kerb usage.`, color:"#ffd000", priority:"warning" });

  if (tel.fuel_pct < 25)
    alerts.push({ id:"fuel_crit", icon:"🔴", title:"FUEL CRITICAL", msg:`${tel.fuel_pct}% remaining. Lift and coast now.`, color:"#ff1e3c", priority:"critical" });
  else if (tel.fuel_pct < 40)
    alerts.push({ id:"fuel_warn", icon:"🟡", title:"FUEL LOW", msg:`${tel.fuel_pct}% — ${Math.round(tel.fuel_pct/5)} laps left.`, color:"#ffd000", priority:"warning" });

  if (tel.rain_prob > 50)
    alerts.push({ id:"rain_crit", icon:"⛈️", title:"RAIN IMMINENT", msg:`${tel.rain_prob}% probability. Consider inters.`, color:"#0099ff", priority:"critical" });
  else if (tel.rain_prob > 30)
    alerts.push({ id:"rain_warn", icon:"🌦️", title:"RAIN POSSIBLE", msg:`${tel.rain_prob}% chance. Monitor closely.`, color:"#38bdf8", priority:"warning" });

  if (tel.heart_rate > 175)
    alerts.push({ id:"hr_crit", icon:"❤️", title:"HR ELEVATED", msg:`${tel.heart_rate}bpm — breathe, driver.`, color:"#ff1e3c", priority:"critical" });
  else if (tel.heart_rate > 165)
    alerts.push({ id:"hr_warn", icon:"❤️", title:"HR HIGH", msg:`${tel.heart_rate}bpm — manage stress levels.`, color:"#ffd000", priority:"warning" });

  if (tel.hydration < 85)
    alerts.push({ id:"hyd_warn", icon:"💧", title:"HYDRATE NOW", msg:`${tel.hydration}% fluid level. Drink through Turn 6.`, color:"#00e5ff", priority:"warning" });

  if (tel.battery < 40)
    alerts.push({ id:"bat_warn", icon:"⚡", title:"ERS LOW", msg:`${tel.battery}% battery. Switch to harvest mode.`, color:"#ffd000", priority:"warning" });

  if (alerts.length === 0)
    alerts.push({ id:"ok", icon:"✅", title:"ALL SYSTEMS GO", msg:"No alerts. Race conditions nominal.", color:"#00ff9d", priority:"info" });

  return alerts.sort((a, b) =>
    a.priority === "critical" ? -1 : b.priority === "critical" ? 1 :
    a.priority === "warning"  ? -1 : 1
  );
}

export default function EmergencyPanel({ tel }: Props) {
  const alerts = buildAlerts(tel);
  const hasCritical = alerts.some(a => a.priority === "critical");

  return (
    <div className="hud-card bracket p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <div className="orb text-[0.5rem] tracking-[0.2em] text-dim">🆘 ALERTS & WARNINGS</div>
        {hasCritical && (
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="orb text-[0.48rem] tracking-widest text-nred font-bold"
          >⚠ CRITICAL</motion.div>
        )}
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-2.5 px-3 py-2 rounded-lg"
              style={{
                background: `${alert.color}0d`,
                border: `1px solid ${alert.color}22`,
              }}
            >
              <span className="text-base flex-shrink-0 mt-0.5">{alert.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="orb text-[0.5rem] font-bold tracking-widest mb-0.5" style={{ color: alert.color }}>
                  {alert.title}
                </div>
                <div className="raj text-[0.72rem] text-dim/80 leading-tight">{alert.msg}</div>
              </div>
              {alert.priority === "critical" && (
                <motion.div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                  style={{ background: alert.color }}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Speed strip */}
      <div className="flex gap-3 pt-2 border-t border-white/[0.05]">
        {[
          { label: "SPEED",   val: `${tel.speed} km/h`, color: "#00e5ff" },
          { label: "G-FORCE", val: `${tel.g_force}G`,   color: "#ffd000" },
          { label: "BRAKES",  val: `${tel.brake_front}°C`, color: "#ff1e3c" },
          { label: "LAP",     val: tel.lap_time,         color: "#00ff9d" },
        ].map(({ label, val, color }) => (
          <div key={label} className="flex-1 text-center">
            <div className="orb text-[0.42rem] tracking-widest text-dim/50 mb-0.5">{label}</div>
            <div className="orb text-[0.62rem] font-bold" style={{ color }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

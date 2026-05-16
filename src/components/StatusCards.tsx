"use client";
import { motion } from "framer-motion";
import { TelemetryRow, statusColor, fuelColor, rainEmoji } from "@/data/telemetry";

interface Props { tel: TelemetryRow; driverName: string; }

function Bar({ value, color, max = 100 }: { value: number; color: string; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="bar-track mt-2">
      <motion.div
        className="bar-fill"
        style={{ background: color, boxShadow: `0 0 6px ${color}55` }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

function Card({ children, delay = 0, accent = "rgba(255,30,60,0.15)" }: {
  children: React.ReactNode; delay?: number; accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="hud-card bracket p-4 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      {children}
    </motion.div>
  );
}

function Label({ text }: { text: string }) {
  return <div className="orb text-[0.5rem] tracking-[0.22em] uppercase text-dim/70 mb-2">{text}</div>;
}

export default function StatusCards({ tel, driverName }: Props) {
  const fuel    = tel.fuel_pct;
  const tireMax = Math.max(tel.tire_fl, tel.tire_fr, tel.tire_rl, tel.tire_rr);
  const rain    = tel.rain_prob;
  const hr      = tel.heart_rate;
  const bat     = tel.battery;
  const hyd     = tel.hydration;
  const laps    = Math.max(0, Math.round(fuel / 5));
  const pitDue  = fuel < 30 || tireMax > 138;

  const fc  = fuelColor(fuel);
  const tc  = statusColor(tireMax, 125, 135);
  const rc  = statusColor(rain, 35, 55);
  const hrc = statusColor(hr, 165, 175);
  const hyc = statusColor(100 - hyd, 10, 20); // invert: low hydration = red

  const tireCols = {
    fl: statusColor(tel.tire_fl, 125, 135),
    fr: statusColor(tel.tire_fr, 125, 135),
    rl: statusColor(tel.tire_rl, 125, 135),
    rr: statusColor(tel.tire_rr, 125, 135),
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {/* Fuel */}
      <Card delay={0} accent={fc}>
        <Label text="Fuel Load" />
        <div className="orb font-black text-2xl leading-none mb-1" style={{ color: fc, textShadow: `0 0 16px ${fc}55` }}>
          {fuel.toFixed(0)}<span className="text-sm font-normal">%</span>
        </div>
        <div className="raj text-[0.7rem] text-dim">{laps} laps remaining</div>
        <Bar value={fuel} color={fc} />
      </Card>

      {/* Tires */}
      <Card delay={0.06} accent={tc}>
        <Label text="Tire Temp" />
        <div className="orb font-black text-2xl leading-none mb-1" style={{ color: tc, textShadow: `0 0 16px ${tc}55` }}>
          {tireMax.toFixed(0)}<span className="text-sm font-normal">°C</span>
        </div>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {(["fl","fr","rl","rr"] as const).map(k => (
            <div key={k} className="rounded text-center py-0.5 orb text-[0.5rem] font-bold" style={{ background: tireCols[k], color: "#000" }}>
              {k.toUpperCase()}
            </div>
          ))}
        </div>
      </Card>

      {/* Weather */}
      <Card delay={0.12} accent={rc}>
        <Label text="Weather" />
        <div className="text-3xl mb-1">{rainEmoji(rain)}</div>
        <div className="raj text-[0.7rem] text-dim">Rain probability</div>
        <div className="orb font-bold text-lg mt-0.5" style={{ color: rc }}>{rain}%</div>
        <Bar value={rain} color={rc} />
      </Card>

      {/* Heart rate */}
      <Card delay={0.18} accent={hrc}>
        <Label text="Driver HR" />
        <div className="orb font-black text-2xl leading-none mb-1" style={{ color: hrc, textShadow: `0 0 16px ${hrc}55` }}>
          {hr}<span className="text-sm font-normal"> bpm</span>
        </div>
        <div className="raj text-[0.7rem] text-dim">Heart Rate</div>
        <Bar value={hr} color={hrc} max={200} />
      </Card>

      {/* Hydration */}
      <Card delay={0.24} accent={hyc}>
        <Label text="Hydration" />
        <div className="orb font-black text-2xl leading-none mb-1" style={{ color: hyc, textShadow: `0 0 16px ${hyc}55` }}>
          {hyd}<span className="text-sm font-normal">%</span>
        </div>
        <div className="raj text-[0.7rem] text-dim">Fluid level</div>
        <Bar value={hyd} color={hyc} />
      </Card>

      {/* Safety status */}
      <Card delay={0.3} accent={pitDue ? "#ff1e3c" : "#00ff9d"}>
        <Label text="Race Status" />
        <motion.div
          className="text-3xl mb-2"
          animate={pitDue ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {pitDue ? "⚠️" : "✅"}
        </motion.div>
        <div
          className="orb text-[0.58rem] font-bold tracking-wider leading-tight"
          style={{ color: pitDue ? "#ff1e3c" : "#00ff9d", textShadow: `0 0 12px ${pitDue ? "#ff1e3c55" : "#00ff9d55"}` }}
        >
          {pitDue ? "PIT\nRECOMMENDED" : "ALL SYSTEMS\nGO"}
        </div>
      </Card>
    </div>
  );
}

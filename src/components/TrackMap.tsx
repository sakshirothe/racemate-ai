"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DRIVERS } from "@/data/telemetry";

interface Props { lap: number; rainProb: number; selectedDriverId: string; }

function trackPoint(t: number): [number, number] {
  const a = t * Math.PI * 2;
  const x = 200 + 135 * Math.cos(a) * (1 - 0.3 * Math.sin(2 * a) + 0.1 * Math.cos(3 * a));
  const y = 145 + 100 * Math.sin(a) * (1 + 0.2 * Math.cos(3 * a) - 0.1 * Math.sin(a));
  return [x, y];
}

const SECTOR_MARKERS = [
  { t: 0.08,  label: "S1", color: "#00ff9d" },
  { t: 0.40,  label: "S2", color: "#ffd000" },
  { t: 0.72,  label: "S3", color: "#ff8c00" },
];

const DANGER_ZONES = [
  { t: 0.25, label: "BRAKING", color: "#ff1e3c" },
  { t: 0.58, label: "RAIN", color: "#0099ff" },
];

export default function TrackMap({ lap, rainProb, selectedDriverId }: Props) {
  const [offsets, setOffsets] = useState([0, 0.22, 0.44, 0.66]);
  const rafRef = useRef<number>();

  useEffect(() => {
    let last = performance.now();
    const animate = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setOffsets(prev => prev.map(t => (t + 0.016 * dt) % 1));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  const steps = 100;
  const pts   = Array.from({ length: steps + 1 }, (_, i) => trackPoint(i / steps));
  const path  = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";

  const rainOp = Math.min(0.45, rainProb / 100 * 0.9);

  return (
    <div className="hud-card bracket flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/[0.05]">
        <div className="orb text-[0.52rem] tracking-[0.2em] text-dim">🗺 CIRCUIT DE MONACO · LIVE</div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-nred animate-pulse" />
          <span className="orb text-[0.5rem] tracking-widest text-nred">LAP {lap}/57</span>
        </div>
      </div>

      {/* SVG Track */}
      <div className="flex-1 relative overflow-hidden">
        <svg viewBox="0 0 400 290" className="w-full h-full" style={{ minHeight: 180 }}>
          <defs>
            <filter id="carglow">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softglow">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="rainGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0099ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0099ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="400" height="290" fill="#06060f" />

          {/* Track layers */}
          <path d={path} fill="none" stroke="#111827" strokeWidth="32" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="#1a2234" strokeWidth="26" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="#1f2a3e" strokeWidth="20" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="#263148" strokeWidth="14" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2" strokeDasharray="10 10" />

          {/* Rain zone */}
          {rainProb > 10 && (
            <ellipse cx="260" cy="100" rx="45" ry="32"
              fill="url(#rainGrad)" opacity={rainOp} filter="url(#softglow)" />
          )}
          {rainProb > 15 && (
            <text x="238" y="98" fill="#93c5fd" fontSize="7" fontFamily="monospace" opacity={Math.min(1, rainProb / 35)}>
              ⛈ RAIN ZONE
            </text>
          )}

          {/* Danger zone: heavy braking */}
          <ellipse cx="120" cy="200" rx="25" ry="18" fill="#ff1e3c" opacity="0.05" />

          {/* Sector markers */}
          {SECTOR_MARKERS.map(({ t, label, color }) => {
            const [sx, sy] = trackPoint(t);
            return (
              <g key={label}>
                <circle cx={sx} cy={sy} r={5} fill={color} filter="url(#carglow)" opacity={0.85} />
                <text x={sx + 8} y={sy + 4} fill={color} fontSize="8" fontFamily="monospace">{label}</text>
              </g>
            );
          })}

          {/* S/F line */}
          {(() => {
            const [fx, fy] = trackPoint(0);
            return (
              <>
                <line x1={fx - 8} y1={fy - 10} x2={fx + 8} y2={fy + 10} stroke="#ffffff" strokeWidth="2.5" opacity="0.7" />
                <text x={fx + 12} y={fy + 4} fill="#fff" fontSize="7" fontFamily="monospace" opacity="0.6">S/F</text>
              </>
            );
          })()}

          {/* Car markers */}
          {DRIVERS.map((driver, i) => {
            const [cx, cy] = trackPoint(offsets[i]);
            const isSelected = driver.id === selectedDriverId;
            return (
              <g key={driver.id}>
                {isSelected && (
                  <circle cx={cx} cy={cy} r={14} fill={driver.teamColor} opacity={0.15} filter="url(#softglow)" />
                )}
                <circle
                  cx={cx} cy={cy}
                  r={isSelected ? 9 : 6}
                  fill={isSelected ? driver.teamColor : driver.teamColor}
                  filter="url(#carglow)"
                  opacity={isSelected ? 1 : 0.75}
                />
                <text
                  x={cx + (isSelected ? 13 : 10)} y={cy + 4}
                  fill={driver.teamColor} fontSize={isSelected ? 9 : 7}
                  fontWeight={isSelected ? "bold" : "normal"}
                  fontFamily="monospace"
                  opacity={isSelected ? 1 : 0.8}
                >
                  {driver.number}
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <text x="8" y="283" fill="#374151" fontSize="7" fontFamily="monospace">
            CIRCUIT DE MONACO · LAP {lap}/57 · IBM GRANITE AI
          </text>
        </svg>
      </div>

      {/* Leaderboard */}
      <div className="border-t border-white/[0.05] px-4 py-2">
        <div className="grid grid-cols-4 gap-1">
          {DRIVERS.map((d, i) => {
            const isSelected = d.id === selectedDriverId;
            return (
              <div
                key={d.id}
                className="flex items-center gap-1.5 py-1"
                style={{ opacity: isSelected ? 1 : 0.6 }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.teamColor, boxShadow: isSelected ? `0 0 8px ${d.teamColor}` : "none" }} />
                <span className="orb text-[0.5rem] font-bold" style={{ color: isSelected ? d.teamColor : "#6b7280" }}>
                  {d.number}
                </span>
                <span className="raj text-[0.65rem] truncate" style={{ color: isSelected ? "#f0f2ff" : "#6b7280" }}>
                  {d.name.split(" ").pop()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/hooks/useVoice";

interface Props { onBack: () => void; }

const DRIVERS = [
  { id:"ver", name:"Max Verstappen",  team:"Red Bull",  number:"1",  color:"#1d4ed8", flag:"🇳🇱", style:"Aggressive braking, dominant in wet conditions", wins:54 },
  { id:"lec", name:"Charles Leclerc", team:"Ferrari",   number:"16", color:"#dc2626", flag:"🇲🇨", style:"Exceptional qualifying pace, master of Monaco", wins:5  },
  { id:"ham", name:"Lewis Hamilton",  team:"Mercedes",  number:"44", color:"#059669", flag:"🇬🇧", style:"Tyre whisperer, strategic genius, 7x champion",  wins:103},
  { id:"nor", name:"Lando Norris",    team:"McLaren",   number:"4",  color:"#ea580c", flag:"🇬🇧", style:"Lightning reactions, exceptional overtaking",    wins:3  },
];

const TOPICS = [
  { id:"drs",       icon:"💨", title:"What is DRS?",          color:"#00e5ff" },
  { id:"tyres",     icon:"🔴", title:"Tyre Strategy",          color:"#ff1e3c" },
  { id:"pit",       icon:"🔧", title:"Pit Stop Timing",        color:"#ffd000" },
  { id:"ers",       icon:"⚡", title:"ERS & Battery",          color:"#b347ff" },
  { id:"weather",   icon:"🌧️", title:"Weather Strategy",       color:"#0099ff" },
  { id:"undercut",  icon:"⚔️", title:"Undercut vs Overcut",    color:"#00ff9d" },
  { id:"safety",    icon:"🚗", title:"Safety Car Impact",      color:"#ffd000" },
  { id:"quali",     icon:"🏁", title:"Qualifying Explained",   color:"#ff1e3c" },
];

const AI_EXPLANATIONS: Record<string, string> = {
  drs:      "DRS stands for Drag Reduction System. When a driver is within one second of the car ahead at a detection point, they can open a flap on their rear wing. This reduces aerodynamic drag and gives them extra top speed — typically 10 to 15 kilometres per hour — on designated DRS zones, usually long straights. It makes overtaking much more likely but can only be used after lap two and when the race director enables it.",
  tyres:    "Formula 1 uses three dry tyre compounds at each race — Soft, Medium, and Hard. Soft tyres give maximum grip and fastest lap times but degrade quickly. Hard tyres last much longer but are slower initially. Teams must use at least two different compounds during a dry race. The art of tyre strategy is deciding when to pit, which compound to fit, and whether to overcut or undercut your rivals.",
  pit:      "A pit stop in F1 typically takes between 2.2 and 2.8 seconds for a wheel change. The crew of around 20 mechanics work in perfectly choreographed precision. Strategy is everything — pitting too early means your new tyres wear out before the race ends. Pitting too late means losing time on degraded rubber. The undercut means pitting before your rival to gain track position through faster lap times on fresh tyres.",
  ers:      "ERS stands for Energy Recovery System. F1 cars harvest energy under braking and from exhaust gases, storing it in a battery. Drivers then deploy this as extra power — up to 160 horsepower — for around 33 seconds per lap. Engineers decide exactly when to harvest and when to deploy for maximum tactical advantage. Running low on battery means less power on the straights.",
  weather:  "Rain transforms Formula 1 completely. Intermediate tyres are used on a damp but not fully wet track, while full wet tyres handle standing water. The key decision is always timing — pitting too early for wets on a drying track costs time, but staying out on slicks in heavy rain risks a crash. Weather radar and track temperature sensors guide the team's calls from the pit wall.",
  undercut: "An undercut means pitting before your rival, getting fresh tyres, and going faster than them to emerge ahead when they pit. An overcut means staying out longer on old tyres while your rival pits, gambling that your pace on track plus their time lost in the pit lane means you come out ahead. The undercut works best on tracks with high tyre degradation. The overcut suits tracks where track position is king.",
  safety:   "When there is an accident or debris on track, the Safety Car comes out. All drivers must slow down and cannot overtake. Gaps between cars close up, often bunching the entire field together. This creates a free pit stop opportunity — teams pit under the Safety Car without losing positions. Strategy under the Safety Car can completely change race results. The Virtual Safety Car reduces speed without physically deploying the car.",
  quali:    "Qualifying decides the starting grid. Q1 eliminates the five slowest drivers. Q2 eliminates the next five. Q3 is a shootout between the top ten for pole position. Pole position — starting from the front — is a massive advantage. Drivers push their cars to the absolute limit on a single flying lap with maximum power, fresh soft tyres, and perfect aerodynamic setup.",
};

const COMMENTARY_PROMPTS = [
  "Explain what just happened with the pit stop strategy",
  "Why did the team pit under the safety car?",
  "Who has the tyre advantage right now?",
  "Is an overtake likely in the next lap?",
  "What is the weather doing to the race?",
  "Explain the championship implications",
];

export default function FanMode({ onBack }: Props) {
  const [selectedDriver, setSelectedDriver] = useState(DRIVERS[0]);
  const [activeTopic,    setActiveTopic]    = useState<string | null>(null);
  const [commentary,     setCommentary]     = useState("");
  const [loading,        setLoading]        = useState(false);
  const [tab,            setTab]            = useState<"commentary"|"learn"|"compare">("commentary");

  const voice = useVoice({ onTranscript: async (text) => { await fetchCommentary(text); } });

  const fetchCommentary = useCallback(async (question: string) => {
    setLoading(true);
    setCommentary("");
    try {
      const res  = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          message: `As an F1 AI commentator and educator, answer this fan question in an exciting, easy-to-understand way (3-4 sentences max): ${question}. Driver focus: ${selectedDriver.name} (${selectedDriver.team}).`,
          telemetry: { fuel_pct:65, tire_fl:120, rain_prob:25, heart_rate:165, battery:70, lap:25 },
        }),
      });
      const data = await res.json();
      setCommentary(data.reply);
      voice.speak(data.reply);
    } catch { setCommentary("Connection error. Please try again."); }
    finally  { setLoading(false); }
  }, [selectedDriver, voice]);

  const showTopic = (id: string) => {
    setActiveTopic(id);
    const explanation = AI_EXPLANATIONS[id];
    setCommentary(explanation);
    voice.speak(explanation);
    setTab("learn");
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="min-h-screen flex flex-col relative z-10">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]"
        style={{ background:"rgba(3,3,10,0.97)", backdropFilter:"blur(24px)" }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.5rem] tracking-widest">← BACK</button>
          <div>
            <div className="orb font-black text-base tracking-widest" style={{ background:"linear-gradient(135deg,#fff,#0099ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              🎧 FAN MODE
            </div>
            <div className="orb text-[0.45rem] tracking-[0.3em] text-dim/50">AI Race Experience</div>
          </div>
        </div>

        {/* Driver selector */}
        <div className="flex gap-2">
          {DRIVERS.map(d => (
            <button key={d.id} onClick={() => setSelectedDriver(d)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{ background: selectedDriver.id === d.id ? `${d.color}22` : "rgba(255,255,255,0.03)", border:`1px solid ${selectedDriver.id === d.id ? d.color+"55" : "rgba(255,255,255,0.07)"}` }}>
              <span className="text-sm">{d.flag}</span>
              <span className="orb text-[0.5rem] font-bold" style={{ color: selectedDriver.id === d.id ? d.color : "#6b7280" }}>{d.name.split(" ").pop()}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <span className="orb text-[0.45rem] px-2 py-1 rounded border border-indigo-500/35 bg-indigo-500/10 text-indigo-300">⬛ IBM Granite</span>
          <span className="orb text-[0.45rem] px-2 py-1 rounded border border-emerald-500/30 bg-emerald-500/08 text-emerald-300">⬡ Langflow</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-3 p-3">

        {/* Left: driver card + voice */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          {/* Driver card */}
          <motion.div key={selectedDriver.id} initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="hud-card p-5 text-center relative overflow-hidden">
            <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 50% 0%, ${selectedDriver.color}12, transparent 70%)` }} />
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg,transparent,${selectedDriver.color},transparent)` }} />
            <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl relative z-10"
              style={{ background:`${selectedDriver.color}18`, border:`2px solid ${selectedDriver.color}40`, boxShadow:`0 0 30px ${selectedDriver.color}25` }}>
              {selectedDriver.flag}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center orb text-[0.7rem] font-black"
                style={{ background:selectedDriver.color }}>
                {selectedDriver.number}
              </div>
            </div>
            <div className="orb font-bold text-sm mb-0.5 relative z-10" style={{ color:selectedDriver.color }}>{selectedDriver.name}</div>
            <div className="raj text-[0.7rem] text-dim/60 mb-3 relative z-10">{selectedDriver.team}</div>
            <div className="raj text-[0.72rem] text-dim/50 leading-relaxed mb-3 relative z-10 italic">"{selectedDriver.style}"</div>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <div className="orb font-black text-2xl" style={{ color:selectedDriver.color }}>{selectedDriver.wins}</div>
              <div className="orb text-[0.45rem] tracking-widest text-dim/50">CAREER<br/>WINS</div>
            </div>
          </motion.div>

          {/* Voice panel */}
          <div className="hud-card p-4">
            <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-3">🎙 ASK AI COMMENTATOR</div>
            <motion.button
              onPointerDown={() => voice.startListening()}
              onPointerUp={() => voice.stopListening()}
              onPointerLeave={() => voice.stopListening()}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-3 mb-3"
              style={{
                background: voice.voiceState === "listening" ? "rgba(0,255,157,0.15)" : "rgba(255,30,60,0.10)",
                border: `1px solid ${voice.voiceState === "listening" ? "#00ff9d" : "rgba(255,30,60,0.3)"}`,
              }}
              animate={voice.voiceState === "listening" ? { scale:[1,1.02,1] } : { scale:1 }}
              transition={{ duration:0.6, repeat:voice.voiceState==="listening"?Infinity:0 }}
            >
              <span className="text-xl">{voice.voiceState === "listening" ? "🔴" : voice.voiceState === "speaking" ? "🔊" : "🎙"}</span>
              <span className="orb text-[0.55rem] tracking-widest font-bold" style={{ color: voice.voiceState === "listening" ? "#00ff9d" : "#ff1e3c" }}>
                {voice.voiceState === "listening" ? "LISTENING..." : voice.voiceState === "speaking" ? "AI SPEAKING..." : "HOLD TO ASK"}
              </span>
            </motion.button>

            {/* Waveform */}
            <div className="flex items-center justify-center gap-0.5 h-8 mb-3">
              {Array.from({length:16}).map((_,i) => (
                <motion.div key={i} className="flex-1 rounded-full"
                  style={{ background: voice.voiceState !== "idle" ? "#00ff9d" : "#374151", minWidth:3 }}
                  animate={voice.voiceState !== "idle" ? { scaleY:[0.2,1,0.3,0.8,0.2], originY:"50%" } : { scaleY:0.2, originY:"50%" }}
                  transition={{ duration:0.6+(i%4)*0.15, delay:i/16, repeat:voice.voiceState!=="idle"?Infinity:0 }}
                />
              ))}
            </div>

            {/* Quick questions */}
            <div className="space-y-1.5">
              {COMMENTARY_PROMPTS.slice(0,4).map((q,i) => (
                <button key={i} onClick={() => fetchCommentary(q)}
                  className="qprompt w-full text-left text-[0.72rem]" disabled={loading}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: tabs */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3">
          {/* Tab nav */}
          <div className="flex gap-2">
            {([
              { id:"commentary", label:"💬 AI Commentary" },
              { id:"learn",      label:"📚 Learn F1" },
              { id:"compare",    label:"⚖️ Compare" },
            ] as const).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-4 py-2 rounded-xl orb text-[0.52rem] font-bold tracking-widest transition-all"
                style={{
                  background: tab === t.id ? "rgba(0,153,255,0.15)" : "rgba(255,255,255,0.03)",
                  border:`1px solid ${tab === t.id ? "rgba(0,153,255,0.4)" : "rgba(255,255,255,0.07)"}`,
                  color: tab === t.id ? "#0099ff" : "#6b7280",
                }}>
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Commentary tab */}
            {tab === "commentary" && (
              <motion.div key="commentary" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="flex flex-col gap-3 flex-1">
                <div className="hud-card p-5 flex-1" style={{ minHeight:300 }}>
                  <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-4">🏎 AI RACE COMMENTARY</div>
                  {loading ? (
                    <div className="flex items-center gap-3 p-4">
                      <span className="text-2xl">🤖</span>
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <motion.div key={i} className="w-2 h-2 rounded-full bg-nblue"
                            animate={{ y:[0,-6,0] }} transition={{ duration:0.7, repeat:Infinity, delay:i*0.18 }} />
                        ))}
                      </div>
                      <span className="orb text-[0.5rem] tracking-widest text-dim/50">GRANITE ANALYZING...</span>
                    </div>
                  ) : commentary ? (
                    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                      className="bubble-ai p-4 raj text-sm leading-relaxed">
                      <div className="orb text-[0.45rem] tracking-widest text-nblue/60 mb-2">AI COMMENTATOR</div>
                      {commentary}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 gap-3 text-dim">
                      <span className="text-5xl">🎧</span>
                      <div className="raj text-sm text-center">Ask the AI commentator anything about the race.<br/><span className="text-dim/50 text-xs">Use voice or click a quick question.</span></div>
                    </div>
                  )}
                </div>

                {/* Commentary prompts */}
                <div className="grid grid-cols-2 gap-2">
                  {COMMENTARY_PROMPTS.map((q,i) => (
                    <button key={i} onClick={() => fetchCommentary(q)} disabled={loading}
                      className="qprompt text-left">{q}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Learn tab */}
            {tab === "learn" && (
              <motion.div key="learn" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map(topic => (
                    <motion.button key={topic.id} onClick={() => showTopic(topic.id)}
                      className="hud-card p-4 text-left flex items-center gap-3 cursor-pointer"
                      whileHover={{ scale:1.02, borderColor:topic.color+"44" }}
                      style={{ borderColor: activeTopic === topic.id ? topic.color+"44" : "rgba(255,255,255,0.06)", background: activeTopic === topic.id ? `${topic.color}10` : undefined }}>
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <div className="orb text-[0.55rem] font-bold tracking-widest" style={{ color: activeTopic === topic.id ? topic.color : "#f0f2ff" }}>{topic.title}</div>
                        <div className="raj text-[0.65rem] text-dim/50 mt-0.5">AI Explanation</div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {activeTopic && commentary && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="hud-card p-5">
                    <div className="orb text-[0.5rem] tracking-widest text-dim/50 mb-3">
                      {TOPICS.find(t=>t.id===activeTopic)?.icon} {TOPICS.find(t=>t.id===activeTopic)?.title?.toUpperCase()}
                    </div>
                    <div className="raj text-sm leading-relaxed text-dim/80">{commentary}</div>
                    <button onClick={() => voice.speak(commentary)} className="mt-3 hud-btn hud-btn-ghost px-3 py-1.5 text-[0.48rem] tracking-widest">
                      🔊 READ ALOUD
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Compare tab */}
            {tab === "compare" && (
              <motion.div key="compare" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="hud-card p-5">
                <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-4">⚖️ DRIVER COMPARISON</div>
                <div className="grid grid-cols-2 gap-4">
                  {DRIVERS.slice(0,2).map(d => (
                    <div key={d.id} className="p-4 rounded-xl" style={{ background:`${d.color}0a`, border:`1px solid ${d.color}20` }}>
                      <div className="orb font-bold text-sm mb-3" style={{ color:d.color }}>{d.name}</div>
                      {[
                        { label:"Career Wins",    val: d.wins },
                        { label:"Team",           val: d.team },
                        { label:"Nationality",    val: d.flag },
                        { label:"Number",         val: `#${d.number}` },
                      ].map(({ label, val }) => (
                        <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                          <span className="orb text-[0.48rem] tracking-widest text-dim/50">{label}</span>
                          <span className="raj text-sm font-bold" style={{ color:d.color }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <button onClick={() => fetchCommentary(`Compare ${DRIVERS[0].name} vs ${DRIVERS[1].name} as F1 drivers. Who has the edge?`)}
                  className="mt-4 w-full hud-btn hud-btn-red py-2.5" disabled={loading}>
                  ASK AI TO COMPARE
                </button>
                {commentary && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="bubble-ai p-4 mt-3 raj text-sm leading-relaxed">
                    {commentary}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: live stats */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3">
          <div className="hud-card bracket p-4">
            <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-3">📡 LIVE RACE SNAPSHOT</div>
            {[
              { label:"SESSION",   val:"Monaco GP · Race",   color:"#00ff9d" },
              { label:"LAP",       val:"25 / 57",             color:"#ffd000" },
              { label:"LEADER",    val:"VER +0.0s",           color:"#1d4ed8" },
              { label:"P2",        val:"LEC +1.4s",           color:"#dc2626" },
              { label:"RAIN",      val:"32% likely",          color:"#0099ff" },
              { label:"TRACK",     val:"38.2°C",              color:"#ff1e3c" },
              { label:"SAFETY",    val:"GREEN FLAG",          color:"#00ff9d" },
              { label:"DRS",       val:"ENABLED",             color:"#00e5ff" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                <span className="orb text-[0.45rem] tracking-widest text-dim/50">{label}</span>
                <span className="orb text-[0.55rem] font-bold" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>

          <div className="hud-card p-4">
            <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-3">🔥 FAN INSIGHTS</div>
            {[
              { q:"Best overtaking spot?",  a:"Turn 1 Braking Zone" },
              { q:"Pit window opens?",      a:"Lap 27-31" },
              { q:"Tyre delta?",            a:"Soft vs Medium: 0.6s" },
              { q:"Championship gap?",      a:"VER leads by 34pts" },
            ].map(({ q, a }) => (
              <div key={q} className="py-2 border-b border-white/[0.04] last:border-0 cursor-pointer group"
                onClick={() => fetchCommentary(q)}>
                <div className="raj text-[0.72rem] text-dim/60 group-hover:text-dim/90 transition-colors">{q}</div>
                <div className="orb text-[0.55rem] font-bold text-ngreen mt-0.5">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

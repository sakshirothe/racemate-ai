"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/hooks/useVoice";

interface Props { onBack: () => void; }

const MODULES = [
  {
    id: "basics", icon: "🏎", title: "What is Formula 1?", level: "Beginner", color: "#00ff9d",
    content: "Formula 1 is the highest class of international single-seater auto racing. Teams spend hundreds of millions developing cars that can reach over 350 km/h. Each season consists of around 23 races called Grands Prix across the world. Drivers and teams compete for World Championship titles. The cars are engineering marvels — generating more downforce than their own weight, braking from 300 km/h in under 2 seconds, and cornering at forces exceeding 5G.",
  },
  {
    id: "race", icon: "🏁", title: "How Races Work", level: "Beginner", color: "#00ff9d",
    content: "A Grand Prix weekend has three phases. Practice sessions on Friday and Saturday let teams test setups. Qualifying on Saturday determines the starting grid — the fastest driver earns pole position. The race on Sunday is the main event. Drivers must use at least two different tyre compounds during a dry race. The first car to complete the required number of laps wins. Points are awarded to the top ten finishers — 25 for the win down to 1 for tenth place.",
  },
  {
    id: "drs", icon: "💨", title: "What is DRS?", level: "Beginner", color: "#00e5ff",
    content: "DRS stands for Drag Reduction System. A movable flap on the rear wing opens to reduce aerodynamic drag on designated straight sections of the circuit. Drivers can only activate DRS when they are within one second of the car ahead at a detection point. This gives the following driver roughly 10 to 15 km/h of extra top speed, making overtaking significantly more likely. DRS is disabled when braking — the flap closes automatically. It cannot be used in the first two laps or during safety car periods.",
  },
  {
    id: "ers", icon: "⚡", title: "ERS & Hybrid Power", level: "Intermediate", color: "#b347ff",
    content: "ERS stands for Energy Recovery System. Modern F1 cars are hybrid machines. They recover energy from two sources — the MGU-K harvests kinetic energy under braking, and the MGU-H harvests heat energy from exhaust gases. This energy is stored in a battery and deployed as electrical power worth up to 160 horsepower. Drivers have about 33 seconds of full ERS deployment per lap. Engineers decide precisely when to harvest and deploy for maximum strategic advantage — often saving deployment for key overtaking zones.",
  },
  {
    id: "tyres", icon: "🔴", title: "Tyre Compounds", level: "Beginner", color: "#ff1e3c",
    content: "Pirelli supplies five tyre compounds for dry conditions — C1 through C5, from hardest to softest. At each race, three compounds are nominated. The softest compound is labeled Soft (red), the medium is Medium (yellow), and the hardest is Hard (white). Soft tyres provide maximum grip and fastest laptimes but degrade quickly — typically lasting 15 to 25 laps. Hard tyres are slower to warm up but can last 40 or more laps. Teams must use at least two different compounds in a dry race, which drives strategy.",
  },
  {
    id: "pitstop", icon: "🔧", title: "Pit Stop Strategy", level: "Intermediate", color: "#ffd000",
    content: "Pit stops are where races are won and lost. A modern F1 pit stop takes between 2.2 and 2.8 seconds for a tyre change — crews of around 20 mechanics work in perfect synchronization. The strategy question is always timing. A one-stop strategy means only changing tyres once, prioritizing track position. A two-stop strategy means faster average lap times but more time lost in the pit lane. The Safety Car creates free pit stop opportunities — pitting under yellow flags means no time lost to rivals.",
  },
  {
    id: "undercut", icon: "⚔️", title: "Undercut & Overcut", level: "Advanced", color: "#ff8c00",
    content: "The undercut and overcut are the two primary strategic weapons in F1. The undercut means pitting before your rival, getting fresh faster tyres, and posting quicker lap times. When your rival eventually pits, you emerge ahead of them. This works best on tracks with high tyre degradation where fresh tyres provide a big advantage. The overcut is the opposite — you stay out longer on old tyres while your rival pits, using the clean air and your track position to set fast enough laps that you emerge ahead when you finally stop. The overcut works best in Monaco-style tracks where passing is nearly impossible.",
  },
  {
    id: "qualifying", icon: "⏱️", title: "Qualifying Explained", level: "Beginner", color: "#00e5ff",
    content: "Qualifying consists of three segments. Q1 lasts 18 minutes — all 20 cars attempt flying laps and the slowest five are eliminated. Q2 lasts 15 minutes — another five cars are eliminated. Q3 is a 12-minute shootout between the top ten drivers for pole position. Each driver typically gets two flying laps per segment on fresh soft tyres. Traffic management is crucial — drivers must find clear laps without other cars disrupting their preparation lap. Pole position provides a significant race advantage, particularly on narrow circuits like Monaco.",
  },
  {
    id: "weather", icon: "🌧️", title: "Weather Strategy", level: "Intermediate", color: "#0099ff",
    content: "Rain transforms Formula 1 completely. Intermediate tyres handle a damp but not fully wet track — they have grooves to channel water but still provide good grip on a drying surface. Full wet tyres have deep grooves to displace standing water and prevent aquaplaning. The strategic decision is timing the switch. Pitting too early for wet tyres on a track that dries quickly loses time. Pitting too late on slicks in heavy rain risks a crash. Teams use weather radar, track moisture sensors, and driver feedback to judge the perfect moment.",
  },
  {
    id: "safetycar", icon: "🚗", title: "Safety Car Impact", color: "#ffd000", level: "Intermediate",
    content: "The Safety Car is deployed when there is an accident, debris, or dangerous conditions on track. All drivers must slow to safety car pace and cannot overtake. Gaps between cars compress — a leader who built a 30-second advantage suddenly finds the field right behind them. The Virtual Safety Car reduces all car speeds by around 30% without physically deploying the safety car. Both create strategic opportunities. Teams can make pit stops without losing track position relative to rivals also pitting. The restart after the safety car comes in is one of the most intense moments in racing.",
  },
  {
    id: "fuel", icon: "⛽", title: "Fuel Management", color: "#00ff9d", level: "Advanced",
    content: "Modern F1 cars start with around 105 kilograms of fuel — the maximum allowed. Teams calculate precisely how much is needed to finish the race without excess weight that slows the car. Fuel consumption varies with driving style. Lift and coast means releasing the throttle early before braking zones, saving fuel without significant lap time loss. Engineers monitor fuel delta in real time and communicate exact savings targets to drivers. Running out of fuel before the finish line is a catastrophic strategic failure. Some teams finish races with less than one kilogram remaining.",
  },
  {
    id: "engineering", icon: "🛠️", title: "Race Engineering", color: "#b347ff", level: "Advanced",
    content: "The race engineer is the driver's primary voice on team radio throughout the race. They coordinate tyre strategy, fuel management, ERS deployment, setup changes, and competitor monitoring. Behind them sits a team of performance engineers analyzing hundreds of data channels in real time. The data includes tyre temperatures at each corner of each tyre, brake temperatures, fuel consumption, engine modes, aerodynamic balance, and much more. Strategic decisions involve balancing track position, tyre life, fuel load, and competitor strategies — often in real time with seconds to decide.",
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function LearnHub({ onBack }: Props) {
  const [activeModule, setActiveModule] = useState<typeof MODULES[0] | null>(null);
  const [filter,       setFilter]       = useState("All");
  const [aiAnswer,     setAiAnswer]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [question,     setQuestion]     = useState("");

  const voice = useVoice({ onTranscript: (text) => askAI(text) });

  const filtered = filter === "All" ? MODULES : MODULES.filter(m => m.level === filter);

  async function askAI(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setAiAnswer("");
    try {
      const res  = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `As an F1 educator, explain this to a beginner in 3 clear sentences: ${q}`,
          telemetry: { fuel_pct:65, tire_fl:110, rain_prob:20, heart_rate:160, battery:70, lap:20 },
        }),
      });
      const data = await res.json();
      setAiAnswer(data.reply);
      voice.speak(data.reply);
    } catch { setAiAnswer("Could not reach AI. Please try again."); }
    finally   { setLoading(false); }
  }

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="min-h-screen flex flex-col relative z-10">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]"
        style={{ background:"rgba(3,3,10,0.97)", backdropFilter:"blur(24px)" }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.5rem] tracking-widest">← BACK</button>
          <div>
            <div className="orb font-black text-base tracking-widest"
              style={{ background:"linear-gradient(135deg,#fff,#b347ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              📚 F1 LEARNING HUB
            </div>
            <div className="orb text-[0.45rem] tracking-[0.3em] text-dim/50">Formula Racing Academy · AI Powered</div>
          </div>
        </div>

        {/* Level filter */}
        <div className="flex gap-1.5">
          {LEVELS.map(l => (
            <button key={l} onClick={() => setFilter(l)}
              className="hud-btn px-3 py-1.5 text-[0.48rem] tracking-widest"
              style={{
                background:  filter === l ? "rgba(179,71,255,0.2)" : "rgba(255,255,255,0.03)",
                border:     `1px solid ${filter === l ? "rgba(179,71,255,0.5)" : "rgba(255,255,255,0.07)"}`,
                color:       filter === l ? "#b347ff" : "#6b7280",
              }}>
              {l}
            </button>
          ))}
        </div>

        <span className="orb text-[0.45rem] tracking-widest px-2 py-1 rounded border border-indigo-500/35 bg-indigo-500/10 text-indigo-300">⬛ IBM Granite</span>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-3 p-3">

        {/* Module grid */}
        <div className="col-span-12 lg:col-span-7">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((mod, i) => (
              <motion.div key={mod.id}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                onClick={() => { setActiveModule(mod); setAiAnswer(""); }}
                className="hud-card p-4 cursor-pointer group relative overflow-hidden"
                whileHover={{ y:-4, scale:1.02 }}
                style={{ borderColor: activeModule?.id === mod.id ? mod.color+"44" : "rgba(255,255,255,0.06)", background: activeModule?.id === mod.id ? `${mod.color}0a` : undefined }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background:`linear-gradient(90deg,transparent,${mod.color},transparent)` }} />

                <div className="text-2xl mb-3">{mod.icon}</div>
                <div className="orb font-bold text-[0.68rem] tracking-wider mb-1 group-hover:text-white transition-colors"
                  style={{ color: activeModule?.id === mod.id ? mod.color : "#d1d5db" }}>
                  {mod.title}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="orb text-[0.42rem] tracking-widest px-2 py-0.5 rounded"
                    style={{ background:`${mod.color}15`, border:`1px solid ${mod.color}25`, color:mod.color }}>
                    {mod.level}
                  </span>
                  <span className="orb text-[0.42rem] tracking-widest text-dim/30 group-hover:text-dim/60">READ →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: content + AI Q&A */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-3">

          {/* Module content */}
          <AnimatePresence mode="wait">
            {activeModule ? (
              <motion.div key={activeModule.id} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                className="hud-card bracket p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{activeModule.icon}</span>
                  <div>
                    <div className="orb font-black text-base tracking-wider" style={{ color:activeModule.color }}>{activeModule.title}</div>
                    <div className="orb text-[0.45rem] tracking-widest text-dim/40 mt-0.5">{activeModule.level.toUpperCase()} LEVEL</div>
                  </div>
                </div>
                <div className="raj text-sm leading-relaxed text-dim/80 mb-4">{activeModule.content}</div>
                <div className="flex gap-2">
                  <button onClick={() => voice.speak(activeModule.content)}
                    className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.48rem] tracking-widest">
                    🔊 LISTEN
                  </button>
                  <button onClick={() => askAI(`Give me a quiz question about: ${activeModule.title}`)}
                    className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.48rem] tracking-widest" disabled={loading}>
                    🧠 QUIZ ME
                  </button>
                  <button onClick={() => askAI(`Give a real world example of: ${activeModule.title} from a famous F1 race`)}
                    className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.48rem] tracking-widest" disabled={loading}>
                    🏆 EXAMPLE
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="hud-card p-8 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-5xl">📚</span>
                <div className="raj text-sm text-dim/60">Select a module to start learning.<br/><span className="text-[0.75rem] text-dim/40">AI explanations available for every topic.</span></div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Answer */}
          <AnimatePresence>
            {(aiAnswer || loading) && (
              <motion.div key="ai" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="hud-card p-4">
                <div className="orb text-[0.48rem] tracking-widest text-ngreen/60 mb-2">🤖 AI EDUCATOR — IBM GRANITE</div>
                {loading ? (
                  <div className="flex gap-1.5 items-center">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-2 h-2 rounded-full bg-ngreen"
                        animate={{ y:[0,-5,0] }} transition={{ duration:0.7, repeat:Infinity, delay:i*0.18 }} />
                    ))}
                    <span className="orb text-[0.48rem] tracking-widest text-dim/40 ml-2">THINKING...</span>
                  </div>
                ) : (
                  <div>
                    <div className="raj text-sm leading-relaxed text-dim/80">{aiAnswer}</div>
                    <button onClick={() => voice.speak(aiAnswer)} className="mt-2 orb text-[0.45rem] tracking-widest text-dim/30 hover:text-dim/60">
                      🔊 READ ALOUD
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ask anything */}
          <div className="hud-card p-4">
            <div className="orb text-[0.5rem] tracking-[0.2em] text-dim mb-3">💬 ASK ANYTHING ABOUT F1</div>

            {/* Voice button */}
            <motion.button
              onPointerDown={() => voice.startListening()}
              onPointerUp={() => voice.stopListening()}
              onPointerLeave={() => voice.stopListening()}
              className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 mb-3 transition-all"
              style={{
                background: voice.voiceState === "listening" ? "rgba(0,255,157,0.12)" : "rgba(179,71,255,0.08)",
                border:`1px solid ${voice.voiceState === "listening" ? "#00ff9d55" : "rgba(179,71,255,0.25)"}`,
              }}
            >
              <span className="text-lg">{voice.voiceState === "listening" ? "🔴" : "🎙"}</span>
              <span className="orb text-[0.52rem] tracking-widest font-bold"
                style={{ color: voice.voiceState === "listening" ? "#00ff9d" : "#b347ff" }}>
                {voice.voiceState === "listening" ? "LISTENING..." : "HOLD TO ASK"}
              </span>
            </motion.button>

            <div className="flex gap-2">
              <input className="hud-input flex-1 px-3 py-2 text-sm" placeholder="Type your F1 question..."
                value={question} onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && askAI(question)} />
              <button onClick={() => askAI(question)} disabled={loading}
                className="hud-btn hud-btn-red px-4 py-2 text-[0.5rem] tracking-widest">ASK</button>
            </div>

            {/* Suggested questions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {["What is a DRS zone?","How long is a pit stop?","What does ERS mean?","Explain tyre degradation"].map(q => (
                <button key={q} onClick={() => askAI(q)} disabled={loading}
                  className="orb text-[0.42rem] tracking-widest px-2 py-1 rounded border border-white/[0.07] text-dim/40 hover:text-dim/70 hover:border-white/[0.15] transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

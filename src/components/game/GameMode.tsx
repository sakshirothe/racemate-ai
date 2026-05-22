"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@/hooks/useVoice";

interface Props { onBack: () => void; }

type GamePhase = "briefing" | "racing" | "decision" | "result" | "finished";

interface Decision {
  id:      string;
  prompt:  string;
  options: { id:string; label:string; icon:string; outcome:string; points:number; }[];
}

const DECISIONS: Decision[] = [
  {
    id:      "rain",
    prompt:  "Rain probability just jumped to 65%. The track is getting damp at Turn 8. Your current tyres are soft slicks. What do you do?",
    options: [
      { id:"pit_inters",  label:"Box for Intermediates", icon:"🔧", outcome:"Smart call. You switched at the perfect moment, gaining 3 positions as rivals spun on slicks.", points:30 },
      { id:"stay_slick",  label:"Stay on Slicks",        icon:"🎲", outcome:"You gambled and survived. The rain was lighter than expected. Lost 2 seconds but kept position.", points:10 },
      { id:"push_harder", label:"Push Harder on Slicks", icon:"💨", outcome:"Too aggressive! You lost the rear at Turn 8 and spun. Lost 5 positions recovering.", points:-10 },
    ],
  },
  {
    id:      "safety_car",
    prompt:  "Safety Car deployed! You're running P3 on 25-lap-old medium tyres. The pit lane is open. This is a free stop opportunity.",
    options: [
      { id:"pit_now",   label:"Pit Now — Free Stop",      icon:"🔧", outcome:"Brilliant strategy! You came out P4 on fresh softs and immediately overtook P3 for net P3.", points:30 },
      { id:"stay_out",  label:"Stay Out — Track Position", icon:"🏎", outcome:"You kept P3 but your tyres are destroyed. Lost 2 positions in the final 10 laps.", points:5  },
      { id:"wait_lap",  label:"Wait One More Lap",        icon:"⏱️", outcome:"Waited too long. The Safety Car came in and you missed the window. Lost 1 position.", points:0  },
    ],
  },
  {
    id:      "fuel",
    prompt:  "Fuel critical! Race engineer says you need to save 0.3 kilos per lap to finish. You're currently P2, 0.8 seconds behind the leader.",
    options: [
      { id:"lift_coast",   label:"Lift and Coast",          icon:"📉", outcome:"Perfect fuel management. You finished P2 with fuel to spare and fastest lap bonus point.", points:25 },
      { id:"push_full",    label:"Push Full Attack",        icon:"🔥", outcome:"You ran out of fuel on the last lap! Finished P8 due to slow zone laps to the pit.", points:-20 },
      { id:"attack_diff",  label:"Attack on Straights Only",icon:"⚡", outcome:"Smart compromise. Saved just enough fuel while keeping pressure on the leader.", points:20 },
    ],
  },
  {
    id:      "overtake",
    prompt:  "You're 0.6 seconds behind P1 into the final 5 laps. DRS is available on the main straight. Your tyres have 5 more laps of life.",
    options: [
      { id:"drs_attack", label:"DRS Attack at Turn 1",    icon:"💨", outcome:"You out-braked them into Turn 1! Clean overtake for the lead. Held it to the flag!", points:40 },
      { id:"wait_error", label:"Wait for Their Mistake",  icon:"⌛", outcome:"They made an error at the hairpin. You pounced and took the lead with 2 laps to go!", points:30 },
      { id:"play_safe",  label:"Consolidate P2",          icon:"🛡️", outcome:"Safe choice. P2 finish and valuable championship points. Lived to fight another day.", points:15 },
    ],
  },
];

interface RaceState {
  lap:      number;
  position: number;
  points:   number;
  tyreAge:  number;
  fuel:     number;
  weather:  number;
  history:  string[];
}

export default function GameMode({ onBack }: Props) {
  const [phase,       setPhase]       = useState<GamePhase>("briefing");
  const [decisionIdx, setDecisionIdx] = useState(0);
  const [raceState,   setRaceState]   = useState<RaceState>({ lap:1, position:3, points:0, tyreAge:0, fuel:98, weather:5, history:[] });
  const [lastOutcome, setLastOutcome] = useState("");
  const [aiMessage,   setAiMessage]   = useState("");
  const animRef = useRef<NodeJS.Timeout>();

  const voice = useVoice({ onTranscript: () => {} });

  const currentDecision = DECISIONS[decisionIdx];

  useEffect(() => {
    if (phase === "racing") {
      // Simulate laps advancing
      let lap = raceState.lap;
      animRef.current = setInterval(() => {
        lap++;
        setRaceState(s => ({
          ...s,
          lap:     Math.min(lap, 57),
          fuel:    Math.max(0, s.fuel - 2.8),
          tyreAge: s.tyreAge + 1,
          weather: Math.min(100, s.weather + 3),
        }));
        if (lap >= raceState.lap + 5) {
          clearInterval(animRef.current);
          presentDecision();
        }
      }, 600);
    }
    return () => clearInterval(animRef.current);
  }, [phase]);

  function startRace() {
    const msg = "Welcome to Monaco, driver. You're starting P3. We've got a strategy ready but conditions can change fast. Stay sharp and trust the team.";
    setAiMessage(msg);
    voice.speak(msg);
    setTimeout(() => { setPhase("racing"); }, 500);
  }

  function presentDecision() {
    const decision = DECISIONS[decisionIdx];
    const msg = `Lap ${raceState.lap}. ${decision.prompt}`;
    setAiMessage(msg);
    voice.speak(msg);
    setPhase("decision");
  }

  function makeChoice(optionId: string) {
    const option = currentDecision.options.find(o => o.id === optionId)!;
    setLastOutcome(option.outcome);
    voice.speak(option.outcome);

    setRaceState(s => ({
      ...s,
      points:   s.points + option.points,
      position: Math.max(1, Math.min(20, s.position - (option.points > 20 ? 1 : option.points < 0 ? 2 : 0))),
      history:  [...s.history, `Lap ${s.lap}: ${option.label} → ${option.points > 0 ? "+" : ""}${option.points}pts`],
    }));

    setPhase("result");
    setTimeout(() => {
      if (decisionIdx >= DECISIONS.length - 1) {
        setPhase("finished");
        const finalMsg = `Race complete! You finished P${Math.max(1,raceState.position)} with ${raceState.points + option.points} strategy points. ${raceState.points + option.points > 60 ? "Outstanding race engineering!" : "Good effort — experience builds strategy."}`;
        voice.speak(finalMsg);
      } else {
        setDecisionIdx(i => i + 1);
        setPhase("racing");
      }
    }, 3500);
  }

  function restartGame() {
    setPhase("briefing");
    setDecisionIdx(0);
    setRaceState({ lap:1, position:3, points:0, tyreAge:0, fuel:98, weather:5, history:[] });
    setLastOutcome("");
    setAiMessage("");
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
            <div className="orb font-black text-base tracking-widest" style={{ background:"linear-gradient(135deg,#fff,#00ff9d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              🎮 AI RACE EXPERIENCE
            </div>
            <div className="orb text-[0.45rem] tracking-[0.3em] text-dim/50">Interactive Strategy Decisions</div>
          </div>
        </div>

        {/* Race status strip */}
        <div className="flex items-center gap-4">
          {[
            { label:"LAP",      val:`${raceState.lap}/57`,    color:"#ffd000" },
            { label:"POSITION", val:`P${raceState.position}`, color:"#00ff9d" },
            { label:"FUEL",     val:`${raceState.fuel.toFixed(0)}%`, color: raceState.fuel < 30 ? "#ff1e3c" : "#00ff9d" },
            { label:"TYRE AGE", val:`${raceState.tyreAge}L`,  color: raceState.tyreAge > 20 ? "#ff1e3c" : "#ffd000" },
            { label:"STRATEGY", val:`${raceState.points}pts`, color:"#b347ff" },
          ].map(({ label, val, color }) => (
            <div key={label} className="text-center">
              <div className="orb text-[0.42rem] tracking-widest text-dim/40">{label}</div>
              <div className="orb text-sm font-bold" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={restartGame} className="hud-btn hud-btn-ghost px-3 py-1.5 text-[0.48rem] tracking-widest">↩ RESTART</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <AnimatePresence mode="wait">

          {/* BRIEFING */}
          {phase === "briefing" && (
            <motion.div key="briefing" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="max-w-2xl w-full text-center flex flex-col items-center gap-6">
              <motion.div className="text-8xl" animate={{ y:[0,-10,0] }} transition={{ duration:3, repeat:Infinity }}>🏎</motion.div>
              <div className="orb font-black text-3xl tracking-widest"
                style={{ background:"linear-gradient(135deg,#fff,#00ff9d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                MONACO GRAND PRIX
              </div>
              <div className="orb text-[0.6rem] tracking-[0.3em] text-dim/60">AI RACE EXPERIENCE · STRATEGY SIMULATOR</div>
              <div className="hud-card p-6 text-left w-full">
                <div className="orb text-[0.52rem] tracking-widest text-ngreen mb-3">PRE-RACE BRIEFING</div>
                <div className="raj text-sm text-dim/80 leading-relaxed space-y-2">
                  <p>You are starting from <span className="orb text-ngreen font-bold">P3</span> on the Monaco street circuit. 57 laps of pure strategy ahead.</p>
                  <p>Your AI race engineer will brief you on critical situations. You must make real-time strategy calls — pit timing, tyre choices, weather decisions, overtaking opportunities.</p>
                  <p>Each decision earns or costs strategy points. Your final score determines how good a race engineer you are.</p>
                </div>
                <div className="flex gap-3 mt-4 flex-wrap">
                  {[["Starting Position","P3"],["Tyre","SOFT C4"],["Fuel Load","98%"],["Weather","Dry 5%"]].map(([l,v]) => (
                    <div key={l} className="flex-1 text-center p-2 rounded-lg" style={{ background:"rgba(0,255,157,0.06)", border:"1px solid rgba(0,255,157,0.12)" }}>
                      <div className="orb text-[0.42rem] tracking-widest text-dim/50">{l}</div>
                      <div className="orb text-sm font-bold text-ngreen">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.button onClick={startRace} className="hud-btn hud-btn-red px-10 py-4 text-sm tracking-widest"
                whileHover={{ scale:1.05, boxShadow:"0 0 40px rgba(255,30,60,0.5)" }}
                whileTap={{ scale:0.97 }}>
                🏁 START RACE
              </motion.button>
            </motion.div>
          )}

          {/* RACING */}
          {phase === "racing" && (
            <motion.div key="racing" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="max-w-2xl w-full text-center flex flex-col items-center gap-6">
              <div className="orb text-[0.6rem] tracking-[0.3em] text-dim/60 uppercase">Racing in progress</div>
              <motion.div className="text-8xl" animate={{ x:[-10,10,-10], rotate:[-2,2,-2] }} transition={{ duration:0.4, repeat:Infinity }}>🏎</motion.div>
              <div className="orb font-bold text-2xl tracking-widest text-ngreen">LAP {raceState.lap} / 57</div>

              {/* Track strip */}
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
                <motion.div className="h-full rounded-full" style={{ background:"linear-gradient(90deg,#00ff9d,#ffd000)", width:`${(raceState.lap/57)*100}%` }} />
              </div>

              <div className="hud-card p-5 w-full">
                <div className="orb text-[0.5rem] tracking-widest text-dim/50 mb-2">AI ENGINEER</div>
                <div className="raj text-sm text-dim/70 leading-relaxed">
                  {aiMessage || "All systems nominal. Pace is competitive. Stay focused and execute clean laps. A decision is coming soon..."}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.div className="w-2 h-2 rounded-full bg-ngreen" animate={{ opacity:[1,0.3,1] }} transition={{ duration:0.6, repeat:Infinity }} />
                <span className="orb text-[0.52rem] tracking-widest text-ngreen/70">APPROACHING DECISION POINT...</span>
              </div>
            </motion.div>
          )}

          {/* DECISION */}
          {phase === "decision" && currentDecision && (
            <motion.div key="decision" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="max-w-2xl w-full flex flex-col gap-5">
              {/* AI message */}
              <motion.div className="hud-card p-5" animate={{ borderColor:["rgba(255,30,60,0.2)","rgba(255,30,60,0.6)","rgba(255,30,60,0.2)"] }} transition={{ duration:1.5, repeat:Infinity }}>
                <div className="flex items-start gap-3">
                  <motion.span className="text-3xl flex-shrink-0" animate={{ scale:[1,1.15,1] }} transition={{ duration:0.8, repeat:Infinity }}>🎙</motion.span>
                  <div>
                    <div className="orb text-[0.5rem] tracking-widest text-nred mb-2 alert-flash">RACE ENGINEER — URGENT</div>
                    <div className="raj text-base leading-relaxed text-white font-semibold">{currentDecision.prompt}</div>
                  </div>
                </div>
              </motion.div>

              {/* Decision counter */}
              <div className="orb text-[0.52rem] tracking-widest text-dim/40 text-center">
                DECISION {decisionIdx + 1} OF {DECISIONS.length}
              </div>

              {/* Options */}
              <div className="flex flex-col gap-3">
                {currentDecision.options.map((option, i) => (
                  <motion.button key={option.id} onClick={() => makeChoice(option.id)}
                    initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1 }}
                    className="hud-card p-4 flex items-center gap-4 cursor-pointer text-left group"
                    whileHover={{ scale:1.02, borderColor:"rgba(255,30,60,0.4)", x:4 }}
                    whileTap={{ scale:0.98 }}>
                    <span className="text-3xl flex-shrink-0">{option.icon}</span>
                    <div className="flex-1">
                      <div className="orb font-bold text-sm tracking-wider group-hover:text-nred transition-colors">{option.label}</div>
                    </div>
                    <div className="orb text-[0.5rem] tracking-widest text-dim/30 group-hover:text-nred transition-colors">CHOOSE →</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* RESULT */}
          {phase === "result" && (
            <motion.div key="result" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              className="max-w-xl w-full text-center flex flex-col items-center gap-5">
              <motion.div className="text-6xl" initial={{ scale:0 }} animate={{ scale:1, rotate:[0,20,-10,0] }} transition={{ type:"spring" }}>
                {raceState.points > 50 ? "🏆" : raceState.points > 20 ? "✅" : "⚠️"}
              </motion.div>
              <div className="orb font-black text-2xl tracking-widest text-ngreen">DECISION MADE</div>
              <div className="hud-card p-5 w-full">
                <div className="orb text-[0.5rem] tracking-widest text-dim/50 mb-2">OUTCOME</div>
                <div className="raj text-base leading-relaxed text-dim/80">{lastOutcome}</div>
              </div>
              <div className="orb text-[0.6rem] tracking-widest text-dim/40 animate-pulse">
                {decisionIdx < DECISIONS.length - 1 ? "Next situation incoming..." : "Final lap approaching..."}
              </div>
            </motion.div>
          )}

          {/* FINISHED */}
          {phase === "finished" && (
            <motion.div key="finished" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="max-w-2xl w-full text-center flex flex-col items-center gap-6">
              <motion.div className="text-8xl" initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:200 }}>
                {raceState.points > 80 ? "🏆" : raceState.points > 50 ? "🥈" : "🥉"}
              </motion.div>
              <div className="orb font-black text-3xl tracking-widest"
                style={{ background:"linear-gradient(135deg,#ffd000,#ff1e3c)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                RACE COMPLETE
              </div>
              <div className="orb font-black text-5xl text-ngreen">{raceState.points} PTS</div>
              <div className="raj text-dim/60">
                {raceState.points > 80 ? "Outstanding race engineering. You're ready for the pit wall." :
                 raceState.points > 50 ? "Solid strategy. A few more races and you'll be a natural." :
                 "Experience is the best teacher. Study the decisions and try again."}
              </div>

              {/* Decision history */}
              <div className="hud-card p-5 w-full text-left">
                <div className="orb text-[0.5rem] tracking-widest text-dim/50 mb-3">STRATEGY LOG</div>
                {raceState.history.map((h, i) => (
                  <div key={i} className="raj text-[0.75rem] text-dim/60 py-1 border-b border-white/[0.04] last:border-0">{h}</div>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button onClick={restartGame} className="hud-btn hud-btn-red px-8 py-3 text-[0.6rem] tracking-widest"
                  whileHover={{ scale:1.05 }}>↩ RACE AGAIN</motion.button>
                <button onClick={onBack} className="hud-btn hud-btn-ghost px-8 py-3 text-[0.6rem] tracking-widest">← MAIN MENU</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

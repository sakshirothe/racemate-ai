"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TelemetryRow } from "@/data/telemetry";
import VoicePanel from "./VoicePanel";
import { useVoice } from "@/hooks/useVoice";

interface Message { role: "user" | "ai"; text: string; timestamp: Date; }

interface Props { tel: TelemetryRow; driverName: string; }

const QUICK_PROMPTS = [
  "Can I push harder?",
  "Will it rain soon?",
  "When should I pit?",
  "Tires overheating?",
  "Overtake opportunity?",
  "How's my fuel?",
  "Safety car deployed?",
  "Hydration status?",
];

function TypingDots() {
  return (
    <div className="flex gap-1 px-3 py-2.5 items-center">
      <span className="orb text-[0.48rem] tracking-widest text-ncyan/60 mr-1">GRANITE</span>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-ngreen"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

export default function ChatPanel({ tel, driverName }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: q, timestamp: new Date() }]);
    setLoading(true);
    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, telemetry: tel }),
      });
      const data = await res.json();
      const reply = data.reply as string;
      setMessages(prev => [...prev, { role: "ai", text: reply, timestamp: new Date() }]);
      voice.speak(reply);
    } catch {
      const err = "Connection issue — check your API configuration.";
      setMessages(prev => [...prev, { role: "ai", text: err, timestamp: new Date() }]);
    } finally {
      setLoading(false);
      voice.setVoiceState("idle");
    }
  }, [loading, tel]);

  const voice = useVoice({
    onTranscript: (text) => sendMessage(text),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handlePushToTalk = () => voice.startListening();
  const handleRelease    = () => voice.stopListening();

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Voice panel */}
      <VoicePanel
        voiceState={voice.voiceState}
        transcript={voice.transcript}
        isMuted={voice.isMuted}
        isSupported={voice.isSupported}
        onPushToTalk={handlePushToTalk}
        onRelease={handleRelease}
        onToggleMute={voice.toggleMute}
        onCancelSpeech={voice.cancelSpeech}
      />

      {/* Chat window */}
      <div className="hud-card bracket flex flex-col flex-1 overflow-hidden" style={{ minHeight: 240 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05]">
          <div className="orb text-[0.52rem] tracking-[0.2em] text-dim">🤖 AI CO-PILOT — IBM GRANITE</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ngreen animate-pulse" />
            <span className="orb text-[0.48rem] tracking-widest text-ngreen">ONLINE</span>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b border-white/[0.04]">
          {QUICK_PROMPTS.map((q, i) => (
            <button key={i} className="qprompt" onClick={() => sendMessage(q)} disabled={loading}>
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: 280 }}>
          <AnimatePresence initial={false}>
            {messages.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 gap-3 text-dim"
              >
                <motion.span className="text-5xl" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>🏎</motion.span>
                <div className="raj text-sm text-center">
                  RaceMate AI is standing by.<br />
                  <span className="text-dim/60 text-xs">Use voice or type your question.</span>
                </div>
                <div className="orb text-[0.48rem] tracking-widest opacity-30">POWERED BY IBM GRANITE VIA LANGFLOW</div>
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <span className="text-base flex-shrink-0 mt-0.5">{msg.role === "user" ? "👤" : "🤖"}</span>
                <div className={`raj text-sm leading-relaxed px-3 py-2 max-w-[85%] ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                  {msg.role === "ai" && (
                    <div className="orb text-[0.45rem] tracking-widest text-ncyan/50 mb-1">RACE ENGINEER</div>
                  )}
                  {msg.text}
                  <div className="orb text-[0.42rem] tracking-widest text-dim/30 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 items-start"
              >
                <span className="text-base flex-shrink-0 mt-0.5">🤖</span>
                <div className="bubble-ai">
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Text input */}
        <div className="flex gap-2 p-3 border-t border-white/[0.05]">
          <input
            className="hud-input flex-1 px-4 py-2.5 text-sm"
            placeholder="Ask your race engineer anything…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            disabled={loading}
          />
          <motion.button
            className="hud-btn hud-btn-red px-5 py-2.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => sendMessage(input)}
            disabled={loading}
          >
            SEND
          </motion.button>
        </div>
      </div>
    </div>
  );
}

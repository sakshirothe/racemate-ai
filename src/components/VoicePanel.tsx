"use client";
import { motion, AnimatePresence } from "framer-motion";
import { VoiceState } from "@/hooks/useVoice";

interface Props {
  voiceState: VoiceState;
  transcript: string;
  isMuted: boolean;
  isSupported: boolean;
  onPushToTalk: () => void;
  onRelease: () => void;
  onToggleMute: () => void;
  onCancelSpeech: () => void;
}

const VOICE_LABELS: Record<VoiceState, string> = {
  idle:       "PUSH TO TALK",
  listening:  "LISTENING...",
  processing: "PROCESSING...",
  speaking:   "RACE ENGINEER",
};

const VOICE_COLORS: Record<VoiceState, string> = {
  idle:       "#ff1e3c",
  listening:  "#00ff9d",
  processing: "#ffd000",
  speaking:   "#00e5ff",
};

const NUM_BARS = 18;

export default function VoicePanel({
  voiceState, transcript, isMuted, isSupported,
  onPushToTalk, onRelease, onToggleMute, onCancelSpeech,
}: Props) {
  const color = VOICE_COLORS[voiceState];
  const isActive = voiceState !== "idle";

  return (
    <div className="hud-card bracket p-4 flex flex-col gap-3">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="orb text-[0.55rem] tracking-[0.2em] uppercase text-dim flex items-center gap-2">
          🎙 Voice Co-Pilot
        </div>
        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={onToggleMute}
            className="hud-btn hud-btn-ghost px-2 py-1 text-[0.48rem] tracking-widest"
            title={isMuted ? "Unmute" : "Mute voice"}
          >
            {isMuted ? "🔇 MUTED" : "🔊 AUDIO"}
          </button>
          {/* Cancel speech */}
          {voiceState === "speaking" && (
            <button
              onClick={onCancelSpeech}
              className="hud-btn hud-btn-ghost px-2 py-1 text-[0.48rem] tracking-widest"
            >
              ⏹ STOP
            </button>
          )}
        </div>
      </div>

      {/* Waveform + status */}
      <div className="flex items-center justify-center gap-3">
        {/* Mic button */}
        <motion.button
          onPointerDown={onPushToTalk}
          onPointerUp={onRelease}
          onPointerLeave={onRelease}
          disabled={!isSupported}
          className="relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 select-none"
          style={{
            background: isActive ? `${color}22` : "rgba(255,30,60,0.10)",
            border: `2px solid ${color}`,
            boxShadow: isActive ? `0 0 30px ${color}55, 0 0 60px ${color}22` : `0 0 12px ${color}33`,
          }}
          animate={voiceState === "listening" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.8, repeat: voiceState === "listening" ? Infinity : 0 }}
          whileTap={{ scale: 0.92 }}
        >
          <span className="text-2xl">
            {voiceState === "listening"  ? "🔴" :
             voiceState === "processing" ? "⚡" :
             voiceState === "speaking"   ? "🔊" : "🎙"}
          </span>

          {/* Ripple rings */}
          <AnimatePresence>
            {voiceState === "listening" && (
              <>
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border"
                    style={{ borderColor: color }}
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 2.2 }}
                    transition={{ duration: 1.4, delay: i * 0.45, repeat: Infinity }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Waveform bars */}
        <div className="flex items-center gap-0.5 h-10 flex-1">
          {Array.from({ length: NUM_BARS }).map((_, i) => {
            const delay = (i / NUM_BARS) * 1.2;
            const height = isActive ? `${20 + Math.random() * 80}%` : "15%";
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-full"
                style={{
                  background: color,
                  boxShadow: isActive ? `0 0 4px ${color}` : "none",
                  minWidth: 3,
                }}
                animate={
                  voiceState === "listening" || voiceState === "speaking"
                    ? { scaleY: [0.2, 1, 0.3, 0.8, 0.2], originY: "50%" }
                    : voiceState === "processing"
                    ? { scaleY: [0.3, 0.6, 0.3], originY: "50%" }
                    : { scaleY: 0.15, originY: "50%" }
                }
                transition={{
                  duration: voiceState === "listening" ? 0.6 + (i % 4) * 0.15 : 0.8,
                  delay: delay,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Status label */}
      <div className="flex items-center justify-between">
        <motion.div
          className="orb text-[0.58rem] tracking-[0.2em] font-bold"
          style={{ color }}
          animate={voiceState === "listening" ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={{ duration: 0.7, repeat: voiceState === "listening" ? Infinity : 0 }}
        >
          {VOICE_LABELS[voiceState]}
        </motion.div>

        {!isSupported && (
          <div className="orb text-[0.48rem] tracking-widest text-dim/40">
            USE CHROME / EDGE
          </div>
        )}
      </div>

      {/* Transcript display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 py-2 rounded-lg text-sm raj font-medium"
            style={{ background: "rgba(0,255,157,0.06)", border: "1px solid rgba(0,255,157,0.12)", color: "#d0ffe8" }}
          >
            <span className="orb text-[0.48rem] tracking-widest text-ngreen/60 block mb-0.5">YOU SAID</span>
            "{transcript}"
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {voiceState === "idle" && (
        <div className="orb text-[0.45rem] tracking-widest text-dim/30 text-center">
          HOLD MIC BUTTON · SPEAK · RELEASE
        </div>
      )}
    </div>
  );
}

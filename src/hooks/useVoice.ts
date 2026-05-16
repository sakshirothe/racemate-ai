"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface UseVoiceOptions {
  onTranscript: (text: string) => void;
  language?: string;
}

export function useVoice({ onTranscript, language = "en-US" }: UseVoiceOptions) {
  const [voiceState, setVoiceState]     = useState<VoiceState>("idle");
  const [transcript, setTranscript]     = useState("");
  const [isMuted, setIsMuted]           = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef       = useRef<SpeechSynthesisUtterance | null>(null);

  // Init recognition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous    = false;
    recognition.interimResults = true;
    recognition.lang           = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setVoiceState("listening");

    recognition.onresult = (e: any) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);
      if (final) {
        setVoiceState("processing");
        onTranscript(final.trim());
      }
    };

    recognition.onerror  = () => setVoiceState("idle");
    recognition.onend    = () => { if (voiceState === "listening") setVoiceState("idle"); };

    recognitionRef.current = recognition;
  }, [language]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || voiceState === "listening") return;
    setTranscript("");
    try {
      recognitionRef.current.start();
    } catch {}
  }, [voiceState]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch {}
    setVoiceState("idle");
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || isMuted) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = "en-US";
    utterance.rate  = 0.92;
    utterance.pitch = 0.88;
    utterance.volume = 1;

    // Pick a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Google UK English Male") ||
      v.name.includes("Microsoft David") ||
      v.name.includes("Alex") ||
      v.lang === "en-US"
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setVoiceState("speaking");
    utterance.onend   = () => setVoiceState("idle");
    utterance.onerror = () => setVoiceState("idle");

    synthRef.current = utterance;
    setVoiceState("speaking");
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  const cancelSpeech = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setVoiceState("idle");
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(m => {
      if (!m) window.speechSynthesis?.cancel();
      return !m;
    });
  }, []);

  const isSupported = typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return {
    voiceState, setVoiceState,
    transcript, startListening, stopListening,
    speak, cancelSpeech,
    isMuted, toggleMute,
    isSupported,
  };
}

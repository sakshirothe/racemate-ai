# 🏎 RaceMate AI — Ultimate Edition

> **Formula 1 AI Co-Pilot Operating System**  
> IBM Granite + Langflow + Next.js + Tailwind + Framer Motion

---

## 🚀 Quick Start

```bash
npm install
npm run dev
https://racemate-ai.vercel.app
```

No API keys needed — works fully in demo mode.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + fonts
│   ├── page.tsx                # Main page (intro → select → dashboard)
│   ├── globals.css             # Global cinematic styles
│   └── api/chat/route.ts       # IBM Granite API route
├── components/
│   ├── IntroScreen.tsx         # Cinematic boot sequence
│   ├── DriverSelect.tsx        # F1 driver selection grid
│   ├── DashboardHeader.tsx     # Cockpit top bar
│   ├── StatusCards.tsx         # 6 HUD telemetry cards
│   ├── TrackMap.tsx            # Animated Monaco SVG track
│   ├── ChatPanel.tsx           # AI chat + voice integration
│   ├── VoicePanel.tsx          # Push-to-talk + waveform
│   └── EmergencyPanel.tsx      # Alerts + pit strategy
├── hooks/
│   └── useVoice.ts             # Web Speech API hook
└── data/
    └── telemetry.ts            # 20-lap F1 data + driver info
```

---

## 🎙 Voice System

- **Push-to-talk** microphone button
- **Speech recognition** via `webkitSpeechRecognition`
- **Text-to-speech** via `speechSynthesis`
- Animated waveform during listening/speaking
- Works in Chrome and Edge (recommended)

---

## 🧠 IBM Granite

Set in `.env.local`:
```
WATSONX_API_KEY=your-key
WATSONX_PROJECT_ID=your-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

Model: `ibm/granite-3-8b-instruct`

---

## 🌐 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

---

## 📜 License

MIT — IBM Granite + Langflow Hackathon 2025

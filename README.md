# 🏎 RaceMate AI
### The Formula 1 AI Co-Pilot Operating System

> An immersive, AI-powered racing ecosystem that transforms complex F1 telemetry into tactical decisions for drivers, strategic insights for engineers, and cinematic experiences for fans.

[![IBM Granite](https://img.shields.io/badge/IBM-Granite%203%208B-6366f1?style=flat-square&logo=ibm)](https://ibm.com/watsonx)
[![Context Forge](https://img.shields.io/badge/IBM-Context%20Forge-00e5ff?style=flat-square&logo=ibm)](https://ibm.github.io/mcp-context-forge/)
[![Langflow](https://img.shields.io/badge/Langflow-Pipeline-00ff9d?style=flat-square)](https://langflow.org)
[![OpenF1](https://img.shields.io/badge/OpenF1-Live%20Data-ff1e3c?style=flat-square)](https://openf1.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square)](LICENSE)

**IBM SkillsBuild AI Builders Challenge 2026 · Racing Innovation**

---

## The Problem

Formula 1 generates over **1 million data points per second**. Drivers receive telemetry streams, weather alerts, tyre warnings, fuel predictions, rival gap updates, and pit wall communications — all simultaneously — while operating at 5G lateral load, 330 km/h, with 0.2 seconds to make decisions that win or lose a race.

The problem is not a lack of data.

**The problem is that no system exists to convert that data into human-scale intelligence at race speed.**

Engineers drown in numbers. Drivers miss critical instructions. Fans cannot understand what they are watching. Strategic opportunities are missed because the right insight did not reach the right person at the right time.

---

## The Solution

**RaceMate AI** is a full-stack Formula 1 AI operating system that acts as an intelligent layer between raw race data and human decision-making.

It does not show you a dashboard. It tells you what to do and why — with confidence scores, what-if scenarios, voice delivery, and real IBM Granite intelligence behind every recommendation.

```
Live Telemetry (OpenF1)
        ↓
IBM Context Forge — builds structured context blocks
        ↓
Langflow Pipeline — orchestrates the AI workflow
        ↓
IBM Granite 3 8B — generates race-specific intelligence
        ↓
RaceMate AI HUD — delivers to driver, engineer, or fan
```

---

## IBM AI Integration

### ⬛ IBM Granite 3 8B Instruct
**Role:** Core AI reasoning engine for all race intelligence

Every interaction in RaceMate AI goes through `ibm/granite-3-8b-instruct` via watsonx.ai:

| Feature | How Granite is Used |
|---|---|
| AI Co-Pilot Chat | Race engineer responses — tactical, short, decisive |
| Pit Wall Agent | Strategy recommendations with confidence scoring |
| Battle Forecast | Overtake analysis and tactical recommendations |
| Race Recap | Broadcast-quality race narrative generation |
| Fan Commentary | Plain-language race explanations for fans |
| Learning Hub | F1 education explanations for beginners |

```python
# IBM Granite call — ibm/granite-3-8b-instruct via watsonx.ai
model_id   = "ibm/granite-3-8b-instruct"
parameters = {
    "decoding_method":    "greedy",
    "max_new_tokens":     150,
    "temperature":        0.7,
    "repetition_penalty": 1.1,
}
```

---

### 🔧 IBM Context Forge
**Role:** Structured context management for AI performance

[Context Forge](https://ibm.github.io/mcp-context-forge/) is IBM's MCP toolkit for managing context and improving AI system performance through structured inputs and retrieval.

**Without Context Forge:** Granite receives an unstructured blob of telemetry mixed with the question. Response quality degrades. Token budget wasted.

**With Context Forge:** Every Granite call receives a precision-built context package:

```
Driver asks: "Can I push harder?"
         ↓
Context Forge assembles 4 prioritized blocks:

  Block 1 (Priority 1 — TELEMETRY):
  Fuel: 65% | Tyres: FL:121°C FR:125°C RL:118°C RR:122°C
  Status: WARNING (peak 125°C) | Rain: 32% | HR: 172 BPM

  Block 2 (Priority 2 — STRATEGY):
  Pit Window: OPEN | Undercut: AVAILABLE | Tyre Cliff: Not yet
  DRS: ACTIVE | Rival Gap: +1.4s (Verstappen, older tyres)

  Block 3 (Priority 3 — RIVALS):
  P1 Verstappen: Leader, 22-lap-old mediums
  P3 Hamilton: +3.1s, closing 0.2s/lap — threat rising

  Block 4 (Priority 3 — WEATHER):
  Rain 32% — MEDIUM risk. Monitor Sector 2.
         ↓
Compressed to 312 tokens (68% compression ratio)
Relevance score: 87%
         ↓
IBM Granite generates precise, data-aware response
```

Context Forge also maintains a **race decision history** — storing every strategic call made during the session and feeding relevant past decisions back into context for continuity.

```typescript
// Context Forge in action — src/lib/contextForge.ts
const forgedContext = contextForge.forgeContext(question, telemetry, driverName);
// Returns: systemPrompt, contextBlocks, totalTokens, compressionRate, relevanceScore
```

Every AI response in the UI shows the Context Forge indicator:
```
🔧 CONTEXT FORGE  |  ⬛ IBM Granite  |  BLOCKS: 4  |  TOKENS: 312  |  COMPRESSED: 68%  |  RELEVANCE: 87%
```

---

### ⬡ Langflow
**Role:** Visual AI pipeline orchestration

[Langflow](https://langflow.org) provides the visual framework for building and orchestrating the RaceMate AI pipeline.

```
🎙 Driver Query Input
        ↓
📡 Telemetry Context Injector  ←  live fuel, tyre, rain, HR data
        ↓          ↘
⬛ IBM Granite 3 8B    🧠 Race Strategy Memory (10-decision history)
        ↓
🌍 Language Router
        ↓
🏎 HUD Response Output
```

Import `langflow/racemate_flow.json` into your Langflow instance to visualize and modify the complete pipeline. Each node is configurable — swap Granite versions, adjust memory depth, or add new context sources without touching code.

---

## Four Modes — One Platform

### 🏎 Racer Mode
The AI cockpit built for drivers and race engineers.

- **6 Live HUD Cards** — fuel, tyre temperatures, weather, heart rate, hydration, safety status
- **AI Co-Pilot Chat** — IBM Granite responds like a professional race engineer
- **Voice Interaction** — push-to-talk input, text-to-speech output, animated waveform
- **Animated Track Map** — Monaco circuit with live car positions, rain zones, sector markers
- **Strategy Hub** — Pit Wall Agent, Battle Forecast, Race Recap (see below)
- **Live F1 Data** — OpenF1 API integration, auto-refreshes every 10 seconds

### 🎧 Fan Mode
AI-powered race experience for Formula 1 fans.

- **AI Race Commentary** — IBM Granite explains what is happening in plain language
- **8 Topic Explainers** — DRS, tyre strategy, pit stops, ERS, weather, undercut, safety car, qualifying
- **Driver Comparison** — side-by-side career and race statistics
- **Live Race Snapshot** — session status, positions, weather, DRS activation
- **Fan Insights** — best overtaking zones, pit windows, tyre deltas, championship impact

### 🎮 AI Race Experience
Interactive strategy simulation — make real race decisions under AI guidance.

- **4 Decision Scenarios** — rain strategy, safety car window, fuel management, overtake timing
- **AI Voice Briefing** — race engineer briefs each situation before you decide
- **Consequence System** — every decision has realistic outcomes and point scoring
- **Strategy Log** — complete record of every decision and its result
- **Race Rating** — final score rates your race engineering ability out of 100

### 📚 Learning Hub
IBM Granite powered F1 education for complete beginners.

- **12 Educational Modules** — from What is F1 to advanced race engineering
- **Three Difficulty Levels** — Beginner, Intermediate, Advanced
- **AI Explanations** — Granite explains each topic in plain language
- **Voice Read Aloud** — every module can be spoken by the AI
- **Ask Anything** — open question input powered by IBM Granite

---

## Strategy Hub — Challenge Requirements

The Strategy Hub directly addresses the hackathon's example projects:

### 🧠 Pit Wall Strategy Agent
*Matches challenge requirement: "action + confidence + explanation + what-if scenario"*

- Live strategy recommendations based on current telemetry
- Circular confidence indicator (0-100%) per recommendation
- Risk classification: LOW / MEDIUM / HIGH
- Expandable what-if scenario for each action
- IBM Granite deeper analysis on demand
- Actions: BOX THIS LAP, DRS ATTACK, FUEL MANAGEMENT, PREPARE PIT WINDOW, DEPLOY ERS

### ⚔️ Battle Forecast
*Matches challenge requirement: "Battle Forecast — overtake probability"*

- Overtake probability ring (0-100%) per rival
- Defence probability counter-ring
- Six influencing factors (DRS, tyre delta, gap, speed, fuel, clean air)
- Tactical recommendation with best overtaking zone
- IBM Granite battle insight on demand
- Rival selector for multiple targets

### 📋 Race Recap Generator
*Matches challenge inspiration: "IBM and Scuderia Ferrari app — AI-generated race summaries"*

- Auto-generated race headline
- Performance rating out of 10
- Six key statistics (best lap, average speed, tyre peak, heart rate, rain max, fuel final)
- Six expandable analysis sections (pace, tyres, fuel, driver condition, weather, verdict)
- IBM Granite broadcast-quality narrative generation
- Voice read aloud of the complete recap

---

## Architecture

```
racemate-ultimate/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main app — 4 screens, 3 tabs
│   │   ├── layout.tsx                  # Root layout + Google Fonts
│   │   ├── globals.css                 # Cinematic HUD stylesheet
│   │   └── api/
│   │       ├── chat/route.ts           # IBM Granite + Context Forge + Langflow
│   │       └── f1/route.ts             # OpenF1 live race data
│   ├── components/
│   │   ├── IntroScreen.tsx             # Cinematic boot sequence
│   │   ├── ModeSelect.tsx              # 4-mode selection screen
│   │   ├── DriverSelect.tsx            # F1 driver selection grid
│   │   ├── DashboardHeader.tsx         # Cockpit top navigation bar
│   │   ├── StatusCards.tsx             # 6 live HUD telemetry cards
│   │   ├── TrackMap.tsx                # Animated Monaco SVG circuit
│   │   ├── ChatPanel.tsx               # AI chat with Context Forge display
│   │   ├── VoicePanel.tsx              # Push-to-talk + waveform
│   │   ├── EmergencyPanel.tsx          # Alert system + pit strategy
│   │   ├── LiveDashboard.tsx           # OpenF1 real-time leaderboard
│   │   ├── ContextForgeIndicator.tsx   # Context Forge stats display
│   │   ├── strategy/
│   │   │   ├── PitWallAgent.tsx        # Strategy agent + confidence scores
│   │   │   ├── BattleForecast.tsx      # Overtake probability engine
│   │   │   └── RaceRecap.tsx           # Race recap generator
│   │   ├── fan/
│   │   │   └── FanMode.tsx             # Fan experience + AI commentary
│   │   ├── game/
│   │   │   └── GameMode.tsx            # Interactive strategy simulation
│   │   └── learn/
│   │       └── LearnHub.tsx            # F1 Learning Hub (12 modules)
│   ├── hooks/
│   │   ├── useVoice.ts                 # Web Speech API — STT + TTS
│   │   └── useRealTimeF1.ts            # OpenF1 polling hook (10s refresh)
│   ├── lib/
│   │   ├── contextForge.ts             # IBM Context Forge engine
│   │   └── openf1.ts                   # OpenF1 API client
│   └── data/
│       └── telemetry.ts                # 20-lap F1 telemetry + driver data
├── langflow/
│   └── racemate_flow.json              # Importable Langflow pipeline
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.js
└── .env.local
```

---

## IBM Technology Coverage

| IBM Tool | Where Used | What It Does |
|---|---|---|
| **IBM Granite 3 8B** | `/api/chat/route.ts` | AI co-pilot, strategy, recap, fan commentary |
| **IBM Context Forge** | `src/lib/contextForge.ts` | Structured context — 4 block types, compression, relevance scoring |
| **Langflow** | `langflow/racemate_flow.json` | Visual AI pipeline — 6 nodes, orchestration |
| **watsonx.ai** | API route + `.env.local` | Hosts and serves the Granite model |

---

## Challenge Solution Areas Covered

| Challenge Area | RaceMate AI Feature |
|---|---|
| ✅ AI Strategy & Decision Support | Pit Wall Agent (confidence + what-if) + Battle Forecast |
| ✅ AI Copilots | IBM Granite race engineer chatbot + voice interaction |
| ✅ Fan Experience | Fan Mode + Learning Hub + Race Recap Generator |
| ➡️ AI Analytics | Live telemetry HUD + OpenF1 real-time leaderboard |
| ➡️ AI Perception | Battle Forecast overtake probability engine |

---

## Quick Start

### Prerequisites
- Node.js 18+
- IBM watsonx.ai account (free trial — no credit card)

### Install and Run

```bash
git clone https://github.com/sakshirothe/racemate-ai
cd racemate-ai
npm install
npm run dev
```

Open `http://localhost:3000`

**No API keys required** — works in demo mode immediately.

### Connect IBM Granite

Create `.env.local`:

```bash
# IBM watsonx.ai — get free at ibm.com/watsonx
WATSONX_API_KEY=your-ibm-api-key
WATSONX_PROJECT_ID=your-project-id
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# Langflow pipeline (optional)
LANGFLOW_API_URL=http://localhost:7860/api/v1/run
LANGFLOW_FLOW_ID=your-flow-id
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add the three `WATSONX_*` variables in Vercel environment settings and redeploy.

---

## Voice System

RaceMate AI implements full voice interaction using the Web Speech API:

| Feature | Technology |
|---|---|
| Speech to Text | `webkitSpeechRecognition` — push-to-talk |
| Text to Speech | `speechSynthesis` — AI speaks responses |
| Visual Feedback | 18-bar animated waveform |
| Voice States | idle → listening → processing → speaking |

**Best experience:** Chrome or Edge browser on desktop.

---

## Live Data

| Data Source | What is Real |
|---|---|
| **OpenF1 API** | Lap times, positions, tyre compounds, sector times, pit stops |
| **OpenF1 Weather** | Air temperature, track temperature, humidity, rainfall, wind |
| **Simulated** | Driver biometrics (heart rate, hydration) — proprietary team data |

During race weekends: **100% real F1 data**, auto-refreshing every 10 seconds.
Between race weekends: intelligent simulation with identical data structure.

---

## Design System

| Element | Value |
|---|---|
| Background | Void black `#03030a` |
| Primary accent | Neon red `#ff1e3c` |
| Success | Neon green `#00ff9d` |
| Warning | Yellow `#ffd000` |
| Info | Cyan `#00e5ff` |
| AI accent | Purple `#b347ff` |
| Title font | Orbitron 900 |
| Body font | Rajdhani 600 |
| Card style | Glassmorphism + backdrop-blur(24px) |
| Animations | Framer Motion — spring physics |

---

## What Makes RaceMate AI Different

Other systems show drivers data.

**RaceMate AI tells drivers what to do with it.**

The distinction is IBM Context Forge. Every AI call is preceded by intelligent context assembly — the system knows which telemetry is relevant to this specific question, compresses it to the optimal token budget, scores the relevance, and sends IBM Granite exactly the context it needs to give a precise, race-specific answer rather than a generic one.

The result: AI responses that sound like they come from a race engineer who has been watching the race — not a language model that just received a data dump.

---

## Acknowledgements

Built on IBM Granite, IBM Context Forge, Langflow, OpenF1 API, Next.js 14, Tailwind CSS, Framer Motion, and the Web Speech API.

**RaceMate AI · IBM SkillsBuild AI Builders Challenge 2026**

*The pit wall sees the data. RaceMate AI understands it.*

import { NextRequest, NextResponse } from "next/server";

// ── F1 race-engineer style responses ─────────────────────────────────────────
const RESPONSES: Record<string, string[]> = {
  push: [
    "Tires at {tire}°C — still in the window. Push hard through Sectors 1 and 2, manage the final chicane.",
    "Front-right is your limiting factor at {tire}°C. Two more laps at this pace, then a cool-down lap.",
    "You've got grip. Push it. Brake 10 metres later into Turn 1 — the rear is stable.",
    "Attack mode active. DRS window on Verstappen is 0.8 seconds. Commit to the outside at Turn 3.",
  ],
  rain: [
    "Rain probability now {rain}%. Expect moisture at Sector 2 in approximately 3 laps. Stay on slicks for now.",
    "Weather radar confirms a shower moving toward the circuit. Box at the end of this lap if it hits 55%.",
    "Track is drying on the racing line. Intermediate tires would cost you 22 seconds. Hold position.",
    "Cloud cover building over Turn 8. Rain probability {rain}% — stay alert, we're monitoring closely.",
  ],
  pit: [
    "Optimal pit window opens this lap. Undercut on Leclerc is available — we call it now.",
    "Tires are done at {tire}°C. Box this lap. Target stop under 2.3 seconds. Tyres are ready.",
    "Stay out 2 more laps to cover the overcut. We lose 1.2 seconds to the pits but gain track position.",
    "Pit window is closing. If we don't box in the next 2 laps, we switch to a one-stop strategy.",
  ],
  tire: [
    "Front-right at {tire}°C — approaching critical threshold. Reduce kerb use through the swimming pool.",
    "Rear tires are graining. Smooth inputs only. Avoid wheel spin out of the hairpin.",
    "Tire delta to Verstappen is 8 laps. We have the fresher rubber. This is our window.",
    "Front-left is 4°C cooler than front-right. Adjust brake bias 2 clicks forward to balance temperatures.",
  ],
  fuel: [
    "Fuel at {fuel}%. Approximately {laps} laps remaining at current consumption. Lift and coast on the straight.",
    "We're burning 0.3 kilos per lap above target. Harvest more ERS in Sector 1 to compensate.",
    "Fuel load is fine. You have margin to push for 4 more laps before we need to conserve.",
    "Rich mixture mode active. Fuel at {fuel}% — no concerns for race distance.",
  ],
  overtake: [
    "DRS enabled. Brake 15 metres later than normal into Turn 1. You have the pace advantage.",
    "Hamilton is on older tires. Attack at Turn 3 — he'll struggle for rear grip on exit.",
    "Wait for the braking zone at Rascasse. Force him to defend the inside, take the outside line.",
    "Gap is 0.6 seconds and closing. Two more laps and we're in striking distance. Keep the pressure on.",
  ],
  safety: [
    "Safety Car deployed. Box now. All tires. This is the call — go go go.",
    "Yellow flags in Sector 2. Lift. Maintain delta time. No overtaking under yellows.",
    "Virtual Safety Car active. Hold current pace. Delta is plus 0.4 — you're on target.",
    "Track clear. Green flag racing. Push for the next 3 laps — this is our chance.",
  ],
  hydration: [
    "Hydration at {hydration}%. Drink now. Your reaction time degrades above 2% dehydration.",
    "Core temperature rising. Sip water through Turn 6 and 7 — the slow section gives you time.",
    "You're 3 laps behind on hydration. Take a long drink on the straight. Stay sharp.",
  ],
  battery: [
    "ERS battery at {bat}%. Deploy full power through Sector 1 — maximum overtake opportunity.",
    "Harvesting mode active. Battery charging through the braking zones. Full deployment ready in 2 laps.",
    "Battery at {bat}% — manage carefully. Deploy only on straights, not through corners.",
  ],
  default: [
    "All systems nominal. Pace is competitive. Maintain current strategy — the race is yours to lose.",
    "You're in a strong position. Gap to P2 is 1.4 seconds and stable. Focus on clean lap execution.",
    "Everything is green on our side. Keep the pressure on — this race is far from over.",
    "Copy that. We're watching everything from the pit wall. Trust the car, trust the strategy.",
  ],
};

function detectIntent(msg: string): string {
  const m = msg.toLowerCase();
  if (/push|harder|attack|faster|flat.?out|commit|aggressive/.test(m)) return "push";
  if (/rain|wet|weather|storm|shower|forecast|aquaplaning/.test(m)) return "rain";
  if (/pit|stop|box|tyre.?change|tire.?change|service/.test(m)) return "pit";
  if (/tire|tyre|rubber|compound|blister|grain|temperature|deg/.test(m)) return "tire";
  if (/fuel|petrol|consumption|laps.?left|range|mileage/.test(m)) return "fuel";
  if (/overtake|pass|drs|gap|attack|behind|close/.test(m)) return "overtake";
  if (/safety|crash|yellow|flag|accident|danger|incident/.test(m)) return "safety";
  if (/water|drink|hydrat|thirst/.test(m)) return "hydration";
  if (/battery|ers|energy|hybrid|power/.test(m)) return "battery";
  return "default";
}

export async function POST(req: NextRequest) {
  const { message, telemetry } = await req.json();

  const apiKey    = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const baseUrl   = process.env.WATSONX_URL ?? "https://us-south.ml.cloud.ibm.com";

  // ── Real IBM Granite call ──────────────────────────────────────────────────
  if (apiKey && projectId) {
    try {
      const tokenRes = await fetch("https://iam.cloud.ibm.com/identity/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `apikey=${apiKey}&grant_type=urn:ibm:params:oauth:grant-type:apikey`,
      });
      const { access_token } = await tokenRes.json();

      const systemPrompt = `You are RaceMate AI, an elite Formula 1 race engineer embedded in the driver's cockpit HUD.
Rules:
- English only. Maximum 2 short sentences. No jargon. Be decisive and calm.
- Sound like a professional F1 race engineer on team radio.
- Always end with one clear, tactical action.

Live telemetry:
Fuel: ${telemetry?.fuel_pct}% | Tires FL:${telemetry?.tire_fl}°C FR:${telemetry?.tire_fr}°C RL:${telemetry?.tire_rl}°C RR:${telemetry?.tire_rr}°C
Rain: ${telemetry?.rain_prob}% | Heart rate: ${telemetry?.heart_rate}bpm | Battery: ${telemetry?.battery}% | Lap: ${telemetry?.lap}/57`;

      const genRes = await fetch(`${baseUrl}/ml/v1/text/generation?version=2024-05-01`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: "ibm/granite-3-8b-instruct",
          project_id: projectId,
          input: `<|system|>\n${systemPrompt}\n<|user|>\n${message}\n<|assistant|>`,
          parameters: { decoding_method: "greedy", max_new_tokens: 100, temperature: 0.7 },
        }),
      });
      const genData = await genRes.json();
      const text = genData?.results?.[0]?.generated_text?.trim();
      if (text) return NextResponse.json({ reply: text, source: "granite" });
    } catch { /* fall through */ }
  }

  // ── Simulated F1 engineer responses ───────────────────────────────────────
  const intent = detectIntent(message);
  const pool   = RESPONSES[intent] ?? RESPONSES.default;
  const raw    = pool[Math.floor(Math.random() * pool.length)];

  const fuel  = telemetry?.fuel_pct ?? 65;
  const tire  = Math.max(telemetry?.tire_fl ?? 110, telemetry?.tire_fr ?? 110);
  const laps  = Math.max(1, Math.round(fuel / 5));
  const rain  = telemetry?.rain_prob ?? 20;
  const bat   = telemetry?.battery ?? 70;
  const hyd   = telemetry?.hydration ?? 90;

  const reply = raw
    .replace("{fuel}", String(fuel))
    .replace("{tire}", String(tire))
    .replace("{laps}", String(laps))
    .replace("{rain}", String(rain))
    .replace("{bat}",  String(bat))
    .replace("{hydration}", String(hyd));

  return NextResponse.json({ reply, source: "simulation" });
}

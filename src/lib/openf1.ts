// ── OpenF1 API Client ─────────────────────────────────────────────
// Free real-time F1 data — no API key required
// Docs: https://openf1.org

const BASE = "https://api.openf1.org/v1";

// ── Types ─────────────────────────────────────────────────────────

export interface F1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  status: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  circuit_key: number;
  country_name: string;
  location: string;
  year: number;
  meeting_name: string;
}

export interface F1Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  country_code: string;
  session_key: number;
  headshot_url: string;
}

export interface F1LapData {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  i1_speed: number | null;
  i2_speed: number | null;
  st_speed: number | null;
  date_start: string;
  is_pit_out_lap: boolean;
  session_key: number;
}

export interface F1Position {
  driver_number: number;
  position: number;
  date: string;
  session_key: number;
}

export interface F1CarData {
  driver_number: number;
  date: string;
  rpm: number;
  speed: number;
  n_gear: number;
  throttle: number;
  brake: number;
  drs: number;
  session_key: number;
}

export interface F1Stint {
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
  tyre_age_at_start: number;
  session_key: number;
}

export interface F1Weather {
  date: string;
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  wind_speed: number;
  wind_direction: number;
  session_key: number;
}

export interface F1Interval {
  driver_number: number;
  date: string;
  gap_to_leader: number | null;
  interval: number | null;
  session_key: number;
}

// ── Helpers ───────────────────────────────────────────────────────

async function fetchF1<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T[]> {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString();
    const url = `${BASE}/${endpoint}${query ? `?${query}` : ""}`;
    const res = await fetch(url, {
      next: { revalidate: 10 }, // cache for 10 seconds
      headers: { "Accept": "application/json" },
    });
    if (!res.ok) return [];
    return await res.json() as T[];
  } catch {
    return [];
  }
}

function formatLapTime(seconds: number | null): string {
  if (!seconds) return "--:--.---";
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${mins}:${secs}`;
}

// ── Main API functions ────────────────────────────────────────────

// Get the latest active or most recent session
export async function getLatestSession(): Promise<F1Session | null> {
  // Try live session first
  const live = await fetchF1<F1Session>("sessions", { session_type: "Race" });
  if (live.length > 0) {
    // Sort by date descending, get most recent
    const sorted = live.sort((a, b) =>
      new Date(b.date_start).getTime() - new Date(a.date_start).getTime()
    );
    return sorted[0];
  }
  return null;
}

// Get all drivers in a session
export async function getDrivers(sessionKey: number): Promise<F1Driver[]> {
  return fetchF1<F1Driver>("drivers", { session_key: sessionKey });
}

// Get latest lap data for all drivers
export async function getLaps(sessionKey: number, driverNumber?: number): Promise<F1LapData[]> {
  const params: Record<string, string | number> = { session_key: sessionKey };
  if (driverNumber) params.driver_number = driverNumber;
  const laps = await fetchF1<F1LapData>("laps", params);
  return laps.sort((a, b) => b.lap_number - a.lap_number);
}

// Get current race positions
export async function getPositions(sessionKey: number): Promise<F1Position[]> {
  const positions = await fetchF1<F1Position>("position", { session_key: sessionKey });
  // Get latest position for each driver
  const latestMap = new Map<number, F1Position>();
  for (const p of positions) {
    const existing = latestMap.get(p.driver_number);
    if (!existing || new Date(p.date) > new Date(existing.date)) {
      latestMap.set(p.driver_number, p);
    }
  }
  return Array.from(latestMap.values()).sort((a, b) => a.position - b.position);
}

// Get latest car telemetry for a driver
export async function getCarData(sessionKey: number, driverNumber: number): Promise<F1CarData | null> {
  const data = await fetchF1<F1CarData>("car_data", {
    session_key: sessionKey,
    driver_number: driverNumber,
  });
  if (data.length === 0) return null;
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

// Get tire stints for a driver
export async function getStints(sessionKey: number, driverNumber: number): Promise<F1Stint[]> {
  return fetchF1<F1Stint>("stints", {
    session_key: sessionKey,
    driver_number: driverNumber,
  });
}

// Get latest weather at circuit
export async function getWeather(sessionKey: number): Promise<F1Weather | null> {
  const data = await fetchF1<F1Weather>("weather", { session_key: sessionKey });
  if (data.length === 0) return null;
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

// Get gap intervals between drivers
export async function getIntervals(sessionKey: number): Promise<F1Interval[]> {
  const data = await fetchF1<F1Interval>("intervals", { session_key: sessionKey });
  const latestMap = new Map<number, F1Interval>();
  for (const i of data) {
    const existing = latestMap.get(i.driver_number);
    if (!existing || new Date(i.date) > new Date(existing.date)) {
      latestMap.set(i.driver_number, i);
    }
  }
  return Array.from(latestMap.values());
}

// ── Compound colors ───────────────────────────────────────────────
export function compoundColor(compound: string): string {
  const map: Record<string, string> = {
    SOFT:        "#ff1e3c",
    MEDIUM:      "#ffd000",
    HARD:        "#f0f2ff",
    INTERMEDIATE:"#00ff9d",
    WET:         "#0099ff",
  };
  return map[compound?.toUpperCase()] ?? "#6b7280";
}

// ── Aggregate everything into one dashboard object ────────────────
export interface LiveDashboardData {
  session:     F1Session | null;
  drivers:     F1Driver[];
  positions:   F1Position[];
  weather:     F1Weather | null;
  intervals:   F1Interval[];
  laps:        Record<number, F1LapData[]>; // keyed by driver number
  stints:      Record<number, F1Stint[]>;
  carData:     Record<number, F1CarData | null>;
  lastUpdated: string;
  isLive:      boolean;
}

export async function getLiveDashboard(sessionKey: number, driverNumbers: number[]): Promise<LiveDashboardData> {
  const [session, drivers, positions, weather, intervals] = await Promise.all([
    getLatestSession(),
    getDrivers(sessionKey),
    getPositions(sessionKey),
    getWeather(sessionKey),
    getIntervals(sessionKey),
  ]);

  // Fetch per-driver data in parallel
  const lapResults   = await Promise.all(driverNumbers.map(n => getLaps(sessionKey, n)));
  const stintResults = await Promise.all(driverNumbers.map(n => getStints(sessionKey, n)));
  const carResults   = await Promise.all(driverNumbers.map(n => getCarData(sessionKey, n)));

  const laps:    Record<number, F1LapData[]>     = {};
  const stints:  Record<number, F1Stint[]>       = {};
  const carData: Record<number, F1CarData | null> = {};

  driverNumbers.forEach((n, i) => {
    laps[n]    = lapResults[i];
    stints[n]  = stintResults[i];
    carData[n] = carResults[i];
  });

  // Determine if session is live (started and not ended)
  const now = new Date();
  const isLive = session
    ? new Date(session.date_start) <= now && (!session.date_end || new Date(session.date_end) >= now)
    : false;

  return {
    session, drivers, positions, weather, intervals,
    laps, stints, carData,
    lastUpdated: now.toISOString(),
    isLive,
  };
}

export { formatLapTime };

"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export interface LiveDriver {
  position:     number;
  driverNumber: number;
  name:         string;
  acronym:      string;
  team:         string;
  teamColor:    string;
  country:      string;
  headshot:     string;
  gap:          string;
  interval:     string;
  lapNumber:    number;
  lastLapTime:  string;
  sector1:      string;
  sector2:      string;
  sector3:      string;
  speed:        number;
  throttle:     number;
  brake:        number;
  gear:         number;
  drs:          number;
  rpm:          number;
  compound:     string;
  tyreAge:      number;
  pitStops:     number;
}

export interface LiveWeather {
  airTemp:          number;
  trackTemp:        number;
  humidity:         number;
  rainfall:         number;
  windSpeed:        number;
  rainProbability:  number;
}

export interface LiveSession {
  key:     number;
  name:    string;
  type:    string;
  circuit: string;
  country: string;
  year:    number;
  meeting: string;
  status:  string;
}

export interface LiveF1Data {
  live:        boolean;
  session:     LiveSession | null;
  drivers:     LiveDriver[];
  weather:     LiveWeather | null;
  totalLaps:   number;
  lastUpdated: string;
  loading:     boolean;
  error:       string | null;
  isRaceWeekend: boolean;
}

const POLL_INTERVAL = 10000; // 10 seconds

export function useRealTimeF1() {
  const [data, setData] = useState<LiveF1Data>({
    live:          false,
    session:       null,
    drivers:       [],
    weather:       null,
    totalLaps:     57,
    lastUpdated:   "",
    loading:       true,
    error:         null,
    isRaceWeekend: false,
  });

  const timerRef = useRef<NodeJS.Timeout>();

  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch("/api/f1", { cache: "no-store" });
      const json = await res.json();

      setData(prev => ({
        ...prev,
        live:          json.live ?? false,
        session:       json.session ?? null,
        drivers:       json.drivers ?? [],
        weather:       json.weather ?? null,
        totalLaps:     json.totalLaps ?? 57,
        lastUpdated:   json.lastUpdated ?? new Date().toISOString(),
        loading:       false,
        error:         null,
        isRaceWeekend: !!json.session,
      }));
    } catch (err) {
      setData(prev => ({
        ...prev,
        loading: false,
        error:   "Unable to connect to F1 data feed.",
      }));
    }
  }, []);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [fetchData]);

  return { ...data, refetch: fetchData };
}

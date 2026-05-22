import { NextRequest, NextResponse } from "next/server";
import {
  getLatestSession,
  getDrivers,
  getPositions,
  getWeather,
  getIntervals,
  getLaps,
  getStints,
  getCarData,
  formatLapTime,
} from "@/lib/openf1";

export const revalidate = 10; // revalidate every 10 seconds

export async function GET(req: NextRequest) {
  try {
    // Get latest session
    const session = await getLatestSession();

    if (!session) {
      return NextResponse.json({
        live: false,
        message: "No active F1 session found. Using simulated data.",
        data: null,
      });
    }

    const sessionKey = session.session_key;

    // Get all base data
    const [drivers, positions, weather, intervals] = await Promise.all([
      getDrivers(sessionKey),
      getPositions(sessionKey),
      getWeather(sessionKey),
      getIntervals(sessionKey),
    ]);

    // Get top 4 driver numbers from positions
    const topDriverNums = positions.slice(0, 6).map(p => p.driver_number);

    // Fetch per-driver data
    const [lapData, stintData, carData] = await Promise.all([
      Promise.all(topDriverNums.map(n => getLaps(sessionKey, n))),
      Promise.all(topDriverNums.map(n => getStints(sessionKey, n))),
      Promise.all(topDriverNums.map(n => getCarData(sessionKey, n))),
    ]);

    // Build enriched driver list
    const enrichedDrivers = positions.slice(0, 6).map((pos, i) => {
      const driverNum  = pos.driver_number;
      const driverInfo = drivers.find(d => d.driver_number === driverNum);
      const myLaps     = lapData[i] ?? [];
      const myStints   = stintData[i] ?? [];
      const myCarData  = carData[i];
      const interval   = intervals.find(iv => iv.driver_number === driverNum);
      const latestLap  = myLaps[0];
      const latestStint = myStints[myStints.length - 1];

      return {
        position:      pos.position,
        driverNumber:  driverNum,
        name:          driverInfo?.full_name ?? `Driver ${driverNum}`,
        acronym:       driverInfo?.name_acronym ?? "---",
        team:          driverInfo?.team_name ?? "Unknown",
        teamColor:     driverInfo?.team_colour ? `#${driverInfo.team_colour}` : "#ff1e3c",
        country:       driverInfo?.country_code ?? "",
        headshot:      driverInfo?.headshot_url ?? "",
        gap:           pos.position === 1 ? "LEADER" : interval?.gap_to_leader != null ? `+${interval.gap_to_leader.toFixed(3)}s` : "---",
        interval:      interval?.interval != null ? `+${interval.interval.toFixed(3)}s` : "---",
        lapNumber:     latestLap?.lap_number ?? 0,
        lastLapTime:   formatLapTime(latestLap?.lap_duration ?? null),
        sector1:       formatLapTime(latestLap?.duration_sector_1 ?? null),
        sector2:       formatLapTime(latestLap?.duration_sector_2 ?? null),
        sector3:       formatLapTime(latestLap?.duration_sector_3 ?? null),
        speed:         myCarData?.speed ?? 0,
        throttle:      myCarData?.throttle ?? 0,
        brake:         myCarData?.brake ?? 0,
        gear:          myCarData?.n_gear ?? 0,
        drs:           myCarData?.drs ?? 0,
        rpm:           myCarData?.rpm ?? 0,
        compound:      latestStint?.compound ?? "UNKNOWN",
        tyreAge:       latestStint ? (latestLap?.lap_number ?? 0) - latestStint.lap_start : 0,
        pitStops:      myStints.length > 1 ? myStints.length - 1 : 0,
      };
    });

    // Weather summary
    const weatherSummary = weather ? {
      airTemp:        weather.air_temperature,
      trackTemp:      weather.track_temperature,
      humidity:       weather.humidity,
      rainfall:       weather.rainfall,
      windSpeed:      weather.wind_speed,
      rainProbability: weather.rainfall > 0 ? Math.min(100, weather.humidity * 0.8) : Math.min(60, weather.humidity * 0.4),
    } : null;

    // Session info
    const now = new Date();
    const sessionStart = new Date(session.date_start);
    const isLive = sessionStart <= now;

    return NextResponse.json({
      live:    isLive,
      session: {
        key:     sessionKey,
        name:    session.session_name,
        type:    session.session_type,
        circuit: session.circuit_short_name,
        country: session.country_name,
        year:    session.year,
        meeting: session.meeting_name,
        status:  session.status,
      },
      drivers:     enrichedDrivers,
      weather:     weatherSummary,
      totalLaps:   57, // F1 race laps vary — Monaco is 78, set per circuit
      lastUpdated: now.toISOString(),
    });

  } catch (error) {
    return NextResponse.json({
      live:    false,
      message: "Failed to fetch live data. Using simulated data.",
      error:   String(error),
      data:    null,
    }, { status: 200 }); // Return 200 so app doesn't crash
  }
}

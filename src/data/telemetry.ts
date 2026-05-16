export interface TelemetryRow {
  lap: number;
  fuel_pct: number;
  tire_fl: number; tire_fr: number; tire_rl: number; tire_rr: number;
  brake_front: number; brake_rear: number;
  heart_rate: number; hydration: number;
  rain_prob: number; battery: number;
  speed: number; g_force: number; lap_time: string;
}

export const TELEMETRY: TelemetryRow[] = [
  { lap:1,  fuel_pct:98, tire_fl:82,  tire_fr:84,  tire_rl:78,  tire_rr:80,  brake_front:310, brake_rear:280, heart_rate:142, hydration:98, rain_prob:5,  battery:94, speed:287, g_force:2.1, lap_time:"1:14.821" },
  { lap:2,  fuel_pct:95, tire_fl:88,  tire_fr:90,  tire_rl:85,  tire_rr:87,  brake_front:340, brake_rear:310, heart_rate:148, hydration:97, rain_prob:5,  battery:91, speed:312, g_force:3.2, lap_time:"1:13.442" },
  { lap:3,  fuel_pct:92, tire_fl:94,  tire_fr:97,  tire_rl:91,  tire_rr:93,  brake_front:370, brake_rear:340, heart_rate:151, hydration:96, rain_prob:8,  battery:88, speed:298, g_force:3.8, lap_time:"1:13.108" },
  { lap:4,  fuel_pct:89, tire_fl:101, tire_fr:104, tire_rl:98,  tire_rr:100, brake_front:395, brake_rear:362, heart_rate:155, hydration:95, rain_prob:8,  battery:85, speed:265, g_force:4.1, lap_time:"1:13.654" },
  { lap:5,  fuel_pct:86, tire_fl:108, tire_fr:112, tire_rl:105, tire_rr:108, brake_front:412, brake_rear:378, heart_rate:158, hydration:94, rain_prob:12, battery:82, speed:278, g_force:4.4, lap_time:"1:13.991" },
  { lap:6,  fuel_pct:83, tire_fl:115, tire_fr:119, tire_rl:112, tire_rr:115, brake_front:428, brake_rear:394, heart_rate:161, hydration:93, rain_prob:15, battery:79, speed:291, g_force:4.6, lap_time:"1:14.220" },
  { lap:7,  fuel_pct:80, tire_fl:121, tire_fr:125, tire_rl:118, tire_rr:122, brake_front:442, brake_rear:408, heart_rate:163, hydration:92, rain_prob:18, battery:76, speed:305, g_force:4.7, lap_time:"1:14.551" },
  { lap:8,  fuel_pct:77, tire_fl:126, tire_fr:130, tire_rl:124, tire_rr:128, brake_front:455, brake_rear:420, heart_rate:165, hydration:91, rain_prob:22, battery:73, speed:318, g_force:4.8, lap_time:"1:14.882" },
  { lap:9,  fuel_pct:74, tire_fl:130, tire_fr:134, tire_rl:129, tire_rr:133, brake_front:466, brake_rear:431, heart_rate:167, hydration:90, rain_prob:25, battery:70, speed:295, g_force:4.9, lap_time:"1:15.102" },
  { lap:10, fuel_pct:71, tire_fl:133, tire_fr:137, tire_rl:133, tire_rr:137, brake_front:474, brake_rear:440, heart_rate:169, hydration:89, rain_prob:28, battery:67, speed:302, g_force:5.0, lap_time:"1:15.344" },
  { lap:11, fuel_pct:68, tire_fl:135, tire_fr:139, tire_rl:136, tire_rr:140, brake_front:480, brake_rear:447, heart_rate:171, hydration:88, rain_prob:30, battery:64, speed:288, g_force:5.0, lap_time:"1:15.621" },
  { lap:12, fuel_pct:65, tire_fl:136, tire_fr:140, tire_rl:138, tire_rr:142, brake_front:484, brake_rear:452, heart_rate:172, hydration:87, rain_prob:32, battery:61, speed:276, g_force:5.1, lap_time:"1:15.890" },
  { lap:13, fuel_pct:62, tire_fl:137, tire_fr:141, tire_rl:139, tire_rr:143, brake_front:487, brake_rear:455, heart_rate:173, hydration:86, rain_prob:35, battery:58, speed:283, g_force:5.1, lap_time:"1:16.201" },
  { lap:14, fuel_pct:59, tire_fl:138, tire_fr:142, tire_rl:140, tire_rr:144, brake_front:489, brake_rear:457, heart_rate:174, hydration:85, rain_prob:38, battery:55, speed:295, g_force:5.1, lap_time:"1:16.445" },
  { lap:15, fuel_pct:56, tire_fl:138, tire_fr:142, tire_rl:140, tire_rr:144, brake_front:490, brake_rear:458, heart_rate:175, hydration:84, rain_prob:40, battery:52, speed:301, g_force:5.1, lap_time:"1:16.712" },
  { lap:16, fuel_pct:53, tire_fl:137, tire_fr:141, tire_rl:139, tire_rr:143, brake_front:488, brake_rear:456, heart_rate:174, hydration:83, rain_prob:42, battery:49, speed:308, g_force:5.0, lap_time:"1:16.980" },
  { lap:17, fuel_pct:50, tire_fl:135, tire_fr:139, tire_rl:137, tire_rr:141, brake_front:484, brake_rear:452, heart_rate:173, hydration:82, rain_prob:45, battery:46, speed:295, g_force:5.0, lap_time:"1:17.211" },
  { lap:18, fuel_pct:47, tire_fl:132, tire_fr:136, tire_rl:134, tire_rr:138, brake_front:478, brake_rear:446, heart_rate:172, hydration:81, rain_prob:48, battery:43, speed:278, g_force:4.9, lap_time:"1:17.502" },
  { lap:19, fuel_pct:44, tire_fl:128, tire_fr:132, tire_rl:130, tire_rr:134, brake_front:470, brake_rear:438, heart_rate:171, hydration:80, rain_prob:52, battery:40, speed:265, g_force:4.8, lap_time:"1:17.801" },
  { lap:20, fuel_pct:41, tire_fl:123, tire_fr:127, tire_rl:125, tire_rr:129, brake_front:460, brake_rear:428, heart_rate:170, hydration:79, rain_prob:55, battery:37, speed:271, g_force:4.7, lap_time:"1:18.112" },
];

export interface Driver {
  id: string; name: string; number: string; team: string;
  teamColor: string; nationality: string; flag: string;
  position: number; gap: string; emoji: string;
  bio: string;
}

export const DRIVERS: Driver[] = [
  { id:"verstappen", name:"Max Verstappen",   number:"1",  team:"Red Bull Racing",  teamColor:"#1E3A8A", nationality:"Dutch",   flag:"🇳🇱", position:1, gap:"LEADER", emoji:"🔵", bio:"Three-time World Champion. Fearless under pressure." },
  { id:"leclerc",    name:"Charles Leclerc",  number:"16", team:"Scuderia Ferrari", teamColor:"#DC2626", nationality:"Monegasque", flag:"🇲🇨", position:2, gap:"+1.4s",  emoji:"🔴", bio:"Monaco local hero. Fastest in the tunnels." },
  { id:"hamilton",   name:"Lewis Hamilton",   number:"44", team:"Mercedes AMG",     teamColor:"#065F46", nationality:"British", flag:"🇬🇧", position:3, gap:"+3.1s",  emoji:"🟢", bio:"Seven-time World Champion. Master of tyre management." },
  { id:"norris",     name:"Lando Norris",     number:"4",  team:"McLaren Racing",   teamColor:"#EA580C", nationality:"British", flag:"🇬🇧", position:4, gap:"+4.8s",  emoji:"🟠", bio:"Fastest qualifier on the grid. Aggressive on entry." },
];

export function statusColor(v: number, warn: number, crit: number) {
  if (v >= crit) return "#ff1e3c";
  if (v >= warn) return "#ffd000";
  return "#00ff9d";
}
export function fuelColor(p: number) {
  if (p < 25) return "#ff1e3c";
  if (p < 45) return "#ffd000";
  return "#00ff9d";
}
export function rainEmoji(p: number) {
  if (p >= 60) return "⛈️";
  if (p >= 35) return "🌦️";
  if (p >= 15) return "🌤️";
  return "☀️";
}

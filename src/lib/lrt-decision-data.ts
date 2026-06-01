/**
 * DECISION-INTELLIGENCE layer for the Khon Kaen LRT.
 *
 * Everything here is derived **deterministically** from the data that already
 * ships in `docs/lrt_plans.json` — specifically the 25 stations' real CCTV
 * traffic counts (`daily_total`) and their `landmark`/`zone` tags — plus a small
 * set of published headline figures (the ฿26.96B / 22.8 km main-line cost and
 * the proposed ฿15 flat fare).
 *
 * It is explicitly a **planning estimate / scenario model**, NOT official data.
 * Honesty contract (see CLAUDE.md): every number this module produces is meant to
 * be rendered with an "Estimate" badge; ridership is always a range; figures that
 * have no basis in the dataset (Hospital, HSR interchange) are flagged as data
 * gaps and never invented.
 */

import lrtPlansData from '../../docs/lrt_plans.json';
import { getEiaForPlan, getTracking } from './lrt-eia-data';

const stations = lrtPlansData.stations as any[];
const plans = lrtPlansData.plans as any[];

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Unique station indices touched by a plan (across all of its lines). */
export function getPlanStationIndices(planId: number): number[] {
  const plan = plans.find((p) => p.plan_id === planId);
  if (!plan) return [];
  return Array.from(new Set(plan.lines.flatMap((l: any) => l.station_indices as number[])));
}

/** Round to the nearest `step` (used to avoid false-precision ridership). */
function roundTo(n: number, step: number): number {
  return Math.round(n / step) * step;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sila corridor — the territory the withdrawn municipality covers (approximated).
//
// Sila Municipality withdrew from KKTS (approved 30 Apr 2026). The official
// municipal boundary is not in this repo, so we approximate its corridor by the
// northern station zones (which include KKU, the project's single most important
// ridership anchor). This is labeled as an approximation everywhere it surfaces.
// ─────────────────────────────────────────────────────────────────────────────

export const SILA_CORRIDOR_STATIONS: number[] = stations
  .filter((s) => typeof s.zone === 'string' && s.zone.includes('north'))
  .map((s) => s.index as number);

export const SILA_NOTE = {
  en: 'Sila corridor approximated by northern station zones (no official municipal GIS in dataset).',
  th: 'แนวเขตเทศบาลเมืองศิลาในที่นี้เป็นการประมาณการจากโซนสถานีทางทิศเหนือ เนื่องจากชุดข้อมูลยังไม่มีขอบเขตเทศบาลอย่างเป็นทางการ',
};

// ─────────────────────────────────────────────────────────────────────────────
// Strategic anchors — the high-value destinations a viable line must capture.
// Mapped to the REAL station indices that serve them, using the landmark/zone
// tags in the dataset. Anchors with `dataGap: true` are NOT in the station data
// and must be shown as "not represented", never fabricated.
// ─────────────────────────────────────────────────────────────────────────────

export interface StrategicAnchor {
  key: string;
  en: string;
  th: string;
  /** Real station indices serving this anchor (empty when dataGap). */
  stationIndices: number[];
  /** True when the anchor cannot be represented from the current station data. */
  dataGap?: boolean;
}

export const STRATEGIC_ANCHORS: StrategicAnchor[] = [
  { key: 'kku', en: 'Khon Kaen University', th: 'มหาวิทยาลัยขอนแก่น', stationIndices: [11, 6] },
  { key: 'central', en: 'Central Plaza / Malls', th: 'เซ็นทรัล / ห้างสรรพสินค้า', stationIndices: [3] },
  { key: 'busTerminal', en: 'Bus Terminal / District Office', th: 'สถานีขนส่ง / ที่ว่าการอำเภอ', stationIndices: [10] },
  { key: 'nida', en: 'NIDA Khon Kaen', th: 'นิด้า ขอนแก่น', stationIndices: [8, 16] },
  { key: 'stadium', en: 'Sports Stadium / Kaen Nakorn', th: 'สนามกีฬา / แก่นนคร', stationIndices: [14] },
  { key: 'cityCore', en: 'City-core Markets', th: 'ตลาดใจกลางเมือง', stationIndices: [0, 1, 4, 7] },
  { key: 'hospital', en: 'Srinagarind / Regional Hospital', th: 'รพ.ศรีนครินทร์ / รพ.ภูมิภาค', stationIndices: [], dataGap: true },
  { key: 'hsr', en: 'High-Speed Rail Interchange', th: 'จุดเชื่อมต่อรถไฟความเร็วสูง', stationIndices: [], dataGap: true },
];

export interface AnchorCaptureRow {
  key: string;
  en: string;
  th: string;
  dataGap: boolean;
  /** Captured under the current scenario (false for data-gap anchors). */
  captured: boolean;
  /** Captured at base (Sila included) but lost when Sila is excluded. */
  lostWithSila: boolean;
}

export interface AnchorCapture {
  rows: AnchorCaptureRow[];
  /** Anchors captured / total real (non-data-gap) anchors. */
  capturedCount: number;
  realAnchorCount: number;
  /** Number of anchors lost specifically because Sila's corridor is dropped. */
  lostWithSilaCount: number;
}

export function getAnchorCapture(
  planId: number,
  opts: { excludeSila?: boolean } = {},
): AnchorCapture {
  const all = getPlanStationIndices(planId);
  const silaSet = new Set(SILA_CORRIDOR_STATIONS);
  const effective = opts.excludeSila ? all.filter((i) => !silaSet.has(i)) : all;
  const baseSet = new Set(all);
  const effSet = new Set(effective);

  const rows: AnchorCaptureRow[] = STRATEGIC_ANCHORS.map((a) => {
    if (a.dataGap) {
      return { key: a.key, en: a.en, th: a.th, dataGap: true, captured: false, lostWithSila: false };
    }
    const captured = a.stationIndices.some((i) => effSet.has(i));
    const capturedAtBase = a.stationIndices.some((i) => baseSet.has(i));
    const capturedWithoutSila = a.stationIndices.some((i) => !silaSet.has(i) && baseSet.has(i));
    return {
      key: a.key,
      en: a.en,
      th: a.th,
      dataGap: false,
      captured,
      lostWithSila: capturedAtBase && !capturedWithoutSila,
    };
  });

  const real = rows.filter((r) => !r.dataGap);
  return {
    rows,
    capturedCount: real.filter((r) => r.captured).length,
    realAnchorCount: real.length,
    lostWithSilaCount: real.filter((r) => r.lostWithSila).length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Ridership — a RANGE derived from real CCTV throughput. Never a single
// fake-precise integer.
// ─────────────────────────────────────────────────────────────────────────────

/** Modal-shift assumptions: share of corridor vehicle throughput diverted to LRT. */
export const MODAL_SHIFT = { low: 0.04, base: 0.06, high: 0.08 };

export interface Ridership {
  /** Estimated daily LRT trips, rounded to nearest 500 to avoid false precision. */
  low: number;
  base: number;
  high: number;
  /** Σ daily_total of the plan's stations (the real CCTV figure it derives from). */
  corridorDailyVehicles: number;
  stationsCount: number;
  assumption_en: string;
  assumption_th: string;
}

export function getRidership(
  planId: number,
  opts: { excludeSila?: boolean } = {},
): Ridership {
  const all = getPlanStationIndices(planId);
  const silaSet = new Set(SILA_CORRIDOR_STATIONS);
  const effective = opts.excludeSila ? all.filter((i) => !silaSet.has(i)) : all;
  const corridorDailyVehicles = effective.reduce(
    (sum, i) => sum + (stations[i]?.daily_total ?? 0),
    0,
  );
  return {
    low: roundTo(corridorDailyVehicles * MODAL_SHIFT.low, 500),
    base: roundTo(corridorDailyVehicles * MODAL_SHIFT.base, 500),
    high: roundTo(corridorDailyVehicles * MODAL_SHIFT.high, 500),
    corridorDailyVehicles,
    stationsCount: effective.length,
    assumption_en: `${Math.round(MODAL_SHIFT.low * 100)}–${Math.round(MODAL_SHIFT.high * 100)}% modal shift of CCTV vehicle throughput`,
    assumption_th: `ประมาณการจากการเปลี่ยนรูปแบบการเดินทาง ร้อยละ ${Math.round(MODAL_SHIFT.low * 100)}–${Math.round(MODAL_SHIFT.high * 100)} ของปริมาณจราจรที่ตรวจวัดด้วยกล้อง CCTV`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Financial case — parametric, calibrated to the published ฿26.96B / 22.8 km.
// All figures are ESTIMATE / SCENARIO. Capex in billion THB; opex/farebox/TOD in
// million THB per year.
// ─────────────────────────────────────────────────────────────────────────────

export const FARE_THB = 15; // proposed flat fare
/** Calibration: ฿26.96B / 22.8 km ≈ ฿1.18B per km for the spine alignment. */
export const COST_PER_KM_B = { low: 0.9, base: 1.18, high: 1.6 };

export interface SensitivityRow {
  key: string;
  en: string;
  th: string;
  /** Farebox-recovery ratio under this scenario, % (null where not applicable). */
  recoveryPct: number | null;
  /** Capex under this scenario, billion THB (null where unchanged). */
  capexB: number | null;
}

export interface Financials {
  corridorLengthKm: number;
  stationsCount: number;
  capexLowB: number;
  capexBaseB: number;
  capexHighB: number;
  opexPerYearM: number;
  fareboxPerYearM: number;
  recoveryPct: number;
  todStations: number;
  todUpsideLowM: number;
  todUpsideHighM: number;
  sensitivity: SensitivityRow[];
}

/** Stations that plausibly anchor land-value capture (central/commercial zones). */
function todStationCount(planStations: number[]): number {
  return planStations.filter((i) => {
    const s = stations[i];
    if (!s) return false;
    const zone = String(s.zone ?? '');
    const lm = String(s.landmark ?? '');
    return zone.includes('center') || /Market|Plaza|Wholesale|Bus Terminal/i.test(lm);
  }).length;
}

export function getFinancials(planId: number): Financials {
  const eia = getEiaForPlan(planId);
  const km = eia.corridorLengthKm;
  const planStations = getPlanStationIndices(planId);
  const stationsCount = planStations.length;
  const ridership = getRidership(planId);

  const capexLowB = +(km * COST_PER_KM_B.low).toFixed(1);
  const capexBaseB = +(km * COST_PER_KM_B.base).toFixed(1);
  const capexHighB = +(km * COST_PER_KM_B.high).toFixed(1);

  // Opex estimate: per-km O&M + per-station running cost (M THB / yr).
  const opexPerYearM = Math.round(km * 12 + stationsCount * 4);

  // Farebox = base ridership × fare × 365 days (M THB / yr).
  const fareboxPerYearM = Math.round((ridership.base * FARE_THB * 365) / 1e6);
  const recoveryPct = Math.round((fareboxPerYearM / opexPerYearM) * 100);

  const todStations = todStationCount(planStations);
  const todUpsideLowM = todStations * 15;
  const todUpsideHighM = todStations * 45;

  const recAt = (fareboxM: number) => Math.round((fareboxM / opexPerYearM) * 100);
  const sensitivity: SensitivityRow[] = [
    { key: 'base', en: 'Base case', th: 'กรณีฐาน', recoveryPct, capexB: capexBaseB },
    { key: 'ridDown', en: 'Ridership −20%', th: 'ผู้โดยสาร −20%', recoveryPct: recAt(Math.round(fareboxPerYearM * 0.8)), capexB: null },
    { key: 'ridUp', en: 'Ridership +20%', th: 'ผู้โดยสาร +20%', recoveryPct: recAt(Math.round(fareboxPerYearM * 1.2)), capexB: null },
    { key: 'fareUp', en: 'Fare ฿15→฿20', th: 'ค่าโดยสาร ฿15→฿20', recoveryPct: recAt(Math.round(fareboxPerYearM * (20 / FARE_THB))), capexB: null },
    { key: 'overrun', en: 'Capex overrun +30%', th: 'ต้นทุนก่อสร้างบานปลาย +30%', recoveryPct: null, capexB: +(capexBaseB * 1.3).toFixed(1) },
  ];

  return {
    corridorLengthKm: km,
    stationsCount,
    capexLowB,
    capexBaseB,
    capexHighB,
    opexPerYearM,
    fareboxPerYearM,
    recoveryPct,
    todStations,
    todUpsideLowM,
    todUpsideHighM,
    sensitivity,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// National pipeline ranking — Khon Kaen (derived) vs the four cities MRTA is
// actively pushing (Phuket, Chiang Mai, Korat, Phitsanulok). The four comparison
// cities carry NO data in this repo, so their figures are ILLUSTRATIVE ranges
// (clearly flagged) — they exist to show the axes the centre ranks on, not to
// assert official numbers.
// ─────────────────────────────────────────────────────────────────────────────

export interface BenchmarkRow {
  key: string;
  en: string;
  th: string;
  /** ฿ billion per km. */
  costPerKm: number;
  /** Thousand daily trips per km. */
  ridershipPerKm: number;
  /** Benefit–cost ratio (estimate / illustrative). */
  bcr: number;
  /** Readiness 0–100. */
  readiness: number;
  /** Milestones complete, %. */
  milestonesPct: number;
  illustrative: boolean;
  isKhonKaen: boolean;
}

export function getNationalBenchmarks(planId: number | null): BenchmarkRow[] {
  // Khon Kaen, derived from the selected plan (fallback to the N–S spine, plan 1).
  const kkPlan = planId ?? 1;
  const fin = getFinancials(kkPlan);
  const ridership = getRidership(kkPlan);
  const tracking = getTracking(planId !== null);
  const milestonesPct = Math.round(
    (tracking.filter((m) => m.status === 'done').length / tracking.length) * 100,
  );
  const ridershipPerKm = +((ridership.base / 1000) / fin.corridorLengthKm).toFixed(2);
  const khonkaen: BenchmarkRow = {
    key: 'khonkaen',
    en: 'Khon Kaen (local-led)',
    th: 'ขอนแก่น (ท้องถิ่นนำ)',
    costPerKm: fin.capexBaseB,
    ridershipPerKm,
    // BCR has no official basis here → a transparent estimate proxy, flagged.
    bcr: +(0.6 + ridershipPerKm * 0.18).toFixed(2),
    readiness: Math.min(95, 30 + milestonesPct),
    milestonesPct,
    illustrative: false,
    isKhonKaen: true,
  };

  // Illustrative benchmarks for the four MRTA cities (NOT official).
  const cities: BenchmarkRow[] = [
    { key: 'phuket', en: 'Phuket', th: 'ภูเก็ต', costPerKm: 1.5, ridershipPerKm: 2.4, bcr: 1.1, readiness: 70, milestonesPct: 55, illustrative: true, isKhonKaen: false },
    { key: 'chiangmai', en: 'Chiang Mai', th: 'เชียงใหม่', costPerKm: 1.7, ridershipPerKm: 2.1, bcr: 1.0, readiness: 65, milestonesPct: 50, illustrative: true, isKhonKaen: false },
    { key: 'korat', en: 'Nakhon Ratchasima', th: 'นครราชสีมา', costPerKm: 1.2, ridershipPerKm: 1.8, bcr: 0.95, readiness: 60, milestonesPct: 45, illustrative: true, isKhonKaen: false },
    { key: 'phitsanulok', en: 'Phitsanulok', th: 'พิษณุโลก', costPerKm: 1.0, ridershipPerKm: 1.5, bcr: 0.9, readiness: 50, milestonesPct: 40, illustrative: true, isKhonKaen: false },
  ];

  return [khonkaen, ...cities];
}

// ─────────────────────────────────────────────────────────────────────────────
// Assumptions & sources — surfaced in a disclosure panel so nothing is hidden.
// ─────────────────────────────────────────────────────────────────────────────

export const ASSUMPTIONS = {
  en: [
    `Ridership = ${Math.round(MODAL_SHIFT.low * 100)}–${Math.round(MODAL_SHIFT.high * 100)}% modal shift of real CCTV vehicle throughput (Σ daily_total of plan stations), rounded to 500.`,
    `Capex calibrated to the published ฿26.96B / 22.8 km ≈ ฿${COST_PER_KM_B.base}B per km (range ฿${COST_PER_KM_B.low}–${COST_PER_KM_B.high}B for at-grade vs elevated).`,
    `Farebox = base ridership × ฿${FARE_THB} flat fare × 365; opex ≈ ฿12M/km + ฿4M/station per year.`,
    'Sila corridor approximated by northern station zones — not an official municipal boundary.',
    'Hospital and HSR interchange are not in the station dataset and are shown as data gaps, not estimated.',
    'Comparison cities (Phuket, Chiang Mai, Korat, Phitsanulok) are illustrative benchmarks, not official figures.',
  ],
  th: [
    `จำนวนผู้โดยสาร = การเปลี่ยนรูปแบบการเดินทางร้อยละ ${Math.round(MODAL_SHIFT.low * 100)}–${Math.round(MODAL_SHIFT.high * 100)} ของปริมาณจราจรจริงที่ตรวจวัดด้วยกล้อง CCTV (ผลรวม daily_total ของสถานีในแผน) ปัดเศษหน่วยละ 500`,
    `ประมาณการต้นทุนก่อสร้างอ้างอิงตัวเลขที่เผยแพร่ 26.96 พันล้านบาท ต่อระยะทาง 22.8 กิโลเมตร หรือประมาณ ${COST_PER_KM_B.base} พันล้านบาทต่อกิโลเมตร (ช่วง ${COST_PER_KM_B.low}–${COST_PER_KM_B.high} พันล้านบาท สำหรับระดับพื้นและยกระดับ)`,
    `รายได้ค่าโดยสาร = ประมาณการผู้โดยสารกรณีฐาน × ${FARE_THB} บาท × 365 วัน; ค่าดำเนินงานและบำรุงรักษาประมาณ 12 ล้านบาทต่อกิโลเมตร และ 4 ล้านบาทต่อสถานีต่อปี`,
    'แนวเขตเทศบาลเมืองศิลาเป็นการประมาณการจากโซนสถานีทางทิศเหนือ มิใช่ขอบเขตเทศบาลอย่างเป็นทางการ',
    'โรงพยาบาลและจุดเชื่อมต่อรถไฟความเร็วสูงยังไม่มีในชุดข้อมูลสถานี จึงแสดงเป็นรายการที่ยังไม่มีข้อมูล มิใช่การประมาณการ',
    'จังหวัดที่นำมาเปรียบเทียบ (ภูเก็ต เชียงใหม่ นครราชสีมา พิษณุโลก) เป็นค่าอ้างอิงเชิงตัวอย่าง มิใช่ตัวเลขอย่างเป็นทางการ',
  ],
};

export const SOURCES = {
  en: [
    'CCTV AI vehicle count, 25 checkpoints, Feb–Mar 2026 (lrt_plans.json meta).',
    'Main-line cost ฿26.96B / 22.8 km & ฿15 fare — Nation Thailand / Bangkok Biznews, 2024.',
    'Sila withdrawal approved 30 Apr 2026; MRTA 2026 four-city list — soundisan.com, 11 May 2026.',
    'Rail Transport Act B.E. 2568 (DRT licensing) — Royal Gazette, Dec 2025.',
  ],
  th: [
    'ข้อมูลการนับยานพาหนะด้วยระบบ AI จากกล้อง CCTV จำนวน 25 จุด ระหว่างเดือนกุมภาพันธ์–มีนาคม 2569 (ส่วนเมตาของไฟล์ lrt_plans.json)',
    'ต้นทุนเส้นทางหลัก 26.96 พันล้านบาท ต่อ 22.8 กิโลเมตร และค่าโดยสาร 15 บาท — Nation Thailand / กรุงเทพธุรกิจ ปี 2567',
    'การถอนตัวของเทศบาลเมืองศิลา ได้รับอนุมัติเมื่อวันที่ 30 เมษายน 2569; บัญชี 4 จังหวัดของ รฟม. ปี 2569 — soundisan.com วันที่ 11 พฤษภาคม 2569',
    'พระราชบัญญัติการขนส่งทางราง พ.ศ. 2568 (การออกใบอนุญาตโดยกรมการขนส่งทางราง) — ราชกิจจานุเบกษา ธันวาคม 2568',
  ],
};

/**
 * MOCK data for the left-sidebar EIA and Project-Tracking boxes.
 *
 * Numbers are derived deterministically from each LRT plan (plan_id +
 * station/line counts) so every plan shows different — but stable — figures.
 * This is placeholder data: there is no real expropriation/EIA engine yet.
 * See CLAUDE.md ("Not built at all") and the unified-schema notes in
 * `.env.template`.
 */

import lrtPlansData from '../../docs/lrt_plans.json';

export interface EiaMetrics {
  /** Right-of-way / corridor street width that must be cleared, in metres. */
  rowWidthM: number;
  /** Approximate corridor length, in km. */
  corridorLengthKm: number;
  /** Total structures inside the spatial buffer that must be demolished. */
  buildingsToDemolish: number;
  residential: number;
  commercial: number;
  /** Estimated expropriation/compensation cost, in million THB. */
  compensationCostMTHB: number;
  /** 0–100 EIA friction score (higher = more contested). */
  eiaRiskScore: number;
  /** Historical citizen-complaint counts along the corridor. */
  floodComplaints: number;
  noiseComplaints: number;
  /** Estimated land parcels / affected owners along the corridor (modeled). */
  parcelsAffected: number;
}

/** Deterministic pseudo-random in [0,1) from an integer seed. */
function seeded(n: number): number {
  const x = Math.sin(n * 99991) * 10000;
  return x - Math.floor(x);
}

export function getEiaForPlan(planId: number): EiaMetrics {
  const plan = lrtPlansData.plans.find((p: any) => p.plan_id === planId);
  const stations = plan?.total_stations ?? 6;
  const lines = plan?.total_lines ?? 1;
  const r = (i: number) => seeded(planId * 17 + i);

  const corridorLengthKm = +(stations * (1.4 + r(1) * 0.6) + (lines - 1) * 3).toFixed(1);
  const rowWidthM = Math.round(20 + (lines - 1) * 4 + r(2) * 8); // ~20–36 m
  const buildingsToDemolish = Math.round(corridorLengthKm * (4 + r(3) * 5));
  const commercial = Math.round(buildingsToDemolish * (0.3 + r(4) * 0.2));
  const residential = Math.max(0, buildingsToDemolish - commercial);
  const compensationCostMTHB = Math.round(
    buildingsToDemolish * (8 + r(5) * 7) + corridorLengthKm * 12
  );
  const eiaRiskScore = Math.min(
    95,
    Math.round(32 + buildingsToDemolish * 0.7 + lines * 6 + r(6) * 14)
  );
  const floodComplaints = Math.round(8 + r(7) * 55);
  const noiseComplaints = Math.round(18 + r(8) * 80);
  // Affected land parcels / owners — modeled from buildings + corridor length.
  const parcelsAffected = Math.round(buildingsToDemolish * 0.9 + corridorLengthKm * 1.5);

  return {
    rowWidthM,
    corridorLengthKm,
    buildingsToDemolish,
    residential,
    commercial,
    compensationCostMTHB,
    eiaRiskScore,
    floodComplaints,
    noiseComplaints,
    parcelsAffected,
  };
}

export type MilestoneStatus = 'done' | 'in_progress' | 'at_risk' | 'pending';

export interface Milestone {
  key: string;
  status: MilestoneStatus;
  /** Accountable entity (language-neutral acronym, e.g. KKTS, DRT). */
  owner: string;
  /** Originally planned date. */
  baselineDate: string;
  /** Current forecast / actual date ('—' when not yet schedulable). */
  forecastDate: string;
  /** Translation key for the blocker note (resolved in the sidebar). */
  blockerKey?: string;
  /** Translation key for an extra honesty note. */
  noteKey?: string;
}

/**
 * The opening-date slippage history — the single most corrosive fact about this
 * project and the reason the tracker shows baseline-vs-forecast honestly.
 */
export const SLIPPAGE_HISTORY = '2022 → 2025 → 2027 → 2028';

/**
 * Program-level approval tracking — an HONEST view of where the project stands.
 *
 * Design rules (see CLAUDE.md honesty contract):
 *  - The financing step can NEVER be 'done' — it is "Under review, NOT secured".
 *  - The line-confirmation step is 'at_risk' because of Sila's withdrawal.
 *  - DRT licensing steps (Rail Transport Act B.E. 2568) are shown explicitly,
 *    including the first-of-its-kind local-operator licence.
 *  - baselineDate vs forecastDate expose slippage rather than hiding it.
 *
 * Selecting a plan advances line-confirmation from at_risk → in_progress (an
 * alignment is on the table), but everything downstream stays honestly pending.
 */
export function getTracking(planSelected: boolean): Milestone[] {
  return [
    { key: 'survey', status: 'done', owner: 'KKTS', baselineDate: '2025-08', forecastDate: '2025-08' },
    { key: 'draft', status: 'done', owner: 'KKTT', baselineDate: '2025-10', forecastDate: '2025-11' },
    {
      key: 'confirm',
      status: planSelected ? 'in_progress' : 'at_risk',
      owner: '4 Municipalities',
      baselineDate: '2026-02',
      forecastDate: '2026-Q3',
      blockerKey: 'sila',
    },
    {
      key: 'financing',
      status: 'at_risk',
      owner: 'KKTS / Lenders',
      baselineDate: '2026-02',
      forecastDate: 'TBD',
      blockerKey: 'financing',
      noteKey: 'fin_not_secured',
    },
    { key: 'eia_submit', status: planSelected ? 'in_progress' : 'pending', owner: 'KKTS', baselineDate: '2026-05', forecastDate: '2026-Q4' },
    { key: 'eia_pass', status: 'pending', owner: 'ONEP / EIA Cttee', baselineDate: '2026-Q4', forecastDate: '—' },
    { key: 'drt_engage', status: 'pending', owner: 'DRT', baselineDate: '2026-Q4', forecastDate: '—', noteKey: 'drt_new' },
    { key: 'hearing', status: 'pending', owner: '4 Municipalities', baselineDate: '2027', forecastDate: '—' },
    { key: 'drt_license', status: 'pending', owner: 'DRT', baselineDate: '2027', forecastDate: '—', blockerKey: 'drt_license' },
    { key: 'budget', status: 'pending', owner: 'Cabinet / Lenders', baselineDate: '2027', forecastDate: '—' },
    { key: 'construction', status: 'pending', owner: 'Contractor', baselineDate: '2028', forecastDate: '—' },
  ];
}

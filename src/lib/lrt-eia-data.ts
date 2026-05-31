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
  };
}

export type MilestoneStatus = 'done' | 'in_progress' | 'pending';

export interface Milestone {
  key: string;
  status: MilestoneStatus;
  date: string;
}

/**
 * Program-level accomplishment tracking. A couple of steps react to whether an
 * LRT plan is currently selected (mock "Line Plan Confirmed" gate).
 */
export function getTracking(planSelected: boolean): Milestone[] {
  return [
    { key: 'survey', status: 'done', date: '2025-08' },
    { key: 'draft', status: 'done', date: '2025-11' },
    { key: 'confirm', status: planSelected ? 'done' : 'in_progress', date: '2026-02' },
    { key: 'eia_submit', status: planSelected ? 'in_progress' : 'pending', date: '2026-05' },
    { key: 'eia_pass', status: 'pending', date: '—' },
    { key: 'hearing', status: 'pending', date: '—' },
    { key: 'budget', status: 'pending', date: '—' },
    { key: 'construction', status: 'pending', date: '—' },
  ];
}

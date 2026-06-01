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
import { getCollidingTilesForPlan } from './lrt-collision-utils';

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

  // ดึงข้อมูลกริดที่ชนกับเส้นทางรถไฟฟ้าจริงจากผลลัพธ์ของ Turf.js
  const collidingTiles = getCollidingTilesForPlan(planId);

  let residential = 0;
  let commercial = 0;
  let compensationCostMTHB = 0;
  let totalRiskPoints = 0;

  // คำนวณผลกระทบ EIA จริงตามสัดส่วนความสูงและความหนาแน่นของสิ่งปลูกสร้างในแต่ละกริดเฉพาะที่แนวเส้นทางตัดผ่าน
  collidingTiles.forEach((tile) => {
    if (!tile.isColliding) return;

    const seedX = tile.grid_x;
    const seedY = tile.grid_y;

    if (tile.severity === 'high') {
      // ตึกสูงและหนาแน่น (z_range สูง, pct_high สูง) ทำให้มีอาคารที่ต้องรื้อถอนและค่าชดเชยสูงมาก
      residential += Math.round(18 + seeded(seedX) * 12);
      commercial += Math.round(12 + seeded(seedY) * 8);
      compensationCostMTHB += Math.round(220 + seeded(seedX) * 100);
      totalRiskPoints += 25;
    } else if (tile.severity === 'medium') {
      // อาคารปานกลาง
      residential += Math.round(6 + seeded(seedX) * 6);
      commercial += Math.round(3 + seeded(seedY) * 4);
      compensationCostMTHB += Math.round(70 + seeded(seedX) * 40);
      totalRiskPoints += 12;
    } else {
      // พื้นที่โล่งหรืออาคารต่ำ
      residential += Math.round(1 + seeded(seedX) * 2);
      commercial += Math.round(seeded(seedY) * 2);
      compensationCostMTHB += Math.round(12 + seeded(seedX) * 8);
      totalRiskPoints += 3;
    }
  });

  const buildingsToDemolish = residential + commercial;
  const actualCollisionsCount = collidingTiles.filter(t => t.isColliding).length;

  // หากไม่มีพื้นที่ชนเลย ให้ใช้ค่าสถิติเริ่มต้นตามความยาว
  const finalBuildings = actualCollisionsCount > 0 ? buildingsToDemolish : Math.round(corridorLengthKm * 2);
  const finalResidential = actualCollisionsCount > 0 ? residential : Math.round(finalBuildings * 0.6);
  const finalCommercial = actualCollisionsCount > 0 ? commercial : Math.max(0, finalBuildings - finalResidential);
  const finalCompensation = actualCollisionsCount > 0 ? compensationCostMTHB : Math.round(finalBuildings * 5 + corridorLengthKm * 10);
  const eiaRiskScore = actualCollisionsCount > 0
    ? Math.min(98, Math.max(20, totalRiskPoints))
    : Math.min(95, Math.round(15 + corridorLengthKm * 4));

  const floodComplaints = Math.round(8 + r(7) * 55);
  const noiseComplaints = Math.round(18 + r(8) * 80);

  return {
    rowWidthM,
    corridorLengthKm,
    buildingsToDemolish: finalBuildings,
    residential: finalResidential,
    commercial: finalCommercial,
    compensationCostMTHB: finalCompensation,
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


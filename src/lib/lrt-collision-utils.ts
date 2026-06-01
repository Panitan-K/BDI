import * as turf from '@turf/turf';
import { tileAnalysisData, TileAnalysis } from './tile-analysis-data';
import lrtPlansData from '../../docs/lrt_plans.json';

export interface CollisionResult {
  tile: string;
  z_range: number;
  pct_high: number;
  severity: 'high' | 'medium' | 'low';
  demolishNeeded: boolean;
  desc: string;
  grid_x: number;
  grid_y: number;
  bounds: [[number, number], [number, number]]; // [[lat_sw, lon_sw], [lat_ne, lon_ne]]
  isColliding: boolean;
  link?: string;
}

export function getCollidingTilesForPlan(planId: number): CollisionResult[] {
  const plan = lrtPlansData.plans.find((p: any) => p.plan_id === planId);
  if (!plan) return [];

  const collisions: CollisionResult[] = [];

  // วนลูปตรวจสอบทุกพื้นที่ในข้อมูลวิเคราะห์ (tile_analysis.csv)
  tileAnalysisData.forEach((tile) => {
    let isColliding = false;

    // ตรวจสอบว่าแนวเส้นทางรถไฟใดๆ ในแผนตัดผ่านกริดนี้หรือไม่
    plan.lines.forEach((line: any) => {
      const coords = line.route_geometry.map((pt: [number, number]) => [pt[1], pt[0]]);
      if (coords.length < 2) return;

      const lineFeature = turf.lineString(coords);
      const bboxPoly = turf.bboxPolygon([tile.lon_sw, tile.lat_sw, tile.lon_ne, tile.lat_ne]);
      const intersects = turf.booleanIntersects(lineFeature, bboxPoly);

      if (intersects) {
        isColliding = true;
      }
    });


    let severity: 'high' | 'medium' | 'low' = 'low';
    let demolishNeeded = false;

    if (tile.z_range > 23 || tile.pct_high > 40) {
      severity = 'high';
      demolishNeeded = isColliding;
    } else if (tile.z_range > 15 || tile.pct_high > 20) {
      severity = 'medium';
      demolishNeeded = isColliding;
    } else {
      severity = 'low';
      demolishNeeded = false;
    }

    let desc = '';
    if (isColliding) {
      if (severity === 'high') {
        const reasons = [];
        // ตรวจสอบความสูงตามกฎหมายอาคารสูง (23 เมตร)
        if (tile.z_range > 23) reasons.push(`ความสูงอาคารเข้าข่ายอาคารสูงตามกฎหมายควบคุมอาคาร (>23ม. โดยวัดได้ ${tile.z_range}m)`);
        // ตรวจสอบความหนาแน่นสูงสุดตามผังเมือง (70%)
        if (tile.pct_high > 70) reasons.push(`ความหนาแน่นตึกสูงเกินเกณฑ์ผังเมืองพาณิชยกรรมหนาแน่นสูง (>70% โดยวัดได้ ${tile.pct_high}%)`);
        desc = `เสี่ยงรื้อถอนสูง: แนวเส้นทางตัดผ่านอาคารสูงหรือพื้นที่หนาแน่นตามกฎหมายควบคุมอาคาร (${reasons.join(' และ ')})`;
      } else if (severity === 'medium') {
        const reasons = [];
        // ตรวจสอบความสูงตามกฎหมายอาคารขนาดใหญ่ (15 เมตร)
        if (tile.z_range > 15) reasons.push(`ความสูงอาคารเข้าข่ายอาคารขนาดใหญ่ตามกฎหมายควบคุมอาคาร (>15ม. โดยวัดได้ ${tile.z_range}m)`);
        // ตรวจสอบความหนาแน่นปานกลาง (30%)
        if (tile.pct_high > 30) reasons.push(`ความหนาแน่นตึกสูงเกินเกณฑ์ทั่วไป (>30% โดยวัดได้ ${tile.pct_high}%)`);
        desc = `เสี่ยงรื้อถอนปานกลาง: แนวเส้นทางตัดผ่านอาคารขนาดใหญ่หรือพื้นที่หนาแน่นปานกลาง (${reasons.join(' และ ')})`;
      } else {
        desc = `เสี่ยงรื้อถอนต่ำ: แนวเส้นทางตัดผ่านอาคารต่ำหรือพื้นที่โล่ง (z_range: ${tile.z_range}m, pct_high: ${tile.pct_high}%)`;
      }
    } else {
      if (severity === 'high') {
        const reasons = [];
        // ตรวจสอบความสูงตามกฎหมายอาคารสูง (23 เมตร)
        if (tile.z_range > 23) reasons.push(`ความสูงอาคารเข้าข่ายอาคารสูงตามกฎหมายควบคุมอาคาร (>23ม. โดยวัดได้ ${tile.z_range}m)`);
        // ตรวจสอบความหนาแน่นสูงสุดตามผังเมือง (70%)
        if (tile.pct_high > 70) reasons.push(`ความหนาแน่นตึกสูงเกินเกณฑ์ผังเมืองพาณิชยกรรมหนาแน่นสูง (>70% โดยวัดได้ ${tile.pct_high}%)`);
        desc = `นอกแนวเส้นทาง (พื้นที่เสี่ยงสูง): อาคารสูงหรือพื้นที่หนาแน่นตามกฎหมายควบคุมอาคาร (${reasons.join(' และ ')})`;
      } else if (severity === 'medium') {
        const reasons = [];
        // ตรวจสอบความสูงตามกฎหมายอาคารขนาดใหญ่ (15 เมตร)
        if (tile.z_range > 15) reasons.push(`ความสูงอาคารเข้าข่ายอาคารขนาดใหญ่ตามกฎหมายควบคุมอาคาร (>15ม. โดยวัดได้ ${tile.z_range}m)`);
        // ตรวจสอบความหนาแน่นปานกลาง (30%)
        if (tile.pct_high > 30) reasons.push(`ความหนาแน่นตึกสูงเกินเกณฑ์ทั่วไป (>30% โดยวัดได้ ${tile.pct_high}%)`);
        desc = `นอกแนวเส้นทาง (พื้นที่เสี่ยงปานกลาง): อาคารขนาดใหญ่หรือพื้นที่หนาแน่นปานกลาง (${reasons.join(' และ ')})`;
      } else {
        desc = `นอกแนวเส้นทาง (พื้นที่เสี่ยงต่ำ): พื้นที่อาคารต่ำหรือโล่ง (z_range: ${tile.z_range}m, pct_high: ${tile.pct_high}%)`;
      }
    }

    collisions.push({
      tile: tile.tile,
      z_range: tile.z_range,
      pct_high: tile.pct_high,
      severity,
      demolishNeeded,
      desc,
      grid_x: tile.grid_x,
      grid_y: tile.grid_y,
      bounds: [
        [tile.lat_sw, tile.lon_sw],
        [tile.lat_ne, tile.lon_ne]
      ],
      isColliding,
      link: tile.link
    });
  });

  return collisions;
}

'use client';

import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  LabelList,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNationalBenchmarks } from '@/lib/lrt-decision-data';
import { EstimateBadge } from '@/components/nli-estimate-badge';

const translations = {
  en: {
    title: 'National Pipeline Ranking',
    desc: 'Khon Kaen plotted against the four regional cities MRTA is actively advancing (Phuket, Chiang Mai, Korat, Phitsanulok), on the axes the centre uses to rank projects. Khon Kaen is currently OFF that list.',
    scatterX: 'CAPEX ฿B / km',
    scatterY: 'Ridership (k/day) / km',
    city: 'City',
    costPerKm: '฿B/km',
    ridPerKm: 'k/km',
    bcr: 'BCR',
    readiness: 'Readiness',
    milestones: 'Milestones',
    illustrativeNote: 'Comparison cities are illustrative benchmarks, not official figures. Khon Kaen is derived from the selected plan.',
  },
  th: {
    title: 'การจัดอันดับในแผนระดับชาติ',
    desc: 'นำเสนอโครงการขอนแก่นเทียบกับ 4 จังหวัดที่ รฟม. กำลังผลักดัน (ภูเก็ต เชียงใหม่ นครราชสีมา พิษณุโลก) ตามตัวชี้วัดที่ส่วนกลางใช้พิจารณาจัดอันดับโครงการ ทั้งนี้ ปัจจุบันโครงการขอนแก่นยังมิได้อยู่ในบัญชีดังกล่าว',
    scatterX: 'ต้นทุน ฿พันล้าน / กม.',
    scatterY: 'ผู้โดยสาร (พัน/วัน) / กม.',
    city: 'เมือง',
    costPerKm: '฿พันล้าน/กม.',
    ridPerKm: 'พัน/กม.',
    bcr: 'BCR',
    readiness: 'ความพร้อม',
    milestones: 'ความคืบหน้า',
    illustrativeNote: 'จังหวัดที่นำมาเปรียบเทียบเป็นค่าอ้างอิงเชิงตัวอย่าง มิใช่ตัวเลขอย่างเป็นทางการ ส่วนข้อมูลขอนแก่นคำนวณจากแผนที่เลือก',
  },
};

export function NliPipelineDialog({
  isOpen,
  onOpenChange,
  language,
  selectedPlanId,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
  selectedPlanId: number | null;
}) {
  const t = translations[language as keyof typeof translations] || translations.en;
  const rows = useMemo(() => getNationalBenchmarks(selectedPlanId), [selectedPlanId]);

  const scatterData = rows.map((r) => ({
    x: r.costPerKm,
    y: r.ridershipPerKm,
    name: language === 'th' ? r.th : r.en,
    isKhonKaen: r.isKhonKaen,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t.title}
            <EstimateBadge kind="illustrative" language={language} tooltip={t.illustrativeNote} />
          </DialogTitle>
          <DialogDescription className="text-left">{t.desc}</DialogDescription>
        </DialogHeader>

        {/* Scatter: cost/km vs ridership/km, Khon Kaen highlighted */}
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                dataKey="x"
                name={t.scatterX}
                fontSize={10}
                tickLine={false}
                label={{ value: t.scatterX, position: 'insideBottom', offset: -8 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={t.scatterY}
                fontSize={10}
                tickLine={false}
                width={40}
              />
              <ReTooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ fontSize: 11, background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                formatter={(value: any, key: any) => [value, key === 'x' ? t.scatterX : t.scatterY]}
                labelFormatter={() => ''}
              />
              <Scatter data={scatterData}>
                {scatterData.map((d, i) => (
                  <Cell key={i} fill={d.isKhonKaen ? '#ef4444' : 'hsl(var(--chart-1))'} />
                ))}
                <LabelList dataKey="name" position="top" fontSize={9} className="fill-foreground" />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Ranking table */}
        <div className="rounded-lg border border-border/40 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[11px]">{t.city}</TableHead>
                <TableHead className="text-[11px] text-right">{t.costPerKm}</TableHead>
                <TableHead className="text-[11px] text-right">{t.ridPerKm}</TableHead>
                <TableHead className="text-[11px] text-right">{t.bcr}</TableHead>
                <TableHead className="text-[11px] text-right">{t.readiness}</TableHead>
                <TableHead className="text-[11px] text-right">{t.milestones}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.key} className={cn(r.isKhonKaen && 'bg-red-500/10')}>
                  <TableCell className="text-xs font-medium flex items-center gap-1.5">
                    <span className={cn(r.isKhonKaen && 'text-red-400 font-bold')}>
                      {language === 'th' ? r.th : r.en}
                    </span>
                    {r.illustrative && <EstimateBadge kind="illustrative" language={language} />}
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono">{r.costPerKm}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{r.ridershipPerKm}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{r.bcr}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{r.readiness}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{r.milestonesPct}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-[10px] text-muted-foreground">{t.illustrativeNote}</p>
      </DialogContent>
    </Dialog>
  );
}

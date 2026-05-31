
'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Route,
  TrainTrack,
  Plane,
  Ship,
  Map,
  Trees,
  Tractor,
  Building2,
  Factory,
  LandPlot,
  LucideIcon,
  Layers3,
  Settings,
  MapPin,
  ChevronDown,
  ShieldAlert,
  Ruler,
  Home,
  Coins,
  Building,
  ListChecks,
  CheckCircle2,
  Loader2,
  Circle,
  Droplets,
  Volume2,
} from 'lucide-react';
import { Separator } from './ui/separator';
import lrtPlansData from '../../docs/lrt_plans.json';
import { Button } from '@/components/ui/button';
import { NliLayerSettingsDialog } from './nli-layer-settings-dialog';
import { getEiaForPlan, getTracking, type MilestoneStatus } from '@/lib/lrt-eia-data';

interface Layer {
  name: string;
  icon: LucideIcon;
}

interface LayerCategory {
  [key: string]: Layer[];
}

const translations = {
  en: {
    dataLayers: 'Khon Kaen LRT',
    // Box 1 — LRT line plan
    planTitle: 'LRT Line Plan',
    planSubtitle: '10 proposed configurations',
    planSelectLabel: 'Select Proposed Plan:',
    planNone: '--- None / Hide Overlay ---',
    showRoutes: 'Show LRT Routes',
    showStations: 'Show LRT Stations',
    baseMapLayers: 'Base Map Layers',
    // Box 2 — EIA
    eiaTitle: 'EIA & Right-of-Way',
    eiaSubtitle: 'Impact & expropriation',
    eiaEmpty: 'Select an LRT plan above to assess its corridor impact.',
    rowWidth: 'Corridor Width',
    corridorLen: 'Corridor Length',
    buildings: 'Buildings to Demolish',
    residential: 'residential',
    commercial: 'commercial',
    compensation: 'Est. Compensation',
    riskScore: 'EIA Risk Score',
    friction: 'Community Friction',
    floods: 'flood reports',
    noise: 'noise reports',
    riskLow: 'Low',
    riskMed: 'Moderate',
    riskHigh: 'High',
    // Box 3 — Tracking
    trackTitle: 'Project Tracking',
    trackSubtitle: 'Approval & accomplishment',
    milestonesDone: 'milestones complete',
    statusDone: 'Done',
    statusProgress: 'In progress',
    statusPending: 'Pending',
    milestoneLabels: {
      survey: 'Corridor Survey',
      draft: 'Line Plan Drafted',
      confirm: 'Line Plan Confirmed',
      eia_submit: 'EIA Submitted',
      eia_pass: 'EIA Approved',
      hearing: 'Public Hearing',
      budget: 'Budget Approved',
      construction: 'Construction Start',
    } as Record<string, string>,
    categories: {
      Infrastructure: 'Infrastructure',
      'Land Use': 'Land Use',
      Administrative: 'Administrative',
      Economic: 'Economic',
      Analysis: 'Analysis',
    },
    layers: {
      Roads: 'Roads', Railways: 'Railways', Airports: 'Airports', Ports: 'Ports',
      'Land Use Plan': 'Land Use Plan', 'Forest Zones': 'Forest Zones', 'Agricultural Zones': 'Agricultural Zones',
      Province: 'Province', District: 'District', 'Sub-district': 'Sub-district',
      'Industrial Zones': 'Industrial Zones', 'Special Economic Corridors': 'Special Economic Corridors',
      'Population Density': 'Population Density',
    },
    layerSettings: 'Layer Settings',
  },
  th: {
    dataLayers: 'LRT ขอนแก่น',
    planTitle: 'แผนเส้นทาง LRT',
    planSubtitle: '10 ข้อเสนอโครงข่าย',
    planSelectLabel: 'เลือกข้อเสนอเส้นทาง:',
    planNone: '--- ซ่อนชั้นข้อมูล LRT ---',
    showRoutes: 'แสดงเส้นทางเดินรถ',
    showStations: 'แสดงสถานีเชื่อมต่อ',
    baseMapLayers: 'ชั้นข้อมูลแผนที่',
    eiaTitle: 'EIA และแนวเวนคืน',
    eiaSubtitle: 'ผลกระทบและการเวนคืน',
    eiaEmpty: 'เลือกแผน LRT ด้านบนเพื่อประเมินผลกระทบของแนวเส้นทาง',
    rowWidth: 'ความกว้างแนวเส้นทาง',
    corridorLen: 'ระยะทางแนวเส้นทาง',
    buildings: 'อาคารที่ต้องรื้อถอน',
    residential: 'ที่อยู่อาศัย',
    commercial: 'พาณิชย์',
    compensation: 'ค่าชดเชยโดยประมาณ',
    riskScore: 'คะแนนความเสี่ยง EIA',
    friction: 'แรงต้านจากชุมชน',
    floods: 'ร้องเรียนน้ำท่วม',
    noise: 'ร้องเรียนเสียง',
    riskLow: 'ต่ำ',
    riskMed: 'ปานกลาง',
    riskHigh: 'สูง',
    trackTitle: 'การติดตามโครงการ',
    trackSubtitle: 'สถานะการอนุมัติและความคืบหน้า',
    milestonesDone: 'ขั้นตอนที่เสร็จสมบูรณ์',
    statusDone: 'เสร็จแล้ว',
    statusProgress: 'กำลังดำเนินการ',
    statusPending: 'รอดำเนินการ',
    milestoneLabels: {
      survey: 'สำรวจแนวเส้นทาง',
      draft: 'ร่างแผนเส้นทาง',
      confirm: 'ยืนยันแผนเส้นทาง',
      eia_submit: 'ยื่นรายงาน EIA',
      eia_pass: 'EIA ผ่านการอนุมัติ',
      hearing: 'ประชาพิจารณ์',
      budget: 'อนุมัติงบประมาณ',
      construction: 'เริ่มก่อสร้าง',
    } as Record<string, string>,
    categories: {
      Infrastructure: 'โครงสร้างพื้นฐาน',
      'Land Use': 'การใช้ที่ดิน',
      Administrative: 'เขตการปกครอง',
      Economic: 'เศรษฐกิจ',
      Analysis: 'การวิเคราะห์',
    },
    layers: {
      Roads: 'ถนน', Railways: 'ทางรถไฟ', Airports: 'สนามบิน', Ports: 'ท่าเรือ',
      'Land Use Plan': 'ผังการใช้ประโยชน์ที่ดิน', 'Forest Zones': 'เขตป่าไม้', 'Agricultural Zones': 'เขตเกษตรกรรม',
      Province: 'จังหวัด', District: 'อำเภอ', 'Sub-district': 'ตำบล',
      'Industrial Zones': 'เขตอุตสาหกรรม', 'Special Economic Corridors': 'ระเบียงเศรษฐกิจพิเศษ',
      'Population Density': 'ความหนาแน่นของประชากร',
    },
    layerSettings: 'ตั้งค่าชั้นข้อมูล',
  },
};

const dataLayerConfig: LayerCategory = {
  Infrastructure: [
    { name: 'Roads', icon: Route },
    { name: 'Railways', icon: TrainTrack },
    { name: 'Airports', icon: Plane },
    { name: 'Ports', icon: Ship },
  ],
  'Land Use': [
    { name: 'Land Use Plan', icon: Map },
    { name: 'Forest Zones', icon: Trees },
    { name: 'Agricultural Zones', icon: Tractor },
  ],
  Administrative: [
    { name: 'Province', icon: Building2 },
    { name: 'District', icon: Building2 },
    { name: 'Sub-district', icon: Building2 },
  ],
  Economic: [
    { name: 'Industrial Zones', icon: Factory },
    { name: 'Special Economic Corridors', icon: LandPlot },
  ],
  Analysis: [{ name: 'Population Density', icon: Layers3 }],
};

interface NliLeftSidebarProps {
  activeLayers: Record<string, boolean>;
  onLayerToggle: (layerName: string, isActive: boolean) => void;
  language: string;
  style?: React.CSSProperties;
  selectedPlanId: number | null;
  onPlanSelect: (planId: number | null) => void;
  showLrtRoutes: boolean;
  onToggleLrtRoutes: (show: boolean) => void;
  showLrtStations: boolean;
  onToggleLrtStations: (show: boolean) => void;
}

type BoxKey = 'plan' | 'eia' | 'tracking';

/** A collapsible "big box" card used for each of the three sidebar sections. */
function SidebarBox({
  icon: Icon,
  accent,
  title,
  subtitle,
  badge,
  open,
  onToggle,
  children,
}: {
  icon: LucideIcon;
  accent: string; // tailwind text color class, e.g. 'text-primary'
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-secondary/10 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2.5 p-3 text-left hover:bg-accent/40 transition-colors"
      >
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-background/60 shrink-0', accent)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground truncate">{title}</h3>
            {badge}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && <div className="px-3 pb-3 pt-0">{children}</div>}
    </div>
  );
}

/** Small stat tile for the EIA grid. */
function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  accent = 'text-primary',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg bg-background/50 border border-border/30 p-2">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={cn('h-3.5 w-3.5', accent)} />
        <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
      </div>
      <div className="text-base font-bold text-foreground leading-none">{value}</div>
      {hint && <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

export function NliLeftSidebar({
  activeLayers,
  onLayerToggle,
  language,
  style,
  selectedPlanId,
  onPlanSelect,
  showLrtRoutes,
  onToggleLrtRoutes,
  showLrtStations,
  onToggleLrtStations,
}: NliLeftSidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [openBoxes, setOpenBoxes] = useState<Record<BoxKey, boolean>>({
    plan: true,
    eia: true,
    tracking: true,
  });
  const [showBaseLayers, setShowBaseLayers] = useState(false);

  const t = translations[language as keyof typeof translations] || translations.en;

  const toggleBox = (key: BoxKey) => setOpenBoxes((prev) => ({ ...prev, [key]: !prev[key] }));

  const openSettings = (layerName: string) => {
    setSelectedLayer(layerName);
    setIsSettingsOpen(true);
  };

  const planSelected = selectedPlanId !== null;
  const selectedPlan = planSelected
    ? (lrtPlansData.plans as any[]).find((p) => p.plan_id === selectedPlanId)
    : null;

  // ---- EIA (mock, reacts to selected plan) ----
  const eia = planSelected ? getEiaForPlan(selectedPlanId!) : null;
  const riskBand =
    eia == null ? null : eia.eiaRiskScore >= 70 ? 'high' : eia.eiaRiskScore >= 45 ? 'med' : 'low';
  const riskColor =
    riskBand === 'high' ? 'text-red-500' : riskBand === 'med' ? 'text-amber-500' : 'text-emerald-500';
  const riskBarColor =
    riskBand === 'high' ? '[&>div]:bg-red-500' : riskBand === 'med' ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500';
  const riskLabel = riskBand === 'high' ? t.riskHigh : riskBand === 'med' ? t.riskMed : t.riskLow;

  // ---- Tracking (mock) ----
  const milestones = getTracking(planSelected);
  const doneCount = milestones.filter((m) => m.status === 'done').length;
  const trackPct = Math.round((doneCount / milestones.length) * 100);

  const statusMeta: Record<MilestoneStatus, { icon: LucideIcon; cls: string; label: string }> = {
    done: { icon: CheckCircle2, cls: 'text-emerald-500', label: t.statusDone },
    in_progress: { icon: Loader2, cls: 'text-amber-500', label: t.statusProgress },
    pending: { icon: Circle, cls: 'text-muted-foreground/50', label: t.statusPending },
  };

  return (
    <>
      <aside style={style} className={cn('p-3 flex flex-col glass-panel !rounded-lg z-10 shrink-0')}>
        <div className="flex items-center gap-2 mb-3 px-1">
          <TrainTrack className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">{t.dataLayers}</h2>
        </div>

        <ScrollArea className="flex-1 -mr-3 pr-3">
          <div className="space-y-3">
            {/* ──────────────── BOX 1 — LRT LINE PLAN ──────────────── */}
            <SidebarBox
              icon={TrainTrack}
              accent="text-primary"
              title={t.planTitle}
              subtitle={t.planSubtitle}
              open={openBoxes.plan}
              onToggle={() => toggleBox('plan')}
              badge={
                planSelected ? (
                  <span className="text-[10px] font-semibold rounded-full bg-primary/15 text-primary px-1.5 py-0.5">
                    #{selectedPlanId}
                  </span>
                ) : undefined
              }
            >
              <label className="text-[10px] text-muted-foreground block mb-1">{t.planSelectLabel}</label>
              <select
                value={selectedPlanId ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onPlanSelect(val === '' ? null : Number(val));
                }}
                className="w-full bg-background/50 hover:bg-background/80 border border-border/50 focus:border-primary/50 text-foreground text-xs rounded-md px-2 py-1.5 focus:outline-none transition-all duration-200 cursor-pointer"
              >
                <option value="" className="bg-popover text-foreground">
                  {t.planNone}
                </option>
                {lrtPlansData.plans.map((plan: any) => (
                  <option key={plan.plan_id} value={plan.plan_id} className="bg-popover text-foreground">
                    Plan {plan.plan_id}: {plan.name}
                  </option>
                ))}
              </select>

              {planSelected && (
                <div className="space-y-2 bg-secondary/20 p-2 rounded-md border border-border/20 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Route className="h-3 w-3 text-primary" />
                      {t.showRoutes}
                    </span>
                    <Switch checked={showLrtRoutes} onCheckedChange={onToggleLrtRoutes} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-primary" />
                      {t.showStations}
                    </span>
                    <Switch checked={showLrtStations} onCheckedChange={onToggleLrtStations} />
                  </div>
                </div>
              )}

              {/* Base map data layers, tucked inside the plan box */}
              <button
                type="button"
                onClick={() => setShowBaseLayers((v) => !v)}
                className="w-full flex items-center justify-between mt-3 mb-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Layers3 className="h-3.5 w-3.5" />
                  {t.baseMapLayers}
                </span>
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showBaseLayers && 'rotate-180')} />
              </button>
              {showBaseLayers && (
                <div className="space-y-3 mt-1">
                  {Object.entries(dataLayerConfig).map(([category, layers]) => (
                    <div key={category}>
                      <h4 className="font-semibold text-muted-foreground mb-1.5 text-[11px]">
                        {t.categories[category as keyof typeof t.categories]}
                      </h4>
                      <div className="space-y-1">
                        {layers.map((layer) => (
                          <div
                            key={layer.name}
                            className="flex items-center justify-between p-1 rounded-md hover:bg-accent group"
                          >
                            <div className="flex items-center gap-2.5">
                              <layer.icon className="h-4 w-4 text-primary" />
                              <span className="text-xs text-foreground">
                                {t.layers[layer.name as keyof typeof t.layers]}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                onClick={() => openSettings(layer.name)}
                                aria-label={t.layerSettings}
                              >
                                <Settings className="h-3 w-3" />
                              </Button>
                              <Switch
                                checked={activeLayers[layer.name]}
                                onCheckedChange={(checked) => onLayerToggle(layer.name, checked)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SidebarBox>

            {/* ──────────────── BOX 2 — EIA & RIGHT-OF-WAY ──────────────── */}
            <SidebarBox
              icon={ShieldAlert}
              accent="text-amber-500"
              title={t.eiaTitle}
              subtitle={t.eiaSubtitle}
              open={openBoxes.eia}
              onToggle={() => toggleBox('eia')}
              badge={
                eia ? (
                  <span className={cn('text-[10px] font-semibold rounded-full px-1.5 py-0.5 bg-background/60', riskColor)}>
                    {riskLabel}
                  </span>
                ) : undefined
              }
            >
              {!eia ? (
                <div className="flex items-start gap-2 rounded-lg bg-background/40 border border-dashed border-border/40 p-3">
                  <ShieldAlert className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t.eiaEmpty}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedPlan && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      Plan {selectedPlanId}: <span className="text-foreground font-medium">{selectedPlan.name}</span>
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <StatTile icon={Ruler} label={t.rowWidth} value={`${eia.rowWidthM} m`} />
                    <StatTile icon={Route} label={t.corridorLen} value={`${eia.corridorLengthKm} km`} />
                    <StatTile
                      icon={Home}
                      label={t.buildings}
                      value={`${eia.buildingsToDemolish}`}
                      hint={`${eia.residential} ${t.residential} · ${eia.commercial} ${t.commercial}`}
                      accent="text-amber-500"
                    />
                    <StatTile
                      icon={Coins}
                      label={t.compensation}
                      value={`฿${eia.compensationCostMTHB}M`}
                      accent="text-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">{t.riskScore}</span>
                      <span className={cn('text-xs font-bold', riskColor)}>{eia.eiaRiskScore}/100</span>
                    </div>
                    <Progress value={eia.eiaRiskScore} className={cn('h-1.5', riskBarColor)} />
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground">{t.friction}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1.5 text-xs text-foreground">
                        <Droplets className="h-3.5 w-3.5 text-blue-400" />
                        {eia.floodComplaints} <span className="text-muted-foreground text-[10px]">{t.floods}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-foreground">
                        <Volume2 className="h-3.5 w-3.5 text-purple-400" />
                        {eia.noiseComplaints} <span className="text-muted-foreground text-[10px]">{t.noise}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </SidebarBox>

            {/* ──────────────── BOX 3 — PROJECT TRACKING ──────────────── */}
            <SidebarBox
              icon={ListChecks}
              accent="text-emerald-500"
              title={t.trackTitle}
              subtitle={t.trackSubtitle}
              open={openBoxes.tracking}
              onToggle={() => toggleBox('tracking')}
              badge={
                <span className="text-[10px] font-semibold rounded-full bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5">
                  {trackPct}%
                </span>
              }
            >
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-muted-foreground">
                    {doneCount}/{milestones.length} {t.milestonesDone}
                  </span>
                  <span className="text-xs font-bold text-emerald-500">{trackPct}%</span>
                </div>
                <Progress value={trackPct} className="h-1.5 [&>div]:bg-emerald-500" />
              </div>

              <ol className="relative space-y-3 pl-1">
                {milestones.map((m, i) => {
                  const meta = statusMeta[m.status];
                  const Icon = meta.icon;
                  const isLast = i === milestones.length - 1;
                  return (
                    <li key={m.key} className="relative flex items-start gap-2.5">
                      {/* connector line */}
                      {!isLast && <span className="absolute left-[7px] top-5 bottom-[-12px] w-px bg-border/50" />}
                      <Icon
                        className={cn('h-4 w-4 mt-0.5 shrink-0 relative z-10', meta.cls, m.status === 'in_progress' && 'animate-spin')}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              'text-xs truncate',
                              m.status === 'pending' ? 'text-muted-foreground' : 'text-foreground font-medium'
                            )}
                          >
                            {t.milestoneLabels[m.key]}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">{m.date}</span>
                        </div>
                        <span className={cn('text-[10px]', meta.cls)}>{meta.label}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </SidebarBox>
          </div>
          <Separator className="my-2 opacity-0" />
        </ScrollArea>
      </aside>
      <NliLayerSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        layerName={selectedLayer}
        language={language}
      />
    </>
  );
}

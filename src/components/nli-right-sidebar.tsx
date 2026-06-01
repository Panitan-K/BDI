
'use client';

import React, { useMemo, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, Cell, LabelList, PieChart, Pie, ComposedChart, Line, LineChart, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Building, Briefcase, TrendingUp, XIcon, Maximize2, PiggyBank, Landmark, Bot, LayoutList, Lightbulb, CheckCircle2, Scaling, ShieldCheck, Split, CircleDollarSign, Target, List, Info, Users, Flag, AreaChart as AreaChartIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip as ShadTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { 
    project1Data, 
    project2Data, 
    comparisonData, 
    regionalMockData, 
    popoverDetailData,
    comparisonPopoverDetailData
} from '@/lib/project-data';
import lrtPlansData from '../../docs/lrt_plans.json';
import {
    getAnchorCapture,
    getRidership,
    getFinancials,
    ASSUMPTIONS,
    SOURCES,
    FARE_THB,
} from '@/lib/lrt-decision-data';
import { EstimateBadge } from '@/components/nli-estimate-badge';
import { Users2, Coins, TrainFront, Building2, ScrollText, MinusCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const translations = {
  en: {
    economicImpact: 'Economic Impact',
    gdpForecast: 'GDP Forecast',
    logisticFlow: 'Logistic Flow',
    freightVolume: 'Freight Volume',
    envScore: 'Environmental Score',
    investSuitability: 'Investment Suitability',
    jobsCreated: 'Jobs Created',
    regionalDist: 'Regional Distribution',
    predictiveTools: 'Predictive Tools',
    landPriceTrend: 'Land Price Trend',
    businessReg: 'Business Registration',
    skilledLabor: 'Skilled Labor',
    project1: 'Project 1',
    project2: 'Project 2',
    jobs: 'Jobs',
    financingCosts: 'Financing & Costs',
    totalCost: 'Total Cost (B-THB)',
    fundingSources: 'Funding Sources',
    roi: 'Return on Investment (%)',
    paybackPeriod: 'Payback Period (Yrs)',
    socioEconomic: 'Socio-Economic Impact',
    povertyReduction: 'Poverty Reduction',
    householdIncome: 'Household Income',
    regionalDisparity: 'Regional Disparity',
    aiRecommendation: 'AI Investment Recommendation',
    p1analysis: 'shows superior short-term economic impact and job creation. However, its lower environmental score requires careful mitigation planning.',
    p2analysis: 'offers greater long-term strategic value for logistics and has a better environmental profile, but with a higher initial cost and longer payback period.',
    recommendation: 'Recommendation:',
    recommendationDetail: 'For immediate economic stimulus, Project 1 is favorable. For long-term national logistics strategy and sustainability, Project 2 presents a stronger case despite higher upfront investment.',
    // LRT decision views
    ridershipTitle: 'Projected Daily Ridership',
    ridershipRange: 'trips/day',
    ridershipBasis: 'from real CCTV throughput',
    silaImpact: 'If Sila corridor excluded',
    silaWithdrawn: 'Sila Municipality withdrew (30 Apr 2026)',
    anchorTitle: 'Strategic Anchor Capture',
    anchorCaptured: 'captured',
    anchorLostSila: 'lost without Sila',
    anchorDataGap: 'not in dataset',
    financeTitle: 'Financial Case',
    capex: 'Capital cost (CAPEX)',
    opex: 'Annual O&M (OPEX)',
    farebox: 'Farebox revenue / yr',
    recovery: 'Farebox recovery',
    todUpside: 'TOD / land-value upside',
    sensitivity: 'Sensitivity',
    perYear: '/yr',
    assumptionsTitle: 'Assumptions & Sources',
    assumptionsHead: 'Assumptions',
    sourcesHead: 'Sources',
  },
  th: {
    economicImpact: 'ผลกระทบทางเศรษฐกิจ',
    gdpForecast: 'พยากรณ์ GDP',
    logisticFlow: 'การไหลของโลจิสติกส์',
    freightVolume: 'ปริมาณการขนส่งสินค้า',
    envScore: 'คะแนนสิ่งแวดล้อม',
    investSuitability: 'ความเหมาะสมในการลงทุน',
    jobsCreated: 'จำนวนงานที่สร้าง',
    regionalDist: 'การกระจายตัวตามภูมิภาค',
    predictiveTools: 'เครื่องมือคาดการณ์',
    landPriceTrend: 'แนวโน้มราคาที่ดิน',
    businessReg: 'การจดทะเบียนธุรกิจ',
    skilledLabor: 'แรงงานมีฝีมือ',
    project1: 'โปรเจกต์ 1',
    project2: 'โปรเจกต์ 2',
    jobs: 'จำนวนงาน',
    financingCosts: 'การเงินและต้นทุน',
    totalCost: 'ต้นทุนรวม (พันล้านบาท)',
    fundingSources: 'แหล่งเงินทุน',
    roi: 'ผลตอบแทนจากการลงทุน (%)',
    paybackPeriod: 'ระยะเวลาคืนทุน (ปี)',
    socioEconomic: 'ผลกระทบทางเศรษฐกิจและสังคม',
    povertyReduction: 'การลดความยากจน',
    householdIncome: 'รายได้ครัวเรือน',
    regionalDisparity: 'ความเหลื่อมล้ำในภูมิภาค',
    aiRecommendation: 'คำแนะนำการลงทุนโดย AI',
    p1analysis: 'แสดงผลกระทบทางเศรษฐกิจและการสร้างงานในระยะสั้นที่เหนือกว่า อย่างไรก็ตาม คะแนนด้านสิ่งแวดล้อมที่ต่ำกว่าจำเป็นต้องมีการวางแผนลดผลกระทบอย่างรอบคอบ',
    p2analysis: 'มีคุณค่าเชิงกลยุทธ์ด้านโลจิสติกส์ในระยะยาวที่ดีกว่าและมีโปรไฟล์ด้านสิ่งแวดล้อมที่ดีกว่า แต่มีต้นทุนเริ่มต้นที่สูงกว่าและระยะเวลาคืนทุนนานกว่า',
    recommendation: 'คำแนะนำ:',
    recommendationDetail: 'สำหรับการกระตุ้นเศรษฐกิจในทันที โปรเจกต์ 1 มีความน่าสนใจมากกว่า สำหรับกลยุทธ์โลจิสติกส์ของประเทศในระยะยาวและความยั่งยืน โปรเจกต์ 2 เป็นกรณีที่แข็งแกร่งกว่าแม้จะมีการลงทุนเริ่มต้นที่สูงกว่า',
    // LRT decision views
    ridershipTitle: 'ประมาณการผู้โดยสารต่อวัน',
    ridershipRange: 'เที่ยว/วัน',
    ridershipBasis: 'อ้างอิงจากปริมาณจราจรจริงที่ตรวจวัดด้วยกล้อง CCTV',
    silaImpact: 'กรณีตัดแนวเขตเทศบาลเมืองศิลา',
    silaWithdrawn: 'เทศบาลเมืองศิลาได้ถอนตัว (30 เมษายน 2569)',
    anchorTitle: 'การครอบคลุมจุดยุทธศาสตร์',
    anchorCaptured: 'ครอบคลุม',
    anchorLostSila: 'สูญเสียหากไม่มีศิลา',
    anchorDataGap: 'ไม่มีในชุดข้อมูล',
    financeTitle: 'กรณีศึกษาทางการเงิน',
    capex: 'ต้นทุนก่อสร้าง (CAPEX)',
    opex: 'ค่าดำเนินงานต่อปี (OPEX)',
    farebox: 'รายได้ค่าโดยสาร/ปี',
    recovery: 'อัตราคืนทุนค่าโดยสาร',
    todUpside: 'มูลค่าเพิ่มที่ดิน/TOD',
    sensitivity: 'การวิเคราะห์ความอ่อนไหว',
    perYear: '/ปี',
    assumptionsTitle: 'สมมติฐานและแหล่งข้อมูล',
    assumptionsHead: 'สมมติฐาน',
    sourcesHead: 'แหล่งข้อมูล',
  }
};

const SmallSparkline = ({
  data,
  dataKey,
  dataKey2,
  strokeColor,
  strokeColor2,
}: {
  data: any[]
  dataKey: string
  dataKey2?: string
  strokeColor: string
  strokeColor2?: string
}) => {
  const chartConfig = {
    [dataKey]: {
      color: strokeColor,
    },
    ...(dataKey2 && { [dataKey2]: { color: strokeColor } }),
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="h-[40px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id={`sparkline-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
          {strokeColor2 && (
            <linearGradient id={`sparkline-${strokeColor2}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor2} stopOpacity={0.4} />
              <stop offset="100%" stopColor={strokeColor2} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" hideLabel />}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#sparkline-${strokeColor})`}
        />
        {dataKey2 && strokeColor2 && (
          <Area
            type="monotone"
            dataKey={dataKey2}
            stroke={strokeColor2}
            strokeWidth={2}
            fill={`url(#sparkline-${strokeColor2})`}
          />
        )}
        <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
      </AreaChart>
    </ChartContainer>
  )
}

const sectionIcons: { [key: string]: React.ElementType } = {
    'Overall Projection': TrendingUp,
    'Sector-Specific Growth': LayoutList,
    'Economic Multiplier Effect': Scaling,
    'Methodology': Lightbulb,
    'Increased Capacity': Maximize2,
    'Key Commodities': List,
    'Cost Efficiency': CircleDollarSign,
    'Overall Score': Target,
    'Scoring Breakdown': LayoutList,
    'Political & Regulatory Stability': Landmark,
    'Market Demand': TrendingUp,
    'Financial Viability': CircleDollarSign,
    'Risk Mitigation': ShieldCheck,
    'Total Jobs': Briefcase,
    'Job Breakdown': Split,
    'Objective': Target,
    'Benefit Distribution': Split,
    'Funding Model': Briefcase,
    'Financial Metrics': TrendingUp,
    'Land Price Trend': TrendingUp,
    'New Business Registrations': Building,
    'Skilled Labor Demand': Briefcase,
    'Community & Social Development': Landmark,
    'Impact Metrics': TrendingUp,
    'Time Savings': CheckCircle2,
    // Comparison Icons
    'Overview': Info,
    'Project 1: EEC High-Speed Rail (GDP Forecast: +2.8%)': TrendingUp,
    'Project 2: Green Community Rail (GDP Forecast: +1.2%)': TrendingUp,
    'Project 1: EEC High-Speed Rail (Freight Volume: +15%)': Briefcase,
    'Project 2: Green Community Rail (Freight Volume: +8%)': Briefcase,
    'Project 1: Score 72': ShieldCheck,
    'Project 2: Score 85': ShieldCheck,
    'Project 1: Score 79': CircleDollarSign,
    'Project 2: Score 68': CircleDollarSign,
    'Project 1: EEC High-Speed Rail': Users,
    'Project 2: Green Community Rail': Users,
    'Total Cost': PiggyBank,
    'Return & Payback': TrendingUp,
    'Funding Mix': Split,
    'Poverty Reduction & Household Income': Landmark,
    'Regional Disparity': AreaChartIcon,
    'Business Registration': Building,
};

const DraggablePanel = ({
    popoverData,
    onClose,
    initialPosition,
  }: {
    popoverData: any;
    onClose: () => void;
    initialPosition: { x: number; y: number };
  }) => {
    if (!popoverData) return null;
  
    const nodeRef = React.useRef(null);
  
    return (
      <Draggable nodeRef={nodeRef} handle=".drag-handle" defaultPosition={initialPosition} bounds="body">
        <div
          ref={nodeRef}
          className="fixed z-50"
        >
          <div className="w-[320px] glass-panel text-foreground p-0 border border-primary/20 rounded-lg shadow-2xl flex flex-col">
            <div className="drag-handle p-4 cursor-move bg-card/50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-primary">{popoverData.title}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator className="bg-border/50" />
            <ScrollArea className="h-[320px]">
              <div className="px-4 py-4 space-y-4">
                {popoverData.sections?.map((section: any, index: number) => {
                  const Icon = sectionIcons[section.heading] || CheckCircle2;
                  return (
                    <div key={index}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-foreground text-sm">{section.heading}</h4>
                      </div>
                      {section.text && <p className="text-xs text-muted-foreground ml-6 whitespace-pre-wrap">{section.text}</p>}
                      {section.list && (
                        <div className="ml-6 space-y-1.5">
                          {section.list.map((item: string, itemIndex: number) => {
                            const parts = item.split(':');
                            const hasColon = parts.length > 1;
                            return (
                              <div key={itemIndex} className="flex items-baseline text-xs gap-2">
                                {hasColon ? (
                                  <>
                                    <p className="text-muted-foreground">{parts[0]}:</p>
                                    <p className="flex-1 text-right font-medium text-foreground">{parts.slice(1).join(':').trim()}</p>
                                  </>
                                ) : (
                                  <p className="text-muted-foreground">{item}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {section.timeSavings && (
                        <div className="ml-6 space-y-3">
                          {section.timeSavings.map((item: any, itemIndex: number) => (
                            <div key={itemIndex}>
                              <p className="font-semibold text-foreground text-xs mb-0.5">{item.location}</p>
                              <p className="text-xs text-muted-foreground">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </Draggable>
    );
  };
  

interface NliRightSidebarProps {
    isOpen?: boolean; 
    activeProject: string; 
    isComparing: boolean; 
    selectedRegion: string | null; 
    onClearRegion: () => void; 
    language: string; 
    activeParameters?: string[];
    style?: React.CSSProperties;
    selectedPlanId: number | null;
    onClearLrtPlan: () => void;
    silaExcluded?: boolean;
}

export function NliRightSidebar({ activeProject, isComparing, selectedRegion, onClearRegion, language, activeParameters = [], style, selectedPlanId, onClearLrtPlan, silaExcluded = false }: NliRightSidebarProps) {
  const lrtPlan = useMemo(() => {
    if (selectedPlanId === null) return null;
    return lrtPlansData.plans.find((p: any) => p.plan_id === selectedPlanId) || null;
  }, [selectedPlanId]);

  const lrtMetrics = useMemo(() => {
    if (!lrtPlan) return null;
    const stationIndices = Array.from(new Set(lrtPlan.lines.flatMap((l: any) => l.station_indices)));
    const stationsInPlan = stationIndices.map(idx => lrtPlansData.stations[idx]).filter(Boolean);
    const totalDailyTraffic = stationsInPlan.reduce((sum, s) => sum + s.daily_total, 0);
    const avgVehiclesPerHour = Math.round(stationsInPlan.reduce((sum, s) => sum + s.vehicles_per_hour, 0) / stationsInPlan.length);
    const chartData = stationsInPlan.map(s => ({
      name: language === 'th' ? s.name_th.split(' (')[0] : s.name_en,
      traffic: s.daily_total,
    }));
    return {
      stationsCount: stationsInPlan.length,
      totalDailyTraffic,
      avgVehiclesPerHour,
      chartData,
      color: lrtPlan.lines[0]?.color || '#008080'
    };
  }, [lrtPlan, language]);

  // ---- LRT decision-intelligence (derived from real CCTV + published figures) ----
  const decision = useMemo(() => {
    if (selectedPlanId === null) return null;
    return {
      ridershipBase: getRidership(selectedPlanId),
      ridershipSila: getRidership(selectedPlanId, { excludeSila: true }),
      anchors: getAnchorCapture(selectedPlanId, { excludeSila: silaExcluded }),
      financials: getFinancials(selectedPlanId),
    };
  }, [selectedPlanId, silaExcluded]);

  const data = React.useMemo(() => {
    if (isComparing) {
      return comparisonData;
    }
    if (selectedRegion && regionalMockData[selectedRegion]) {
      return regionalMockData[selectedRegion];
    }
    return activeProject === 'project1' ? project1Data : project2Data;
  }, [isComparing, selectedRegion, activeProject]);

  const detailData = React.useMemo(() => {
    if (isComparing) {
        return comparisonPopoverDetailData;
    }
    if (selectedRegion) return null;
    return activeProject === 'project1' ? popoverDetailData.project1 : popoverDetailData.project2;
  }, [isComparing, selectedRegion, activeProject]);
  
  const [activePopover, setActivePopover] = useState<{
    key: string;
    position: { x: number; y: number };
  } | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (key: string) => {
    const sidebarEl = sidebarRef.current;
    if (!sidebarEl) return;
  
    if (activePopover?.key === key) {
      setActivePopover(null);
      return;
    }
  
    const sidebarRect = sidebarEl.getBoundingClientRect();
    const popoverWidth = 320;
    const popoverHeight = 380;
    const gap = 16;
  
    const x = sidebarRect.left - popoverWidth - gap;
  
    // Center the panel vertically in the viewport
    let y = (window.innerHeight - popoverHeight) / 2;
  
    // Ensure it doesn't go off-screen (though with centering it's less likely)
    if (y < gap) {
      y = gap;
    }
    if (y + popoverHeight > window.innerHeight - gap) {
      y = window.innerHeight - popoverHeight - gap;
    }
  
    setActivePopover({ key, position: { x, y } });
  };
  

  const popoverDataForKey = useMemo(() => {
    if (!activePopover || !detailData) return null;
    return detailData[activePopover.key as keyof typeof detailData] || null;
  }, [activePopover, detailData]);


  const t = translations[language as keyof typeof translations] || translations.en;
  
  const title = React.useMemo(() => {
    if (lrtPlan) {
      return language === 'en' ? `Plan ${lrtPlan.plan_id}: ${lrtPlan.name}` : `แผนที่ ${lrtPlan.plan_id}: ${lrtPlan.name}`;
    }
    if (isComparing) {
      return language === 'en' ? 'Comparison: P1 vs P2' : 'เปรียบเทียบ: P1 vs P2';
    }
    if (selectedRegion && regionalMockData[selectedRegion]) {
      const regionData = regionalMockData[selectedRegion];
      return language === 'en' ? regionData.name : regionData.name_th;
    }
    const projectData = activeProject === 'project1' ? project1Data : project2Data;
    return language === 'en' ? projectData.name : projectData.name_th;
  }, [isComparing, selectedRegion, activeProject, language, lrtPlan]);

  const nameKey = language === 'en' ? 'name' : 'name_th';

  const barChartConfig = {
    p1: { label: t.project1, color: "hsl(var(--chart-1))" },
    p2: { label: t.project2, color: "hsl(var(--chart-2))" },
    value: { label: t.jobs, color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;
  
  const renderComparisonValue = (val: any, unit: string = '%') => (
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-chart-1">{val.p1}{unit}</span>
        <span className="text-muted-foreground text-xs">vs</span>
        <span className="text-chart-2">{val.p2}{unit}</span>
      </div>
  );

  const recommendationParts = React.useMemo(() => {
    const recommendationKey = language === 'th' ? 'โปรเจกต์' : 'Project';
    const regex = new RegExp(`(${recommendationKey} 1|${recommendationKey} 2)`, 'g');
    return t.recommendationDetail.split(regex);
  }, [t.recommendationDetail, language]);

  const showAllParams = !isComparing || !activeParameters || activeParameters.length === 0;
  const shouldShow = (param: string) => showAllParams || activeParameters.includes(param);
  
  const CardWrapper = ({ popoverKey, children }: { popoverKey: string, children: React.ReactNode }) => (
    <Card
      className="glass-panel border-none cursor-pointer transition-all hover:ring-2 hover:ring-primary/50"
      onClick={() => handleCardClick(popoverKey)}
    >
      {children}
    </Card>
  );

  return (
    <>
    <aside
      ref={sidebarRef}
      style={style}
      className={cn(
        'p-2 flex flex-col glass-panel !rounded-lg z-10 shrink-0'
      )}
    >
        <div className='flex justify-between items-center mb-2 px-1'>
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            <div className="flex items-center">
              {lrtPlan && <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onClearLrtPlan}><XIcon className='h-4 w-4'/></Button>}
              {selectedRegion && <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onClearRegion}><XIcon className='h-4 w-4'/></Button>}
            </div>
        </div>
        <ScrollArea className="flex-1 -mr-2 pr-2">
          {lrtPlan && lrtMetrics ? (
            <div className="space-y-4 px-1 pb-4">
              {/* Type and Description */}
              <div className="bg-secondary/20 p-2.5 rounded-lg border border-border/20 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                    {language === 'th' ? 'ประเภทเครือข่าย' : 'Network Type'}
                  </span>
                  <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded font-semibold text-[10px]">
                    {lrtPlan.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-foreground leading-relaxed font-medium">{lrtPlan.description}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <Card className="glass-panel border-none">
                  <CardHeader className="p-2 pb-0">
                    <CardTitle className="text-[9px] font-medium text-muted-foreground uppercase">
                      {language === 'th' ? 'สถานีทั้งหมด' : 'Stations'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0.5">
                    <span className="text-base font-bold text-foreground">{lrtMetrics.stationsCount}</span>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-none">
                  <CardHeader className="p-2 pb-0">
                    <CardTitle className="text-[9px] font-medium text-muted-foreground uppercase">
                      {language === 'th' ? 'เส้นทางเชื่อมต่อ' : 'Lines'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0.5">
                    <span className="text-base font-bold text-foreground" style={{ color: lrtMetrics.color }}>
                      {lrtPlan.total_lines}
                    </span>
                  </CardContent>
                </Card>
                <Card className="glass-panel border-none">
                  <CardHeader className="p-2 pb-0">
                    <CardTitle className="text-[9px] font-medium text-muted-foreground uppercase">
                      {language === 'th' ? 'ทราฟฟิกรวม' : 'Daily Traffic'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 pt-0.5">
                    <span className="text-xs font-bold text-green-400 break-all">
                      {lrtMetrics.totalDailyTraffic.toLocaleString()}
                    </span>
                  </CardContent>
                </Card>
              </div>

              {/* ── VIEW 1a — Projected ridership (range) + Sila impact ── */}
              {decision && (
                <Card className="glass-panel border-none">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <TrainFront className="h-4 w-4 text-primary" />
                      {t.ridershipTitle}
                      <EstimateBadge kind="estimate" language={language} tooltip={language === 'th' ? decision.ridershipBase.assumption_th : decision.ridershipBase.assumption_en} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-foreground">
                        {(decision.ridershipBase.low / 1000).toFixed(1)}–{(decision.ridershipBase.high / 1000).toFixed(1)}k
                      </span>
                      <span className="text-[11px] text-muted-foreground">{t.ridershipRange}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.ridershipBasis}: {decision.ridershipBase.corridorDailyVehicles.toLocaleString()} veh/day</p>
                    <div className="mt-2 flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 p-2">
                      <MinusCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <div className="text-[11px] leading-tight">
                        <span className="text-red-400 font-semibold">{t.silaImpact}: </span>
                        <span className="text-foreground">
                          −{((decision.ridershipBase.base - decision.ridershipSila.base) / 1000).toFixed(1)}k {t.ridershipRange}
                          {decision.anchors.lostWithSilaCount > 0 && `, −${decision.anchors.lostWithSilaCount} ${t.anchorLostSila}`}
                        </span>
                        <p className="text-[10px] text-muted-foreground">{t.silaWithdrawn}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── VIEW 1b — Strategic anchor-capture scorecard ── */}
              {decision && (
                <Card className="glass-panel border-none">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Users2 className="h-4 w-4 text-primary" />
                      {t.anchorTitle}
                      <span className="ml-auto text-[11px] font-bold text-primary">
                        {decision.anchors.capturedCount}/{decision.anchors.realAnchorCount} {t.anchorCaptured}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {decision.anchors.rows.map((a) => (
                        <span
                          key={a.key}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                            a.dataGap
                              ? 'bg-muted/30 text-muted-foreground border-border/40'
                              : a.captured
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-background/40 text-muted-foreground border-border/40 line-through decoration-muted-foreground/50',
                            a.lostWithSila && 'ring-1 ring-red-500/40',
                          )}
                        >
                          {a.dataGap ? <Info className="h-2.5 w-2.5" /> : a.captured ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XIcon className="h-2.5 w-2.5" />}
                          {language === 'th' ? a.th : a.en}
                          {a.dataGap && <span className="opacity-70">({t.anchorDataGap})</span>}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* reasoning / value to municipality */}
              <Card className="glass-panel border-none">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    {language === 'th' ? 'เหตุผลความเหมาะสมทางเศรษฐกิจ' : 'Socio-Economic Reasoning'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {lrtPlan.reasoning}
                </CardContent>
              </Card>

              {/* Station Traffic Chart */}
              <Card className="glass-panel border-none">
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-xs font-bold text-foreground">
                    {language === 'th' ? 'ปริมาณการเดินทางรายสถานี' : 'Traffic Volume per Station'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 h-[180px]">
                  <ChartContainer config={{}} className="w-full h-full">
                    <BarChart data={lrtMetrics.chartData} margin={{ left: -20, top: 15, right: 5, bottom: 0 }}>
                      <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={9} interval={0} tickFormatter={(v) => v.length > 8 ? v.substring(0, 7) + '..' : v} />
                      <YAxis tickLine={false} axisLine={false} fontSize={9} />
                      <ChartTooltip cursor={{ fill: 'hsla(var(--background), 0.3)' }} content={<ChartTooltipContent hideIndicator hideLabel />} />
                      <Bar dataKey="traffic" fill={lrtMetrics.color} radius={3} barSize={10} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* ── VIEW 2 — Financial case (parametric, all estimates) ── */}
              {decision && (
                <Card className="glass-panel border-none">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-primary" />
                      {t.financeTitle}
                      <EstimateBadge kind="scenario" language={language} tooltip={language === 'th' ? ASSUMPTIONS.th[1] : ASSUMPTIONS.en[1]} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-md bg-background/40 border border-border/30 p-2">
                        <p className="text-[10px] text-muted-foreground">{t.capex}</p>
                        <p className="font-bold text-foreground">฿{decision.financials.capexBaseB}B</p>
                        <p className="text-[10px] text-muted-foreground">฿{decision.financials.capexLowB}–{decision.financials.capexHighB}B</p>
                      </div>
                      <div className="rounded-md bg-background/40 border border-border/30 p-2">
                        <p className="text-[10px] text-muted-foreground">{t.opex}</p>
                        <p className="font-bold text-foreground">฿{decision.financials.opexPerYearM}M{t.perYear}</p>
                      </div>
                      <div className="rounded-md bg-background/40 border border-border/30 p-2">
                        <p className="text-[10px] text-muted-foreground">{t.farebox}</p>
                        <p className="font-bold text-foreground">฿{decision.financials.fareboxPerYearM}M</p>
                        <p className="text-[10px] text-muted-foreground">@ ฿{FARE_THB}/trip</p>
                      </div>
                      <div className="rounded-md bg-background/40 border border-border/30 p-2">
                        <p className="text-[10px] text-muted-foreground">{t.recovery}</p>
                        <p className={cn('font-bold', decision.financials.recoveryPct >= 100 ? 'text-emerald-400' : decision.financials.recoveryPct >= 50 ? 'text-amber-400' : 'text-red-400')}>
                          {decision.financials.recoveryPct}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-emerald-500/10 border border-emerald-500/20 p-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                        {t.todUpside}
                      </span>
                      <span className="font-bold text-emerald-400">฿{decision.financials.todUpsideLowM}–{decision.financials.todUpsideHighM}M{t.perYear}</span>
                    </div>
                    {/* sensitivity */}
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">{t.sensitivity}</p>
                      <div className="space-y-1">
                        {decision.financials.sensitivity.map((s) => (
                          <div key={s.key} className="flex items-center justify-between text-[11px]">
                            <span className="text-muted-foreground">{language === 'th' ? s.th : s.en}</span>
                            <span className="font-mono text-foreground">
                              {s.recoveryPct !== null ? `${s.recoveryPct}%` : s.capexB !== null ? `฿${s.capexB}B` : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 gap-2">
                <Card className="glass-panel border-none">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {language === 'th' ? 'ข้อดี / ประโยชน์หลัก' : 'Key Advantages'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-[11px] text-muted-foreground">
                    <ul className="space-y-1.5">
                      {lrtPlan.pros.map((pro: string, i: number) => (
                        <li key={i} className="flex gap-1.5 items-baseline">
                          <span className="text-green-400 font-bold">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-panel border-none">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-red-400" />
                      {language === 'th' ? 'ข้อจำกัด / ความเสี่ยง' : 'Limitations & Risks'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-[11px] text-muted-foreground">
                    <ul className="space-y-1.5">
                      {lrtPlan.cons.map((con: string, i: number) => (
                        <li key={i} className="flex gap-1.5 items-baseline">
                          <span className="text-red-400 font-bold">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* ── Assumptions & Sources (nothing hidden) ── */}
              <Accordion type="single" collapsible className="rounded-lg border border-border/40 bg-secondary/10 px-2">
                <AccordionItem value="assumptions" className="border-none">
                  <AccordionTrigger className="py-2 text-[11px] font-semibold text-muted-foreground hover:no-underline">
                    <span className="flex items-center gap-1.5">
                      <ScrollText className="h-3.5 w-3.5" />
                      {t.assumptionsTitle}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[10px] text-muted-foreground space-y-2 pb-3">
                    <div>
                      <p className="font-semibold text-foreground/80 mb-0.5">{t.assumptionsHead}</p>
                      <ul className="space-y-1 list-disc pl-3.5">
                        {(language === 'th' ? ASSUMPTIONS.th : ASSUMPTIONS.en).map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground/80 mb-0.5">{t.sourcesHead}</p>
                      <ul className="space-y-1 list-disc pl-3.5">
                        {(language === 'th' ? SOURCES.th : SOURCES.en).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="space-y-3 px-1">
            <div className="grid grid-cols-2 gap-2">
              {shouldShow('Economic Impact') && (
                <CardWrapper popoverKey='economicImpact'>
                    <CardHeader className="p-2 pb-1">
                        <CardTitle className="text-xs font-medium text-muted-foreground">{t.economicImpact}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                        <div className="text-lg font-bold text-foreground">{isComparing ? renderComparisonValue(data.economicImpact) : `+${data.economicImpact}%`}</div>
                        <div className="text-xs text-green-400">{t.gdpForecast}</div>
                        <SmallSparkline 
                        data={data.gdpData} 
                        dataKey={isComparing ? 'p1' : 'v'} 
                        dataKey2={isComparing ? 'p2' : undefined}
                        strokeColor="hsl(var(--chart-1))"
                        strokeColor2={isComparing ? "hsl(var(--chart-2))" : undefined}
                        />
                    </CardContent>
                </CardWrapper>
              )}
              {shouldShow('Logistic Flow') && (
                <CardWrapper popoverKey='logisticFlow'>
                    <CardHeader className="p-2 pb-1">
                        <CardTitle className="text-xs font-medium text-muted-foreground">{t.logisticFlow}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                        <div className="text-lg font-bold text-foreground">{isComparing ? renderComparisonValue(data.logisticFlow) : `+${data.logisticFlow}%`}</div>
                        <div className="text-xs text-green-400">{t.freightVolume}</div>
                        <SmallSparkline 
                        data={data.freightData} 
                        dataKey={isComparing ? 'p1' : 'v'} 
                        dataKey2={isComparing ? 'p2' : undefined}
                        strokeColor="hsl(var(--chart-4))"
                        strokeColor2={isComparing ? "hsl(var(--chart-5))" : undefined}
                        />
                    </CardContent>
                </CardWrapper>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {shouldShow('Environmental Score') && (
                  <CardWrapper popoverKey='environmentalScore'>
                      <CardHeader className="p-2 pb-1">
                          <CardTitle className="text-xs font-medium text-muted-foreground">{t.envScore}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 pt-0">
                          {isComparing ? (
                              <div className="flex flex-col gap-1.5 mt-1">
                                  <div className="flex items-center gap-2">
                                      <span className="text-xs text-chart-1 font-medium w-12">{t.project1}</span>
                                      <Progress value={data.environmentalScore.p1} className="h-2 [&>div]:bg-chart-1" />
                                      <span className="text-xs font-bold w-8 text-right">{data.environmentalScore.p1}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <span className="text-xs text-chart-2 font-medium w-12">{t.project2}</span>
                                      <Progress value={data.environmentalScore.p2} className="h-2 [&>div]:bg-chart-2" />
                                      <span className="text-xs font-bold w-8 text-right">{data.environmentalScore.p2}</span>
                                  </div>
                              </div>
                          ) : (
                              <>
                                  <span className="font-bold text-lg text-chart-3">{data.environmentalScore}</span>
                                  <Progress value={data.environmentalScore} className="h-1.5 [&>div]:bg-chart-3 mt-2" />
                              </>
                          )}
                      </CardContent>
                  </CardWrapper>
                )}
                {shouldShow('Investment Suitability') && (
                    <CardWrapper popoverKey='investmentSuitability'>
                        <CardHeader className="p-2 pb-1">
                            <CardTitle className="text-xs font-medium text-muted-foreground">{t.investSuitability}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                            {isComparing ? (
                                <div className="flex flex-col gap-1.5 mt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-chart-4 font-medium w-12">{t.project1}</span>
                                        <Progress value={data.investmentSuitability.p1} className="h-2 [&>div]:bg-chart-4" />
                                        <span className="text-xs font-bold w-8 text-right">{data.investmentSuitability.p1}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-chart-2 font-medium w-12">{t.project2}</span>
                                        <Progress value={data.investmentSuitability.p2} className="h-2 [&>div]:bg-chart-2" />
                                        <span className="text-xs font-bold w-8 text-right">{data.investmentSuitability.p2}</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="font-bold text-lg text-chart-4">{data.investmentSuitability}</span>
                                    <Progress value={data.investmentSuitability} className="h-1.5 [&>div]:bg-chart-4 mt-2" />
                                </>
                            )}
                        </CardContent>
                    </CardWrapper>
                )}
            </div>
            
            {shouldShow('Jobs Created') && (
              <CardWrapper popoverKey='jobsCreated'>
                    <CardHeader className="p-2 pb-0">
                    <CardTitle className="text-sm font-medium text-foreground">{t.jobsCreated}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 h-[190px]">
                    <ChartContainer config={barChartConfig} className="w-full h-full">
                        {isComparing ? (
                        <LineChart accessibilityLayer data={data.jobsData} margin={{ left: -20, top: 20, right: 10, bottom: 0 }}>
                            <XAxis dataKey={nameKey} tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} />
                            <ChartTooltip cursor={{ fill: 'hsla(var(--background), 0.5)' }} content={<ChartTooltipContent indicator="dot" />} />
                            <ChartLegend verticalAlign="top" height={30} />
                            <Line type="monotone" dataKey="p1" name={t.project1} stroke="var(--color-p1)" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="p2" name={t.project2} stroke="var(--color-p2)" strokeWidth={2} dot={false} />
                        </LineChart>
                        ) : (
                        <BarChart accessibilityLayer data={data.jobsData} margin={{ left: -20, top: 20, right: 10, bottom: 0 }} barGap={4}>
                            <XAxis
                            dataKey={nameKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={10}
                            />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} />
                            <ChartTooltip
                            cursor={{ fill: 'hsla(var(--background), 0.5)' }}
                            content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="value" fill="var(--color-value)" radius={4} barSize={12}>
                            <LabelList dataKey="value" position="top" className="fill-foreground" fontSize={10}/>
                            </Bar>
                        </BarChart>
                        )}
                    </ChartContainer>
                    </CardContent>
              </CardWrapper>
            )}
            
            {shouldShow('Regional Distribution') && (
              <CardWrapper popoverKey='regionalDistribution'>
                    <CardHeader className='p-2'>
                    <CardTitle className="text-foreground text-sm">{t.regionalDist}</CardTitle>
                    </CardHeader>
                    <CardContent className='p-2 pt-0 h-[180px]'>
                    <ChartContainer config={barChartConfig} className="w-full h-full">
                        {isComparing ? (
                        <LineChart accessibilityLayer data={data.regionalData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey={nameKey} tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} domain={[0, 'dataMax + 100']} />
                            <ChartTooltip cursor={{ fill: 'hsla(var(--background), 0.5)' }} content={<ChartTooltipContent indicator="dot" />} />
                            <ChartLegend verticalAlign="top" height={30} />
                            <Line type="monotone" dataKey="p1" name={t.project1} stroke="var(--color-p1)" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="p2" name={t.project2} stroke="var(--color-p2)" strokeWidth={2} dot={false} />
                        </LineChart>
                        ) : (
                        <BarChart
                            accessibilityLayer
                            data={data.regionalData}
                            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                        >
                            <XAxis
                                dataKey={nameKey}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                fontSize={10}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={10}
                                domain={[0, 'dataMax + 100']}
                            />
                            <ChartTooltip
                                cursor={{ fill: 'hsla(var(--background), 0.5)' }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar
                                dataKey="value"
                                radius={4}
                                barSize={30}
                            >
                                {data.regionalData.map((entry: any) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                        )}
                    </ChartContainer>
                    </CardContent>
              </CardWrapper>
            )}

            {shouldShow('Financing & Costs') && (
              <CardWrapper popoverKey='financing'>
                    <CardHeader className="p-2 flex flex-row items-center gap-2">
                        <PiggyBank className="h-5 w-5 text-primary"/>
                        <CardTitle className="text-foreground text-sm">{t.financingCosts}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 space-y-4">
                        {isComparing ? (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">{t.totalCost}</p>
                                    <ChartContainer config={barChartConfig} className="h-[50px] w-full">
                                        <BarChart layout="vertical" data={[{name: 'Cost', p1: data.funding.totalCost.p1, p2: data.funding.totalCost.p2}]} margin={{left: 0, right: 30, top: 0, bottom: 0}} barGap={4}>
                                            <YAxis dataKey="name" type="category" tick={false} axisLine={false} width={0}/>
                                            <XAxis type="number" hide />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator hideLabel />} />
                                            <Bar dataKey="p1" name={t.project1} fill="var(--color-p1)" radius={4} barSize={12}>
                                                <LabelList dataKey="p1" position="right" offset={4} className="fill-foreground" fontSize={10}/>
                                            </Bar>
                                            <Bar dataKey="p2" name={t.project2} fill="var(--color-p2)" radius={4} barSize={12}>
                                                <LabelList dataKey="p2" position="right" offset={4} className="fill-foreground" fontSize={10}/>
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">{t.roi}</p>
                                    <ChartContainer config={barChartConfig} className="h-[50px] w-full">
                                        <BarChart layout="vertical" data={[{name: 'ROI', p1: data.funding.roi.p1, p2: data.funding.roi.p2}]} margin={{left: 0, right: 30, top: 0, bottom: 0}} barGap={4}>
                                            <YAxis dataKey="name" type="category" tick={false} axisLine={false} width={0}/>
                                            <XAxis type="number" hide />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator hideLabel />} />
                                            <Bar dataKey="p1" name={t.project1} fill="var(--color-p1)" radius={4} barSize={12}>
                                                <LabelList dataKey="p1" position="right" offset={4} className="fill-foreground" fontSize={10} formatter={(v: number) => `${v}%`}/>
                                            </Bar>
                                            <Bar dataKey="p2" name={t.project2} fill="var(--color-p2)" radius={4} barSize={12}>
                                                <LabelList dataKey="p2" position="right" offset={4} className="fill-foreground" fontSize={10} formatter={(v: number) => `${v}%`}/>
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">{t.paybackPeriod}</p>
                                    <ChartContainer config={barChartConfig} className="h-[50px] w-full">
                                        <BarChart layout="vertical" data={[{name: 'Payback', p1: data.funding.paybackPeriod.p1, p2: data.funding.paybackPeriod.p2}]} margin={{left: 0, right: 30, top: 0, bottom: 0}} barGap={4}>
                                            <YAxis dataKey="name" type="category" tick={false} axisLine={false} width={0}/>
                                            <XAxis type="number" hide />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator hideLabel />} />
                                            <Bar dataKey="p1" name={t.project1} fill="var(--color-p1)" radius={4} barSize={12}>
                                                <LabelList dataKey="p1" position="right" offset={4} className="fill-foreground" fontSize={10} formatter={(v: number) => `${v}y`}/>
                                            </Bar>
                                            <Bar dataKey="p2" name={t.project2} fill="var(--color-p2)" radius={4} barSize={12}>
                                                <LabelList dataKey="p2" position="right" offset={4} className="fill-foreground" fontSize={10} formatter={(v: number) => `${v}y`}/>
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    <p className="mb-1">{t.fundingSources}</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">{language === 'th' ? 'ภาครัฐ / เอกชน' : 'Gov / Private'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-chart-1">{data.funding.sources.p1.gov}% / {data.funding.sources.p1.priv}%</span>
                                        <span className="text-muted-foreground text-xs">vs</span>
                                        <span className="font-mono text-chart-2">{data.funding.sources.p2.gov}% / {data.funding.sources.p2.priv}%</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t.totalCost}</p>
                                        <p className="font-bold">{data.funding.totalCost}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t.roi}</p>
                                        <p className="font-bold">{data.funding.roi}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{t.paybackPeriod}</p>
                                        <p className="font-bold">{data.funding.paybackPeriod}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-center text-muted-foreground mb-1">{t.fundingSources}</p>
                                    <ChartContainer config={{}} className="h-[80px] w-full">
                                        <BarChart layout="vertical" data={data.funding.sources} margin={{left: language === 'th' ? 30 : 20}}>
                                            <XAxis type="number" hide domain={[0, 100]} />
                                            <YAxis dataKey={nameKey} type="category" tickLine={false} axisLine={false} fontSize={10} width={language === 'en' ? 70 : 60}/>
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator hideLabel />} />
                                            <Bar dataKey="value" radius={4} barSize={10}>
                                                {data.funding.sources.map((s:any) => <Cell key={s.name} fill={s.fill}/>)}
                                                <LabelList dataKey="value" position="right" formatter={(v:any) => `${v}%`} fontSize={10} className="fill-foreground"/>
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                            </div>
                        )}
                    </CardContent>
              </CardWrapper>
            )}

            {shouldShow('Socio-Economic Impact') && (
              <CardWrapper popoverKey='socioEconomic'>
                    <CardHeader className="p-2 flex flex-row items-center gap-2">
                        <Landmark className="h-5 w-5 text-primary"/>
                        <CardTitle className="text-foreground text-sm">{t.socioEconomic}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="flex flex-col items-center">
                                <p className="text-xs text-muted-foreground">{t.povertyReduction}</p>
                                <div className="font-bold text-green-400 h-5 flex items-center justify-center">{isComparing ? renderComparisonValue(data.socioEconomic.povertyReduction) : `+${data.socioEconomic.povertyReduction}%`}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <p className="text-xs text-muted-foreground">{t.householdIncome}</p>
                                <div className="font-bold text-green-400 h-5 flex items-center justify-center">{isComparing ? renderComparisonValue(data.socioEconomic.householdIncome) : `+${data.socioEconomic.householdIncome}%`}</div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-center text-muted-foreground">{t.regionalDisparity}</div>
                            <SmallSparkline 
                                data={data.socioEconomic.disparityData} 
                                dataKey={isComparing ? 'p1' : 'v'} 
                                dataKey2={isComparing ? 'p2' : undefined}
                                strokeColor="hsl(var(--chart-3))"
                                strokeColor2={isComparing ? "hsl(var(--chart-5))" : undefined}
                            />
                        </div>
                    </CardContent>
              </CardWrapper>
            )}

            {shouldShow('Predictive Tools') && (
              <CardWrapper popoverKey='predictive'>
                    <CardHeader className='p-2'>
                    <CardTitle className="text-foreground text-sm">{t.predictiveTools}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 space-y-2 text-xs">
                    <TooltipProvider>
                        <ShadTooltip>
                            <TooltipTrigger asChild>
                                <div className="flex justify-between items-center cursor-pointer p-1 rounded-md hover:bg-accent">
                                    <span className="text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> {t.landPriceTrend}</span>
                                    <span className="font-bold text-green-400">{isComparing ? `${data.landPriceTrend.p1}% / ${data.landPriceTrend.p2}%` : `+${data.landPriceTrend}%`}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t.landPriceTrend}</p>
                            </TooltipContent>
                        </ShadTooltip>
                        <ShadTooltip>
                            <TooltipTrigger asChild>
                                <div className="flex justify-between items-center cursor-pointer p-1 rounded-md hover:bg-accent">
                                    <span className="text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" />{t.businessReg}</span>
                                    <span className="font-bold text-foreground">{isComparing ? `${data.businessReg.p1} / ${data.businessReg.p2}` : data.businessReg}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t.businessReg}</p>
                            </TooltipContent>
                        </ShadTooltip>
                        <ShadTooltip>
                            <TooltipTrigger asChild>
                                <div className="flex justify-between items-center cursor-pointer p-1 rounded-md hover:bg-accent">
                                    <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="h-4 w-4" />{t.skilledLabor}</span>
                                    <span className="font-bold text-foreground">{isComparing ? `${data.skilledLabor.p1}k / ${data.skilledLabor.p2}k` : `${data.skilledLabor}k`}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t.skilledLabor}</p>
                            </TooltipContent>
                        </ShadTooltip>
                    </TooltipProvider>
                    </CardContent>
              </CardWrapper>
            )}

            {isComparing && (
              <Card className="glass-panel border-none">
                <CardHeader className="p-2 flex flex-row items-center gap-2">
                    <Bot className="h-5 w-5 text-primary"/>
                    <CardTitle className="text-foreground text-sm">{t.aiRecommendation}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 text-xs text-muted-foreground space-y-2">
                    <p><strong className="text-foreground">{t.project1}</strong> {t.p1analysis}</p>
                    <p><strong className="text-foreground">{t.project2}</strong> {t.p2analysis}</p>
                    <div className="text-foreground pt-1">
                      <strong>{t.recommendation}</strong>{' '}
                      {recommendationParts.map((part, index) => {
                          const recommendationKey = language === 'th' ? 'โปรเจกต์' : 'Project';
                          if (part === `${recommendationKey} 1`) {
                              return <strong key={index} className="text-chart-1">{part}</strong>;
                          }
                          if (part === `${recommendationKey} 2`) {
                              return <strong key={index} className="text-chart-2">{part}</strong>;
                          }
                          return part;
                      })}
                    </div>
                </CardContent>
              </Card>
            )}
          </div>
          )}
        </ScrollArea>
    </aside>
    {activePopover && popoverDataForKey && (
        <DraggablePanel
          popoverData={popoverDataForKey}
          onClose={() => setActivePopover(null)}
          initialPosition={activePopover.position}
        />
      )}
    </>
  );
}

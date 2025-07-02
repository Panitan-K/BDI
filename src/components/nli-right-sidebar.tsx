
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Cell, LabelList, Legend, PieChart, Pie, ComposedChart, Line } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Building, Briefcase, TrendingUp, XIcon, Maximize2, Minimize2, PiggyBank, Landmark } from 'lucide-react';
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

const project1Data = {
  name: "Project 1: Eastern EEC High-Speed Rail",
  name_th: "โปรเจกต์ 1: รถไฟความเร็วสูง EEC ตะวันออก",
  gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 3 + 1 })),
  freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 20 + 10 })),
  jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', value: 4500 }, { name: 'Logistics', name_th: 'โลจิสติกส์', value: 2700 }, { name: 'Services', name_th: 'บริการ', value: 3200 }, { name: 'Manufacturing', name_th: 'การผลิต', value: 1800 } ],
  regionalData: [ { name: 'North', name_th: 'เหนือ', value: 400, fill: 'hsl(var(--chart-1))' }, { name: 'East', name_th: 'ตะวันออก', value: 300, fill: 'hsl(var(--chart-2))' }, { name: 'South', name_th: 'ใต้', value: 300, fill: 'hsl(var(--chart-3))' }, { name: 'West', name_th: 'ตะวันตก', value: 200, fill: 'hsl(var(--chart-4))' } ],
  economicImpact: 2.8, logisticFlow: 15, environmentalScore: 72, investmentSuitability: 79, landPriceTrend: 2.1, businessReg: 425, skilledLabor: 38.2,
  funding: {
    totalCost: 150, // B THB
    roi: 12.5,
    paybackPeriod: 8,
    sources: [
      { name: 'Government', name_th: 'ภาครัฐ', value: 60, fill: 'hsl(var(--chart-1))' },
      { name: 'Private', name_th: 'เอกชน', value: 40, fill: 'hsl(var(--chart-2))' }
    ]
  },
  socioEconomic: {
    povertyReduction: 1.5,
    householdIncome: 3.2,
    disparityData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: 10 - i * (0.5 + Math.random()*0.2) })),
  }
};
const project2Data = {
  name: "Project 2: Southern Land Bridge",
  name_th: "โปรเจกต์ 2: สะพานเศรษฐกิจภาคใต้",
  gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 2 + 0.5 })),
  freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 15 + 5 })),
  jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', value: 2200 }, { name: 'Logistics', name_th: 'โลจิสติกส์', value: 5100 }, { name: 'Services', name_th: 'บริการ', value: 1800 }, { name: 'Manufacturing', name_th: 'การผลิต', value: 4200 } ],
  regionalData: [ { name: 'North', name_th: 'เหนือ', value: 150, fill: 'hsl(var(--chart-1))' }, { name: 'East', name_th: 'ตะวันออก', value: 550, fill: 'hsl(var(--chart-2))' }, { name: 'South', name_th: 'ใต้', value: 200, fill: 'hsl(var(--chart-3))' }, { name: 'West', name_th: 'ตะวันตก', value: 100, fill: 'hsl(var(--chart-4))' } ],
  economicImpact: 1.2, logisticFlow: 8, environmentalScore: 85, investmentSuitability: 68, landPriceTrend: 1.3, businessReg: 210, skilledLabor: 25.6,
  funding: {
    totalCost: 350,
    roi: 9.8,
    paybackPeriod: 12,
    sources: [
      { name: 'Government', name_th: 'ภาครัฐ', value: 45, fill: 'hsl(var(--chart-1))' },
      { name: 'Private', name_th: 'เอกชน', value: 55, fill: 'hsl(var(--chart-2))' }
    ]
  },
  socioEconomic: {
    povertyReduction: 2.1,
    householdIncome: 4.5,
    disparityData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: 12 - i * (0.6 + Math.random()*0.2) })),
  }
};
const comparisonData = {
  name: "Comparison: P1 vs P2",
  name_th: "เปรียบเทียบ: P1 vs P2",
  gdpData: project1Data.gdpData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.gdpData[i].v})),
  freightData: project1Data.freightData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.freightData[i].v})),
  jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', p1: 4500, p2: 2200 }, { name: 'Logistics', name_th: 'โลจิสติกส์', p1: 2700, p2: 5100 }, { name: 'Services', name_th: 'บริการ', p1: 3200, p2: 1800 }, { name: 'Manufacturing', name_th: 'การผลิต', p1: 1800, p2: 4200 } ],
  regionalData: project1Data.regionalData.map((d, i) => ({ name: d.name, name_th: d.name_th, p1: d.value, p2: project2Data.regionalData[i].value, fill: d.fill })),
  economicImpact: { p1: 2.8, p2: 1.2 }, logisticFlow: { p1: 15, p2: 8 }, environmentalScore: { p1: 72, p2: 85 }, investmentSuitability: { p1: 79, p2: 68 }, landPriceTrend: { p1: 2.1, p2: 1.3 }, businessReg: { p1: 425, p2: 210 }, skilledLabor: { p1: 38.2, p2: 25.6 },
  funding: {
    totalCost: {p1: 150, p2: 350},
    roi: {p1: 12.5, p2: 9.8},
    paybackPeriod: {p1: 8, p2: 12},
    sourcesP1: [
        { name: 'Government', name_th: 'ภาครัฐ', value: 60, fill: 'hsl(var(--chart-1))' },
        { name: 'Private', name_th: 'เอกชน', value: 40, fill: 'hsl(var(--chart-2))' }
    ],
    sourcesP2: [
        { name: 'Government', name_th: 'ภาครัฐ', value: 45, fill: 'hsl(var(--chart-1))' },
        { name: 'Private', name_th: 'เอกชน', value: 55, fill: 'hsl(var(--chart-2))' }
    ]
  },
  socioEconomic: {
      povertyReduction: {p1: 1.5, p2: 2.1},
      householdIncome: {p1: 3.2, p2: 4.5},
      disparityData: project1Data.socioEconomic.disparityData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.socioEconomic.disparityData[i].v})),
  }
};
const regionalMockData: Record<string, any> = {
    'Bangkok': { ...project1Data, name: 'Bangkok Analysis', name_th: 'การวิเคราะห์กรุงเทพมหานคร', economicImpact: 5.1, environmentalScore: 55, investmentSuitability: 92 },
    'Chiang Mai': { ...project2Data, name: 'Chiang Mai Analysis', name_th: 'การวิเคราะห์เชียงใหม่', economicImpact: 1.8, environmentalScore: 88, investmentSuitability: 75 },
    'Phuket': { ...project1Data, name: 'Phuket Analysis', name_th: 'การวิเคราะห์ภูเก็ต', economicImpact: 3.5, environmentalScore: 78, investmentSuitability: 85 },
    'Chon Buri': { ...project2Data, name: 'Chon Buri Analysis', name_th: 'การวิเคราะห์ชลบุรี', economicImpact: 4.2, environmentalScore: 65, investmentSuitability: 89 }
};

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
    ...(dataKey2 && { [dataKey2]: { color: strokeColor2 } }),
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

interface NliRightSidebarProps {
    isOpen?: boolean; 
    activeProject: string; 
    isComparing: boolean; 
    selectedRegion: string | null; 
    onClearRegion: () => void; 
    language: string; 
    isMaximized: boolean;
    onMaximizeToggle: () => void;
}

export function NliRightSidebar({ activeProject, isComparing, selectedRegion, onClearRegion, language, isMaximized, onMaximizeToggle }: NliRightSidebarProps) {
  const data = React.useMemo(() => {
    if (isComparing) {
      return comparisonData;
    }
    if (selectedRegion && regionalMockData[selectedRegion]) {
      return regionalMockData[selectedRegion];
    }
    return activeProject === 'project1' ? project1Data : project2Data;
  }, [isComparing, selectedRegion, activeProject]);

  const t = translations[language as keyof typeof translations] || translations.en;
  
  const title = React.useMemo(() => {
    const nameKey = language === 'en' ? 'name' : 'name_th';
    return data[nameKey as keyof typeof data] || data.name
  }, [data, language]);

  const nameKey = language === 'en' ? 'name' : 'name_th';

  const barChartConfig = {
    p1: { label: t.project1, color: "hsl(var(--chart-1))" },
    p2: { label: t.project2, color: "hsl(var(--chart-2))" },
    value: { label: t.jobs, color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;
  
  const fundingSourcesChartConfig = {
    p1: { label: t.project1, color: "hsl(var(--chart-1))" },
    p2: { label: t.project2, color: "hsl(var(--chart-2))" },
    Government: { label: language === 'en' ? 'Government' : 'ภาครัฐ', color: "hsl(var(--chart-1))" },
    Private: { label: language === 'en' ? 'Private' : 'เอกชน', color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const renderComparisonValue = (val: any, unit: string = '%') => (
      <div className="flex items-baseline justify-center gap-2">
        <span className="text-chart-1">{val.p1}{unit}</span>
        <span className="text-muted-foreground text-xs">vs</span>
        <span className="text-chart-2">{val.p2}{unit}</span>
      </div>
  );

  return (
    <aside
      className={cn(
        'p-2 flex flex-col glass-panel !rounded-lg transition-all duration-300 ease-in-out z-10 shrink-0',
        isMaximized ? 'w-[500px]' : 'w-80'
      )}
    >
        <div className='flex justify-between items-center mb-2 px-1'>
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            <div className="flex items-center">
              {selectedRegion && <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onClearRegion}><XIcon className='h-4 w-4'/></Button>}
              <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onMaximizeToggle}>
                {isMaximized ? <Minimize2 className='h-4 w-4' /> : <Maximize2 className='h-4 w-4' />}
              </Button>
            </div>
        </div>
        <ScrollArea className="flex-1 -mr-2 pr-2">
          <div className="space-y-3 px-1">
            <div className="grid grid-cols-2 gap-2">
              <Card className="glass-panel border-none">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{t.economicImpact}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="text-lg font-bold text-foreground">{isComparing ? renderComparisonValue(data.economicImpact) : `+${data.economicImpact}%`}</div>
                  <p className="text-xs text-green-400">{t.gdpForecast}</p>
                  <SmallSparkline 
                    data={data.gdpData} 
                    dataKey={isComparing ? 'p1' : 'v'} 
                    dataKey2={isComparing ? 'p2' : undefined}
                    strokeColor="hsl(var(--chart-1))"
                    strokeColor2={isComparing ? "hsl(var(--chart-2))" : undefined}
                  />
                </CardContent>
              </Card>
              <Card className="glass-panel border-none">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{t.logisticFlow}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="text-lg font-bold text-foreground">{isComparing ? renderComparisonValue(data.logisticFlow) : `+${data.logisticFlow}%`}</div>
                  <p className="text-xs text-green-400">{t.freightVolume}</p>
                  <SmallSparkline 
                    data={data.freightData} 
                    dataKey={isComparing ? 'p1' : 'v'} 
                    dataKey2={isComparing ? 'p2' : undefined}
                    strokeColor="hsl(var(--chart-4))"
                    strokeColor2={isComparing ? "hsl(var(--chart-5))" : undefined}
                   />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Card className="glass-panel border-none">
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
                </Card>
                <Card className="glass-panel border-none">
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
                </Card>
            </div>

            <Card className="glass-panel border-none">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="text-sm font-medium text-foreground">{t.jobsCreated}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 h-[190px]">
                <ChartContainer config={barChartConfig} className="w-full h-full">
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
                    {isComparing && <ChartLegend verticalAlign="top" height={30} />}
                    {isComparing ? (
                      <>
                        <Bar dataKey="p1" fill="var(--color-p1)" radius={4} barSize={isMaximized ? 15 : 10}>
                            <LabelList dataKey="p1" position="top" className="fill-foreground" fontSize={10}/>
                        </Bar>
                        <Bar dataKey="p2" fill="var(--color-p2)" radius={4} barSize={isMaximized ? 15 : 10}>
                            <LabelList dataKey="p2" position="top" className="fill-foreground" fontSize={10}/>
                        </Bar>
                      </>
                    ) : (
                      <Bar dataKey="value" fill="var(--color-value)" radius={4} barSize={12}>
                        <LabelList dataKey="value" position="top" className="fill-foreground" fontSize={10}/>
                      </Bar>
                    )}
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-none">
              <CardHeader className='p-2'>
                <CardTitle className="text-foreground text-sm">{t.regionalDist}</CardTitle>
              </CardHeader>
              <CardContent className='p-2 pt-0 h-[180px]'>
                 <ChartContainer config={barChartConfig} className="w-full h-full">
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
                        {isComparing && <ChartLegend verticalAlign="top" height={30} />}
                        {isComparing ? (
                            <>
                                <Bar dataKey="p1" name={t.project1} fill="var(--color-p1)" radius={4} barSize={isMaximized ? 15 : 12} />
                                <Bar dataKey="p2" name={t.project2} fill="var(--color-p2)" radius={4} barSize={isMaximized ? 15 : 12} />
                            </>
                        ) : (
                            <Bar
                                dataKey="value"
                                radius={4}
                                barSize={30}
                            >
                                {data.regionalData.map((entry: any) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        )}
                    </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
                <CardHeader className="p-2 flex flex-row items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-primary"/>
                    <CardTitle className="text-foreground text-sm">{t.financingCosts}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-4">
                    {isComparing ? (
                        <>
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
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">{t.fundingSources}</p>
                                <ChartContainer config={fundingSourcesChartConfig} className="h-[50px] w-full">
                                    <BarChart layout="vertical" data={[...data.funding.sourcesP1.map((s, i) => ({ name: s[nameKey as 'name' | 'name_th'], p1: s.value, p2: data.funding.sourcesP2[i].value}))]} stackOffset="expand" margin={{left: language === 'th' ? 10 : 0}}>
                                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={10} width={language === 'en' ? 70 : 60}/>
                                        <XAxis type="number" hide domain={[0, 100]}/>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator formatter={(v) => `${v}%`}/>} />
                                        <Bar dataKey="p1" name={t.project1} fill="var(--color-p1)" radius={4} barSize={12} stackId="a" />
                                        <Bar dataKey="p2" name={t.project2} fill="var(--color-p2)" radius={4} barSize={12} stackId="b" />
                                    </BarChart>
                                </ChartContainer>
                            </div>
                        </>
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
            </Card>


            <Card className="glass-panel border-none">
                <CardHeader className="p-2 flex flex-row items-center gap-2">
                    <Landmark className="h-5 w-5 text-primary"/>
                    <CardTitle className="text-foreground text-sm">{t.socioEconomic}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-center">
                         <div className="flex flex-col items-center">
                            <p className="text-xs text-muted-foreground">{t.povertyReduction}</p>
                            <div className="font-bold text-green-400 h-5 flex items-center">{isComparing ? renderComparisonValue(data.socioEconomic.povertyReduction) : `+${data.socioEconomic.povertyReduction}%`}</div>
                        </div>
                         <div className="flex flex-col items-center">
                            <p className="text-xs text-muted-foreground">{t.householdIncome}</p>
                            <div className="font-bold text-green-400 h-5 flex items-center">{isComparing ? renderComparisonValue(data.socioEconomic.householdIncome) : `+${data.socioEconomic.householdIncome}%`}</div>
                        </div>
                    </div>
                    <div>
                         <p className="text-xs text-center text-muted-foreground">{t.regionalDisparity}</p>
                        <SmallSparkline 
                            data={data.socioEconomic.disparityData} 
                            dataKey={isComparing ? 'p1' : 'v'} 
                            dataKey2={isComparing ? 'p2' : undefined}
                            strokeColor="hsl(var(--chart-3))"
                            strokeColor2={isComparing ? "hsl(var(--chart-5))" : undefined}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-panel border-none">
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
            </Card>
          </div>
        </ScrollArea>
    </aside>
  );
}


'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Building, Briefcase, TrendingUp, XIcon } from 'lucide-react';
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
  pieData: [ { name: 'North', name_th: 'เหนือ', value: 400 }, { name: 'East', name_th: 'ตะวันออก', value: 300 }, { name: 'South', name_th: 'ใต้', value: 300 }, { name: 'West', name_th: 'ตะวันตก', value: 200 } ],
  economicImpact: 2.8, logisticFlow: 15, environmentalScore: 72, investmentSuitability: 79, landPriceTrend: 2.1, businessReg: 425, skilledLabor: 38.2
};
const project2Data = {
  name: "Project 2: Southern Land Bridge",
  name_th: "โปรเจกต์ 2: สะพานเศรษฐกิจภาคใต้",
  gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 2 + 0.5 })),
  freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 15 + 5 })),
  jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', value: 2200 }, { name: 'Logistics', name_th: 'โลจิสติกส์', value: 5100 }, { name: 'Services', name_th: 'บริการ', value: 1800 }, { name: 'Manufacturing', name_th: 'การผลิต', value: 4200 } ],
  pieData: [ { name: 'North', name_th: 'เหนือ', value: 150 }, { name: 'East', name_th: 'ตะวันออก', value: 550 }, { name: 'South', name_th: 'ใต้', value: 200 }, { name: 'West', name_th: 'ตะวันตก', value: 100 } ],
  economicImpact: 1.2, logisticFlow: 8, environmentalScore: 85, investmentSuitability: 68, landPriceTrend: 1.3, businessReg: 210, skilledLabor: 25.6
};
const comparisonData = {
  name: "Comparison: P1 vs P2",
  name_th: "เปรียบเทียบ: P1 vs P2",
  gdpData: project1Data.gdpData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.gdpData[i].v})),
  freightData: project1Data.freightData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.freightData[i].v})),
  jobsData: [ { name: 'Construction', name_th: 'ก่อสร้าง', p1: 4500, p2: 2200 }, { name: 'Logistics', name_th: 'โลจิสติกส์', p1: 2700, p2: 5100 }, { name: 'Services', name_th: 'บริการ', p1: 3200, p2: 1800 }, { name: 'Manufacturing', name_th: 'การผลิต', p1: 1800, p2: 4200 } ],
  pieData: project1Data.pieData.map((d, i) => ({ name: d.name, name_th: d.name_th, p1: d.value, p2: project2Data.pieData[i].value })),
  economicImpact: { p1: 2.8, p2: 1.2 }, logisticFlow: { p1: 15, p2: 8 }, environmentalScore: { p1: 72, p2: 85 }, investmentSuitability: { p1: 79, p2: 68 }, landPriceTrend: { p1: 2.1, p2: 1.3 }, businessReg: { p1: 425, p2: 210 }, skilledLabor: { p1: 38.2, p2: 25.6 }
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
    jobsCreated: 'Jobs Created (k)',
    regionalDist: 'Regional Distribution',
    predictiveTools: 'Predictive Tools',
    landPriceTrend: 'Land Price Trend',
    landPriceUnit: 'Yr/Yr',
    landPriceTooltip: 'Annualized land price increase based on current investment models.',
    businessReg: 'Business Registration',
    businessRegUnit: 'May 2024',
    businessRegTooltip: 'New business registrations in the target region this month.',
    skilledLabor: 'Skilled Labor (k)',
    skilledLaborTooltip: 'Available skilled labor pool in the sub-region.',
    project1: 'Project 1',
    project2: 'Project 2',
    jobs: 'Jobs',
  },
  th: {
    economicImpact: 'ผลกระทบทางเศรษฐกิจ',
    gdpForecast: 'พยากรณ์ GDP',
    logisticFlow: 'การไหลของโลจิสติกส์',
    freightVolume: 'ปริมาณการขนส่งสินค้า',
    envScore: 'คะแนนสิ่งแวดล้อม',
    investSuitability: 'ความเหมาะสมในการลงทุน',
    jobsCreated: 'จำนวนงานที่สร้าง (พัน)',
    regionalDist: 'การกระจายตัวในภูมิภาค',
    predictiveTools: 'เครื่องมือคาดการณ์',
    landPriceTrend: 'แนวโน้มราคาที่ดิน',
    landPriceUnit: 'ต่อปี',
    landPriceTooltip: 'การเพิ่มขึ้นของราคาที่ดินรายปีตามแบบจำลองการลงทุนปัจจุบัน',
    businessReg: 'การจดทะเบียนธุรกิจ',
    businessRegUnit: 'พ.ค. 2567',
    businessRegTooltip: 'การจดทะเบียนธุรกิจใหม่ในพื้นที่เป้าหมายในเดือนนี้',
    skilledLabor: 'แรงงานมีฝีมือ (พัน)',
    skilledLaborTooltip: 'จำนวนแรงงานมีฝีมือที่มีอยู่ในอนุภูมิภาค',
    project1: 'โปรเจกต์ 1',
    project2: 'โปรเจกต์ 2',
    jobs: 'จำนวนงาน',
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

export function NliRightSidebar({ activeProject, isComparing, selectedRegion, onClearRegion, language }: { isOpen?: boolean; activeProject: string; isComparing: boolean; selectedRegion: string | null; onClearRegion: () => void; language: string; }) {
  const [data, setData] = useState<any>(project1Data);
  const [title, setTitle] = useState(project1Data.name);
  const t = translations[language as keyof typeof translations] || translations.en;
  const nameKey = language === 'en' ? 'name' : 'name_th';

  useEffect(() => {
    if (selectedRegion) {
        setData(regionalMockData[selectedRegion] || project1Data);
        setTitle(language === 'en' ? (regionalMockData[selectedRegion]?.name || "Region Analysis") : (regionalMockData[selectedRegion]?.name_th || "การวิเคราะห์ภูมิภาค"));
    } else if (isComparing) {
      setData(comparisonData);
      setTitle(language === 'en' ? comparisonData.name : comparisonData.name_th);
    } else {
      const projectData = activeProject === 'project1' ? project1Data : project2Data;
      setData(projectData);
      setTitle(language === 'en' ? projectData.name : projectData.name_th);
    }
  }, [activeProject, isComparing, selectedRegion, language]);

  const barChartConfig = {
    p1: { label: t.project1, color: "hsl(var(--chart-1))" },
    p2: { label: t.project2, color: "hsl(var(--chart-2))" },
    value: { label: t.jobs, color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const pieChartConfig = {
    value: { label: "Value" },
    p1: { label: t.project1 },
    p2: { label: t.project2 },
    North: { label: language === 'en' ? 'North' : 'เหนือ', color: "hsl(var(--chart-1))" },
    East: { label: language === 'en' ? 'East' : 'ตะวันออก', color: "hsl(var(--chart-2))" },
    South: { label: language === 'en' ? 'South' : 'ใต้', color: "hsl(var(--chart-3))" },
    West: { label: language === 'en' ? 'West' : 'ตะวันตก', color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  const totalPieValue = React.useMemo(() => {
    if (isComparing || !data.pieData) return 0;
    return data.pieData.reduce((acc: number, curr: any) => acc + curr.value, 0);
  }, [data.pieData, isComparing]);

  const renderComparisonValue = (val: any) => (
      <div className="flex items-baseline gap-2">
        <span className="text-chart-1">{val.p1}%</span>
        <span className="text-muted-foreground text-xs">vs</span>
        <span className="text-chart-2">{val.p2}%</span>
      </div>
  );

  return (
    <aside
      className={cn(
        'w-72 p-2 flex flex-col glass-panel !rounded-lg transition-all duration-300 ease-in-out z-10 shrink-0'
      )}
    >
        <div className='flex justify-between items-center mb-2 px-1'>
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            {selectedRegion && <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onClearRegion}><XIcon className='h-4 w-4'/></Button>}
        </div>
        <ScrollArea className="flex-1 -mr-2 pr-2">
          <div className="space-y-2 px-1">
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

            <Card className="glass-panel border-none">
              <CardHeader className="p-2 pb-2 flex-row items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground">{t.envScore}</CardTitle>
                <span className="font-bold text-lg text-chart-3">{isComparing ? `${data.environmentalScore.p1}/${data.environmentalScore.p2}` : data.environmentalScore}</span>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Progress value={isComparing ? (data.environmentalScore.p1 + data.environmentalScore.p2)/2 : data.environmentalScore} className="h-1.5 [&>div]:bg-chart-3" />
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className="p-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t.jobsCreated}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <ChartContainer config={barChartConfig} className="h-[120px] w-full">
                  <BarChart accessibilityLayer data={data.jobsData} margin={{ left: -25, top: 10 }}>
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
                    {isComparing ? (
                      <>
                        <Bar dataKey="p1" fill="var(--color-p1)" radius={4} barSize={10} />
                        <Bar dataKey="p2" fill="var(--color-p2)" radius={4} barSize={10} />
                      </>
                    ) : (
                      <Bar dataKey="value" fill="var(--color-value)" radius={4} barSize={12} />
                    )}
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-none">
              <CardHeader className='p-2'>
                <CardTitle className="text-foreground text-sm">{t.regionalDist}</CardTitle>
              </CardHeader>
              <CardContent className='p-2 pt-0'>
                 {isComparing ? (
                    <ChartContainer config={pieChartConfig} className="h-[180px] w-full">
                        <BarChart layout="vertical" data={data.pieData} margin={{ left: 0, top: 20, right: 10 }}>
                        <YAxis
                            dataKey={nameKey}
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={5}
                            fontSize={10}
                            width={language === 'th' ? 60 : 50}
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <ChartLegend content={<ChartLegendContent verticalAlign="top" />} />
                        <Bar dataKey="p1" name={t.project1} layout="vertical" fill="var(--color-p1)" radius={4} barSize={12} />
                        <Bar dataKey="p2" name={t.project2} layout="vertical" fill="var(--color-p2)" radius={4} barSize={12} />
                        </BarChart>
                    </ChartContainer>
                 ) : (
                    <div className="relative">
                        <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-[180px]">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                <Pie data={data.pieData} dataKey="value" nameKey={nameKey} innerRadius={50} outerRadius={70} strokeWidth={2} >
                                    {data.pieData.map((entry: any) => (
                                        <Cell key={entry.name} fill={`var(--color-${entry.name})`} className="stroke-background" />
                                    ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent nameKey="name" className="-mt-4 flex-wrap" />} />
                            </PieChart>
                        </ChartContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-lg font-bold">{totalPieValue.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                    </div>
                 )}
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
                            <p>{t.landPriceTooltip}</p>
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
                            <p>{t.businessRegTooltip}</p>
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
                            <p>{t.skilledLaborTooltip}</p>
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

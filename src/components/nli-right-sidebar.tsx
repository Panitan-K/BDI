'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import type { TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { XIcon } from 'lucide-react';
import {
    Tooltip as ShadTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

const project1Data = {
  name: "Project 1: Eastern EEC High-Speed Rail",
  gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 3 + 1 })),
  freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 20 + 10 })),
  jobsData: [ { name: 'Construction', value: 4500 }, { name: 'Logistics', value: 2700 }, { name: 'Services', value: 3200 }, { name: 'Manufacturing', value: 1800 } ],
  pieData: [ { name: 'North', value: 400 }, { name: 'East', value: 300 }, { name: 'South', value: 300 }, { name: 'West', value: 200 } ],
  economicImpact: 2.8, logisticFlow: 15, environmentalScore: 72, investmentSuitability: 79, landPriceTrend: 2.1, businessReg: 425, skilledLabor: 38.2
};
const project2Data = {
  name: "Project 2: Southern Land Bridge",
  gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 2 + 0.5 })),
  freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 15 + 5 })),
  jobsData: [ { name: 'Construction', value: 2200 }, { name: 'Logistics', value: 5100 }, { name: 'Services', value: 1800 }, { name: 'Manufacturing', value: 4200 } ],
  pieData: [ { name: 'North', value: 150 }, { name: 'East', value: 550 }, { name: 'South', value: 200 }, { name: 'West', value: 100 } ],
  economicImpact: 1.2, logisticFlow: 8, environmentalScore: 85, investmentSuitability: 68, landPriceTrend: 1.3, businessReg: 210, skilledLabor: 25.6
};
const comparisonData = {
  name: "Comparison: P1 vs P2",
  gdpData: project1Data.gdpData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.gdpData[i].v})),
  freightData: project1Data.freightData.map((d, i) => ({name: d.name, p1: d.v, p2: project2Data.freightData[i].v})),
  jobsData: [ { name: 'Construction', p1: 4500, p2: 2200 }, { name: 'Logistics', p1: 2700, p2: 5100 }, { name: 'Services', p1: 3200, p2: 1800 }, { name: 'Manufacturing', p1: 1800, p2: 4200 } ],
  pieData: project1Data.pieData.map((d, i) => ({ name: d.name, p1: d.value, p2: project2Data.pieData[i].value })),
  economicImpact: { p1: 2.8, p2: 1.2 }, logisticFlow: { p1: 15, p2: 8 }, environmentalScore: { p1: 72, p2: 85 }, investmentSuitability: { p1: 79, p2: 68 }, landPriceTrend: { p1: 2.1, p2: 1.3 }, businessReg: { p1: 425, p2: 210 }, skilledLabor: { p1: 38.2, p2: 25.6 }
};
const regionalMockData: Record<string, any> = {
    'Bangkok': { ...project1Data, name: 'Bangkok Analysis', economicImpact: 5.1, environmentalScore: 55, investmentSuitability: 92 },
    'Chiang Mai': { ...project2Data, name: 'Chiang Mai Analysis', economicImpact: 1.8, environmentalScore: 88, investmentSuitability: 75 },
    'Phuket': { ...project1Data, name: 'Phuket Analysis', economicImpact: 3.5, environmentalScore: 78, investmentSuitability: 85 },
    'Chon Buri': { ...project2Data, name: 'Chon Buri Analysis', economicImpact: 4.2, environmentalScore: 65, investmentSuitability: 89 }
};

const COLORS = ['#57C3FF', '#4A69F6', '#FCE525', '#6C72FF'];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 glass-panel text-white rounded-md border-border text-sm">
        <p className="label font-bold">{`${label}`}</p>
        {payload.map((p, index) => (
             <p key={index} style={{ color: p.color }}>{`${p.name}: ${p.value?.toLocaleString()}`}</p>
        ))}
         {data.note && <p className="text-muted-foreground text-xs mt-1">{data.note}</p>}
      </div>
    );
  }
  return null;
};

const SmallSparkline = ({ data, dataKey, dataKey2, strokeColor, strokeColor2 }: { data: any[], dataKey: string, dataKey2?: string, strokeColor: string, strokeColor2?: string }) => (
  <ResponsiveContainer width="100%" height={40}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id={`sparkline-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
        {strokeColor2 && <linearGradient id={`sparkline-${strokeColor2}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor2} stopOpacity={0.4} />
          <stop offset="100%" stopColor={strokeColor2} stopOpacity={0} />
        </linearGradient>}
      </defs>
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={2} fill={`url(#sparkline-${strokeColor})`} />
      {dataKey2 && strokeColor2 && <Area type="monotone" dataKey={dataKey2} stroke={strokeColor2} strokeWidth={2} fill={`url(#sparkline-${strokeColor2})`} />}
      <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
    </AreaChart>
  </ResponsiveContainer>
);

export function NliRightSidebar({ activeProject, isComparing, selectedRegion, onClearRegion }: { isOpen?: boolean; activeProject: string; isComparing: boolean; selectedRegion: string | null; onClearRegion: () => void; }) {
  const [data, setData] = useState<any>(project1Data);
  const [title, setTitle] = useState(project1Data.name);

  useEffect(() => {
    if (selectedRegion) {
        setData(regionalMockData[selectedRegion] || project1Data);
        setTitle(regionalMockData[selectedRegion]?.name || "Region Analysis");
    } else if (isComparing) {
      setData(comparisonData);
      setTitle(comparisonData.name);
    } else {
      setData(activeProject === 'project1' ? project1Data : project2Data);
      setTitle(activeProject === 'project1' ? project1Data.name : project2Data.name);
    }
  }, [activeProject, isComparing, selectedRegion]);

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
        'w-80 p-2 flex flex-col glass-panel !rounded-lg transition-all duration-300 ease-in-out z-10 shrink-0'
      )}
    >
        <div className='flex justify-between items-center mb-2 px-1'>
            <h2 className="text-base font-bold text-white">{title}</h2>
            {selectedRegion && <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onClearRegion}><XIcon className='h-4 w-4'/></Button>}
        </div>
        <ScrollArea className="flex-1 -mr-2 pr-2">
          <div className="space-y-2 px-1">
            <div className="grid grid-cols-2 gap-2">
              <Card className="glass-panel border-none">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Economic Impact</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="text-xl font-bold text-white">{isComparing ? renderComparisonValue(data.economicImpact) : `+${data.economicImpact}%`}</div>
                  <p className="text-xs text-green-400">GDP Forecast</p>
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
                  <CardTitle className="text-xs font-medium text-muted-foreground">Logistic Flow</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="text-xl font-bold text-white">{isComparing ? renderComparisonValue(data.logisticFlow) : `+${data.logisticFlow}%`}</div>
                  <p className="text-xs text-green-400">Freight Volume</p>
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
                <CardTitle className="text-xs font-medium text-muted-foreground">Environmental Score</CardTitle>
                <span className="font-bold text-lg text-chart-3">{isComparing ? `${data.environmentalScore.p1}/${data.environmentalScore.p2}` : data.environmentalScore}</span>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Progress value={isComparing ? (data.environmentalScore.p1 + data.environmentalScore.p2)/2 : data.environmentalScore} className="h-1.5 [&>div]:bg-chart-3" />
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className="p-2 pb-2 flex-row items-center justify-between">
                 <CardTitle className="text-xs font-medium text-muted-foreground">Investment Suitability</CardTitle>
                 <span className="font-bold text-lg text-chart-2">{isComparing ? `${data.investmentSuitability.p1}/${data.investmentSuitability.p2}`: data.investmentSuitability}</span>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <p className="text-xs text-muted-foreground mb-1">Jobs Created (k)</p>
                 <ResponsiveContainer width="100%" height={80}>
                    <BarChart data={data.jobsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={isComparing ? 2 : 4}>
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}/>
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                       {isComparing ? (
                          <>
                            <Bar dataKey="p1" name="Project 1" barSize={8} radius={[4, 4, 0, 0]} fill="hsl(var(--chart-1))" />
                            <Bar dataKey="p2" name="Project 2" barSize={8} radius={[4, 4, 0, 0]} fill="hsl(var(--chart-2))" />
                          </>
                        ) : (
                          <Bar dataKey="value" name="Jobs" barSize={10} radius={[4, 4, 0, 0]} fill="hsl(var(--chart-2))" />
                        )}
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-none">
              <CardHeader className='p-2'>
                <CardTitle className="text-white text-sm">Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent className='p-2 pt-0 -mt-2'>
                 <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                       <Tooltip content={<CustomTooltip />} />
                       {isComparing ? (
                         <>
                            <Pie data={data.pieData} dataKey="p1" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="hsl(var(--chart-1))" stroke="none" />
                            <Pie data={data.pieData} dataKey="p2" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={70} fill="hsl(var(--chart-2))" stroke="none" />
                         </>
                       ) : (
                        <Pie data={data.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#8884d8" stroke="none" labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}>
                            {data.pieData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                       )}
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: "10px", paddingTop: '10px'}}/>
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className='p-2'>
                <CardTitle className="text-white text-sm">Predictive Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-2 text-xs">
                <TooltipProvider>
                    <ShadTooltip>
                        <TooltipTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer">
                                <span className="text-muted-foreground">Land Price Trend</span>
                                <span className="font-bold text-green-400">{isComparing ? `${data.landPriceTrend.p1}% / ${data.landPriceTrend.p2}%` : `+${data.landPriceTrend}%`} <span className="text-xs font-normal text-muted-foreground">Yr/Yr</span></span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Annualized land price increase based on current investment models.</p>
                        </TooltipContent>
                    </ShadTooltip>
                    <ShadTooltip>
                        <TooltipTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer">
                                <span className="text-muted-foreground">Business Registration</span>
                                <span className="font-bold text-white">{isComparing ? `${data.businessReg.p1} / ${data.businessReg.p2}` : data.businessReg} <span className="text-xs font-normal text-muted-foreground">May 2024</span></span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>New business registrations in the target region this month.</p>
                        </TooltipContent>
                    </ShadTooltip>
                    <ShadTooltip>
                        <TooltipTrigger asChild>
                            <div className="flex justify-between items-center cursor-pointer">
                                <span className="text-muted-foreground">Skilled Labor (k)</span>
                                <span className="font-bold text-white">{isComparing ? `${data.skilledLabor.p1}k / ${data.skilledLabor.p2}k` : `${data.skilledLabor}k`}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Available skilled labor pool in the sub-region.</p>
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

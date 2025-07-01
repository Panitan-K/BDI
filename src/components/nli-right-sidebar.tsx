'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { XIcon } from 'lucide-react';

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
  pieData: [ { name: 'North', p1: 400, p2: 150 }, { name: 'East', p1: 300, p2: 550 }, { name: 'South', p1: 300, p2: 200 }, { name: 'West', p1: 200, p2: 100 } ],
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

const SmallSparkline = ({ data, dataKey, strokeColor }: { data: any[], dataKey: string, strokeColor: string }) => (
  <ResponsiveContainer width="100%" height={50}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id={`sparkline-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey={dataKey} stroke={strokeColor} strokeWidth={2} fill={`url(#sparkline-${strokeColor})`} />
      <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
    </AreaChart>
  </ResponsiveContainer>
);

export function NliRightSidebar({ activeProject, isComparing, selectedRegion, onClearRegion }: { isOpen?: boolean; activeProject: string; isComparing: boolean; selectedRegion: string | null; onClearRegion: () => void; }) {
  const [data, setData] = useState(project1Data);
  const [title, setTitle] = useState(project1Data.name);

  useEffect(() => {
    if (selectedRegion) {
        setData(regionalMockData[selectedRegion] || project1Data);
        setTitle(regionalMockData[selectedRegion]?.name || "Region Analysis");
    } else if (isComparing) {
      setData(comparisonData as any);
      setTitle(comparisonData.name);
    } else {
      setData(activeProject === 'project1' ? project1Data : project2Data);
      setTitle(activeProject === 'project1' ? project1Data.name : project2Data.name);
    }
  }, [activeProject, isComparing, selectedRegion]);

  const renderComparisonValue = (val: any) => (
      <div className="flex items-baseline gap-2">
        <span className="text-chart-1">{val.p1}%</span>
        <span className="text-muted-foreground text-sm">vs</span>
        <span className="text-chart-2">{val.p2}%</span>
      </div>
  );

  return (
    <aside
      className={cn(
        'w-96 p-4 flex flex-col glass-panel !rounded-lg transition-all duration-300 ease-in-out z-20 shrink-0'
      )}
    >
        <div className='flex justify-between items-center mb-4'>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {selectedRegion && <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onClearRegion}><XIcon className='h-4 w-4'/></Button>}
        </div>
        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-panel border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Economic Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{isComparing ? renderComparisonValue(data.economicImpact) : `+${data.economicImpact}%`}</div>
                  <p className="text-xs text-green-400">GDP Forecast</p>
                  <SmallSparkline data={data.gdpData} dataKey={isComparing ? 'p1' : 'v'} strokeColor="hsl(var(--chart-1))" />
                </CardContent>
              </Card>
              <Card className="glass-panel border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Logistic Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{isComparing ? renderComparisonValue(data.logisticFlow) : `+${data.logisticFlow}%`}</div>
                  <p className="text-xs text-green-400">Freight Volume</p>
                  <SmallSparkline data={data.freightData} dataKey={isComparing ? 'p1' : 'v'} strokeColor="hsl(var(--chart-2))" />
                </CardContent>
              </Card>
            </div>

            <Card className="glass-panel border-none">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Environmental Score</CardTitle>
                <span className="font-bold text-lg text-chart-3">{isComparing ? `${data.environmentalScore.p1}/${data.environmentalScore.p2}` : data.environmentalScore}</span>
              </CardHeader>
              <CardContent>
                <Progress value={isComparing ? (data.environmentalScore.p1 + data.environmentalScore.p2)/2 : data.environmentalScore} className="h-2 [&>div]:bg-chart-3" />
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                    <span>Investment Suitability</span>
                    <span className="font-bold text-lg text-chart-2">{isComparing ? `${data.investmentSuitability.p1}/${data.investmentSuitability.p2}`: data.investmentSuitability}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-2">Jobs Created</p>
                 <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={data.jobsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}/>
                      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                       {isComparing ? (
                          <>
                            <Bar dataKey="p1" name="Project 1" stackId="a" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-1))" />
                            <Bar dataKey="p2" name="Project 2" stackId="a" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-2))" />
                          </>
                        ) : (
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-2))" />
                        )}
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-none">
              <CardHeader>
                <CardTitle className="text-white text-base">Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent className='-mt-4'>
                 <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                       <Tooltip content={<CustomTooltip />} />
                       {isComparing ? (
                         <>
                            <Pie data={data.pieData} dataKey="p1" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="hsl(var(--chart-1))" stroke="none" />
                            <Pie data={data.pieData} dataKey="p2" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={80} fill="hsl(var(--chart-2))" label={({ name, p2 }) => `${name} P2: ${p2}`} stroke="none" />
                         </>
                       ) : (
                        <Pie data={data.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" stroke="none" label={({ name, value }) => `${name}: ${value}`}>
                            {data.pieData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                       )}
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: "12px"}}/>
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader>
                <CardTitle className="text-white">Predictive Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                 <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Land Price Trend</span>
                   <span className="font-bold text-green-400">{isComparing ? `${data.landPriceTrend.p1}% / ${data.landPriceTrend.p2}%` : `+${data.landPriceTrend}%`} <span className="text-xs font-normal text-muted-foreground">Yr/Yr</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Business Registration</span>
                  <span className="font-bold text-white">{isComparing ? `${data.businessReg.p1} / ${data.businessReg.p2}` : data.businessReg} <span className="text-xs font-normal text-muted-foreground">May 2024</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sub Region Skilled Labor</span>
                  <span className="font-bold text-white">{isComparing ? `${data.skilledLabor.p1}k / ${data.skilledLabor.p2}k` : `${data.skilledLabor}k`}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
    </aside>
  );
}

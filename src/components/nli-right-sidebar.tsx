'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { cn } from '@/lib/utils';

const project1Data = {
  gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 3 + 1 })),
  freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 20 + 10 })),
  jobsData: [
    { name: 'Construction', value: 4500 }, { name: 'Logistics', value: 2700 },
    { name: 'Services', value: 3200 }, { name: 'Manufacturing', value: 1800 },
  ],
  pieData: [
    { name: 'North', value: 400 }, { name: 'East', value: 300 },
    { name: 'South', value: 300 }, { name: 'West', value: 200 },
  ],
  economicImpact: 2.8,
  logisticFlow: 15,
  environmentalScore: 72,
  investmentSuitability: 79,
  landPriceTrend: 2.1,
  businessReg: 425,
  skilledLabor: 38.2
};

const project2Data = {
  gdpData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 2 + 0.5 })),
  freightData: Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 15 + 5 })),
  jobsData: [
    { name: 'Construction', value: 2200 }, { name: 'Logistics', value: 5100 },
    { name: 'Services', value: 1800 }, { name: 'Manufacturing', value: 4200 },
  ],
  pieData: [
    { name: 'North', value: 150 }, { name: 'East', value: 550 },
    { name: 'South', value: 200 }, { name: 'West', value: 100 },
  ],
  economicImpact: 1.2,
  logisticFlow: 8,
  environmentalScore: 85,
  investmentSuitability: 68,
  landPriceTrend: 1.3,
  businessReg: 210,
  skilledLabor: 25.6
};


const COLORS = ['#57C3FF', '#4A69F6', '#FCE525', '#6C72FF'];

const SmallSparkline = ({ data, strokeColor }: { data: any[], strokeColor: string }) => (
  <ResponsiveContainer width="100%" height={50}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id={`sparkline-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={strokeColor} strokeWidth={2} fill={`url(#sparkline-${strokeColor})`} />
      <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
    </AreaChart>
  </ResponsiveContainer>
);

const JobsBarChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={100}>
    <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
      <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-2))" />
      <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
      <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
    </BarChart>
  </ResponsiveContainer>
);

const CustomPieChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={200}>
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" labelLine={false} innerRadius={50} outerRadius={70} fill="#8884d8" dataKey="value" stroke="none">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
      <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize: "12px"}}/>
    </PieChart>
  </ResponsiveContainer>
);

export function NliRightSidebar({ isOpen, activeProject }: { isOpen: boolean, activeProject: string }) {
  const data = activeProject === 'project1' ? project1Data : project2Data;
  
  return (
    <aside
      className={cn(
        'flex flex-col glass-panel !rounded-none transition-all duration-300 ease-in-out z-20 shrink-0',
        isOpen ? 'w-96 p-4' : 'w-0 p-0'
      )}
      style={{ overflow: 'hidden' }}
    >
      <div className={cn("flex flex-col min-h-0 h-full transition-opacity", isOpen ? "opacity-100 delay-200" : "opacity-0")}>
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-panel border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Economic Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">+{data.economicImpact}%</div>
                  <p className="text-xs text-green-400">GDP Forecast</p>
                  <SmallSparkline data={data.gdpData} strokeColor="hsl(var(--chart-1))" />
                </CardContent>
              </Card>
              <Card className="glass-panel border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Logistic Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">+{data.logisticFlow}%</div>
                  <p className="text-xs text-green-400">Freight Volume</p>
                  <SmallSparkline data={data.freightData} strokeColor="hsl(var(--chart-2))" />
                </CardContent>
              </Card>
            </div>

            <Card className="glass-panel border-none">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Environmental Score</CardTitle>
                <span className="font-bold text-lg text-chart-3">{data.environmentalScore}</span>
              </CardHeader>
              <CardContent>
                <Progress value={data.environmentalScore} className="h-2 [&>div]:bg-chart-3" />
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Investment Suitability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-right font-bold text-lg text-chart-2 mb-2">{data.investmentSuitability}</div>
                 <p className="text-xs text-muted-foreground mb-2">Jobs Created</p>
                <JobsBarChart data={data.jobsData} />
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-none">
              <CardHeader>
                <CardTitle className="text-white text-base">Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent className='-mt-4'>
                 <CustomPieChart data={data.pieData} />
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader>
                <CardTitle className="text-white">Predictive Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Land Price Trend</span>
                  <span className="font-bold text-green-400">+{data.landPriceTrend}% <span className="text-xs font-normal text-muted-foreground">Yr/Yr</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Business Registration</span>
                  <span className="font-bold text-white">{data.businessReg} <span className="text-xs font-normal text-muted-foreground">May 2024</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sub Region Skilled Labor</span>
                  <span className="font-bold text-white">{data.skilledLabor}k</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}

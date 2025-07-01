'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

const gdpData = Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`, v: Math.random() * 3 }));
const freightData = Array.from({ length: 10 }, (_, i) => ({ name: `T${i+1}`,v: Math.random() * 20 }));
const jobsData = [
  { name: 'Construction', value: 4500 },
  { name: 'Logistics', value: 2700 },
  { name: 'Services', value: 3200 },
  { name: 'Manufacturing', value: 1800 },
];
const pieData = [
  { name: 'North', value: 400 },
  { name: 'East', value: 300 },
  { name: 'South', value: 300 },
  { name: 'West', value: 200 },
];
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

export function NliRightSidebar({ isOpen }: { isOpen: boolean }) {
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
            <Card className="glass-panel border-none">
              <CardHeader>
                <CardTitle className="text-white">Simulation Control</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary/90 hover:bg-primary">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Infrastructure
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-panel border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Economic Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">+2.8%</div>
                  <p className="text-xs text-green-400">GDP Forecast</p>
                  <SmallSparkline data={gdpData} strokeColor="hsl(var(--chart-1))" />
                </CardContent>
              </Card>
              <Card className="glass-panel border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Logistic Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">+15%</div>
                  <p className="text-xs text-green-400">Freight Volume</p>
                  <SmallSparkline data={freightData} strokeColor="hsl(var(--chart-2))" />
                </CardContent>
              </Card>
            </div>

            <Card className="glass-panel border-none">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Environmental Score</CardTitle>
                <span className="font-bold text-lg text-chart-3">72</span>
              </CardHeader>
              <CardContent>
                <Progress value={72} className="h-2 [&>div]:bg-chart-3" />
              </CardContent>
            </Card>

            <Card className="glass-panel border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Investment Suitability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-right font-bold text-lg text-chart-2 mb-2">79</div>
                 <p className="text-xs text-muted-foreground mb-2">Jobs Created</p>
                <JobsBarChart data={jobsData} />
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-none">
              <CardHeader>
                <CardTitle className="text-white text-base">Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                 <ResponsiveContainer width="100%" height={150}>
                   <PieChart>
                     <Pie data={pieData} cx="50%" cy="50%" labelLine={false} innerRadius={40} outerRadius={60} fill="#8884d8" dataKey="value">
                       {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
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
                  <span className="font-bold text-green-400">+2.1% <span className="text-xs font-normal text-muted-foreground">Yr/Yr</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Business Registration</span>
                  <span className="font-bold text-white">425 <span className="text-xs font-normal text-muted-foreground">May 2024</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sub Region Skilled Labor</span>
                  <span className="font-bold text-white">38.2k</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}

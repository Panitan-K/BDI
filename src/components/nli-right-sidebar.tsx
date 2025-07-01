'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp, PlusCircle } from 'lucide-react';

const gdpData = Array.from({ length: 20 }, () => ({ v: Math.random() * 100 }));
const freightData = Array.from({ length: 20 }, () => ({ v: Math.random() * 100 }));
const jobsData = [
  { name: 'Construction', value: 4500 },
  { name: 'Logistics', value: 2700 },
  { name: 'Services', value: 3200 },
  { name: 'Manufacturing', value: 1800 },
];

const SmallSparkline = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={50}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.5} />
          <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#sparkline-grad)" />
      <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
    </AreaChart>
  </ResponsiveContainer>
);

const JobsBarChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={100}>
    <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
      <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--chart-2))" />
    </BarChart>
  </ResponsiveContainer>
);

export function NliRightSidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside
      className={cn(
        'flex flex-col glass-panel !rounded-none transition-all duration-300 ease-in-out z-20',
        isOpen ? 'w-96 p-4' : 'w-0 p-0'
      )}
      style={{ overflow: 'hidden' }}
    >
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          <Card className="glass-panel">
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
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Economic Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">+2.8%</div>
                <p className="text-xs text-green-400">GDP Forecast</p>
                <SmallSparkline data={gdpData} />
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Logistic Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">+15%</div>
                <p className="text-xs text-green-400">Freight Volume</p>
                <SmallSparkline data={freightData} />
              </CardContent>
            </Card>
          </div>

          <Card className="glass-panel">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Environmental Score</CardTitle>
              <span className="font-bold text-lg text-chart-3">72</span>
            </CardHeader>
            <CardContent>
              <Progress value={72} className="h-2 [&>div]:bg-chart-3" />
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Investment Suitability</CardTitle>
              <span className="font-bold text-lg text-chart-2">79</span>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">Jobs Created</p>
              <JobsBarChart data={jobsData} />
            </CardContent>
          </Card>
          
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-white">Predictive Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Land Price Trend</span>
                <span className="text-sm font-bold text-green-400">+2.1% <span className="text-xs font-normal text-muted-foreground">Yr/Yr</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Business Registration</span>
                <span className="text-sm font-bold text-white">425 <span className="text-xs font-normal text-muted-foreground">May 2024</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sub Region Skilled Labor</span>
                <span className="text-sm font-bold text-white">38.2k</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
}

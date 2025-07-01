'use client';

import React from 'react';
import Image from 'next/image';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard,
  BarChart3,
  Box,
  CheckSquare,
  Star,
  Users,
  DollarSign,
  Link,
  Settings,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Eye,
  UserPlus,
  CreditCard,
  MoreHorizontal,
  Download,
  ArrowRight,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: BarChart3, label: 'Reports' },
  { icon: Box, label: 'Products' },
  { icon: CheckSquare, label: 'Task' },
  { icon: Star, label: 'Features' },
  { icon: Users, label: 'Users' },
  { icon: DollarSign, label: 'Pricing' },
  { icon: Link, label: 'Integrations' },
];

const settingsNavItems = [
  { icon: Settings, label: 'Settings' },
  { icon: FileText, label: 'Template pages' },
];

const stats = [
  { icon: Eye, title: 'Pageviews', value: '50.8K', change: '+14.5%', changeType: 'positive' },
  { icon: Users, title: 'Monthly users', value: '23.6K', change: '-2.5%', changeType: 'negative' },
  { icon: UserPlus, title: 'New sign ups', value: '756', change: '+3.7%', changeType: 'positive' },
  { icon: CreditCard, title: 'Subscriptions', value: '2.3K', change: '+1.2%', changeType: 'positive' },
];

const totalRevenueData = [
  { name: 'Jan', revenue: 60000, expenses: 40000 },
  { name: 'Feb', revenue: 75000, expenses: 50000 },
  { name: 'Mar', revenue: 90000, expenses: 60000 },
  { name: 'Apr', revenue: 110000, expenses: 70000 },
  { name: 'May', revenue: 100000, expenses: 75000 },
  { name: 'Jun', revenue: 125200, expenses: 80000 },
  { name: 'Jul', revenue: 140000, expenses: 90000 },
  { name: 'Aug', revenue: 160000, expenses: 100000 },
  { name: 'Sep', revenue: 150000, expenses: 95000 },
  { name: 'Oct', revenue: 170000, expenses: 110000 },
  { name: 'Nov', revenue: 190000, expenses: 120000 },
  { name: 'Dec', revenue: 210000, expenses: 130000 },
];

const totalProfitData = Array.from({ length: 12 }, (_, i) => ({
  time: `${i + 8} AM`,
  profit: Math.floor(Math.random() * 3000 + 1000),
}));

const totalSessionsData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

const usersByDeviceData = [
  { name: 'Desktop users', value: 15624, fill: 'var(--color-chart-1)' },
  { name: 'Phone app users', value: 5546, fill: 'var(--color-chart-2)' },
  { name: 'Laptop users', value: 2478, fill: 'var(--color-chart-3)' },
];

const recentOrdersData = [
  { order: '#1132', date: 'Dec 30, 10:00 AM', status: 'Paid', total: '$320.40' },
  { order: '#1131', date: 'Dec 29, 12:54 AM', status: 'Pending', total: '$117.34' },
  { order: '#1130', date: 'Dec 28, 02:32 PM', status: 'Pending', total: '$562.16' },
  { order: '#1129', date: 'Dec 28, 02:32 PM', status: 'Paid', total: '$350.82' },
  { order: '#1127', date: 'Dec 26, 9:45 AM', status: 'Paid', total: '$64.80' },
];

const usersByCountryData = [
  { country: 'United states', percentage: 30, color: 'bg-primary' },
  { country: 'United Kingdom', percentage: 25, color: 'bg-cyan-400' },
  { country: 'Canada', percentage: 20, color: 'bg-green-400' },
  { country: 'Australia', percentage: 15, color: 'bg-yellow-400' },
  { country: 'Spain', percentage: 10, color: 'bg-orange-400' },
];


export default function DashboardPage() {
  return (
    <div className="bg-background text-foreground font-sans flex min-h-screen">
      <aside className="w-64 bg-card flex-col border-r border-border hidden lg:flex">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg"></div>
            <h1 className="text-xl font-bold font-headline">Dashdark X</h1>
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search for..." className="pl-9 bg-background" />
          </div>
          <nav className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground px-2 mb-1">All pages</span>
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? 'secondary' : 'ghost'}
                className="justify-start gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.label === 'Dashboard' && <ChevronDown className="w-4 h-4 ml-auto" />}
              </Button>
            ))}
            <div className='mt-4'>
              {settingsNavItems.map((item, index) => (
                <Button
                  key={index}
                  variant='ghost'
                  className="justify-start gap-2 w-full"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                   <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              ))}
            </div>
          </nav>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="John Carter" />
              <AvatarFallback>JC</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">John Carter</p>
              <p className="text-xs text-muted-foreground">Account settings</p>
            </div>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Get template <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-headline">Welcome back, John</h2>
            <p className="text-muted-foreground">Measure your advertising ROI and report website traffic.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export data</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><ArrowRight className="w-4 h-4 mr-2" /> Create report</Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
          <Card className="lg:col-span-2 bg-card">
            <CardHeader>
              <CardTitle>Total revenue</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={{}} className="w-full h-[300px]">
                <AreaChart data={totalRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0}/>
                    </linearGradient>
                     <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-6">
            <Card className="flex-1 bg-card">
              <CardHeader>
                <CardTitle>Total profit</CardTitle>
                <p className="text-2xl font-bold">$144.6K <span className="text-sm text-green-500 font-normal">+18.5%</span></p>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="w-full h-[100px]">
                  <BarChart data={totalProfitData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Tooltip content={<ChartTooltipContent indicator="dot" hideLabel />} />
                    <Bar dataKey="profit" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="flex-1 bg-card">
              <CardHeader>
                <CardTitle>Total sessions</CardTitle>
                 <p className="text-2xl font-bold">400 <span className="text-sm text-green-500 font-normal">+2.6%</span></p>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={{}} className="w-full h-[100px]">
                  <AreaChart data={totalSessionsData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                     <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip content={<ChartTooltipContent indicator="dot" hideLabel />} />
                    <Area type="monotone" dataKey="uv" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorSessions)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="my-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-headline">Reports overview</h3>
                 <div className="flex items-center gap-2">
                    <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export data</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground"><ArrowRight className="w-4 h-4 mr-2" /> Create report</Button>
                </div>
            </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="xl:col-span-1 bg-card">
              <CardHeader>
                <CardTitle>Users by device</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="w-full h-[250px] mx-auto">
                    <PieChart>
                      <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                      <Pie data={usersByDeviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={100} cornerRadius={5} paddingAngle={2} startAngle={90} endAngle={450}>
                        {usersByDeviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="text-center mt-[-100px] mb-[70px]">
                  <p className="text-3xl font-bold">23,648</p>
                  <p className="text-sm text-muted-foreground">Users by device</p>
                </div>
                <div className="space-y-2">
                  {usersByDeviceData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="xl:col-span-2 bg-card">
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrdersData.map((order) => (
                      <TableRow key={order.order}>
                        <TableCell className="font-medium">{order.order}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Paid' ? 'default' : 'secondary'} className={order.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{order.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="xl:col-span-3 bg-card">
              <CardHeader>
                  <CardTitle>Users by country</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  {usersByCountryData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.country}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                 <div className="md:col-span-2 relative">
                    <Image src="https://placehold.co/800x400.png" width={800} height={400} alt="World map" className="object-contain" data-ai-hint="world map dots" />
                 </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

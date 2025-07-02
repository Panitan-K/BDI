
'use client';

import React, { useMemo, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, AreaChart, Area, Cell, LabelList, PieChart, Pie, ComposedChart, Line, LineChart, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Building, Briefcase, TrendingUp, XIcon, Maximize2, PiggyBank, Landmark, Bot, LayoutList, Lightbulb, CheckCircle2, Scaling, ShieldCheck, Split, CircleDollarSign, Target, List } from 'lucide-react';
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
    sources: { p1: { gov: 60, priv: 40 }, p2: { gov: 45, priv: 55 } },
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

const popoverDetailData = {
  project1: {
    economicImpact: {
      title: 'Detailed Economic Outlook',
      sections: [
        { heading: 'Overall Projection', text: 'This project is forecast to contribute a sustained +2.8% to the regional GDP over the next decade.' },
        { heading: 'Sector-Specific Growth', list: ['Tourism & Hospitality: +4.5%', 'Trade & Logistics: +3.2%', 'Industrial & Manufacturing: +2.5%', 'Real Estate & Commercial: +1.8%'] },
        { heading: 'Economic Multiplier Effect', text: 'For every ฿1 billion invested, an additional ฿1.8 billion in economic activity is expected to be generated in related industries.' },
        { heading: 'Methodology', text: 'The forecast is based on a Computable General Equilibrium (CGE) model, analyzing the impact of reduced travel times, increased freight capacity, and enhanced labor market access.' },
      ],
    },
    logisticFlow: {
      title: 'Enhanced Freight & Transit Capabilities',
      sections: [
        {
          heading: 'Increased Capacity',
          text: "The high-speed rail will handle an additional 4.5 million tons of freight annually, marking a +15% increase in the region's total freight volume.",
        },
        {
          heading: 'Time Savings',
          timeSavings: [
            {
              location: 'Bangkok to Rayong',
              detail: 'Transit time for goods will be reduced from 4-6 hours by truck to just 90 minutes by rail.',
            },
            {
              location: 'Laem Chabang Port to Industrial Estates',
              detail: 'Connectivity will be reduced to under 60 minutes.',
            },
          ],
        },
        {
          heading: 'Key Commodities',
          text: 'Primary goods expected to shift to rail include agricultural products (fruits, rubber), automotive parts, electronics, and consumer goods.',
        },
        {
          heading: 'Cost Efficiency',
          text: 'Shifting to rail is projected to reduce logistics costs by 12-18% compared to road transport, enhancing the competitiveness of Thai exports.',
        },
      ],
    },
    environmentalScore: {
        title: 'Environmental Impact Analysis',
        sections: [
          { heading: 'Overall Score: 72/100', text: 'This score reflects a strong commitment to sustainability, balanced against the unavoidable impacts of large-scale construction. The project has received full approval from the Environmental Impact Assessment (EIA) board.' },
          { heading: 'Scoring Breakdown', list: ['Carbon Emissions Reduction: +85/100', 'Land Use Impact: -55/100', 'Noise & Vibration: 70/100', 'Biodiversity Protection: +78/100'] },
        ],
    },
    investmentSuitability: {
        title: 'Investment Profile & Risk Assessment',
        sections: [
          { heading: 'Overall Score: 79/100', text: 'Indicates a highly favorable investment climate, supported by strong government backing and robust economic fundamentals.' },
          { heading: 'Scoring Breakdown', list: ['Political & Regulatory Stability: 88/100', 'Market Demand: 82/100', 'Financial Viability: 75/100', 'Risk Mitigation: 71/100'] },
        ],
    },
    jobsCreated: {
        title: 'Employment Generation Details',
        sections: [
          { heading: 'Total Jobs: 12,200', text: 'This project will create a significant number of both temporary and permanent jobs across various sectors.' },
          { heading: 'Job Breakdown', list: ['Construction: 4,500 jobs', 'Services: 3,200 jobs', 'Logistics: 2,700 jobs', 'Manufacturing: 1,800 jobs'] },
        ],
    },
    regionalDistribution: {
        title: 'Allocation of Resources & Benefits',
        sections: [
            { heading: 'Objective', text: 'To ensure equitable growth and connect economic hubs with developing areas.' },
            { heading: 'Benefit Distribution', list: ['South: 40%', 'East: 30%', 'North: 15%', 'West: 15%'] },
        ],
    },
    financing: {
        title: 'Detailed Financial Structure',
        sections: [
          { heading: 'Total Cost: ฿150 Billion', list: ['Civil Works & Construction: ฿75B (50%)', 'Rolling Stock (Trains): ฿30B (20%)', 'Signaling & Electrification: ฿22.5B (15%)', 'Land Acquisition: ฿15B (10%)', 'Contingency: ฿7.5B (5%)'] },
          { heading: 'Funding Model', text: 'Government (60% - ฿90B) and Private (40% - ฿60B) via a Public-Private Partnership (PPP) Net Cost model.' },
          { heading: 'Financial Metrics', list: ['Return on Investment (ROI): 12.5%', 'Payback Period: 8 Years'] },
        ],
    },
    socioEconomic: {
        title: 'Community & Social Development',
        sections: [
          { heading: 'Objective', text: 'To improve quality of life and reduce inequality across the Eastern Economic Corridor.' },
          { heading: 'Impact Metrics', list: ['Household Income: +3.2%', 'Poverty Reduction: +1.5%', 'Regional Disparity: Decreasing'] },
        ],
    },
    predictive: {
        title: 'Predictive Analytics & Future Trends',
        sections: [
          { heading: 'Land Price Trend (+2.1% Annually)', text: 'Land values within a 5km radius of new stations are projected to increase. Areas around major interchanges may see appreciation as high as 4-5% annually.' },
          { heading: 'New Business Registrations (425 Annually)', text: 'An average of 425 new businesses are expected to be registered annually in the three years following the line\'s opening.' },
          { heading: 'Skilled Labor Demand (38.2k)', text: 'A projected demand for 38,200 skilled workers will be created over the project\'s first decade.' },
        ],
    }
  }
  // NOTE: In a real app, this would be distinct data. For this demo, we'll reuse and slightly modify P1's data.
  ,project2: {
    economicImpact: {
        title: 'Detailed Economic Outlook (P2)',
        sections: [
          { heading: 'Overall Projection', text: 'This project is forecast to contribute a sustained +1.2% to the regional GDP over the next decade.' },
        ],
      },
      logisticFlow: {
        title: 'Enhanced Freight & Transit Capabilities (P2)',
        sections: [
          {
            heading: 'Increased Capacity',
            text: "The land bridge will handle an additional 8 million tons of freight annually, marking a +8% increase in the region's total freight volume.",
          },
          {
            heading: 'Time Savings',
            timeSavings: [
              {
                location: 'Gulf of Thailand to Andaman Sea',
                detail: 'Maritime transit time reduced from 2-3 days (via Strait of Malacca) to under 12 hours via the land bridge.',
              },
            ],
          },
        ],
      },
      environmentalScore: {
        title: 'Environmental Impact Analysis (P2)',
        sections: [
            { heading: 'Overall Score: 85/100', text: 'This high score reflects a focus on marine and coastal ecosystem preservation.' },
        ],
    },
    investmentSuitability: {
        title: 'Investment Profile & Risk Assessment (P2)',
        sections: [
            { heading: 'Overall Score: 68/100', text: 'A moderate investment profile, reflecting higher construction complexity but significant long-term strategic value.' },
        ],
    },
    jobsCreated: {
        title: 'Employment Generation Details (P2)',
        sections: [
          { heading: 'Total Jobs: 13,300', text: 'This project will create a significant number of both temporary and permanent jobs across various sectors.' },
        ],
    },
    regionalDistribution: {
        title: 'Allocation of Resources & Benefits (P2)',
        sections: [
            { heading: 'Objective', text: 'To create a new strategic trade route bypassing the Strait of Malacca.' },
        ],
    },
    financing: {
        title: 'Detailed Financial Structure (P2)',
        sections: [
          { heading: 'Total Cost: ฿350 Billion', list: ['Port Construction: ฿150B (43%)', 'Land Infrastructure: ฿100B (28%)', 'Contingency & Other: ฿100B (29%)'] },
        ],
    },
    socioEconomic: {
        title: 'Community & Social Development (P2)',
        sections: [
          { heading: 'Objective', text: 'To energize the economy of southern provinces.' },
        ],
    },
    predictive: {
        title: 'Predictive Analytics & Future Trends (P2)',
        sections: [
          { heading: 'Land Price Trend (+1.3% Annually)', text: 'Moderate land value increase expected.' },
        ],
    }
  }
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
    aiRecommendation: 'AI Investment Recommendation',
    p1analysis: 'shows superior short-term economic impact and job creation. However, its lower environmental score requires careful mitigation planning.',
    p2analysis: 'offers greater long-term strategic value for logistics and has a better environmental profile, but with a higher initial cost and longer payback period.',
    recommendation: 'Recommendation:',
    recommendationDetail: 'For immediate economic stimulus, Project 1 is favorable. For long-term national logistics strategy and sustainability, Project 2 presents a stronger case despite higher upfront investment.'
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
    recommendationDetail: 'สำหรับการกระตุ้นเศรษฐกิจในทันที โปรเจกต์ 1 มีความน่าสนใจมากกว่า สำหรับกลยุทธ์โลจิสติกส์ของประเทศในระยะยาวและความยั่งยืน โปรเจกต์ 2 เป็นกรณีที่แข็งแกร่งกว่าแม้จะมีการลงทุนเริ่มต้นที่สูงกว่า'
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
    'Time Savings': CheckCircle2,
    'Key Commodities': List,
    'Cost Efficiency': CircleDollarSign,
    'Overall Score': Target,
    'Scoring Breakdown': LayoutList,
    'Investment Profile & Risk Assessment': ShieldCheck,
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
                      {section.text && <p className="text-xs text-muted-foreground ml-6">{section.text}</p>}
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
}

export function NliRightSidebar({ activeProject, isComparing, selectedRegion, onClearRegion, language, activeParameters = [], style }: NliRightSidebarProps) {
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
    if (isComparing || selectedRegion) return null; // Details not shown for comparison/region view yet
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
    const gap = 16;
  
    // Position the panel to the left of the sidebar with a gap.
    const x = sidebarRect.left - popoverWidth - gap;
  
    // Start with a position aligned with the top of the sidebar.
    let y = sidebarRect.top;
  
    // Define panel height for collision detection.
    const popoverHeight = 380; // Approximate height of the draggable panel
  
    // If the panel would go off-screen at the bottom, adjust its position upwards.
    if (y + popoverHeight > window.innerHeight - gap) {
      y = window.innerHeight - popoverHeight - gap;
    }
  
    // Ensure the panel doesn't go off the top of the screen if the window is very short.
    if (y < gap) {
      y = gap;
    }
  
    setActivePopover({ key, position: { x, y } });
  };
  

  const popoverDataForKey = useMemo(() => {
    if (!activePopover || !detailData) return null;
    return detailData[activePopover.key as keyof typeof detailData] || null;
  }, [activePopover, detailData]);


  const t = translations[language as keyof typeof translations] || translations.en;
  
  const title = React.useMemo(() => {
    if (isComparing) {
      return language === 'en' ? 'Comparison: P1 vs P2' : 'เปรียบเทียบ: P1 vs P2';
    }
    if (selectedRegion && regionalMockData[selectedRegion]) {
      const regionData = regionalMockData[selectedRegion];
      return language === 'en' ? regionData.name : regionData.name_th;
    }
    const projectData = activeProject === 'project1' ? project1Data : project2Data;
    return language === 'en' ? projectData.name : projectData.name_th;
  }, [isComparing, selectedRegion, activeProject, language]);

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
              {selectedRegion && <Button variant="ghost" size="icon" className='h-6 w-6' onClick={onClearRegion}><XIcon className='h-4 w-4'/></Button>}
            </div>
        </div>
        <ScrollArea className="flex-1 -mr-2 pr-2">
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



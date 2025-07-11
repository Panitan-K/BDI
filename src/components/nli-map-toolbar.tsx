
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Layers, Ruler, Pen, MousePointerSquareDashed, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const translations = {
    en: {
        basemap: 'Basemap',
        basemapTitle: 'Change Basemap',
        basemapDesc: 'Select a different background map style, such as streets, satellite, or outdoors.',
        measureTitle: 'Measure Tool',
        measureDesc: 'Measure distances and areas directly on the map.',
        drawTitle: 'Draw Tool',
        drawDesc: 'Draw points, lines, and polygons to add or highlight features.',
        selectTitle: 'Select Tool',
        selectDesc: 'Select and interact with features already on the map to view their data.',
    },
    th: {
        basemap: 'แผนที่ฐาน',
        basemapTitle: 'เปลี่ยนแผนที่ฐาน',
        basemapDesc: 'เลือกสไตล์แผนที่พื้นหลังอื่น เช่น ถนน, ดาวเทียม, หรือ ภูมิประเทศ',
        measureTitle: 'เครื่องมือวัด',
        measureDesc: 'วัดระยะทางและพื้นที่บนแผนที่โดยตรง',
        drawTitle: 'เครื่องมือวาด',
        drawDesc: 'วาดจุด, เส้น, และรูปหลายเหลี่ยมเพื่อเพิ่มหรือเน้นคุณลักษณะ',
        selectTitle: 'เครื่องมือเลือก',
        selectDesc: 'เลือกและโต้ตอบกับคุณลักษณะบนแผนที่เพื่อดูข้อมูล',
    }
};

interface NliMapToolbarProps {
  onBasemapChange: (styleUrl: string) => void;
  activeTool: string | null;
  onToolSelect: (toolName: string) => void;
  language: string;
}

const basemaps = [
  { name: 'DataViz Dark', url: 'https://api.maptiler.com/maps/dataviz-dark/style.json' },
  { name: 'Streets', url: 'https://api.maptiler.com/maps/streets-v2-dark/style.json' },
  { name: 'Outdoor', url: 'https://api.maptiler.com/maps/outdoor-v2/style.json' },
  { name: 'Satellite', url: 'https://api.maptiler.com/maps/satellite/style.json' },
];

const tools = [
    { name: 'Measure', icon: Ruler, titleEn: 'Measure Tool', titleTh: 'เครื่องมือวัด', descEn: 'Measure distances and areas directly on the map.', descTh: 'วัดระยะทางและพื้นที่บนแผนที่โดยตรง' },
    { name: 'Draw', icon: Pen, titleEn: 'Draw Tool', titleTh: 'เครื่องมือวาด', descEn: 'Draw points, lines, and polygons to add or highlight features.', descTh: 'วาดจุด, เส้น, และรูปหลายเหลี่ยมเพื่อเพิ่มหรือเน้นคุณลักษณะ' },
    { name: 'Select', icon: MousePointerSquareDashed, titleEn: 'Select Tool', titleTh: 'เครื่องมือเลือก', descEn: 'Select and interact with features already on the map to view their data.', descTh: 'เลือกและโต้ตอบกับคุณลักษณะบนแผนที่เพื่อดูข้อมูล' },
];

export function NliMapToolbar({ onBasemapChange, activeTool, onToolSelect, language }: NliMapToolbarProps) {
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="glass-panel text-foreground h-8">
                <Layers className="h-4 w-4 mr-2" />
                {t.basemap}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-left">
            <p className="font-bold">{t.basemapTitle}</p>
            <p className="text-muted-foreground">{t.basemapDesc}</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent>
          {basemaps.map((basemap) => (
            <DropdownMenuItem key={basemap.name} onClick={() => onBasemapChange(basemap.url)}>
              {basemap.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "text-foreground hover:bg-accent hover:text-primary h-8 w-8",
                    activeTool === tool.name && "bg-accent text-primary"
                )}
                onClick={() => onToolSelect(tool.name)}
                >
                <tool.icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-left">
                <p className="font-bold">{language === 'en' ? tool.titleEn : tool.titleTh}</p>
                <p className="text-muted-foreground">{language === 'en' ? tool.descEn : tool.descTh}</p>
            </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

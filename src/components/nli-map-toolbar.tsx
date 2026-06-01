
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Layers, Ruler, Pen, MousePointerSquareDashed, ChevronDown, Baseline, ZoomIn, ZoomOut, Compass, Home, Trash2, View, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from './ui/separator';

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
        scaleTitle: 'Toggle Scale',
        scaleDesc: 'Show or hide the map scale control.',
        zoomInTitle: 'Zoom In',
        zoomInDesc: 'Increase the map magnification level.',
        zoomOutTitle: 'Zoom Out',
        zoomOutDesc: 'Decrease the map magnification level.',
        compassTitle: 'Reset North',
        compassDesc: 'Reset the map\'s rotation to face North.',
        homeTitle: 'Reset View',
        homeDesc: 'Return to the default map view.',
        clearTitle: 'Clear All',
        clearDesc: 'Remove all drawings and measurements from the map.',
        view3dTitle: 'Toggle 3D View',
        view3dDesc: 'Switch between 2D and 3D map perspectives.',
        coordsTitle: 'Toggle Coordinates',
        coordsDesc: 'Show or hide the mouse cursor\'s map coordinates.',
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
        scaleTitle: 'สลับมาตราส่วน',
        scaleDesc: 'แสดงหรือซ่อนตัวควบคุมมาตราส่วนแผนที่',
        zoomInTitle: 'ขยาย',
        zoomInDesc: 'เพิ่มระดับการขยายของแผนที่',
        zoomOutTitle: 'ย่อ',
        zoomOutDesc: 'ลดระดับการขยายของแผนที่',
        compassTitle: 'รีเซ็ตทิศเหนือ',
        compassDesc: 'รีเซ็ตการหมุนของแผนที่ให้หันไปทางทิศเหนือ',
        homeTitle: 'รีเซ็ตมุมมอง',
        homeDesc: 'กลับไปยังมุมมองแผนที่เริ่มต้น',
        clearTitle: 'ล้างทั้งหมด',
        clearDesc: 'ลบภาพวาดและการวัดทั้งหมดออกจากแผนที่',
        view3dTitle: 'สลับมุมมอง 3 มิติ',
        view3dDesc: 'สลับระหว่างมุมมองแผนที่ 2 มิติและ 3 มิติ',
        coordsTitle: 'สลับพิกัด',
        coordsDesc: 'แสดงหรือซ่อนพิกัดแผนที่ของเคอร์เซอร์เมาส์',
    }
};

interface NliMapToolbarProps {
  onBasemapChange: (styleUrl: string) => void;
  activeTool: string | null;
  onToolSelect: (toolName: string) => void;
  language: string;
}

const basemaps = [
  // ใช้ค่าสไตล์แบบสั้น (shorthand strings) เพื่อให้ SDK ดึงข้อมูลสไตล์พร้อม API key อัตโนมัติ
  { name: 'DataViz Dark', url: 'dataviz-dark' },
  { name: 'Streets', url: 'streets-v2' },
  { name: 'Outdoor', url: 'outdoor' },
  { name: 'Satellite', url: 'satellite' },
];

const tools = [
    { name: 'Measure', icon: Ruler, titleEn: translations.en.measureTitle, titleTh: translations.th.measureTitle, descEn: translations.en.measureDesc, descTh: translations.th.measureDesc },
    { name: 'Draw', icon: Pen, titleEn: translations.en.drawTitle, titleTh: translations.th.drawTitle, descEn: translations.en.drawDesc, descTh: translations.th.drawDesc },
    { name: 'Select', icon: MousePointerSquareDashed, titleEn: translations.en.selectTitle, titleTh: translations.th.selectTitle, descEn: translations.en.selectDesc, descTh: translations.th.selectDesc },
];

const utilityTools = [
    { name: 'ZoomIn', icon: ZoomIn, titleEn: translations.en.zoomInTitle, titleTh: translations.th.zoomInTitle, descEn: translations.en.zoomInDesc, descTh: translations.th.zoomInDesc, isAction: true },
    { name: 'ZoomOut', icon: ZoomOut, titleEn: translations.en.zoomOutTitle, titleTh: translations.th.zoomOutTitle, descEn: translations.en.zoomOutDesc, descTh: translations.th.zoomOutDesc, isAction: true },
    { name: 'Compass', icon: Compass, titleEn: translations.en.compassTitle, titleTh: translations.th.compassTitle, descEn: translations.en.compassDesc, descTh: translations.th.compassDesc, isAction: true },
    { name: 'Home', icon: Home, titleEn: translations.en.homeTitle, titleTh: translations.th.homeTitle, descEn: translations.en.homeDesc, descTh: translations.th.homeDesc, isAction: true },
    { name: 'Clear', icon: Trash2, titleEn: translations.en.clearTitle, titleTh: translations.th.clearTitle, descEn: translations.en.clearDesc, descTh: translations.th.clearDesc, isAction: true },
    { name: '3DView', icon: View, titleEn: translations.en.view3dTitle, titleTh: translations.th.view3dTitle, descEn: translations.en.view3dDesc, descTh: translations.th.view3dDesc },
    { name: 'Scale', icon: Baseline, titleEn: translations.en.scaleTitle, titleTh: translations.th.scaleTitle, descEn: translations.en.scaleDesc, descTh: translations.th.scaleDesc },
    { name: 'Coords', icon: MousePointer, titleEn: translations.en.coordsTitle, titleTh: translations.th.coordsTitle, descEn: translations.en.coordsDesc, descTh: translations.th.coordsDesc },
]

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

      <Separator orientation="vertical" className="h-6 mx-1" />

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
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      {utilityTools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
                <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "text-foreground hover:bg-accent hover:text-primary h-8 w-8",
                    activeTool === tool.name && !tool.isAction && "bg-accent text-primary"
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


'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Info, Layers, RefreshCw } from 'lucide-react';

const translations = {
  en: {
    title: 'Layer Settings',
    description: 'Customize the appearance and properties of the layer.',
    appearance: 'Appearance',
    layerInfo: 'Layer Info',
    layerName: 'Layer Name',
    attribution: 'Attribution',
    fillColor: 'Fill Color',
    opacity: 'Opacity',
    borderWidth: 'Border Width',
    displayType: 'Display Type',
    choropleth: 'Choropleth',
    heatmap: 'Heatmap',
    clusteredPoints: 'Clustered Points',
    layerActions: 'Layer Actions',
    bringToFront: 'Bring to Front',
    sendToBack: 'Send to Back',
    reloadLayer: 'Reload Layer',
    apply: 'Apply',
    cancel: 'Cancel',
  },
  th: {
    title: 'ตั้งค่าชั้นข้อมูล',
    description: 'ปรับแต่งลักษณะและคุณสมบัติของชั้นข้อมูล',
    appearance: 'ลักษณะ',
    layerInfo: 'ข้อมูลชั้นข้อมูล',
    layerName: 'ชื่อชั้นข้อมูล',
    attribution: 'ที่มา',
    fillColor: 'สีเติม',
    opacity: 'ความทึบ',
    borderWidth: 'ความกว้างเส้นขอบ',
    displayType: 'ประเภทการแสดงผล',
    choropleth: 'แผนที่โคโรเพลท',
    heatmap: 'แผนที่ความร้อน',
    clusteredPoints: 'จุดแบบกลุ่ม',
    layerActions: 'การกระทำของชั้นข้อมูล',
    bringToFront: 'นำมาไว้ข้างหน้าสุด',
    sendToBack: 'ส่งไปไว้ข้างหลังสุด',
    reloadLayer: 'โหลดชั้นข้อมูลใหม่',
    apply: 'นำไปใช้',
    cancel: 'ยกเลิก',
  }
};

const colorSwatches = ['#4A69F6', '#FF6B6B', '#4ECDC4', '#FCE525', '#9B59B6'];

interface NliLayerSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  layerName: string | null;
  language: string;
}

export function NliLayerSettingsDialog({ isOpen, onOpenChange, layerName, language }: NliLayerSettingsDialogProps) {
  const [opacity, setOpacity] = useState([0.7]);
  const [borderWidth, setBorderWidth] = useState([1]);
  const t = translations[language as keyof typeof translations] || translations.en;

  if (!layerName) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel text-foreground max-w-md p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{t.title}: {layerName}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appearance"><Paintbrush className="mr-2 h-4 w-4" />{t.appearance}</TabsTrigger>
            <TabsTrigger value="info"><Info className="mr-2 h-4 w-4" />{t.layerInfo}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4 py-4">
            <div>
              <Label>{t.fillColor}</Label>
              <div className="flex gap-2 mt-2">
                {colorSwatches.map(color => (
                  <Button key={color} className="h-8 w-8 rounded-full border-2 border-transparent focus:border-primary" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <div>
              <Label>{t.opacity}</Label>
              <Slider
                defaultValue={opacity}
                max={1}
                step={0.1}
                onValueChange={setOpacity}
                className="mt-2"
              />
            </div>
             <div>
              <Label>{t.borderWidth}</Label>
              <Slider
                defaultValue={borderWidth}
                max={5}
                step={0.5}
                onValueChange={setBorderWidth}
                className="mt-2"
              />
            </div>
            <div>
              <Label>{t.displayType}</Label>
               <RadioGroup defaultValue="choropleth" className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <RadioGroupItem value="choropleth" id="choropleth" className="peer sr-only" />
                    <Label htmlFor="choropleth" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-xs">
                     {t.choropleth}
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="heatmap" id="heatmap" className="peer sr-only" />
                     <Label htmlFor="heatmap" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-xs">
                     {t.heatmap}
                    </Label>
                  </div>
               </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4 py-4">
            <div>
              <Label htmlFor="layer-name">{t.layerName}</Label>
              <Input id="layer-name" defaultValue={layerName} className="mt-2 bg-secondary" />
            </div>
            <div>
              <Label htmlFor="layer-attribution">{t.attribution}</Label>
              <Input id="layer-attribution" placeholder="e.g., OpenStreetMap contributors" className="mt-2 bg-secondary" />
            </div>
             <div>
              <Label>{t.layerActions}</Label>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm"><Layers className="mr-2 h-4 w-4"/>{t.bringToFront}</Button>
                <Button variant="outline" size="sm"><Layers className="mr-2 h-4 w-4"/>{t.sendToBack}</Button>
                <Button variant="outline" size="sm"><RefreshCw className="mr-2 h-4 w-4"/>{t.reloadLayer}</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-6 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
          <Button onClick={() => onOpenChange(false)}>{t.apply}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

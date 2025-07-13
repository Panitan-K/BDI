
'use client';

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Route, 
  TrainTrack, 
  Plane, 
  Ship, 
  Map, 
  Trees, 
  Tractor, 
  Building2, 
  Factory, 
  LandPlot,
  LucideIcon,
  Layers3,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NliLayerSettingsDialog } from './nli-layer-settings-dialog';

interface Layer {
  name: string;
  icon: LucideIcon;
}

interface LayerCategory {
  [key: string]: Layer[];
}

const translations = {
  en: {
    dataLayers: 'Data Layers',
    addInfrastructure: 'Add Infrastructure',
    categories: {
      'Infrastructure': 'Infrastructure',
      'Land Use': 'Land Use',
      'Administrative': 'Administrative',
      'Economic': 'Economic',
      'Analysis': 'Analysis',
    },
    layers: {
      'Roads': 'Roads', 'Railways': 'Railways', 'Airports': 'Airports', 'Ports': 'Ports',
      'Land Use Plan': 'Land Use Plan', 'Forest Zones': 'Forest Zones', 'Agricultural Zones': 'Agricultural Zones',
      'Province': 'Province', 'District': 'District', 'Sub-district': 'Sub-district',
      'Industrial Zones': 'Industrial Zones', 'Special Economic Corridors': 'Special Economic Corridors',
      'Population Density': 'Population Density',
    },
    layerSettings: 'Layer Settings',
  },
  th: {
    dataLayers: 'ชั้นข้อมูล',
    addInfrastructure: 'เพิ่มโครงสร้างพื้นฐาน',
    categories: {
      'Infrastructure': 'โครงสร้างพื้นฐาน',
      'Land Use': 'การใช้ที่ดิน',
      'Administrative': 'เขตการปกครอง',
      'Economic': 'เศรษฐกิจ',
      'Analysis': 'การวิเคราะห์',
    },
    layers: {
      'Roads': 'ถนน', 'Railways': 'ทางรถไฟ', 'Airports': 'สนามบิน', 'Ports': 'ท่าเรือ',
      'Land Use Plan': 'ผังการใช้ประโยชน์ที่ดิน', 'Forest Zones': 'เขตป่าไม้', 'Agricultural Zones': 'เขตเกษตรกรรม',
      'Province': 'จังหวัด', 'District': 'อำเภอ', 'Sub-district': 'ตำบล',
      'Industrial Zones': 'เขตอุตสาหกรรม', 'Special Economic Corridors': 'ระเบียงเศรษฐกิจพิเศษ',
      'Population Density': 'ความหนาแน่นของประชากร',
    },
    layerSettings: 'ตั้งค่าชั้นข้อมูล',
  }
};


const dataLayerConfig: LayerCategory = {
  'Infrastructure': [
    { name: 'Roads', icon: Route },
    { name: 'Railways', icon: TrainTrack },
    { name: 'Airports', icon: Plane },
    { name: 'Ports', icon: Ship },
  ],
  'Land Use': [
    { name: 'Land Use Plan', icon: Map },
    { name: 'Forest Zones', icon: Trees },
    { name: 'Agricultural Zones', icon: Tractor },
  ],
  'Administrative': [
    { name: 'Province', icon: Building2 },
    { name: 'District', icon: Building2 },
    { name: 'Sub-district', icon: Building2 },
  ],
  'Economic': [
    { name: 'Industrial Zones', icon: Factory },
    { name: 'Special Economic Corridors', icon: LandPlot },
  ],
  'Analysis': [
    { name: 'Population Density', icon: Layers3 },
  ]
};

interface NliLeftSidebarProps {
  activeLayers: Record<string, boolean>;
  onLayerToggle: (layerName: string, isActive: boolean) => void;
  language: string;
  style?: React.CSSProperties;
}

export function NliLeftSidebar({ activeLayers, onLayerToggle, language, style }: NliLeftSidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const t = translations[language as keyof typeof translations] || translations.en;
  
  const openSettings = (layerName: string) => {
    setSelectedLayer(layerName);
    setIsSettingsOpen(true);
  }

  return (
    <>
      <aside
        style={style}
        className={cn(
          'p-3 flex flex-col glass-panel !rounded-lg z-10 shrink-0'
        )}
      >
          <div className="flex justify-between items-center mb-3 px-1">
            <h2 className="text-base font-bold text-foreground">{t.dataLayers}</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" title={t.addInfrastructure}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 -mr-3 pr-3">
            <div className="space-y-4 px-1">
              {Object.entries(dataLayerConfig).map(([category, layers]) => (
                <div key={category}>
                  <h3 className="font-semibold text-muted-foreground mb-2 text-sm">{t.categories[category as keyof typeof t.categories]}</h3>
                  <div className="space-y-2">
                    {layers.map((layer) => (
                      <div key={layer.name} className="flex items-center justify-between p-1 rounded-md hover:bg-accent group">
                        <div className="flex items-center gap-3">
                          <layer.icon className="h-4 w-4 text-primary" />
                          <span className="text-xs text-foreground">{t.layers[layer.name as keyof typeof t.layers]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                            onClick={() => openSettings(layer.name)}
                            aria-label={t.layerSettings}
                          >
                              <Settings className="h-3 w-3" />
                          </Button>
                          <Switch 
                            checked={activeLayers[layer.name]}
                            onCheckedChange={(checked) => onLayerToggle(layer.name, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
      </aside>
      <NliLayerSettingsDialog 
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        layerName={selectedLayer}
        language={language}
      />
    </>
  );
}

    
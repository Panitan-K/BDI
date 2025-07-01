'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  Ruler,
  Pen,
  MousePointerSquare,
  GalleryVertical
} from 'lucide-react';

const dataLayers = {
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
  ]
};

const tools = [
  { name: 'Measure', icon: Ruler },
  { name: 'Draw', icon: Pen },
  { name: 'Select', icon: MousePointerSquare },
  { name: 'Basemap Gallery', icon: GalleryVertical },
];

export function NliLeftSidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside
      className={cn(
        'flex flex-col glass-panel !rounded-none transition-all duration-300 ease-in-out z-20',
        isOpen ? 'w-80 p-4' : 'w-0 p-0'
      )}
      style={{ overflow: 'hidden' }}
    >
      <div className="flex-1 min-h-0">
        <h2 className="text-lg font-bold text-white mb-4">Data Layers & Tools</h2>
        <ScrollArea className="h-[calc(100%-80px)]">
          <div className="space-y-6 pr-4">
            {Object.entries(dataLayers).map(([category, layers]) => (
              <div key={category}>
                <h3 className="font-semibold text-muted-foreground mb-3">{category}</h3>
                <div className="space-y-3">
                  {layers.map((layer) => (
                    <div key={layer.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <layer.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm text-white">{layer.name}</span>
                      </div>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex justify-around">
          {tools.map((tool) => (
            <Button key={tool.name} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <tool.icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}

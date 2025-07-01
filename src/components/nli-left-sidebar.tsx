'use client';

import React from 'react';
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
  Layers3
} from 'lucide-react';

interface Layer {
  name: string;
  icon: LucideIcon;
}

interface LayerCategory {
  [key: string]: Layer[];
}

const dataLayers: LayerCategory = {
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
}

export function NliLeftSidebar({ activeLayers, onLayerToggle }: NliLeftSidebarProps) {
  return (
    <aside
      className={cn(
        'w-72 p-3 flex flex-col glass-panel !rounded-lg transition-all duration-300 ease-in-out z-10 shrink-0'
      )}
    >
        <h2 className="text-base font-bold text-white mb-3 px-1">Data Layers</h2>
        <ScrollArea className="flex-1 -mr-3 pr-3">
          <div className="space-y-4 px-1">
            {Object.entries(dataLayers).map(([category, layers]) => (
              <div key={category}>
                <h3 className="font-semibold text-muted-foreground mb-2 text-sm">{category}</h3>
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div key={layer.name} className="flex items-center justify-between p-1 rounded-md hover:bg-white/5">
                      <div className="flex items-center gap-3">
                        <layer.icon className="h-4 w-4 text-primary" />
                        <span className="text-xs text-white">{layer.name}</span>
                      </div>
                      <Switch 
                        checked={activeLayers[layer.name]}
                        onCheckedChange={(checked) => onLayerToggle(layer.name, checked)}
                        disabled={layer.name === 'Province'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
    </aside>
  );
}

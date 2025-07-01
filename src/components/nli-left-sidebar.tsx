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
    { name: 'Population Density (3D)', icon: Layers3 },
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
        'w-80 p-4 flex flex-col glass-panel !rounded-lg transition-all duration-300 ease-in-out z-20 shrink-0'
      )}
    >
        <h2 className="text-lg font-bold text-white mb-4">Data Layers</h2>
        <ScrollArea className="flex-1 -mr-4 pr-4">
          <div className="space-y-6">
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

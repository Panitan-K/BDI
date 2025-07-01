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

interface NliMapToolbarProps {
  onBasemapChange: (styleUrl: string) => void;
  activeTool: string | null;
  onToolSelect: (toolName: string) => void;
}

const basemaps = [
  { name: 'DataViz Dark', url: 'https://api.maptiler.com/maps/dataviz-dark/style.json' },
  { name: 'Streets', url: 'https://api.maptiler.com/maps/streets-v2-dark/style.json' },
  { name: 'Outdoor', url: 'https://api.maptiler.com/maps/outdoor-v2/style.json' },
  { name: 'Satellite', url: 'https://api.maptiler.com/maps/satellite/style.json' },
];

const tools = [
  { name: 'Measure', icon: Ruler },
  { name: 'Draw', icon: Pen },
  { name: 'Select', icon: MousePointerSquareDashed },
];

export function NliMapToolbar({ onBasemapChange, activeTool, onToolSelect }: NliMapToolbarProps) {
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
      <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            variant="ghost"
            size="sm"
            className={cn(
              "text-white hover:bg-accent hover:text-primary",
              activeTool === tool.name && "bg-accent text-primary"
            )}
            onClick={() => onToolSelect(tool.name)}
            title={tool.name}
          >
            <tool.icon className="h-4 w-4 mr-1" />
            {tool.name}
          </Button>
        ))}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="glass-panel text-white">
            <Layers className="h-4 w-4 mr-2" />
            Basemap
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {basemaps.map((basemap) => (
            <DropdownMenuItem key={basemap.name} onClick={() => onBasemapChange(basemap.url)}>
              {basemap.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

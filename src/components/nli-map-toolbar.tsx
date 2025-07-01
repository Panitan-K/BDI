'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Layers, Ruler, Pen, MousePointerSquareDashed, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface NliMapToolbarProps {
  onBasemapChange: (styleUrl: string) => void;
  activeTool: string | null;
  onToolSelect: (toolName: string) => void;
  is3D: boolean;
  on3DToggle: () => void;
}

const basemaps = [
  { name: 'DataViz Dark', url: 'https://api.maptiler.com/maps/dataviz-dark/style.json' },
  { name: 'Streets', url: 'https://api.maptiler.com/maps/streets-v2-dark/style.json' },
  { name: 'Outdoor', url: 'https://api.maptiler.com/maps/outdoor-v2/style.json' },
  { name: 'Satellite', url: 'https://api.maptiler.com/maps/satellite/style.json' },
];

const tools = [
    { name: 'Measure', icon: Ruler, title: 'Measure Tool', description: 'Measure distances and areas directly on the map.' },
    { name: 'Draw', icon: Pen, title: 'Draw Tool', description: 'Draw points, lines, and polygons to add or highlight features.' },
    { name: 'Select', icon: MousePointerSquareDashed, title: 'Select Tool', description: 'Select and interact with features already on the map to view their data.' },
];

export function NliMapToolbar({ onBasemapChange, activeTool, onToolSelect, is3D, on3DToggle }: NliMapToolbarProps) {
  return (
    <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="glass-panel text-white h-8">
                <Layers className="h-4 w-4 mr-2" />
                Basemap
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-left">
            <p className="font-bold">Change Basemap</p>
            <p className="text-muted-foreground">Select a different background map style, such as streets, satellite, or outdoors.</p>
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
                    "text-white hover:bg-accent hover:text-primary h-8 w-8",
                    activeTool === tool.name && "bg-accent text-primary"
                )}
                onClick={() => onToolSelect(tool.name)}
                >
                <tool.icon className="h-4 w-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-left">
                <p className="font-bold">{tool.title}</p>
                <p className="text-muted-foreground">{tool.description}</p>
            </TooltipContent>
        </Tooltip>
      ))}

        <Tooltip>
            <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8" onClick={on3DToggle}>
                <Globe className="h-4 w-4" />
            </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-left">
                <p className="font-bold">Toggle {is3D ? "2D" : "3D"} View</p>
                <p className="text-muted-foreground">Switch between a flat 2D map and an interactive 3D globe.</p>
            </TooltipContent>
        </Tooltip>
    </div>
  );
}

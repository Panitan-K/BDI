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
  { name: 'Measure', icon: Ruler },
  { name: 'Draw', icon: Pen },
  { name: 'Select', icon: MousePointerSquareDashed },
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
          <TooltipContent>
            <p>Change Basemap</p>
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
            <TooltipContent>
                <p>{tool.name} Tool</p>
            </TooltipContent>
        </Tooltip>
      ))}

        <Tooltip>
            <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8" onClick={on3DToggle}>
                <Globe className="h-4 w-4" />
            </Button>
            </TooltipTrigger>
            <TooltipContent>
            <p>Toggle {is3D ? "2D" : "3D"} View</p>
            </TooltipContent>
        </Tooltip>
    </div>
  );
}

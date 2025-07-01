'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NliHeader } from '@/components/nli-header';
import { NliLeftSidebar } from '@/components/nli-left-sidebar';
import { NliRightSidebar } from '@/components/nli-right-sidebar';
import { NliMap } from '@/components/nli-map';
import { NliMapToolbar } from '@/components/nli-map-toolbar';
import { AiChatModal } from '@/components/nli-ai-chat';
import { ChevronLeft, ChevronRight, Sparkles, Globe } from 'lucide-react';

export default function NliPlatformPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isAiChatOpen, setAiChatOpen] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [activeProject, setActiveProject] = useState('project1');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [basemapStyle, setBasemapStyle] = useState('https://api.maptiler.com/maps/dataviz-dark/style.json');

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    'Roads': false,
    'Railways': false,
    'Airports': false,
    'Ports': false,
    'Land Use Plan': false,
    'Forest Zones': false,
    'Agricultural Zones': false,
    'Province': false,
    'District': false,
    'Sub-district': false,
    'Industrial Zones': false,
    'Special Economic Corridors': false,
    'Population Density (3D)': false,
  });

  const handleLayerToggle = (layerName: string, isActive: boolean) => {
    setActiveLayers(prev => ({ ...prev, [layerName]: isActive }));
  };
  
  const handleToolSelect = (toolName: string) => {
    setActiveTool(prev => prev === toolName ? null : toolName);
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <NliHeader activeProject={activeProject} onProjectChange={setActiveProject} />
      <div className="flex flex-1 overflow-hidden transition-all duration-300">
        <NliLeftSidebar 
          isOpen={leftSidebarOpen} 
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
          activeTool={activeTool}
          onToolSelect={handleToolSelect}
        />

        <main className="flex-1 flex flex-col relative">
          <div className="absolute top-2 left-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="glass-panel hover:bg-background/80 rounded-full"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              {leftSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
          
          <NliMapToolbar 
             onBasemapChange={setBasemapStyle}
             activeTool={activeTool}
             onToolSelect={handleToolSelect}
          />
          
          <NliMap is3D={is3D} activeLayers={activeLayers} basemapStyle={basemapStyle} />

          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg glass-panel hover:bg-accent"
              onClick={() => setIs3D(!is3D)}
              title="Toggle 2D/3D View"
            >
              <Globe className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12 shadow-lg"
              onClick={() => setAiChatOpen(true)}
              title="Open AI Assistant"
            >
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </Button>
          </div>
          
          <div className="absolute top-2 right-2 z-10">
             <Button
              variant="ghost"
              size="icon"
              className="glass-panel hover:bg-background/80 rounded-full"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              {rightSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </main>
        
        <NliRightSidebar isOpen={rightSidebarOpen} activeProject={activeProject} />
      </div>
      <AiChatModal isOpen={isAiChatOpen} onOpenChange={setAiChatOpen} />
    </div>
  );
}

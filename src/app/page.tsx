'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NliHeader } from '@/components/nli-header';
import { NliLeftSidebar } from '@/components/nli-left-sidebar';
import { NliRightSidebar } from '@/components/nli-right-sidebar';
import { NliMap } from '@/components/nli-map';
import { NliMapToolbar } from '@/components/nli-map-toolbar';
import { AiChatModal } from '@/components/nli-ai-chat';
import { Share2, Link, Copy } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


function ShareDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share the link with others.",
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2"><Share2 /> Share Project</AlertDialogTitle>
          <AlertDialogDescription>
            Share a read-only link to your current project view, including selected layers and analysis.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
                <label htmlFor="link" className="sr-only">
                Link
                </label>
                <Input
                id="link"
                defaultValue={url}
                readOnly
                />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default function NliPlatformPage() {
  const [activeProject, setActiveProject] = useState('project1');
  const [isComparing, setIsComparing] = useState(false);
  const [isAiChatOpen, setAiChatOpen] = useState(false);
  const [isShareOpen, setShareOpen] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [basemapStyle, setBasemapStyle] = useState('https://api.maptiler.com/maps/dataviz-dark/style.json');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    'Roads': false,
    'Railways': false,
    'Airports': false,
    'Ports': false,
    'Land Use Plan': false,
    'Forest Zones': false,
    'Agricultural Zones': false,
    'Province': true, // Keep Province on by default for interaction
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

  const handleRegionSelect = (regionName: string | null) => {
    setSelectedRegion(regionName);
  }

  const handleProjectChange = (project: string) => {
    setActiveProject(project);
    setIsComparing(false);
  }

  const handleCompareToggle = () => {
    setIsComparing(prev => !prev);
    if (!isComparing) {
       // When turning compare on, we don't need a specific active project
    }
  }

  return (
    <div className={cn(
      "flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden",
      isFullscreen && "h-screen w-screen"
    )}>
      {!isFullscreen && (
        <NliHeader 
          activeProject={activeProject} 
          onProjectChange={handleProjectChange} 
          isComparing={isComparing}
          onCompareToggle={handleCompareToggle}
          onShare={() => setShareOpen(true)}
          onFullscreenToggle={() => setIsFullscreen(true)}
        />
      )}
      <div className={cn("flex flex-1 overflow-hidden transition-all duration-300", isFullscreen ? "p-0" : "p-4 gap-4")}>
        {!isFullscreen && <NliLeftSidebar 
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
        />}

        <main className="flex-1 flex flex-col relative rounded-lg overflow-hidden">
          <NliMapToolbar 
             onBasemapChange={setBasemapStyle}
             activeTool={activeTool}
             onToolSelect={handleToolSelect}
             is3D={is3D}
             on3DToggle={() => setIs3D(!is3D)}
             isFullscreen={isFullscreen}
             onFullscreenToggle={() => setIsFullscreen(prev => !prev)}
          />
          
          <NliMap 
            is3D={is3D} 
            activeLayers={activeLayers} 
            basemapStyle={basemapStyle} 
            activeTool={activeTool}
            onRegionClick={handleRegionSelect}
            selectedRegion={selectedRegion}
          />

          {!isFullscreen && (
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12 shadow-lg"
                onClick={() => setAiChatOpen(true)}
                title="Open AI Assistant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-primary-foreground h-6 w-6"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              </Button>
            </div>
          )}
        </main>
        
        {!isFullscreen && <NliRightSidebar 
          activeProject={activeProject} 
          isComparing={isComparing} 
          selectedRegion={selectedRegion}
          onClearRegion={() => setSelectedRegion(null)}
        />}
      </div>
      <AiChatModal isOpen={isAiChatOpen} onOpenChange={setAiChatOpen} />
      <ShareDialog isOpen={isShareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}

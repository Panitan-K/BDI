'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NliHeader } from '@/components/nli-header';
import { NliLeftSidebar } from '@/components/nli-left-sidebar';
import { NliRightSidebar } from '@/components/nli-right-sidebar';
import { NliMap } from '@/components/nli-map';
import { NliMapToolbar } from '@/components/nli-map-toolbar';
import { AiChatModal } from '@/components/nli-ai-chat';
import { Share2, Copy, Upload, Settings, SlidersHorizontal, Download, Layers, BookText, Table2, History, StickyNote, Bot } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


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
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
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
    if (isComparing) return;
    setActiveProject(project);
  }

  const handleCompareToggle = () => {
    setIsComparing(prev => !prev);
    if (!isComparing) {
      // When turning compare on, deselect any specific region
      setSelectedRegion(null);
    }
  }

  return (
    <div className={cn(
      "flex flex-col h-screen w-screen bg-background text-foreground",
      isFullscreen && "absolute inset-0 z-50"
    )}>
      {!isFullscreen && (
        <NliHeader 
          activeProject={activeProject} 
          onProjectChange={handleProjectChange} 
          isComparing={isComparing}
          onCompareToggle={handleCompareToggle}
          onShare={() => setShareOpen(true)}
          onFullscreenToggle={() => setIsFullscreen(prev => !prev)}
        />
      )}

      {/* Toolbars Row */}
      {!isFullscreen && (
          <div className="relative z-20 flex items-center justify-between px-2 py-1 border-b border-border/50 bg-secondary/20 shrink-0">
              <div className="flex items-center gap-1 w-auto">
                    <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <Upload className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Import Data</p>
                              <p className="text-muted-foreground">Upload and visualize your own geospatial data from KML, GeoJSON, or Shapefile formats.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <Settings className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Settings</p>
                              <p className="text-muted-foreground">Configure application preferences, map settings, and user profile.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <Layers className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Layer Control</p>
                              <p className="text-muted-foreground">Manage the visibility and properties of data layers on the map.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <BookText className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Legend</p>
                              <p className="text-muted-foreground">View the map legend to understand the symbols and colors used.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <Table2 className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Attribute Table</p>
                              <p className="text-muted-foreground">Inspect the data associated with map features in a tabular format.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
              </div>
              <div className="flex-1 flex justify-center">
                  <NliMapToolbar 
                      onBasemapChange={setBasemapStyle}
                      activeTool={activeTool}
                      onToolSelect={handleToolSelect}
                      is3D={is3D}
                      on3DToggle={() => setIs3D(!is3D)}
                  />
              </div>
              <div className="flex items-center gap-1 w-auto justify-end">
                    <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <SlidersHorizontal className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Parameters</p>
                              <p className="text-muted-foreground">Adjust variables and assumptions for analysis and simulation models.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <History className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Time-Series Slider</p>
                              <p className="text-muted-foreground">Animate and visualize how data changes across different time periods.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <StickyNote className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">User Notes</p>
                              <p className="text-muted-foreground">Create, view, and manage your annotations and notes on the map.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8">
                                    <Download className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Export Data</p>
                              <p className="text-muted-foreground">Download map data, analysis results, or export the current view as an image.</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-accent hover:text-primary h-8 w-8" onClick={() => setAiChatOpen(true)}>
                                    <Bot className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">Ask AI Assistant</p>
                              <p className="text-muted-foreground">Get insights, run complex analyses, and ask questions using natural language.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
              </div>
          </div>
      )}

      <div className={cn("flex flex-1 p-2 gap-2 transition-all duration-300", isFullscreen ? "p-0" : "p-2 gap-2")}>
        {!isFullscreen && <NliLeftSidebar 
          activeLayers={activeLayers}
          onLayerToggle={handleLayerToggle}
        />}

        <main className="flex-1 flex flex-col relative rounded-lg overflow-hidden border border-border/20">
          {isFullscreen && (
            <Button 
                variant="secondary"
                size="sm"
                className="absolute top-4 left-4 z-20"
                onClick={() => setIsFullscreen(false)}>
                <Download className="mr-2 h-4 w-4" />
                Exit Fullscreen
            </Button>
          )}

          <NliMap 
            is3D={is3D} 
            activeLayers={activeLayers} 
            basemapStyle={basemapStyle} 
            activeTool={activeTool}
            onRegionClick={handleRegionSelect}
            selectedRegion={selectedRegion}
          />

            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full h-11 w-11 shadow-lg"
                onClick={() => setAiChatOpen(true)}
                title="Open AI Assistant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-primary-foreground h-5 w-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              </Button>
            </div>
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

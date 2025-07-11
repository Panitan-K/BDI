
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { NliHeader } from '@/components/nli-header';
import { NliLeftSidebar } from '@/components/nli-left-sidebar';
import { NliRightSidebar } from '@/components/nli-right-sidebar';
import { NliMap } from '@/components/nli-map';
import { NliMapToolbar } from '@/components/nli-map-toolbar';
import { AiChatModal } from '@/components/nli-ai-chat';
import { Share2, Copy, Upload, Settings, SlidersHorizontal, Download, Layers, BookText, Table2, History, StickyNote, Bot, Minimize, Maximize2, Minimize2 } from 'lucide-react';
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
import { NewProjectDialog } from '@/components/nli-new-project-dialog';
import { CompareProjectsDialog } from '@/components/nli-compare-dialog';

const translations = {
  en: {
    shareTitle: 'Share Project',
    shareDesc: 'Share a read-only link to your current project view, including selected layers and analysis.',
    shareLinkSr: 'Link',
    shareCopySr: 'Copy',
    shareClose: 'Close',
    copySuccessTitle: 'Copied to clipboard!',
    copySuccessDesc: 'You can now share the link with others.',
    importDataTitle: 'Import Data',
    importDataDesc: 'Upload and visualize your own geospatial data from KML, GeoJSON, or Shapefile formats.',
    settingsTitle: 'Settings',
    settingsDesc: 'Configure application preferences, map settings, and user profile.',
    layerControlTitle: 'Layer Control',
    layerControlDesc: 'Manage the visibility and properties of data layers on the map.',
    legendTitle: 'Legend',
    legendDesc: 'View the map legend to understand the symbols and colors used.',
    attributeTableTitle: 'Attribute Table',
    attributeTableDesc: 'Inspect the data associated with map features in a tabular format.',
    parametersTitle: 'Parameters',
    parametersDesc: 'Adjust variables and assumptions for analysis and simulation models.',
    timeSeriesTitle: 'Time-Series Slider',
    timeSeriesDesc: 'Animate and visualize how data changes across different time periods.',
    userNotesTitle: 'User Notes',
    userNotesDesc: 'Create, view, and manage your annotations and notes on the map.',
    exportDataTitle: 'Export Data',
    exportDataDesc: 'Download map data, analysis results, or export the current view as an image.',
    askAiTitle: 'Ask AI Assistant',
    askAiDesc: 'Get insights, run complex analyses, and ask questions using natural language.',
    exitFullscreen: 'Exit Fullscreen',
  },
  th: {
    shareTitle: 'แบ่งปันโปรเจกต์',
    shareDesc: 'แบ่งปันลิงก์สำหรับอ่านอย่างเดียวของมุมมองโปรเจกต์ปัจจุบันของคุณ รวมถึงเลเยอร์และการวิเคราะห์ที่เลือก',
    shareLinkSr: 'ลิงก์',
    shareCopySr: 'คัดลอก',
    shareClose: 'ปิด',
    copySuccessTitle: 'คัดลอกไปยังคลิปบอร์ดแล้ว!',
    copySuccessDesc: 'คุณสามารถแบ่งปันลิงก์กับผู้อื่นได้แล้ว',
    importDataTitle: 'นำเข้าข้อมูล',
    importDataDesc: 'อัปโหลดและแสดงข้อมูลภูมิสารสนเทศของคุณเองจากไฟล์ KML, GeoJSON, หรือ Shapefile',
    settingsTitle: 'การตั้งค่า',
    settingsDesc: 'กำหนดค่าแอปพลิเคชัน การตั้งค่าแผนที่ และโปรไฟล์ผู้ใช้',
    layerControlTitle: 'ควบคุมชั้นข้อมูล',
    layerControlDesc: 'จัดการการมองเห็นและคุณสมบัติของชั้นข้อมูลบนแผนที่',
    legendTitle: 'คำอธิบายสัญลักษณ์',
    legendDesc: 'ดูคำอธิบายสัญลักษณ์ของแผนที่เพื่อทำความเข้าใจสัญลักษณ์และสีที่ใช้',
    attributeTableTitle: 'ตารางข้อมูล',
    attributeTableDesc: 'ตรวจสอบข้อมูลที่เกี่ยวข้องกับฟีเจอร์บนแผนที่ในรูปแบบตาราง',
    parametersTitle: 'พารามิเตอร์',
    parametersDesc: 'ปรับตัวแปรและสมมติฐานสำหรับการวิเคราะห์และแบบจำลอง',
    timeSeriesTitle: 'แถบเลื่อนอนุกรมเวลา',
    timeSeriesDesc: 'สร้างภาพเคลื่อนไหวและแสดงข้อมูลที่เปลี่ยนแปลงตามช่วงเวลาต่างๆ',
    userNotesTitle: 'บันทึกผู้ใช้',
    userNotesDesc: 'สร้าง ดู และจัดการคำอธิบายประกอบและบันทึกของคุณบนแผนที่',
    exportDataTitle: 'ส่งออกข้อมูล',
    exportDataDesc: 'ดาวน์โหลดข้อมูลแผนที่ ผลการวิเคราะห์ หรือส่งออกมุมมองปัจจุบันเป็นรูปภาพ',
    askAiTitle: 'สอบถามผู้ช่วย AI',
    askAiDesc: 'รับข้อมูลเชิงลึก ทำการวิเคราะห์ที่ซับซ้อน และถามคำถามโดยใช้ภาษาธรรมชาติ',
    exitFullscreen: 'ออกจากโหมดเต็มจอ',
  },
};


function ShareDialog({ isOpen, onOpenChange, language, activeProject, isComparing }: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  language: string;
  activeProject: string;
  isComparing: boolean;
}) {
  const { toast } = useToast()
  
  let url = '';
  if (typeof window !== 'undefined') {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    if (isComparing) {
      params.set('view', 'compare');
    } else {
      params.set('project', activeProject);
    }
    url = `${baseUrl}?${params.toString()}`;
  }

  const t = translations[language as keyof typeof translations] || translations.en;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: t.copySuccessTitle,
      description: t.copySuccessDesc,
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2"><Share2 /> {t.shareTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.shareDesc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
                <label htmlFor="link" className="sr-only">
                {t.shareLinkSr}
                </label>
                <Input
                id="link"
                defaultValue={url}
                readOnly
                />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
                <span className="sr-only">{t.shareCopySr}</span>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>{t.shareClose}</Button>
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
  const [isNewProjectOpen, setNewProjectOpen] = useState(false);
  const [isCompareOpen, setCompareOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [basemapStyle, setBasemapStyle] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [activeParameters, setActiveParameters] = useState<string[]>([]);
  
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(256);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

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
    'Population Density': false,
  });
  
  // Load theme from local storage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('nli-theme') || 'dark';
    setTheme(storedTheme);
  }, []);

  // Effect to handle theme changes (DOM, localStorage, basemap)
  useEffect(() => {
    const newBasemap = theme === 'light' 
      ? 'https://api.maptiler.com/maps/outdoor-v2/style.json' 
      : 'https://api.maptiler.com/maps/dataviz-dark/style.json';
    setBasemapStyle(newBasemap);
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('nli-theme', theme);
  }, [theme]);

  const handleMouseDownLeft = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  const handleMouseDownRight = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
    document.body.style.cursor = 'col-resize';
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizingLeft) {
      const containerRect = mainContainerRef.current?.getBoundingClientRect();
      if (containerRect) {
        const newWidth = e.clientX - containerRect.left;
        if (newWidth >= 192 && newWidth <= 400) {
          setLeftSidebarWidth(newWidth);
        }
      }
    }
    if (isResizingRight) {
      const containerRect = mainContainerRef.current?.getBoundingClientRect();
       if (containerRect) {
        const newWidth = containerRect.right - e.clientX;
        if (newWidth >= 384 && newWidth <= 700) {
          setRightSidebarWidth(newWidth);
        }
       }
    }
  }, [isResizingLeft, isResizingRight]);

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);


  const t = translations[language as keyof typeof translations] || translations.en;

  const handleLayerToggle = (layerName: string, isActive: boolean) => {
    setActiveLayers(prev => ({ ...prev, [layerName]: isActive }));
  };
  
  const handleToolSelect = (toolName: string) => {
    // For single-action tools, just pass the name.
    // For toggleable tools, toggle them.
    const isAction = ['ZoomIn', 'ZoomOut', 'Compass', 'Home', 'Clear'].includes(toolName);
    if(isAction) {
        setActiveTool(toolName);
        // Reset to null immediately after so it can be clicked again.
        setTimeout(() => setActiveTool(null), 100);
        return;
    }
    setActiveTool(prev => prev === toolName ? null : toolName);
  }

  const handleRegionSelect = (regionName: string | null) => {
    setSelectedRegion(regionName);
  }

  const handleProjectChange = (project: string) => {
    if (isComparing) {
      setIsComparing(false);
    }
    setActiveProject(project);
  }

  const handleCompareToggle = () => {
    if (isComparing) {
      setIsComparing(false);
      setSelectedRegion(null);
    } else {
      setCompareOpen(true);
    }
  };

  const handleStartComparison = (values: { projects: string[], layers?: string[], parameters?: string[] }) => {
    // Auto-activate selected layers
    const layerKeys = Object.keys(activeLayers);
    const newActiveLayers = Object.fromEntries(
        layerKeys.map(key => [key, values.layers?.includes(key) ?? false])
    ) as Record<string, boolean>;

    // Special dependency: Population Density requires the Province layer
    if (newActiveLayers['Population Density']) {
        newActiveLayers['Province'] = true;
    }
    setActiveLayers(newActiveLayers);
    setActiveParameters(values.parameters || []);

    // In a real application, you would pass these values to an AI or data processing backend.
    // For this demo, we'll just enable the mock comparison view in the right sidebar.
    setCompareOpen(false);
    setIsComparing(true);
    setSelectedRegion(null); // Ensure no single region is focused during comparison
  };

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
          onNewProject={() => setNewProjectOpen(true)}
          onFullscreenToggle={() => setIsFullscreen(prev => !prev)}
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      {!isFullscreen && (
          <div className="relative z-20 flex items-center justify-between px-2 py-1 border-b border-border/50 bg-secondary/20 shrink-0">
              <div className="flex items-center gap-1 w-auto">
                    <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <Upload className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.importDataTitle}</p>
                              <p className="text-muted-foreground">{t.importDataDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <Settings className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.settingsTitle}</p>
                              <p className="text-muted-foreground">{t.settingsDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <Layers className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.layerControlTitle}</p>
                              <p className="text-muted-foreground">{t.layerControlDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <BookText className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.legendTitle}</p>
                              <p className="text-muted-foreground">{t.legendDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <Table2 className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.attributeTableTitle}</p>
                              <p className="text-muted-foreground">{t.attributeTableDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
              </div>
              <div className="flex-1 flex justify-center">
                  <NliMapToolbar 
                      onBasemapChange={setBasemapStyle}
                      activeTool={activeTool}
                      onToolSelect={handleToolSelect}
                      language={language}
                  />
              </div>
              <div className="flex items-center gap-1 w-auto justify-end">
                    <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <SlidersHorizontal className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.parametersTitle}</p>
                              <p className="text-muted-foreground">{t.parametersDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <History className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.timeSeriesTitle}</p>
                              <p className="text-muted-foreground">{t.timeSeriesDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <StickyNote className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.userNotesTitle}</p>
                              <p className="text-muted-foreground">{t.userNotesDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8">
                                    <Download className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.exportDataTitle}</p>
                              <p className="text-muted-foreground">{t.exportDataDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-primary h-8 w-8" onClick={() => setAiChatOpen(true)}>
                                    <Bot className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-left">
                              <p className="font-bold">{t.askAiTitle}</p>
                              <p className="text-muted-foreground">{t.askAiDesc}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
              </div>
          </div>
      )}

      <div ref={mainContainerRef} className={cn("flex flex-1 p-2 gap-2 min-h-0", isFullscreen ? "p-0 gap-0" : "p-2 gap-2")}>
        {!isFullscreen && (
          <>
            <NliLeftSidebar
              style={{ width: `${leftSidebarWidth}px`, minWidth: '192px', maxWidth: '400px' }}
              activeLayers={activeLayers}
              onLayerToggle={handleLayerToggle}
              language={language}
            />
            <div
              className="w-1 cursor-col-resize rounded-full bg-transparent hover:bg-border transition-colors self-stretch my-2"
              onMouseDown={handleMouseDownLeft}
            />
          </>
        )}
        
        <main className="flex-1 flex flex-col relative rounded-lg overflow-hidden border border-border/20">
          {isFullscreen && (
            <Button 
                variant="secondary"
                size="sm"
                className="absolute top-4 left-4 z-20"
                onClick={() => setIsFullscreen(false)}>
                <Minimize className="mr-2 h-4 w-4" />
                {t.exitFullscreen}
            </Button>
          )}

          {basemapStyle && <NliMap 
            activeLayers={activeLayers} 
            basemapStyle={basemapStyle} 
            activeTool={activeTool}
            onRegionClick={handleRegionSelect}
            selectedRegion={selectedRegion}
          />}

            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full h-11 w-11 shadow-lg"
                onClick={() => setAiChatOpen(true)}
                title={t.askAiTitle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-primary-foreground h-5 w-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              </Button>
            </div>
        </main>
        
        {!isFullscreen && (
          <>
            <div
              className="w-1 cursor-col-resize rounded-full bg-transparent hover:bg-border transition-colors self-stretch my-2"
              onMouseDown={handleMouseDownRight}
            />
            <NliRightSidebar
              style={{ width: `${rightSidebarWidth}px`, minWidth: '384px', maxWidth: '700px' }}
              activeProject={activeProject}
              isComparing={isComparing}
              selectedRegion={selectedRegion}
              onClearRegion={() => setSelectedRegion(null)}
              language={language}
              activeParameters={activeParameters}
            />
          </>
        )}
      </div>
      <AiChatModal isOpen={isAiChatOpen} onOpenChange={setAiChatOpen} language={language} />
      <ShareDialog isOpen={isShareOpen} onOpenChange={setShareOpen} language={language} activeProject={activeProject} isComparing={isComparing} />
      <NewProjectDialog isOpen={isNewProjectOpen} onOpenChange={setNewProjectOpen} />
      <CompareProjectsDialog isOpen={isCompareOpen} onOpenChange={setCompareOpen} onCompare={handleStartComparison} />
    </div>
  );
}

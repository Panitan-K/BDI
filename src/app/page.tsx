
'use client';

import React, { useState, useEffect } from 'react';
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


function ShareDialog({ isOpen, onOpenChange, language }: { isOpen: boolean, onOpenChange: (open: boolean) => void, language: string }) {
  const { toast } = useToast()
  const url = typeof window !== 'undefined' ? window.location.href : '';
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
  const [is3D, setIs3D] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [basemapStyle, setBasemapStyle] = useState('https://api.maptiler.com/maps/dataviz-dark/style.json');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRightSidebarMaximized, setRightSidebarMaximized] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

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
    if (theme === 'light') {
      setBasemapStyle('https://api.maptiler.com/maps/outdoor-v2/style.json');
    } else {
      setBasemapStyle('https://api.maptiler.com/maps/dataviz-dark/style.json');
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('nli-theme', theme);
  }, [theme]);

  const t = translations[language as keyof typeof translations] || translations.en;

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
          theme={theme}
          onThemeChange={setTheme}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      {!isFullscreen && !isRightSidebarMaximized && (
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
                      is3D={is3D}
                      on3DToggle={() => setIs3D(!is3D)}
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

      <div className={cn("flex flex-1 p-2 gap-2 min-h-0 transition-all duration-300", isFullscreen ? "p-0" : "p-2 gap-2")}>
        {!isFullscreen && !isRightSidebarMaximized && (
          <NliLeftSidebar 
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            language={language}
          />
        )}
        
        {!isRightSidebarMaximized && (
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
                  title={t.askAiTitle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-primary-foreground h-5 w-5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                </Button>
              </div>
          </main>
        )}
        
        {!isFullscreen && (
          <NliRightSidebar 
            activeProject={activeProject} 
            isComparing={isComparing} 
            selectedRegion={selectedRegion}
            onClearRegion={() => setSelectedRegion(null)}
            language={language}
            isMaximized={isRightSidebarMaximized}
            onMaximizeToggle={() => setRightSidebarMaximized(prev => !prev)}
          />
        )}
      </div>
      <AiChatModal isOpen={isAiChatOpen} onOpenChange={setAiChatOpen} />
      <ShareDialog isOpen={isShareOpen} onOpenChange={setShareOpen} language={language} />
    </div>
  );
}

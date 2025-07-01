'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  GitCompare, 
  Share2, 
  Plus, 
  Maximize, 
  User, 
  Settings,
  Palette,
  Globe,
  LogOut,
  Minimize
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from '@/components/ui/switch';
import { Separator } from './ui/separator';

const translations = {
  en: {
    title: 'NLI-Thailand Land',
    project1: 'Project 1',
    project2: 'Project 2',
    addProject: 'Add New Project',
    compare: 'Compare Projects',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    share: 'Share',
    myAccount: 'My Account',
    viewProfile: 'View Profile',
    settings: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    logout: 'Log Out',
    english: 'English',
    thai: 'Thai'
  },
  th: {
    title: 'NLI-Thailand Land',
    project1: 'โปรเจกต์ 1',
    project2: 'โปรเจกต์ 2',
    addProject: 'เพิ่มโปรเจกต์ใหม่',
    compare: 'เปรียบเทียบโปรเจกต์',
    fullscreen: 'เต็มจอ',
    exitFullscreen: 'ออกจากโหมดเต็มจอ',
    share: 'แบ่งปัน',
    myAccount: 'บัญชีของฉัน',
    viewProfile: 'ดูโปรไฟล์',
    settings: 'การตั้งค่า',
    appearance: 'ลักษณะ',
    language: 'ภาษา',
    logout: 'ออกจากระบบ',
    english: 'อังกฤษ',
    thai: 'ไทย'
  }
};


interface NliHeaderProps {
  activeProject: string;
  onProjectChange: (project: string) => void;
  isComparing: boolean;
  onCompareToggle: () => void;
  onShare: () => void;
  onFullscreenToggle: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
}

export function NliHeader({ 
  activeProject, 
  onProjectChange, 
  isComparing,
  onCompareToggle,
  onShare,
  onFullscreenToggle,
  theme,
  onThemeChange,
  language,
  onLanguageChange
}: NliHeaderProps) {
  const [isClientFullscreen, setIsClientFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsClientFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Set initial state
    handleFullscreenChange();

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  const toggleTheme = () => {
    onThemeChange(theme === 'dark' ? 'light' : 'dark');
  }

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <header className="flex items-center justify-between px-2 py-2 border-b border-border/50 glass-panel !rounded-none z-10 shrink-0">
      <div className="flex items-center gap-3">
        <MapPin className="text-primary h-6 w-6" />
        <h1 className="text-lg font-bold text-foreground">{t.title}</h1>
        
        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Tabs value={isComparing ? 'compare' : activeProject} onValueChange={onProjectChange} className="w-auto">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="project1" disabled={isComparing}>{t.project1}</TabsTrigger>
              <TabsTrigger value="project2" disabled={isComparing}>{t.project2}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" title={t.addProject}>
                      <Plus className="h-4 w-4" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>{t.addProject}</p>
              </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-2">
         <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground",
            isComparing && "bg-primary text-white"
            )}
          onClick={onCompareToggle}
          >
          <GitCompare className="mr-2 h-4 w-4"/>
          {t.compare}
        </Button>
        <Button variant="secondary" size="sm" onClick={onFullscreenToggle}>
          {isClientFullscreen ? <Minimize className="mr-2 h-4 w-4" /> : <Maximize className="mr-2 h-4 w-4" />}
          {isClientFullscreen ? t.exitFullscreen : t.fullscreen}
        </Button>
        <Button variant="secondary" size="sm" onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" />
          {t.share}
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage data-ai-hint="profile picture" src="https://placehold.co/40x40.png" alt="User Avatar" />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t.viewProfile}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.settings}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>{t.appearance}</span>
                    <Switch 
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                        className="ml-auto"
                    />
                </DropdownMenuItem>
                 <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Globe className="mr-2 h-4 w-4" />
                        <span>{t.language}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onSelect={() => onLanguageChange('en')}>{t.english}</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onLanguageChange('th')}>{t.thai}</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.logout}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}

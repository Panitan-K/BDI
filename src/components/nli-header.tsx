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
  LogOut
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


interface NliHeaderProps {
  activeProject: string;
  onProjectChange: (project: string) => void;
  isComparing: boolean;
  onCompareToggle: () => void;
  onShare: () => void;
  onFullscreenToggle: () => void;
}

export function NliHeader({ 
  activeProject, 
  onProjectChange, 
  isComparing,
  onCompareToggle,
  onShare,
  onFullscreenToggle
}: NliHeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('nli-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('nli-theme', theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }

  return (
    <header className="flex items-center justify-between px-2 py-2 border-b border-border/50 glass-panel !rounded-none z-10 shrink-0">
      <div className="flex items-center gap-3">
        <MapPin className="text-primary h-6 w-6" />
        <h1 className="text-lg font-bold text-foreground">NLI-Thailand Land</h1>
        
        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Tabs value={isComparing ? 'compare' : activeProject} onValueChange={onProjectChange} className="w-auto">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
              <TabsTrigger value="project1" disabled={isComparing}>Project 1</TabsTrigger>
              <TabsTrigger value="project2" disabled={isComparing}>Project 2</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" title="Add Project">
                      <Plus className="h-4 w-4" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>Add New Project</p>
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
          Compare Projects
        </Button>
        <Button variant="secondary" size="sm" onClick={onFullscreenToggle}>
          <Maximize className="mr-2 h-4 w-4" />
          Fullscreen
        </Button>
        <Button variant="secondary" size="sm" onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage data-ai-hint="profile picture" src="https://placehold.co/40x40" alt="User Avatar" />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Appearance</span>
                    {isMounted && (
                      <Switch 
                          checked={theme === 'dark'}
                          onCheckedChange={toggleTheme}
                          className="ml-auto"
                      />
                    )}
                </DropdownMenuItem>
                 <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Globe className="mr-2 h-4 w-4" />
                        <span>Language</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>English</DropdownMenuItem>
                            <DropdownMenuItem>Thai</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}

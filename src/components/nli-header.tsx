'use client';

import React from 'react';
import { MapPin, GitCompare, Share2, Plus, Maximize, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


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
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border/50 glass-panel !rounded-none z-20 shrink-0">
      <div className="flex items-center gap-2">
        <MapPin className="text-primary h-6 w-6" />
        <h1 className="text-lg font-bold text-white">NLI-Thailand</h1>
      </div>
      
      <div className="flex-1 flex justify-center items-center gap-1">
        <Tabs value={isComparing ? 'compare' : activeProject} onValueChange={onProjectChange} className="w-auto">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="project1" disabled={isComparing}>Project 1</TabsTrigger>
            <TabsTrigger value="project2" disabled={isComparing}>Project 2</TabsTrigger>
          </TabsList>
        </Tabs>
        <TooltipProvider>
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
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
         <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "bg-transparent border-primary text-primary hover:bg-primary hover:text-white",
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
        <Avatar className="h-8 w-8">
          <AvatarImage data-ai-hint="profile picture" src="https://placehold.co/40x40" alt="User Avatar" />
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

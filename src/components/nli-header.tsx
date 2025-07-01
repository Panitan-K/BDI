'use client';

import React from 'react';
import { MapPin, GitCompare, Share2, Plus, Maximize, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

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
        <MapPin className="text-primary h-7 w-7" />
        <h1 className="text-xl font-bold text-white">NLI-Thailand</h1>
      </div>
      
      <div className="flex-1 flex justify-center items-center gap-2">
        <Tabs value={isComparing ? 'compare' : activeProject} onValueChange={onProjectChange} className="w-auto">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="project1" disabled={isComparing}>Project 1</TabsTrigger>
            <TabsTrigger value="project2" disabled={isComparing}>Project 2</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Add Project">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
         <Button 
          variant="outline" 
          className={cn(
            "bg-transparent border-primary text-primary hover:bg-primary hover:text-white",
            isComparing && "bg-primary text-white"
            )}
          onClick={onCompareToggle}
          >
          <GitCompare className="mr-2 h-4 w-4"/>
          Compare Projects
        </Button>
        <Button variant="secondary" onClick={onFullscreenToggle}>
          <Maximize className="mr-2 h-4 w-4" />
          Fullscreen
        </Button>
        <Button variant="secondary" onClick={onShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Avatar>
          <AvatarImage data-ai-hint="profile picture" src="https://placehold.co/40x40" alt="User Avatar" />
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

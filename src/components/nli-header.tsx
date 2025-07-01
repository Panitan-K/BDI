'use client';

import React from 'react';
import { MapPin, GitCompare, Share2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NliHeaderProps {
  activeProject: string;
  onProjectChange: (project: string) => void;
}

export function NliHeader({ activeProject, onProjectChange }: NliHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border/50 glass-panel !rounded-none z-20 shrink-0">
      <div className="flex items-center gap-2">
        <MapPin className="text-primary h-7 w-7" />
        <h1 className="text-xl font-bold text-white">NLI-Thailand</h1>
      </div>
      
      <div className="flex-1 flex justify-center items-center gap-2">
        <Tabs value={activeProject} onValueChange={onProjectChange} className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="project1">Project 1</TabsTrigger>
            <TabsTrigger value="project2">Project 2</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" title="Add Project">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white">
          <GitCompare className="mr-2 h-4 w-4"/>
          Compare Projects
        </Button>
        <Button variant="secondary">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

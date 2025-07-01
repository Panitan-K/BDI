'use client';

import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NliHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border/50 glass-panel !rounded-none z-20">
      <div className="flex items-center gap-2">
        <MapPin className="text-primary h-7 w-7" />
        <h1 className="text-xl font-bold text-white">NLI-Thailand</h1>
      </div>
      
      <div className="flex-1 flex justify-center">
        <Tabs defaultValue="project1" className="w-[300px]">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="project1">Project 1</TabsTrigger>
            <TabsTrigger value="project2">Project 2</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white">Compare Projects</Button>
        <Button variant="secondary">Share</Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

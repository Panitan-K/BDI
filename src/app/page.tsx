'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NliHeader } from '@/components/nli-header';
import { NliLeftSidebar } from '@/components/nli-left-sidebar';
import { NliRightSidebar } from '@/components/nli-right-sidebar';
import { NliMap } from '@/components/nli-map';
import { AiChatModal } from '@/components/nli-ai-chat';
import { ChevronLeft, ChevronRight, Sparkles, Globe, LucideIcon } from 'lucide-react';

export default function NliPlatformPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [isAiChatOpen, setAiChatOpen] = useState(false);
  const [is3D, setIs3D] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <NliHeader />
      <div className="flex flex-1 overflow-hidden">
        <NliLeftSidebar isOpen={leftSidebarOpen} />

        <main className="flex-1 flex flex-col relative transition-all duration-300 ease-in-out">
          <div className="absolute top-2 left-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/50 hover:bg-background/80 rounded-full"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              {leftSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
          
          <NliMap is3D={is3D} />

          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
              onClick={() => setIs3D(!is3D)}
            >
              <Globe className="h-6 w-6" />
            </Button>
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12 shadow-lg"
              onClick={() => setAiChatOpen(true)}
            >
              <Sparkles className="h-6 w-6 text-white" />
            </Button>
          </div>
          
          <div className="absolute top-2 right-2 z-10">
             <Button
              variant="ghost"
              size="icon"
              className="bg-background/50 hover:bg-background/80 rounded-full"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              {rightSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          </div>
        </main>
        
        <NliRightSidebar isOpen={rightSidebarOpen} />
      </div>
      <AiChatModal isOpen={isAiChatOpen} onOpenChange={setAiChatOpen} />
    </div>
  );
}

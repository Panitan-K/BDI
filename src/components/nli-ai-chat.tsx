
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { askGisAssistant, GisAssistantInput } from '@/ai/flows/gis-assistant';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const translations = {
  en: {
    description: "Ask about infrastructure investments and their potential impacts.",
    placeholder: "e.g., What is the economic impact of building a high-speed rail from Bangkok to Chon Buri?",
    title: "AI Assistant (Typhoon LLM)",
    send: "Send",
    error: "Sorry, I encountered an error. Please try again.",
    liveBadge: "Live AI",
    mockBadge: "Demo Mode",
    initialMessage: "Hello! I am Typhoon LLM. I can help you analyze potential investment locations. For example, you could ask me:\n\n'Hello AI, I'm looking for a suitable location to invest in the EEC area. I'm not sure which province to choose. Can you help me with a spatial analysis?'"
  },
  th: {
    description: "สอบถามเกี่ยวกับการลงทุนโครงสร้างพื้นฐานและผลกระทบที่อาจเกิดขึ้น",
    placeholder: "เช่น การสร้างรถไฟความเร็วสูงจากกรุงเทพฯ ไปชลบุรีมีผลกระทบทางเศรษฐกิจอย่างไร?",
    title: "ผู้ช่วย AI (ไต้ฝุ่น LLM)",
    send: "ส่ง",
    error: "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    liveBadge: "AI สด",
    mockBadge: "โหมดสาธิต",
    initialMessage: `สวัสดีครับ! ผมคือไต้ฝุ่น LLM ผู้ช่วยวิเคราะห์การลงทุนโครงสร้างพื้นฐาน\n\nคุณสามารถสอบถามเกี่ยวกับการวิเคราะห์เชิงพื้นที่ หรือผลกระทบของโครงการต่างๆ ได้เลยครับ`
  }
};


export function AiChatModal({ isOpen, onOpenChange, language = 'en' }: { isOpen: boolean; onOpenChange: (open: boolean) => void; language: string; }) {
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: t.initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 'live' = answered by the real LLM, 'mock' = built-in demo response, null = no query yet.
  const [mode, setMode] = useState<'live' | 'mock' | null>(null);

  React.useEffect(() => {
    // When language changes, reset the chat with the appropriate initial message
    const newTranslations = translations[language as keyof typeof translations] || translations.en;
    setMessages([{ sender: 'bot', text: newTranslations.initialMessage }]);
    setInput('');
    setMode(null);
  }, [language]);


  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await askGisAssistant({ query: input, language });
      const botMessage: Message = { sender: 'bot', text: result.response };
      setMessages((prev) => [...prev, botMessage]);
      setMode(result.source);
    } catch (error) {
      console.error('AI assistant error:', error);
      const errorMessage: Message = { sender: 'bot', text: t.error };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel text-foreground max-w-2xl h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="text-primary" />
            {t.title}
            {mode && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  mode === 'live'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-amber-500/15 text-amber-500'
                }`}
                title={
                  mode === 'live'
                    ? 'Answered by the live Gemini LLM.'
                    : 'No GEMINI_API_KEY configured — showing a built-in demo response.'
                }
              >
                {mode === 'live' ? t.liveBadge : t.mockBadge}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                <div className={`rounded-lg p-3 max-w-md ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3">
                <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="rounded-lg p-3 bg-secondary flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t border-border">
          <div className="w-full flex items-center gap-2">
            <Textarea
              placeholder={t.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 bg-secondary border-none ring-offset-background focus-visible:ring-1 focus-visible:ring-primary"
              rows={1}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              {t.send}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

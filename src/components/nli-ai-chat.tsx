
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
    initialMessage: "Hello! I am Typhoon LLM. I can help you analyze potential investment locations. For example, you could ask me:\n\n'Hello AI, I'm looking for a suitable location to invest in the EEC area. I'm not sure which province to choose. Can you help me with a spatial analysis?'"
  },
  th: {
    description: "สอบถามเกี่ยวกับการลงทุนโครงสร้างพื้นฐานและผลกระทบที่อาจเกิดขึ้น",
    placeholder: "เช่น การสร้างรถไฟความเร็วสูงจากกรุงเทพฯ ไปชลบุรีมีผลกระทบทางเศรษฐกิจอย่างไร?",
    title: "ผู้ช่วย AI (ไต้ฝุ่น LLM)",
    send: "ส่ง",
    error: "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    initialMessage: `ตัวอย่างบทสนทนา: ขอความช่วยเหลือจาก AI เพื่อวิเคราะห์พื้นที่ใน EEC

คุณ:
สวัสดี เอไอ ฉันกำลังมองหาทำเลที่เหมาะสมในการลงทุนในพื้นที่ EEC ตอนนี้ยังไม่แน่ใจว่าควรเลือกจังหวัดไหน ช่วยวิเคราะห์เชิงพื้นที่ให้หน่อยได้ไหม?

AI:
ยินดีครับ! ข้อมูลที่คุณต้องการให้ฉันวิเคราะห์ประกอบด้วยอะไรบ้างครับ เช่น ประเภทธุรกิจที่ต้องการลงทุน งบประมาณ หรือเงื่อนไขเฉพาะอื่น ๆ?

คุณ:
ฉันสนใจลงทุนในธุรกิจโลจิสติกส์ อยากได้พื้นที่ที่ใกล้ท่าเรือ สนามบิน หรือเขตอุตสาหกรรม และขอให้คำนึงถึงการเข้าถึงระบบขนส่งหลักด้วย

AI:
ขอบคุณครับ ตอนนี้ฉันจะใช้ข้อมูลแผนที่เชิงพื้นที่ เช่น

ความใกล้กับสนามบินอู่ตะเภา
ท่าเรือแหลมฉบัง
โครงข่ายถนนมอเตอร์เวย์
เขตอุตสาหกรรมในระยอง ชลบุรี ฉะเชิงเทรา
เพื่อวิเคราะห์หาพื้นที่ที่เหมาะสมที่สุด

คุณ:
ดีเลย ขอให้จัดลำดับมาให้ด้วยนะ ว่าพื้นที่ไหนน่าลงทุนมากที่สุด

AI:
ได้ครับ… (เริ่มวิเคราะห์แผนที่และข้อมูลเชิงพื้นที่)
✅ อันดับที่ 1: อำเภอปลวกแดง จ.ระยอง – ใกล้เขตอุตสาหกรรมหลักและมอเตอร์เวย์
✅ อันดับที่ 2: อำเภอบ้านบึง จ.ชลบุรี – ศักยภาพในการพัฒนา และอยู่ใกล้ทั้งถนนหลักและท่าเรือ
✅ อันดับที่ 3: อำเภอบางปะกง จ.ฉะเชิงเทรา – ใกล้สนามบินและมีโครงการพัฒนาพื้นที่รองรับ EEC อย่างต่อเนื่อง

คุณ:
ขอบคุณมาก เอไอ แบบนี้ช่วยสร้างแผนภาพแสดงตำแหน่งและปัจจัยสำคัญให้หน่อยได้ไหม?

AI:
แน่นอนครับ ฉันกำลังจัดทำแผนที่แสดงจุดเด่นของแต่ละพื้นที่ พร้อมไฮไลต์เส้นทางขนส่งและศักยภาพทางเศรษฐกิจ… กรุณารอสักครู่…`
  }
};


export function AiChatModal({ isOpen, onOpenChange, language = 'en' }: { isOpen: boolean; onOpenChange: (open: boolean) => void; language: string; }) {
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: t.initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  React.useEffect(() => {
    // When language changes, reset the chat with the appropriate initial message
    const newTranslations = translations[language as keyof typeof translations] || translations.en;
    setMessages([{ sender: 'bot', text: newTranslations.initialMessage }]);
    setInput('');
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

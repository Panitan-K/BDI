
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbulb, ListChecks } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const analysisParameters = [
    { id: 'Economic Impact', en: 'Economic Impact', th: 'ผลกระทบทางเศรษฐกิจ' },
    { id: 'Logistic Flow', en: 'Logistic Flow', th: 'การไหลของโลจิสติกส์' },
    { id: 'Environmental Score', en: 'Environmental Score', th: 'คะแนนสิ่งแวดล้อม' },
    { id: 'Investment Suitability', en: 'Investment Suitability', th: 'ความเหมาะสมในการลงทุน' },
    { id: 'Jobs Created', en: 'Job Creation', th: 'การสร้างงาน' },
    { id: 'Regional Distribution', en: 'Regional Distribution', th: 'การกระจายตัวตามภูมิภาค' },
    { id: 'Financing & Costs', en: 'Financing & Costs', th: 'การเงินและต้นทุน' },
    { id: 'Socio-Economic Impact', en: 'Socio-Economic Impact', th: 'ผลกระทบทางเศรษฐกิจและสังคม' },
    { id: 'Predictive Tools', en: 'Predictive Tools', th: 'เครื่องมือคาดการณ์' },
];

const translations = {
  en: {
    title: 'Analyze Project',
    description: 'Select the parameters you want to analyze for the current project.',
    selectParamsTitle: 'Select Analysis Parameters',
    selectParamsDesc: 'Choose the key metrics for the analysis.',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    cancel: 'Cancel',
    runAnalysis: 'Run Analysis',
  },
  th: {
    title: 'วิเคราะห์โปรเจกต์',
    description: 'เลือกพารามิเตอร์ที่คุณต้องการวิเคราะห์สำหรับโปรเจกต์ปัจจุบัน',
    selectParamsTitle: 'เลือกพารามิเตอร์การวิเคราะห์',
    selectParamsDesc: 'เลือกตัวชี้วัดหลักสำหรับการวิเคราะห์',
    selectAll: 'เลือกทั้งหมด',
    deselectAll: 'ยกเลิกการเลือกทั้งหมด',
    cancel: 'ยกเลิก',
    runAnalysis: 'เริ่มการวิเคราะห์',
  },
};


const analyzeSchema = z.object({
  parameters: z.array(z.string()).optional(),
});

interface AnalyzeProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalyze: (values: z.infer<typeof analyzeSchema>) => void;
  language: string;
}

export function AnalyzeProjectDialog({ isOpen, onOpenChange, onAnalyze, language }: AnalyzeProjectDialogProps) {
  const form = useForm<z.infer<typeof analyzeSchema>>({
    resolver: zodResolver(analyzeSchema),
    defaultValues: {
      parameters: analysisParameters.map(p => p.id),
    },
  });

  const t = translations[language as keyof typeof translations] || translations.en;
  const langKey = language as 'en' | 'th';

  const watchedParameters = form.watch('parameters');
  const allParametersSelected = analysisParameters.length > 0 && watchedParameters?.length === analysisParameters.length;

  const handleToggleAllParameters = () => {
    if (allParametersSelected) {
      form.setValue('parameters', []);
    } else {
      form.setValue('parameters', analysisParameters.map(p => p.id));
    }
  };

  function onSubmit(values: z.infer<typeof analyzeSchema>) {
    onAnalyze(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel text-foreground max-w-2xl h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="parameters"
                    render={() => (
                      <FormItem>
                        <div className="mb-4 flex justify-between items-start">
                            <div>
                                <FormLabel className="text-base font-semibold">{t.selectParamsTitle}</FormLabel>
                                <FormDescription>
                                {t.selectParamsDesc}
                                </FormDescription>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={handleToggleAllParameters} className="shrink-0">
                                <ListChecks className="mr-2 h-4 w-4" />
                                {allParametersSelected ? t.deselectAll : t.selectAll}
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {analysisParameters.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="parameters"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item.id])
                                            : field.onChange(
                                                (field.value || [])?.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {item[langKey] || item.en}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
                
              <DialogFooter className="p-6 mt-auto border-t border-border">
                  <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
                  <Button type="submit">{t.runAnalysis}</Button>
              </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

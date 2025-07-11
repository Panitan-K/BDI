
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
import { GitCompare, ListChecks } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const projects = [
    { id: 'project1', label: 'Project 1: Eastern EEC High-Speed Rail' },
    { id: 'project2', label: 'Project 2: Southern Land Bridge' },
];

const dataLayers = [
    'Roads', 'Railways', 'Airports', 'Ports',
    'Land Use Plan', 'Forest Zones', 'Agricultural Zones',
    'Province', 'Industrial Zones', 'Special Economic Corridors',
    'Population Density',
];

const analysisParameters = [
    'Economic Impact', 'Logistic Flow', 'Environmental Score',
    'Investment Suitability', 'Job Creation', 'Regional Distribution', 'Financing & Costs',
    'Socio-Economic Impact', 'Predictive Tools',
];

const translations = {
  en: {
    title: 'Compare Projects',
    description: 'Select projects, data layers, and parameters to generate a comparative analysis.',
    selectProjectsTitle: '1. Select Projects to Compare',
    selectProjectsDesc: 'Choose at least two projects to see a side-by-side comparison.',
    selectLayersTitle: '2. Select Data Layers',
    selectLayersDesc: 'Choose the geospatial data layers to include in the analysis. (Optional)',
    selectParamsTitle: '3. Select Analysis Parameters',
    selectParamsDesc: 'Choose the key metrics for the comparison. (Optional)',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    cancel: 'Cancel',
    runComparison: 'Run Comparison',
  },
  th: {
    title: 'เปรียบเทียบโปรเจกต์',
    description: 'เลือกโปรเจกต์ ชั้นข้อมูล และพารามิเตอร์เพื่อสร้างการวิเคราะห์เปรียบเทียบ',
    selectProjectsTitle: '1. เลือกโปรเจกต์ที่จะเปรียบเทียบ',
    selectProjectsDesc: 'เลือกอย่างน้อยสองโปรเจกต์เพื่อดูการเปรียบเทียบแบบเคียงข้างกัน',
    selectLayersTitle: '2. เลือกชั้นข้อมูล',
    selectLayersDesc: 'เลือกชั้นข้อมูลภูมิสารสนเทศที่จะรวมในการวิเคราะห์ (ตัวเลือก)',
    selectParamsTitle: '3. เลือกพารามิเตอร์การวิเคราะห์',
    selectParamsDesc: 'เลือกตัวชี้วัดหลักสำหรับการเปรียบเทียบ (ตัวเลือก)',
    selectAll: 'เลือกทั้งหมด',
    deselectAll: 'ยกเลิกการเลือกทั้งหมด',
    cancel: 'ยกเลิก',
    runComparison: 'เริ่มการเปรียบเทียบ',
  },
};


const compareSchema = z.object({
  projects: z.array(z.string()).refine((value) => value.length >= 2, {
    message: "You must select at least two projects to compare.",
  }),
  layers: z.array(z.string()).optional(),
  parameters: z.array(z.string()).optional(),
});

interface CompareProjectsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCompare: (values: z.infer<typeof compareSchema>) => void;
  language: string;
}

export function CompareProjectsDialog({ isOpen, onOpenChange, onCompare, language }: CompareProjectsDialogProps) {
  const form = useForm<z.infer<typeof compareSchema>>({
    resolver: zodResolver(compareSchema),
    defaultValues: {
      projects: ['project1', 'project2'],
      layers: [],
      parameters: [],
    },
  });

  const t = translations[language as keyof typeof translations] || translations.en;

  const watchedParameters = form.watch('parameters');
  const allParametersSelected = analysisParameters.length > 0 && watchedParameters?.length === analysisParameters.length;

  const handleToggleAllParameters = () => {
    if (allParametersSelected) {
      form.setValue('parameters', []);
    } else {
      form.setValue('parameters', analysisParameters);
    }
  };

  function onSubmit(values: z.infer<typeof compareSchema>) {
    onCompare(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel text-foreground max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <GitCompare className="text-primary" />
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
                    name="projects"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base font-semibold">{t.selectProjectsTitle}</FormLabel>
                          <FormDescription>
                            {t.selectProjectsDesc}
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {projects.map((project) => (
                            <FormField
                              key={project.id}
                              control={form.control}
                              name="projects"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={project.id}
                                    className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(project.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), project.id])
                                            : field.onChange(
                                                (field.value || [])?.filter(
                                                  (value) => value !== project.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal w-full cursor-pointer">
                                      {project.label}
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

                  <FormField
                    control={form.control}
                    name="layers"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base font-semibold">{t.selectLayersTitle}</FormLabel>
                          <FormDescription>
                            {t.selectLayersDesc}
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {dataLayers.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="layers"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(
                                                (field.value || [])?.filter(
                                                  (value) => value !== item
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {item}
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
                        <div className="grid grid-cols-3 gap-4">
                          {analysisParameters.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="parameters"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), item])
                                            : field.onChange(
                                                (field.value || [])?.filter(
                                                  (value) => value !== item
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {item}
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
                  <Button type="submit">{t.runComparison}</Button>
              </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


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
import { GitCompare } from 'lucide-react';
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
    'Investment Suitability', 'Job Creation', 'Financing & Costs',
    'Socio-Economic Impact', 'Land Price Trend',
];


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
}

export function CompareProjectsDialog({ isOpen, onOpenChange, onCompare }: CompareProjectsDialogProps) {
  const form = useForm<z.infer<typeof compareSchema>>({
    resolver: zodResolver(compareSchema),
    defaultValues: {
      projects: ['project1', 'project2'],
      layers: [],
      parameters: [],
    },
  });

  function onSubmit(values: z.infer<typeof compareSchema>) {
    onCompare(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel text-foreground max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <GitCompare className="text-primary" />
            Compare Projects
          </DialogTitle>
          <DialogDescription>
            Select projects, data layers, and parameters to generate a comparative analysis.
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
                          <FormLabel className="text-base font-semibold">1. Select Projects to Compare</FormLabel>
                          <FormDescription>
                            Choose at least two projects to see a side-by-side comparison.
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
                          <FormLabel className="text-base font-semibold">2. Select Data Layers</FormLabel>
                          <FormDescription>
                            Choose the geospatial data layers to include in the analysis. (Optional)
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
                        <div className="mb-4">
                          <FormLabel className="text-base font-semibold">3. Select Analysis Parameters</FormLabel>
                          <FormDescription>
                           Choose the key metrics for the comparison. (Optional)
                          </FormDescription>
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
                  <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button type="submit">Run Comparison</Button>
              </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

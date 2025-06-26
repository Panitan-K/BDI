'use client';

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@/components/ui/sidebar';
import type { DataLayer, Filters } from '@/types';
import { suggestDataLayers } from '@/ai/flows/suggest-data-layers';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Sparkles, Loader2, ListPlus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from '@/components/ui/chart';

interface SidebarContentComponentProps {
  layers: DataLayer[];
  filters: Filters;
  onLayerToggle: (id: DataLayer['id']) => void;
  onFilterChange: (filterType: keyof Filters, value: number[]) => void;
  onAddLayer: (layerName: string) => void;
}

const analysisData = {
  landUse: [
    { name: 'Commercial', value: 45, fill: 'hsl(var(--chart-1))' },
    { name: 'Residential', value: 25, fill: 'hsl(var(--chart-2))' },
    { name: 'Park', value: 20, fill: 'hsl(var(--chart-3))' },
    { name: 'Water', value: 10, fill: 'hsl(var(--chart-4))' },
  ],
  populationDistribution: [
    { range: '0-1k', count: 5, fill: 'hsl(var(--chart-1))' },
    { range: '1k-2k', count: 8, fill: 'hsl(var(--chart-2))' },
    { range: '2k-3k', count: 3, fill: 'hsl(var(--chart-3))' },
    { range: '>3k', count: 2, fill: 'hsl(var(--chart-4))' },
  ],
};

const chartConfig = {
  value: { label: "Value" },
  count: { label: "Count" },
  Commercial: { label: "Commercial", color: "hsl(var(--chart-1))" },
  Residential: { label: "Residential", color: "hsl(var(--chart-2))" },
  Park: { label: "Park", color: "hsl(var(--chart-3))" },
  Water: { label: "Water", color: "hsl(var(--chart-4))" },
} as const;

const SidebarContentComponent = ({
  layers,
  filters,
  onLayerToggle,
  onFilterChange,
  onAddLayer,
}: SidebarContentComponentProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuggest = async () => {
    setIsLoading(true);
    try {
      const result = await suggestDataLayers({ mapAreaDescription: 'A dense urban city center with parks and a waterfront.' });
      setSuggestions(result.suggestedDataLayers);
      setIsDialogOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not fetch data layer suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="font-headline">Data Layers</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4">
            {layers.map(layer => (
              <div key={layer.id} className="flex items-center justify-between">
                <Label htmlFor={`layer-${layer.id}`} className="flex items-center gap-2">
                  <layer.icon className="w-4 h-4 text-primary" />
                  {layer.name}
                </Label>
                <Switch
                  id={`layer-${layer.id}`}
                  checked={layer.enabled}
                  onCheckedChange={() => onLayerToggle(layer.id)}
                />
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        <SidebarGroup>
          <SidebarGroupLabel className="font-headline">Filters</SidebarGroupLabel>
          <SidebarGroupContent>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Population</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Label>Range: {filters.population.min} - {filters.population.max}</Label>
                  <Slider
                    defaultValue={[filters.population.min, filters.population.max]}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={value => onFilterChange('population', value)}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Building Height</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <Label>Min Height: {filters.buildingHeight.min}m</Label>
                  <Slider
                    defaultValue={[filters.buildingHeight.min]}
                    min={0}
                    max={400}
                    step={10}
                    onValueChange={value => onFilterChange('buildingHeight', [value[0], filters.buildingHeight.max])}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator />

        <SidebarGroup>
          <SidebarGroupLabel className="font-headline">Analysis</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-center text-muted-foreground">Land Use Distribution</h4>
              <ChartContainer config={chartConfig} className="w-full h-[200px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={analysisData.landUse} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} labelLine={false} label>
                     {analysisData.landUse.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2 text-center text-muted-foreground">Population Distribution</h4>
                <ChartContainer config={chartConfig} className="w-full h-[200px]">
                  <BarChart data={analysisData.populationDistribution} margin={{ top: 20, right: 20, left: -10, bottom: 0 }} accessibilityLayer>
                    <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={4} />
                  </BarChart>
                </ChartContainer>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <Separator />

        <SidebarGroup>
          <SidebarGroupLabel className="font-headline">AI Assistant</SidebarGroupLabel>
          <SidebarGroupContent>
            <Button onClick={handleSuggest} disabled={isLoading} className="w-full bg-primary/90 hover:bg-primary">
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Suggest Data Layers
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-headline flex items-center gap-2">
                <Sparkles className="text-accent" />
                AI Layer Suggestions
              </AlertDialogTitle>
              <AlertDialogDescription>
                Based on the current map view, here are some relevant data layers you might consider.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-md bg-secondary">
                  <span>{suggestion}</span>
                  <Button size="sm" variant="ghost" onClick={() => { onAddLayer(suggestion); setIsDialogOpen(false); }}>
                    <ListPlus className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ScrollArea>
  );
};

export default SidebarContentComponent;

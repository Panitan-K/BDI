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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Sparkles, Loader2, ListPlus } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface SidebarContentComponentProps {
  layers: DataLayer[];
  filters: Filters;
  onLayerToggle: (id: DataLayer['id']) => void;
  onFilterChange: (filterType: keyof Filters, value: number[]) => void;
  onAddLayer: (layerName: string) => void;
}

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
      const result = await suggestDataLayers({ mapAreaDescription: 'A dense urban city center with parks, commercial and residential buildings, and a waterfront.' });
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
                    max={200}
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

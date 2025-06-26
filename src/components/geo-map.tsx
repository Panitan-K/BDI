'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { GeoFeature, DataLayer } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Plus, Minus } from 'lucide-react';

export const mockFeatures: GeoFeature[] = [
  { id: 'b1', type: 'building', name: 'Quantum Tower', path: 'M100,100 h40 v50 h-40 z', properties: { population: 1200, usage: 'commercial', height: 150 } },
  { id: 'b2', type: 'building', name: 'Orion Complex', path: 'M150,120 h50 v60 h-50 z', properties: { population: 850, usage: 'residential', height: 90 } },
  { id: 'b3', type: 'building', name: 'Skyline Hub', path: 'M110,200 h30 v40 h-30 z', properties: { population: 300, usage: 'commercial', height: 45 } },
  { id: 'p1', type: 'park', name: 'Central Park', path: 'M220,100 h80 v100 h-80 z', properties: { usage: 'recreational' } },
  { id: 'w1', type: 'water', name: 'River Styx', path: 'M50,250 q100 -50 200 0', properties: {} },
  { id: 'b4', type: 'building', name: 'The Monolith', path: 'M320,150 h20 v80 h-20 z', properties: { population: 2500, usage: 'commercial', height: 180 } },
  { id: 'b5', type: 'building', name: 'Vertex Plaza', path: 'M230,220 h60 v30 h-60 z', properties: { population: 450, usage: 'commercial', height: 35 } },
];


const getFeatureFill = (feature: GeoFeature, activeLayers: DataLayer[]) => {
  if (feature.type === 'park') return 'hsl(120, 40%, 30%)';
  if (feature.type === 'water') return 'hsl(200, 50%, 40%)';
  
  if (activeLayers.some(l => l.id === 'population')) {
    const pop = feature.properties.population || 0;
    const intensity = Math.min(pop / 2000, 1);
    return `hsl(48, 100%, ${50 + intensity * 40}%)`;
  }

  if (activeLayers.some(l => l.id === 'land_use')) {
    switch (feature.properties.usage) {
      case 'commercial': return 'hsl(300, 40%, 50%)';
      case 'residential': return 'hsl(240, 40%, 60%)';
      default: return 'hsl(0, 0%, 50%)';
    }
  }

  if (activeLayers.some(l => l.id === 'elevation')) {
    const height = feature.properties.height || 0;
    const intensity = Math.min(height / 200, 1);
    return `hsl(0, 80%, ${50 + intensity * 30}%)`;
  }
  
  return 'hsl(0, 0%, 50%)';
};

interface GeoMapProps {
  features: GeoFeature[];
  activeLayers: DataLayer[];
  selectedFeature: GeoFeature | null;
  onSelectFeature: (feature: GeoFeature | null) => void;
}

const GeoMap = ({ features, activeLayers, selectedFeature, onSelectFeature }: GeoMapProps) => {
  const [viewState, setViewState] = useState({ x: -150, y: -150, zoom: 1 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleZoom = (direction: 'in' | 'out') => {
    setViewState(prev => ({ ...prev, zoom: Math.max(0.2, prev.zoom + (direction === 'in' ? 0.2 : -0.2)) }));
  };
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * -0.001;
      setViewState(prev => ({...prev, zoom: Math.max(0.1, Math.min(5, prev.zoom + zoomFactor))}));
    };

    const mapEl = mapRef.current;
    mapEl?.addEventListener('wheel', handleWheel, { passive: false });
    return () => mapEl?.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div ref={mapRef} className="relative w-full h-full bg-background overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div
        className="w-full h-full"
        style={{ perspective: '2000px' }}
        drag
        dragMomentum={false}
      >
        <motion.div
          className="relative w-full h-full transition-transform duration-200 ease-linear"
          style={{
            transform: `scale(${viewState.zoom}) rotateX(45deg) rotateZ(0deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <svg viewBox="0 0 400 400" className="absolute top-0 left-0 w-[400px] h-[400px]">
            {features.map(feature => (
              <Popover key={feature.id} open={selectedFeature?.id === feature.id} onOpenChange={(isOpen) => onSelectFeature(isOpen ? feature : null)}>
                <PopoverTrigger asChild>
                  <motion.path
                    d={feature.path}
                    onClick={() => onSelectFeature(feature)}
                    className={cn(
                      'stroke-accent/50 stroke-1 cursor-pointer transition-all duration-300 hover:stroke-accent hover:stroke-2',
                      { 'stroke-accent stroke-2': selectedFeature?.id === feature.id }
                    )}
                    initial={{ fill: '#555' }}
                    animate={{ fill: getFeatureFill(feature, activeLayers) }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </PopoverTrigger>
              </Popover>
            ))}
          </svg>
        </motion.div>
      </motion.div>

      {selectedFeature && (
        <div className="absolute top-4 right-4 z-10 w-80">
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-primary">{selectedFeature.name}</CardTitle>
              <CardDescription>{selectedFeature.type.charAt(0).toUpperCase() + selectedFeature.type.slice(1)}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {Object.entries(selectedFeature.properties).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button size="icon" onClick={() => handleZoom('in')} className="bg-primary/80 hover:bg-primary">
          <Plus />
        </Button>
        <Button size="icon" onClick={() => handleZoom('out')} className="bg-primary/80 hover:bg-primary">
          <Minus />
        </Button>
      </div>
    </div>
  );
};

export default GeoMap;

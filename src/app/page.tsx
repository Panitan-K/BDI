'use client';

import React, { useState, useMemo } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import GeoMap from '@/components/geo-map';
import SidebarContentComponent from '@/components/sidebar-content';
import type { DataLayer, Filters, GeoFeature } from '@/types';
import { Layers, Building, Trees, Droplets, Route, User } from 'lucide-react';
import { mockFeatures } from '@/components/geo-map';

const initialLayers: DataLayer[] = [
  { id: 'population', name: 'Population', icon: User, enabled: false, description: 'Population density in different areas.' },
  { id: 'land_use', name: 'Land Use', icon: Building, enabled: true, description: 'Categorization of land based on its primary use.' },
  { id: 'elevation', name: 'Elevation', icon: Layers, enabled: false, description: 'Height of land above sea level.' },
];

const initialFilters: Filters = {
  population: {
    min: 0,
    max: 5000,
  },
  buildingHeight: {
    min: 0,
    max: 200,
  },
};

export default function GeoMapperPage() {
  const [layers, setLayers] = useState<DataLayer[]>(initialLayers);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);

  const handleLayerToggle = (id: DataLayer['id']) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const handleFilterChange = (filterType: keyof Filters, value: number[]) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: { min: value[0], max: value[1] },
    }));
  };

  const handleAddLayer = (layerName: string) => {
    const newLayer: DataLayer = {
      id: layerName.toLowerCase().replace(/ /g, '_') as any,
      name: layerName,
      icon: Layers,
      enabled: true,
      description: `User-suggested layer: ${layerName}`,
    };
    // Avoid adding duplicate layers
    if (!layers.find(l => l.id === newLayer.id)) {
      setLayers(prev => [...prev, newLayer]);
    }
  };

  const filteredFeatures = useMemo(() => {
    return mockFeatures.filter(feature => {
      const { population, height } = feature.properties;
      const { population: popFilter, buildingHeight: heightFilter } = filters;

      const populationMatch = !layers.find(l => l.id === 'population')?.enabled || !population || (population >= popFilter.min && population <= popFilter.max);
      const heightMatch = !population || (height || 0) >= heightFilter.min && (height || 0) <= heightFilter.max;
      
      return populationMatch && heightMatch;
    });
  }, [filters, layers]);


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Layers className="text-primary" />
            <h1 className="text-xl font-headline font-bold">GeoMapper</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <SidebarContentComponent
            layers={layers}
            filters={filters}
            onLayerToggle={handleLayerToggle}
            onFilterChange={handleFilterChange}
            onAddLayer={handleAddLayer}
          />
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-muted-foreground p-2">
            Interactive Data Exploration
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="absolute top-2 left-2 z-10 md:hidden">
          <SidebarTrigger />
        </div>
        <GeoMap
          features={filteredFeatures}
          activeLayers={layers.filter(l => l.enabled)}
          selectedFeature={selectedFeature}
          onSelectFeature={setSelectedFeature}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

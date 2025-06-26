'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as maptilerSdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import type { GeoFeature, DataLayer, Filters } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Building, Trees, Waves } from 'lucide-react';

const mockFeatures: GeoFeature[] = [
  { id: 'b1', type: 'building', name: 'Coit Tower', lat: 37.8024, lng: -122.4058, properties: { population: 1200, usage: 'commercial', height: 64 } },
  { id: 'b2', type: 'building', name: 'Transamerica Pyramid', lat: 37.7952, lng: -122.4028, properties: { population: 2500, usage: 'commercial', height: 260 } },
  { id: 'b3', type: 'building', name: 'Salesforce Tower', lat: 37.7897, lng: -122.3969, properties: { population: 4000, usage: 'commercial', height: 326 } },
  { id: 'p1', type: 'park', name: 'Washington Square Park', lat: 37.8005, lng: -122.4103, properties: { usage: 'recreational' } },
  { id: 'w1', type: 'water', name: 'Pier 39', lat: 37.8087, lng: -122.4098, properties: {} },
];

const getMarkerColor = (feature: GeoFeature, activeLayers: DataLayer[]) => {
  if (activeLayers.some(l => l.id === 'population')) {
    const pop = feature.properties.population || 0;
    const intensity = Math.min(pop / 4000, 1);
    return `hsl(48, 100%, ${50 + intensity * 30}%)`;
  }
  if (activeLayers.some(l => l.id === 'land_use')) {
    switch (feature.properties.usage) {
      case 'commercial': return 'hsl(var(--primary))';
      case 'residential': return 'hsl(240, 40%, 60%)';
      case 'recreational': return 'hsl(120, 40%, 40%)';
      default: return 'hsl(0, 0%, 50%)';
    }
  }
  if (activeLayers.some(l => l.id === 'elevation')) {
    const height = feature.properties.height || 0;
    const intensity = Math.min(height / 350, 1);
    return `hsl(183, 100%, ${30 + intensity * 40}%)`;
  }
  return 'hsl(var(--accent))';
};

const getIcon = (type: GeoFeature['type']) => {
  switch (type) {
    case 'building':
      return <Building className="w-4 h-4 text-white" />;
    case 'park':
      return <Trees className="w-4 h-4 text-white" />;
    case 'water':
      return <Waves className="w-4 h-4 text-white" />;
    default:
      return null;
  }
};

const PopupContent = ({ feature }: { feature: GeoFeature }) => (
    <Card className="bg-popover text-popover-foreground border-none shadow-lg w-64">
      <CardHeader>
        <CardTitle className="font-headline text-primary">{feature.name}</CardTitle>
        <CardDescription>{feature.type.charAt(0).toUpperCase() + feature.type.slice(1)}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {Object.entries(feature.properties).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-muted-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
            <span>{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
);


interface GeoMapProps {
  activeLayers: DataLayer[];
  filters: Filters;
}

const GeoMap = ({ activeLayers, filters }: GeoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilerSdk.Map | null>(null);
  const markers = useRef<maptilerSdk.Marker[]>([]);
  const popup = useRef<maptilerSdk.Popup | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);

  const filteredFeatures = useMemo(() => {
    return mockFeatures.filter(feature => {
      const { population, height } = feature.properties;
      const { population: popFilter, buildingHeight: heightFilter } = filters;
      
      const populationMatch = !population || (population >= popFilter.min && population <= popFilter.max);
      const heightMatch = !height || (height >= heightFilter.min && height <= heightFilter.max);
      
      return populationMatch && heightMatch;
    });
  }, [filters]);

  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

  useEffect(() => {
    if (map.current || !mapContainer.current || !apiKey) return;

    maptilerSdk.config.apiKey = apiKey;
    
    map.current = new maptilerSdk.Map({
      container: mapContainer.current,
      style: maptilerSdk.MapStyle.DATAVIZ.DARK,
      center: [-122.405, 37.795],
      zoom: 14,
    });
    
    map.current.on('click', () => {
      setSelectedFeature(null);
    });
  }, [apiKey]);
  
  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    filteredFeatures.forEach(feature => {
      const el = document.createElement('div');
      el.className = "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer";
      el.style.backgroundColor = getMarkerColor(feature, activeLayers);

      const root = createRoot(el);
      root.render(getIcon(feature.type));
      
      const marker = new maptilerSdk.Marker({ element: el })
          .setLngLat([feature.lng, feature.lat])
          .addTo(map.current);
      
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedFeature(feature);
      });

      markers.current.push(marker);
    });
  }, [filteredFeatures, activeLayers]);

  useEffect(() => {
    if (popup.current) {
        popup.current.remove();
        popup.current = null;
    }

    if (selectedFeature && map.current) {
        const popupNode = document.createElement('div');
        const root = createRoot(popupNode);
        root.render(<PopupContent feature={selectedFeature} />);
        
        popup.current = new maptilerSdk.Popup({ 
          closeButton: true, 
          closeOnClick: false,
          offset: 35
        })
            .setLngLat([selectedFeature.lng, selectedFeature.lat])
            .setDOMContent(popupNode)
            .addTo(map.current);
        
        popup.current.on('close', () => {
          setSelectedFeature(null);
        });
    }
  }, [selectedFeature]);


  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center p-4">
          <p className="text-muted-foreground mb-2">MapTiler API key is missing.</p>
          <p className="text-sm text-muted-foreground">Please add <code className="bg-secondary p-1 rounded">NEXT_PUBLIC_MAPTILER_API_KEY</code> to your <code className="bg-secondary p-1 rounded">.env</code> file.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full relative">
       <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default GeoMap;

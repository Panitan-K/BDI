'use client';

import React, { useState, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
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

interface GeoMapProps {
  activeLayers: DataLayer[];
  filters: Filters;
}

const GeoMap = ({ activeLayers, filters }: GeoMapProps) => {
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

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Google Maps API key is missing.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 37.795, lng: -122.405 }}
          defaultZoom={15}
          mapId="e909980143896582"
          disableDefaultUI={true}
        >
          {filteredFeatures.map(feature => (
            <AdvancedMarker
              key={feature.id}
              position={{ lat: feature.lat, lng: feature.lng }}
              onClick={() => setSelectedFeature(feature)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: getMarkerColor(feature, activeLayers) }}
              >
                {getIcon(feature.type)}
              </div>
            </AdvancedMarker>
          ))}
          {selectedFeature && (
            <InfoWindow
              position={{ lat: selectedFeature.lat, lng: selectedFeature.lng }}
              onCloseClick={() => setSelectedFeature(null)}
              pixelOffset={[0, -40]}
            >
              <Card className="bg-popover text-popover-foreground border-none shadow-lg w-64">
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
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default GeoMap;

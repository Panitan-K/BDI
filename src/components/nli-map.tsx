'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';

interface NliMapProps {
  is3D: boolean;
  activeLayers: Record<string, boolean>;
  basemapStyle: string;
  activeTool: string | null;
  onRegionClick: (regionName: string | null) => void;
  selectedRegion: string | null;
}

// Mock data source for clickable provinces with coordinates
const regionData: Record<string, { center: [number, number], zoom: number }> = {
    'Bangkok': { center: [100.523186, 13.736717], zoom: 9 },
    'Chiang Mai': { center: [98.9853, 18.7883], zoom: 8 },
    'Phuket': { center: [98.3923, 7.8804], zoom: 9 },
    'Chon Buri': { center: [100.985, 13.361], zoom: 8 },
};


const layerSources: Record<string, { url: string, type: 'line' | 'fill' | 'circle' | 'fill-extrusion', paint: any, sourceData?: any, sourceLayer?: string }> = {
    'Roads': {
        url: 'https://api.maptiler.com/data/transportation/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'line',
        paint: { 'line-color': '#FF0000', 'line-width': 2 }
    },
    'Railways': {
        url: 'https://api.maptiler.com/data/rail/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'line',
        paint: { 'line-color': '#888', 'line-width': 2, 'line-dasharray': [2, 2] }
    },
    'Province': {
        url: 'https://api.maptiler.com/data/thailand-administrative/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'fill',
        paint: { 
            'fill-color': ['case',
                ['boolean', ['feature-state', 'clicked'], false],
                '#6C72FF', // Clicked color
                '#4A69F6'  // Default color
            ],
            'fill-opacity': ['case',
                ['boolean', ['feature-state', 'clicked'], false],
                0.6,
                0.3
            ], 
            'fill-outline-color': '#fff' 
        }
    },
    'Population Density (3D)': {
        url: 'https://api.maptiler.com/data/thailand-administrative/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'fill-extrusion',
        paint: {
            'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'pop_density'],
                0, '#fef0d9',
                250, '#fdd49e',
                500, '#fdbb84',
                750, '#fc8d59',
                1000, '#e34a33',
                1250, '#b30000'
            ],
            'fill-extrusion-height': ['/', ['get', 'pop_density'], 2],
            'fill-extrusion-opacity': 0.75,
            'fill-extrusion-base': 0
        }
    }
};

export function NliMap({ is3D, activeLayers, basemapStyle, activeTool, onRegionClick, selectedRegion }: NliMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [apiKey] = useState(process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'lVz5lFRZJpi7sv6fXhdz');
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const clickedProvinceId = useRef<string | number | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = apiKey;
    map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: basemapStyle,
        center: [100.523186, 13.736717],
        zoom: 5.5,
        pitch: 0,
        bearing: 0,
    });
    
    map.current.on('load', () => {
        setIsStyleLoaded(true);
        
        Object.keys(layerSources).forEach(async (layerName) => {
            if (map.current?.getSource(layerName)) return;

            const layerConfig = layerSources[layerName];
            if (layerName === 'Population Density (3D)') {
                const resp = await fetch(layerConfig.url);
                const geojson = await resp.json();
                geojson.features.forEach((feature: any) => {
                    feature.properties.pop_density = Math.random() * 1500;
                });
                map.current?.addSource(layerName, { type: 'geojson', data: geojson });
            } else {
                map.current?.addSource(layerName, { type: 'geojson', data: layerConfig.url });
            }
        });

        // Add click listener for provinces
        map.current?.on('click', 'Province', (e) => {
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                const provinceName = feature.properties.name_en;

                if (clickedProvinceId.current !== null) {
                    map.current?.setFeatureState({ source: 'Province', id: clickedProvinceId.current }, { clicked: false });
                }
                
                clickedProvinceId.current = feature.id ?? null;
                map.current?.setFeatureState({ source: 'Province', id: clickedProvinceId.current! }, { clicked: true });

                onRegionClick(provinceName);
            }
        });
        
        map.current?.on('click', (e) => {
            const features = map.current?.queryRenderedFeatures(e.point, { layers: ['Province'] });
            if (!features || features.length === 0) {
                 if (clickedProvinceId.current !== null) {
                    map.current?.setFeatureState({ source: 'Province', id: clickedProvinceId.current }, { clicked: false });
                    clickedProvinceId.current = null;
                 }
                onRegionClick(null);
            }
        });

    });
    
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [apiKey]);
  
  useEffect(() => {
    if (!map.current) return;
    if (map.current.isStyleLoaded()) {
      map.current.setStyle(basemapStyle);
    } else {
       map.current.once('load', () => map.current?.setStyle(basemapStyle));
    }
  }, [basemapStyle]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !currentMap.isStyleLoaded()) return;

    const projectionName = is3D ? 'globe' : 'mercator';
    currentMap.setProjection({ name: projectionName });

    if (is3D) {
      currentMap.flyTo({ pitch: 60, zoom: 4, bearing: -20, duration: 2000, essential: true });
    } else {
      currentMap.flyTo({ pitch: 0, bearing: 0, duration: 2000, essential: true });
    }
  }, [is3D, isStyleLoaded]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !currentMap.isStyleLoaded()) return;

    // Logic for flying to selected region
    if (selectedRegion && regionData[selectedRegion]) {
        currentMap.flyTo({
            center: regionData[selectedRegion].center,
            zoom: regionData[selectedRegion].zoom,
            duration: 2000,
            essential: true
        });
    } else if (selectedRegion === null) {
        // Fly back to default view if region is deselected
        currentMap.flyTo({
            center: [100.523186, 13.736717],
            zoom: 5.5,
            duration: 2000,
            essential: true
        });
    }
  }, [selectedRegion, isStyleLoaded]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !currentMap.isStyleLoaded()) return;
    
    const updateLayers = () => {
      Object.keys(layerSources).forEach(layerName => {
          const layerConfig = layerSources[layerName];
          const isLayerVisible = activeLayers[layerName];
          
          if (currentMap.getSource(layerName)) {
            if (isLayerVisible) {
                if (!currentMap.getLayer(layerName)) {
                    currentMap.addLayer({
                        id: layerName,
                        type: layerConfig.type,
                        source: layerName,
                        paint: layerConfig.paint
                    });
                }
            } else {
                if (currentMap.getLayer(layerName)) {
                    currentMap.removeLayer(layerName);
                }
            }
          }
      });
    };
    
    updateLayers();

  }, [activeLayers, isStyleLoaded]);

  useEffect(() => {
    const currentMap = map.current;
    if(!currentMap) return;
    const canvas = currentMap.getCanvas();
    if (activeTool === 'Measure') {
        canvas.style.cursor = 'crosshair';
    } else if (activeTool === 'Draw') {
        canvas.style.cursor = 'url(https://img.icons8.com/ios-glyphs/30/ffffff/pencil-tip.png), auto';
    } else if (activeTool === 'Select') {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'grab';
    }
  }, [activeTool]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

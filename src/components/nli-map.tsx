'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';

interface NliMapProps {
  is3D: boolean;
  activeLayers: Record<string, boolean>;
}

// A simple example of how layer data could be structured
const layerSources: Record<string, { url: string, type: 'line' | 'fill' | 'circle', paint: any }> = {
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
        paint: { 'fill-color': '#4A69F6', 'fill-opacity': 0.3, 'fill-outline-color': '#fff' }
    }
    // Other layers can be added here
};


export function NliMap({ is3D, activeLayers }: NliMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [apiKey] = useState(process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'lVz5lFRZJpi7sv6fXhdz');

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = apiKey;
    map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: "https://api.maptiler.com/maps/dataviz-dark/style.json",
        center: [100.523186, 13.736717], // Bangkok
        zoom: 5.5,
        pitch: 0,
        bearing: 0,
        projection: {name: 'mercator'},
    });

    map.current.on('load', () => {
        // Example: Add a popup on click
        map.current?.on('click', (e) => {
            new maptilersdk.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<b>Coordinates:</b><br/>Lng: ${e.lngLat.lng.toFixed(4)}<br/>Lat: ${e.lngLat.lat.toFixed(4)}`)
                .addTo(map.current!);
        });

        // Preload sources for all potential layers
        Object.keys(layerSources).forEach(layerName => {
            const layerConfig = layerSources[layerName];
            if (!map.current?.getSource(layerName)) {
                 map.current?.addSource(layerName, {
                    type: 'geojson',
                    data: layerConfig.url
                });
            }
        });
    });
    
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [apiKey]);
  
  useEffect(() => {
    if (map.current) {
      if (is3D) {
        map.current.flyTo({ pitch: 60, zoom: 6, bearing: -20, duration: 2000 });
        if(map.current.getProjection().name !== 'globe') map.current.setProjection({name: 'globe'});
      } else {
        map.current.flyTo({ pitch: 0, zoom: 5.5, bearing: 0, duration: 2000 });
        if(map.current.getProjection().name !== 'mercator') map.current.setProjection({name: 'mercator'});
      }
    }
  }, [is3D]);

  useEffect(() => {
    if (!map.current) return;

    const currentMap = map.current;
    
    Object.keys(layerSources).forEach(layerName => {
        const layerConfig = layerSources[layerName];
        const isLayerVisible = activeLayers[layerName];
        
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
    });

  }, [activeLayers]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

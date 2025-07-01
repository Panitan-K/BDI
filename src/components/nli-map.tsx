'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';

interface NliMapProps {
  is3D: boolean;
  activeLayers: Record<string, boolean>;
  basemapStyle: string;
}

const layerSources: Record<string, { url: string, type: 'line' | 'fill' | 'circle' | 'fill-extrusion', paint: any, sourceData?: any }> = {
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

export function NliMap({ is3D, activeLayers, basemapStyle }: NliMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [apiKey] = useState(process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'lVz5lFRZJpi7sv6fXhdz');
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

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

        map.current?.on('click', (e) => {
            new maptilersdk.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<b>Coordinates:</b><br/>Lng: ${e.lngLat.lng.toFixed(4)}<br/>Lat: ${e.lngLat.lat.toFixed(4)}`)
                .addTo(map.current!);
        });

        Object.keys(layerSources).forEach(async (layerName) => {
            const layerConfig = layerSources[layerName];
            if (!map.current?.getSource(layerName)) {
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
            }
        });
    });
    
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [apiKey, basemapStyle]);
  
  useEffect(() => {
    if (!map.current || !isStyleLoaded) return;
    map.current.setStyle(basemapStyle);
  }, [basemapStyle, isStyleLoaded]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap) return;
    
    const projectionName = is3D ? 'globe' : 'mercator';
    if (currentMap.getProjection().name !== projectionName) {
        currentMap.setProjection({ name: projectionName });
    }

    if (is3D) {
      currentMap.flyTo({ pitch: 60, zoom: 4, bearing: -20, duration: 2000, essential: true });
    } else {
      currentMap.flyTo({ pitch: 0, zoom: 5.5, bearing: 0, duration: 2000, essential: true });
    }
  }, [is3D]);

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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { cn } from '@/lib/utils';

export function NliMap({ is3D }: { is3D: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [apiKey] = useState(process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'lVz5lFRZJpi7sv6fXhdz');

  useEffect(() => {
    if (map.current) return; // a map is already initialized

    if (mapContainer.current) {
      maptilersdk.config.apiKey = apiKey;
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: "https://api.maptiler.com/maps/dataviz/style.json",
        center: [100.523186, 13.736717], // Bangkok
        zoom: 5.5,
        pitch: 0,
        bearing: 0,
        projection: 'mercator',
      });

      map.current.on('load', () => {
        // Add a popup on click
        map.current?.on('click', (e) => {
            new maptilersdk.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`<b>Coordinates:</b><br/>Lng: ${e.lngLat.lng}<br/>Lat: ${e.lngLat.lat}`)
                .addTo(map.current!);
        });
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [apiKey]);
  
  useEffect(() => {
    if (map.current) {
      if (is3D) {
        map.current.flyTo({ pitch: 60, zoom: 6, bearing: -20, duration: 2000 });
      } else {
        map.current.flyTo({ pitch: 0, zoom: 5.5, bearing: 0, duration: 2000 });
      }
    }
  }, [is3D]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

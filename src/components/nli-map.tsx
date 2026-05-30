
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import { FeatureCollection, Feature, Point, LineString, Polygon } from 'geojson';

interface NliMapProps {
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

const originalProvincePaint = {
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
};

const choroplethProvincePaint = {
    'fill-color': ['case',
        ['boolean', ['feature-state', 'clicked'], false],
        '#6C72FF', // Clicked color, keep it consistent
        [ // else, choropleth scale
            'interpolate',
            ['linear'],
            ['get', 'pop_density'],
            0, '#fef0d9',
            250, '#fdd49e',
            500, '#fdbb84',
            750, '#fc8d59',
            1000, '#e34a33',
            1250, '#b30000'
        ]
    ],
    'fill-opacity': ['case',
        ['boolean', ['feature-state', 'clicked'], false],
        0.9, // Make clicked more opaque
        0.75 // Default choropleth opacity
    ],
    'fill-outline-color': '#fff'
};

const layerSources: Record<string, { url: string, type: 'line' | 'fill' | 'circle' | 'fill-extrusion', paint: any, sourceData?: any, sourceLayer?: string }> = {
    'Province': {
        url: 'https://api.maptiler.com/data/thailand-administrative/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'fill',
        paint: originalProvincePaint
    },
    'Roads': {
        url: 'https://api.maptiler.com/data/transportation/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'line',
        paint: { 'line-color': '#FF0000', 'line-width': 2 }
    },
    'Railways': {
        url: 'https://api.maptiler.com/data/01980218-e7f9-7917-a344-5cfed5095fb0/features.json?key=mCJoJWjy7xv8aBfkazzm',
        type: 'line',
        paint: {
            'line-color': '#FF0000',
            'line-width': 2,
            'line-opacity': 0.7
        }
    },
    'Ports': {
        url: 'https://api.maptiler.com/data/port/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'circle',
        paint: {
            'circle-radius': 6,
            'circle-color': '#2563eb', // a blue color
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1.5
        }
    },
    'Airports': {
        url: 'https://api.maptiler.com/data/aerodrome/features.json?key=lVz5lFRZJpi7sv6fXhdz',
        type: 'circle',
        paint: {
            'circle-radius': 6,
            'circle-color': '#9333ea', // a purple color
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1.5
        }
    },
    'Industrial Zones': {
        url: "https://api.maptiler.com/data/019801ca-14e1-7441-bb1e-d83b7976efcf/features.json?key=mCJoJWjy7xv8aBfkazzm",
        type: 'fill-extrusion',
        paint: {
          "fill-extrusion-color": [ "interpolate", ["linear"], ["get", "price"], 0, "#E0FFFF", 10, "#B0E0FF", 20, "#87CEFA", 30, "#40BFFF", 40, "#1E90FF", 50, "#0077FF", 60, "#0055CC", 70, "#0033AA", 80, "#1A1A80", 90, "#0D0D66", 100, "#000044" ],
          "fill-extrusion-height": ["*", ["get", "price"], 1500],
          "fill-extrusion-base": 10,
          "fill-extrusion-opacity": 0.9,
          "fill-extrusion-vertical-gradient": true
        }
    },
    'Special Economic Corridors': {
        url: "https://api.maptiler.com/data/019801f4-5d5b-742d-a765-1d848c3c1b7b/features.json?key=mCJoJWjy7xv8aBfkazzm",
        type: 'circle',
        paint: {
            'circle-radius': 5,
            'circle-color': '#ff0000',
            'circle-opacity': 0.5,
            'circle-stroke-width': 0
        }
    },
};

const INITIAL_VIEW = {
    center: [100.523186, 13.736717] as [number, number],
    zoom: 5.5,
};

export function NliMap({ activeLayers, basemapStyle, activeTool, onRegionClick, selectedRegion }: NliMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [apiKey] = useState(process.env.NEXT_PUBLIC_MAPTILER_API_KEY || 'lVz5lFRZJpi7sv6fXhdz');
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const clickedProvinceId = useRef<string | number | null>(null);

  // For measure/draw tools
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);
  const [mouseCoords, setMouseCoords] = useState<string | null>(null);

  const geojson = useRef<FeatureCollection<Point | LineString | Polygon>>({
    type: 'FeatureCollection',
    features: [],
  });

  const linestring = useRef<Feature<LineString, any>>({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [],
    },
    properties: {},
  });
  
  const drawControl = useRef<MapboxDraw | null>(null);
  const scaleControl = useRef<maptilersdk.ScaleControl | null>(null);


  const clearMeasurements = useCallback(() => {
    const currentMap = map.current;
    if (!currentMap) return;
  
    geojson.current.features = [];
    if (linestring.current) {
        linestring.current.geometry.coordinates = [];
    }
    
    const source = currentMap.getSource('measure-geojson') as maptilersdk.GeoJSONSource;
    if (source) {
        source.setData({
            type: 'FeatureCollection',
            features: [],
        });
    }
  
    setMeasureDistance(null);
  }, []);

  const clearDrawings = useCallback(() => {
    if (drawControl.current) {
        drawControl.current.deleteAll();
    }
  }, []);

  useEffect(() => {
    if (!basemapStyle || map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = apiKey;
    const currentMap = new maptilersdk.Map({
        container: mapContainer.current,
        style: basemapStyle,
        ...INITIAL_VIEW,
        pitch: 0,
        bearing: 0,
    });
    map.current = currentMap;
    
    currentMap.on('load', async () => {
        setIsStyleLoaded(true);
        
        const provinceConfig = layerSources['Province'];
        const resp = await fetch(provinceConfig.url);
        const geojson = await resp.json();
        geojson.features.forEach((feature: any) => {
            feature.properties.pop_density = Math.random() * 1500;
        });
        currentMap.addSource('Province', { type: 'geojson', data: geojson, generateId: true });

        Object.keys(layerSources).forEach((layerName) => {
            if (layerName === 'Province') return;
            if (currentMap.getSource(layerName)) return;
            const layerConfig = layerSources[layerName];
            currentMap.addSource(layerName, { type: 'geojson', data: layerConfig.url });
        });
        
        
        currentMap.addSource('measure-geojson', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
        });
        currentMap.addLayer({
            id: 'measure-points',
            type: 'circle',
            source: 'measure-geojson',
            paint: { 'circle-radius': 5, 'circle-color': '#000' },
            filter: ['in', '$type', 'Point'],
        });
        currentMap.addLayer({
            id: 'measure-lines',
            type: 'line',
            source: 'measure-geojson',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#000', 'line-width': 2.5 },
            filter: ['in', '$type', 'LineString'],
        });
        currentMap.addLayer({
            id: 'measure-polygon',
            type: 'fill',
            source: 'measure-geojson',
            paint: { 'fill-color': '#000', 'fill-opacity': 0.1 },
            filter: ['in', '$type', 'Polygon'],
        });

        currentMap.on('click', 'Province', (e) => {
            if (activeTool) return;
            if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                const provinceName = feature.properties.name_en;

                if (clickedProvinceId.current !== null) {
                    currentMap.setFeatureState({ source: 'Province', id: clickedProvinceId.current }, { clicked: false });
                }
                
                clickedProvinceId.current = feature.id ?? null;
                currentMap.setFeatureState({ source: 'Province', id: clickedProvinceId.current! }, { clicked: true });

                onRegionClick(provinceName);
            }
        });
        
        currentMap.on('click', (e) => {
            if (activeTool) return;
            const features = currentMap.queryRenderedFeatures(e.point, { layers: ['Province'] });
            if (!features || features.length === 0) {
                 if (clickedProvinceId.current !== null) {
                    currentMap.setFeatureState({ source: 'Province', id: clickedProvinceId.current }, { clicked: false });
                    clickedProvinceId.current = null;
                 }
                onRegionClick(null);
            }
        });

        // Initialize Draw control but don't add it yet
        drawControl.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                line_string: true,
                point: true,
                trash: true
            }
        });

        currentMap.on('draw.create', (e) => console.log("Drawn Features:", drawControl.current?.getAll()));
        currentMap.on('draw.update', (e) => console.log("Drawn Features:", drawControl.current?.getAll()));
        currentMap.on('draw.delete', (e) => console.log("Drawn Features:", drawControl.current?.getAll()));

        scaleControl.current = new maptilersdk.ScaleControl({ unit: 'metric' });

        currentMap.on('mousemove', (e) => {
            setMouseCoords(`Lng: ${e.lngLat.lng.toFixed(4)}, Lat: ${e.lngLat.lat.toFixed(4)}`);
        });
        currentMap.on('mouseout', () => {
            setMouseCoords(null);
        })

    });
    
    return () => {
      currentMap.remove();
      map.current = null;
    };
  }, [apiKey, basemapStyle, onRegionClick]);
  
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !basemapStyle) return;
    const styleUpdate = () => {
        if(currentMap.isStyleLoaded()) {
            currentMap.setStyle(basemapStyle);
        } else {
            currentMap.once('load', () => currentMap.setStyle(basemapStyle));
        }
    }
    styleUpdate();
  }, [basemapStyle]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !currentMap.isStyleLoaded()) return;

    if (selectedRegion && regionData[selectedRegion]) {
        currentMap.flyTo({
            center: regionData[selectedRegion].center,
            zoom: regionData[selectedRegion].zoom,
            duration: 2000,
            essential: true
        });
    } else if (selectedRegion === null) {
        currentMap.flyTo({
            ...INITIAL_VIEW,
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
    
    if (isStyleLoaded) {
      updateLayers();
    } else {
      currentMap.once('load', updateLayers);
    }

  }, [activeLayers, isStyleLoaded]);

  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !currentMap.isStyleLoaded() || !currentMap.getLayer('Province')) {
        return;
    }

    if (activeLayers['Population Density']) {
        currentMap.setPaintProperty('Province', 'fill-color', choroplethProvincePaint['fill-color']);
        currentMap.setPaintProperty('Province', 'fill-opacity', choroplethProvincePaint['fill-opacity']);
    } else {
        currentMap.setPaintProperty('Province', 'fill-color', originalProvincePaint['fill-color']);
        currentMap.setPaintProperty('Province', 'fill-opacity', originalProvincePaint['fill-opacity']);
    }
  }, [activeLayers['Population Density'], isStyleLoaded]);

  const handleMapClick = useCallback((e: maptilersdk.MapMouseEvent) => {
    const currentMap = map.current;
    if (!currentMap) return;

    const source = currentMap.getSource('measure-geojson') as maptilersdk.GeoJSONSource;
    if (!source) return;

    const features = currentMap.queryRenderedFeatures(e.point, {
      layers: ['measure-points'],
    });

    const clickedPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    
    // Check if the user clicked the first point to close a polygon
    const isClosingClick = geojson.current.features.length > 2 && features.length > 0 && (geojson.current.features[0] as Feature<Point>).properties?.id === features[0].properties.id;

    if (isClosingClick) {
        linestring.current.geometry.coordinates.push((geojson.current.features[0] as Feature<Point>).geometry.coordinates);
    } else {
        const newPoint = turf.point(clickedPoint, { id: String(new Date().getTime()) });
        geojson.current.features.push(newPoint);
        linestring.current.geometry.coordinates.push(clickedPoint);
    }
    
    const displayFeatures: Feature<any>[] = [...geojson.current.features];
    
    let area = 0;
    let distance = 0;

    if (linestring.current.geometry.coordinates.length > 1) {
        const currentLine = turf.lineString(linestring.current.geometry.coordinates, { id: 'line' });
        displayFeatures.push(currentLine);
        distance = turf.length(currentLine, { units: 'kilometers' });

        if (linestring.current.geometry.coordinates.length > 2 && isClosingClick) {
            const polygon = turf.polygon([linestring.current.geometry.coordinates]);
            displayFeatures.push(polygon);
            area = turf.area(polygon); // in square meters
        }
    }
    
    let message = '';
    if (distance > 0) {
        message += `Total distance: ${distance.toFixed(2)} km`;
    }
    if (area > 0) {
        message += ` | Area: ${(area / 1000000).toFixed(2)} km²`;
    }
    setMeasureDistance(message || null);

    if (source) {
      source.setData({
          type: 'FeatureCollection',
          features: displayFeatures,
      });
    }
  }, []);


  // Tool activation logic
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !isStyleLoaded) return;
  
    const canvas = currentMap.getCanvas();
  
    // Handle one-time actions first
    switch(activeTool) {
        case 'ZoomIn': currentMap.zoomIn(); break;
        case 'ZoomOut': currentMap.zoomOut(); break;
        case 'Compass': currentMap.resetNorthPitch(); break;
        case 'Home': currentMap.flyTo({...INITIAL_VIEW}); break;
        case 'Clear':
            clearMeasurements();
            clearDrawings();
            break;
    }

    // Cleanup previous tool's state
    currentMap.off('click', handleMapClick);
    
    if (drawControl.current && currentMap.hasControl(drawControl.current as any)) {
        currentMap.removeControl(drawControl.current as any);
    }
    
    // Activate the selected tool
    if (activeTool === 'Measure') {
      canvas.style.cursor = 'crosshair';
      clearMeasurements();
      currentMap.on('click', handleMapClick);
    } else if (activeTool === 'Draw') {
      canvas.style.cursor = 'crosshair';
      if (drawControl.current) {
        currentMap.addControl(drawControl.current as any, 'top-left');
      }
    } else {
      canvas.style.cursor = 'grab';
      if (activeTool !== 'Measure') {
        clearMeasurements();
      }
    }

    // Handle persistent toggles
    if (scaleControl.current) {
        if (activeTool === 'Scale' && !currentMap.hasControl(scaleControl.current)) {
            currentMap.addControl(scaleControl.current, 'bottom-left');
        } else if (activeTool !== 'Scale' && currentMap.hasControl(scaleControl.current)) {
            currentMap.removeControl(scaleControl.current);
        }
    }

    if (activeTool === '3DView') {
        currentMap.setPitch(currentMap.getPitch() === 0 ? 60 : 0);
    }

  
    return () => {
      // General cleanup when component unmounts
      if (currentMap) {
        currentMap.off('click', handleMapClick);
        canvas.style.cursor = 'grab';
      }
    };
  }, [activeTool, isStyleLoaded, handleMapClick, clearMeasurements, clearDrawings]);


  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
      {measureDistance && (
        <div className="absolute top-2 left-2 z-10 bg-black/75 text-white text-xs p-2 rounded-md shadow-lg">
          {measureDistance}
        </div>
      )}
      {activeTool === 'Coords' && mouseCoords && (
        <div className="absolute bottom-2 right-2 z-10 bg-black/75 text-white text-xs p-2 rounded-md shadow-lg">
          {mouseCoords}
        </div>
      )}
    </div>
  );
}

    
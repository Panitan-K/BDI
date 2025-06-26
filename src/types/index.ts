import type { LucideIcon } from 'lucide-react';

export interface GeoFeature {
  id: string;
  type: 'building' | 'park' | 'water';
  name: string;
  lat: number;
  lng: number;
  properties: {
    population?: number;
    usage?: 'residential' | 'commercial' | 'recreational';
    height?: number; // in meters
  };
}

export interface DataLayer {
  id: 'population' | 'land_use' | 'elevation' | string;
  name: string;
  icon: LucideIcon;
  enabled: boolean;
  description: string;
}

export interface Filters {
  population: {
    min: number;
    max: number;
  };
  buildingHeight: {
    min: number;
    max: number;
  };
}

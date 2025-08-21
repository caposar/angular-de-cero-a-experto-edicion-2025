// src/app/map/styles/esri-worldstreet-style.ts
import type { StyleSpecification } from 'maplibre-gl';

export const ESRI_WORLD_STREET_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esri: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution:
        'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, and others',
    },
  },
  layers: [
    {
      id: 'esri-world-street-layer',
      type: 'raster',
      source: 'esri',
    },
  ],
} as const;

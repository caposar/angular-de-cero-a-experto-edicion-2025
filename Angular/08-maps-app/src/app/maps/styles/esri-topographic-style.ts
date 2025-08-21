// Filename: esri-topographic-style.ts
import { StyleSpecification } from 'maplibre-gl';

export const ESRI_TOPOGRAPHIC_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esriTopo: {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution:
        'Tiles &copy; Esri — Source: Esri, Garmin, USGS, NGA, EPA, NPS',
    },
  },
  layers: [
    {
      id: 'esri-topo-layer',
      type: 'raster',
      source: 'esriTopo',
    },
  ],
} as const;
